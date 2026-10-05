import{s as a}from"./supabase.CogZFm8o.js";const I=document.getElementById("loading"),F=document.getElementById("friends-section"),w=document.getElementById("friends-list"),p=document.getElementById("applications-list"),c=document.getElementById("add-friend-btn"),m=document.getElementById("friend-form"),$=document.getElementById("cancel-friend-btn"),o=document.getElementById("save-friend-btn"),_=document.getElementById("logout-btn");let s=null,y="",v=[];async function L(){const{data:{user:t}}=await a.auth.getUser();if(!t)return window.location.href="/admin",!1;const{data:n,error:e}=await a.from("profiles").select("is_admin").eq("id",t.id).single();return e||!n?.is_admin?(alert("You do not have administrator permission."),window.location.href="/admin",!1):!0}async function g(){const{data:t,error:n}=await a.from("friends").select("id, name, url, description, avatar_url, created_at").order("created_at",{ascending:!1});if(n){console.error(n),w.innerHTML=`
          <p class="admin-error">
            Failed to load friends: ${n.message}
          </p>
        `;return}if(!t||t.length===0){w.innerHTML=`
          <div class="admin-empty">
            <p>No friends yet.</p>
            <span>Add your first friend link ♡</span>
          </div>
        `;return}w.innerHTML=t.map(e=>`

        <article class="admin-content-card">

          ${e.avatar_url?`
                <div class="admin-content-image friend-avatar">
                  <img
                    src="${e.avatar_url}"
                    alt="${e.name}"
                  />
                </div>
              `:`
                <div class="admin-content-image friend-avatar placeholder">
                  ♡
                </div>
              `}


          <div class="admin-content-info">

            <h3>${e.name}</h3>

            <p class="admin-content-meta">
              ${e.url||""}
            </p>

            <p class="admin-content-description">
              ${e.description||""}
            </p>

          </div>


          <div class="admin-content-actions">

            <button
              class="admin-edit-btn"
              data-id="${e.id}"
            >
              Edit
            </button>

            <button
              class="admin-delete-btn"
              data-id="${e.id}"
              data-avatar="${e.avatar_url||""}"
            >
              Delete
            </button>

          </div>

        </article>

      `).join(""),document.querySelectorAll(".admin-delete-btn").forEach(e=>{e.addEventListener("click",async()=>{const i=e.dataset.id,r=e.dataset.avatar;if(!confirm("Delete this friend?"))return;const{error:l}=await a.from("friends").delete().eq("id",i);if(l){alert("Delete failed: "+l.message);return}if(r){const d=r.split("/").pop();d&&await a.storage.from("friends").remove([d])}await g()})}),document.querySelectorAll(".admin-edit-btn").forEach(e=>{e.addEventListener("click",()=>{const i=t.find(r=>r.id===Number(e.dataset.id));i&&U(i)})})}async function b(){p.innerHTML=`
        <div class="admin-loading">
          Loading applications...
        </div>
      `;const{data:t,error:n}=await a.from("friend_applications").select("id, name, url, description, avatar_url, created_at").order("created_at",{ascending:!1});if(n){console.error(n),p.innerHTML=`
          <p class="admin-error">
            Failed to load applications: ${n.message}
          </p>
        `;return}if(v=t||[],!v.length){p.innerHTML=`
          <div class="admin-empty">
            <p>No pending applications.</p>
            <span>New applications will show up here ♡</span>
          </div>
        `;return}p.innerHTML=v.map(e=>`

        <article class="admin-content-card">

          ${e.avatar_url?`
                <div class="admin-content-image friend-avatar">
                  <img
                    src="${e.avatar_url}"
                    alt="${e.name}"
                  />
                </div>
              `:`
                <div class="admin-content-image friend-avatar placeholder">
                  ♡
                </div>
              `}


          <div class="admin-content-info">

            <h3>${e.name}</h3>

            <p class="admin-content-meta">
              ${e.url||""}
            </p>

            <p class="admin-content-description">
              ${e.description||""}
            </p>

          </div>


          <div class="admin-content-actions">

            <button
              class="approve-btn"
              data-id="${e.id}"
            >
              Approve
            </button>

            <button
              class="admin-delete-btn reject-btn"
              data-id="${e.id}"
            >
              Reject
            </button>

          </div>

        </article>

      `).join(""),document.querySelectorAll(".approve-btn").forEach(e=>{e.addEventListener("click",()=>{const i=v.find(r=>r.id===Number(e.dataset.id));i&&A(i)})}),document.querySelectorAll(".reject-btn").forEach(e=>{e.addEventListener("click",()=>{k(Number(e.dataset.id))})})}async function A(t){if(!confirm(`Approve "${t.name}" and add to friends?`))return;const{error:e}=await a.from("friends").insert({name:t.name,url:t.url,description:t.description||null,avatar_url:t.avatar_url||null});if(e){alert("Approve failed: "+e.message);return}const{error:i}=await a.from("friend_applications").delete().eq("id",t.id);i&&alert("Application record delete failed: "+i.message),await b(),await g()}async function k(t){if(!confirm("Reject this application?"))return;const{error:e}=await a.from("friend_applications").delete().eq("id",t);if(e){alert("Reject failed: "+e.message);return}await b()}function h(){s=null,y="",document.getElementById("friend-name").value="",document.getElementById("friend-url").value="",document.getElementById("friend-description").value="",document.getElementById("friend-avatar").value="",document.getElementById("friend-form-title").textContent="Add a new friend",document.getElementById("friend-avatar-hint").textContent="",o.textContent="Save Friend",o.disabled=!1}function U(t){s=t.id,y=t.avatar_url||"",document.getElementById("friend-name").value=t.name||"",document.getElementById("friend-url").value=t.url||"",document.getElementById("friend-description").value=t.description||"",document.getElementById("friend-avatar").value="",document.getElementById("friend-form-title").textContent="Edit this friend",document.getElementById("friend-avatar-hint").textContent="Leave empty to keep the current avatar.",o.textContent="Update Friend",m.style.display="block",c.style.display="none",m.scrollIntoView({behavior:"smooth"})}c.addEventListener("click",()=>{h(),m.style.display="block",c.style.display="none"});$.addEventListener("click",()=>{h(),m.style.display="none",c.style.display="inline-flex"});o.addEventListener("click",async()=>{const t=document.getElementById("friend-name").value.trim(),n=document.getElementById("friend-url").value.trim(),e=document.getElementById("friend-description").value.trim(),i=document.getElementById("friend-avatar");if(!t){alert("Please enter a friend name.");return}if(!n){alert("Please enter a friend URL.");return}o.disabled=!0,o.textContent="Saving...";let r=null;const f=i.files[0];if(f){const d=f.name.split(".").pop(),u=`${Date.now()}-${crypto.randomUUID()}.${d}`,{error:E}=await a.storage.from("friends").upload(u,f,{cacheControl:"3600",upsert:!1});if(E){console.error(E),alert("Avatar upload failed: "+E.message),o.disabled=!1,o.textContent=s?"Update Friend":"Save Friend";return}const{data:B}=a.storage.from("friends").getPublicUrl(u);r=B.publicUrl}let l;if(s){const d={name:t,url:n,description:e};r&&(d.avatar_url=r);const{error:u}=await a.from("friends").update(d).eq("id",s);l=u}else{const{error:d}=await a.from("friends").insert({name:t,url:n,description:e,avatar_url:r});l=d}if(l){console.error(l),alert("Failed to save friend: "+l.message),o.disabled=!1,o.textContent=s?"Update Friend":"Save Friend";return}if(s&&r&&y){const d=y.split("/").pop();d&&await a.storage.from("friends").remove([d])}alert(s?"Friend updated successfully! ♡":"Friend added successfully! ♡"),h(),m.style.display="none",c.style.display="inline-flex",await g()});_.addEventListener("click",async()=>{await a.auth.signOut(),window.location.href="/admin"});const x=await L();x&&(I.style.display="none",F.style.display="block",await b(),await g());
