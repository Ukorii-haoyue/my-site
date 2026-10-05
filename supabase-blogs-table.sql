-- =========================================================
-- 博客 blogs 表建表 SQL
-- 在 Supabase Dashboard → SQL Editor 中整段执行即可
-- 结构与 films / books / guestbook 保持一致的模式
-- =========================================================

create table if not exists public.blogs (
  id          bigint generated always as identity primary key,
  title       text not null,
  content     text not null default '',
  created_at  timestamptz not null default now(),
  is_visible  boolean not null default true
);

-- 开启行级安全
alter table public.blogs enable row level security;

-- 表级授权：RLS 策略只管行，必须同时授予角色表权限
-- （否则后台保存会报 permission denied for table blogs）
grant select on public.blogs to anon;
grant select, insert, update, delete on public.blogs to authenticated;
grant usage on sequence public.blogs_id_seq to authenticated;

-- 1) 公开访问：只读已发布（is_visible = true）的文章
create policy "blogs_public_select"
  on public.blogs
  for select
  using (is_visible = true);

-- 2) 登录用户（即后台管理员）：可读全部（包括未发布的草稿）
create policy "blogs_auth_select_all"
  on public.blogs
  for select
  to authenticated
  using (true);

-- 3) 登录用户：新增 / 修改 / 删除
create policy "blogs_auth_insert"
  on public.blogs
  for insert
  to authenticated
  with check (true);

create policy "blogs_auth_update"
  on public.blogs
  for update
  to authenticated
  using (true)
  with check (true);

create policy "blogs_auth_delete"
  on public.blogs
  for delete
  to authenticated
  using (true);

-- =========================================================
-- 测试数据（可选，执行后可在 /blog/ 看到示例文章）
-- =========================================================
insert into public.blogs (title, content, is_visible)
values
  ('你好，博客', E'这是第一篇博客。\n\n在这里记录一些日常、想法和碎碎念。', true);
