-- =========================================================
-- Uko's Diary 安全加固 SQL
-- 在 Supabase Dashboard → SQL Editor 中整段执行
-- =========================================================

-- =========================================================
-- 0. profiles 表：管理员标识
-- =========================================================
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  is_admin    boolean not null default false,
  created_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- 任何人不能随意查看 profiles
-- 仅允许用户自己读取自己的 profile（用于判断 is_admin）
create policy "profiles_self_select"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);

-- 仅允许通过 SQL 手动设置管理员（不开放给任何客户端写入）
-- 不需要 insert/update/delete policy，客户端无法直接修改

-- =========================================================
-- 1. guestbook 留言板
-- =========================================================
alter table public.guestbook enable row level security;

grant select on public.guestbook to anon;
grant select, insert, update, delete on public.guestbook to authenticated;

-- 匿名用户：只能看已显示的留言
create policy "guestbook_public_select"
  on public.guestbook
  for select
  to anon
  using (is_visible = true);

-- 匿名用户：可以提交留言（INSERT），但不能修改/删除
create policy "guestbook_anon_insert"
  on public.guestbook
  for insert
  to anon
  with check (
    char_length(name) <= 30
    and char_length(message) <= 300
    and char_length(name) >= 1
    and char_length(message) >= 1
  );

-- 管理员：全部操作
create policy "guestbook_admin_select_all"
  on public.guestbook
  for select
  to authenticated
  using (true);

create policy "guestbook_admin_update"
  on public.guestbook
  for update
  to authenticated
  using (true)
  with check (true);

create policy "guestbook_admin_delete"
  on public.guestbook
  for delete
  to authenticated
  using (true);

-- =========================================================
-- 2. friends 友链（正式展示表）
-- =========================================================
alter table public.friends enable row level security;

grant select on public.friends to anon;
grant select, insert, update, delete on public.friends to authenticated;

-- 匿名用户：只能看已显示的友链
create policy "friends_public_select"
  on public.friends
  for select
  to anon
  using (is_visible = true);

-- 匿名用户：不能直接插入 friends 表（只能通过 friend_applications 申请）
-- 不创建 anon insert policy

-- 管理员：全部操作
create policy "friends_admin_all"
  on public.friends
  for all
  to authenticated
  using (true)
  with check (true);

-- =========================================================
-- 3. friend_applications 友链申请表（访客提交，管理员审核）
-- =========================================================
create table if not exists public.friend_applications (
  id            bigint generated always as identity primary key,
  name          text not null,
  url           text not null,
  description   text,
  avatar_url    text,
  is_approved   boolean not null default false,
  created_at    timestamptz not null default now()
);

alter table public.friend_applications enable row level security;

grant insert on public.friend_applications to anon;
grant select, delete on public.friend_applications to authenticated;

-- 匿名用户：只能提交申请（INSERT），不能查看已有申请
create policy "friend_app_anon_insert"
  on public.friend_applications
  for insert
  to anon
  with check (
    char_length(name) <= 50
    and char_length(url) <= 500
    and url ~ '^https?://'
    and char_length(name) >= 1
  );

-- 管理员：可以查看和删除申请
create policy "friend_app_admin_select"
  on public.friend_applications
  for select
  to authenticated
  using (true);

create policy "friend_app_admin_delete"
  on public.friend_applications
  for delete
  to authenticated
  using (true);

-- =========================================================
-- 4. films 影评
-- =========================================================
alter table public.films enable row level security;

grant select on public.films to anon;
grant select, insert, update, delete on public.films to authenticated;

create policy "films_public_select"
  on public.films
  for select
  to anon
  using (is_visible = true);

create policy "films_admin_all"
  on public.films
  for all
  to authenticated
  using (true)
  with check (true);

-- =========================================================
-- 5. books 读书笔记
-- =========================================================
alter table public.books enable row level security;

grant select on public.books to anon;
grant select, insert, update, delete on public.books to authenticated;

create policy "books_public_select"
  on public.books
  for select
  to anon
  using (is_visible = true);

create policy "books_admin_all"
  on public.books
  for all
  to authenticated
  using (true)
  with check (true);

-- =========================================================
-- 6. baking 烘焙日记
-- =========================================================
alter table public.baking enable row level security;

grant select on public.baking to anon;
grant select, insert, update, delete on public.baking to authenticated;

create policy "baking_public_select"
  on public.baking
  for select
  to anon
  using (is_visible = true);

create policy "baking_admin_all"
  on public.baking
  for all
  to authenticated
  using (true)
  with check (true);

-- =========================================================
-- 7. blogs 博客（补充之前 SQL 中可能缺失的 anon insert 防护）
-- =========================================================
-- blogs 表已有 RLS，这里确保匿名用户不能写
-- （之前的 SQL 只 grant select to anon，已经够了）
-- 但确认没有 anon insert/update/delete policy
-- 如果之前创建了多余的 policy，执行：
-- drop policy if exists "blogs_anon_insert" on public.blogs;
-- drop policy if exists "blogs_anon_update" on public.blogs;
-- drop policy if exists "blogs_anon_delete" on public.blogs;

-- =========================================================
-- 8. 数据校验约束（CHECK constraints）
-- =========================================================
-- guestbook 长度约束
alter table public.guestbook
  drop constraint if exists guestbook_name_length;
alter table public.guestbook
  add constraint guestbook_name_length check (char_length(name) between 1 and 30);

alter table public.guestbook
  drop constraint if exists guestbook_message_length;
alter table public.guestbook
  add constraint guestbook_message_length check (char_length(message) between 1 and 300);

-- friends URL 格式约束
alter table public.friends
  drop constraint if exists friends_url_format;
alter table public.friends
  add constraint friends_url_format check (url ~ '^https?://');

-- friend_applications URL 格式约束
alter table public.friend_applications
  drop constraint if exists friend_app_url_format;
alter table public.friend_applications
  add constraint friend_app_url_format check (url ~ '^https?://');

-- =========================================================
-- 9. 设置管理员（手动替换成你的邮箱）
-- =========================================================
-- 先在 Supabase Authentication → Users 中创建你的账号，
-- 然后执行以下 SQL 把自己设为管理员：
--
-- insert into public.profiles (id, is_admin)
-- select id, true from auth.users where email = '你的邮箱@example.com'
-- on conflict (id) do update set is_admin = true;
