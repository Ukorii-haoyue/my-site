import{s as i}from"./supabase.CogZFm8o.js";const b=document.getElementById("bakingForm"),h=document.getElementById("titleInput"),v=document.getElementById("dateInput"),w=document.getElementById("descriptionInput"),g=document.getElementById("imageInput"),u=document.getElementById("bakingGrid"),p=document.getElementById("loading"),m=document.getElementById("saveBtn"),C=document.getElementById("logoutBtn"),B=document.getElementById("formTitle"),I=document.getElementById("imageHint"),E=document.getElementById("cancelEditBtn");let s=null,f="";async function U(){const{data:{user:t},error:a}=await i.auth.getUser();if(a||!t)return window.location.href="/admin",!1;const{data:e,error:n}=await i.from("profiles").select("is_admin").eq("id",t.id).single();return n||!e||!e.is_admin?(alert("You do not have permission to access this page."),window.location.href="/admin",!1):!0}async function k(){p.style.display="block",u.style.display="none";const{data:t,error:a}=await i.from("baking").select("id, title, date, description, image_url, created_at").order("created_at",{ascending:!1});if(a){console.error(a),p.textContent="Failed to load baking diary.";return}if(p.style.display="none",u.style.display="grid",u.innerHTML="",!t||t.length===0){u.innerHTML=`
        <p style="
          color:#b28b94;
          grid-column:1/-1;
          text-align:center;
        ">
          No baking records yet ♡
        </p>
      `;return}t.forEach(e=>{const n=document.createElement("article");n.className="admin-item",n.innerHTML=`

        ${e.image_url?`
              <img
                src="${e.image_url}"
                alt="${y(e.title)}"
              />
            `:""}

        <div class="admin-item-content">

          <h3>
            ${y(e.title)}
          </h3>

          <p class="baking-date">
            ${e.date||""}
          </p>

          <p>
            ${y(e.description||"")}
          </p>

          <button
            class="edit-btn"
            data-id="${e.id}"
          >
            Edit
          </button>

          <button
            class="delete-btn"
            data-id="${e.id}"
            data-image="${e.image_url||""}"
          >
            Delete
          </button>

        </div>
      `,u.appendChild(n)}),document.querySelectorAll(".delete-btn").forEach(e=>{e.addEventListener("click",async()=>{const n=e.dataset.id,l=e.dataset.image;if(!confirm("Delete this baking record?"))return;const{error:r}=await i.from("baking").delete().eq("id",n);if(r){alert("Failed to delete: "+r.message);return}if(l)try{const o=l.split("/baking/")[1];o&&await i.storage.from("baking").remove([o])}catch(o){console.warn("Storage image could not be removed:",o)}await k()})}),document.querySelectorAll(".edit-btn").forEach(e=>{e.addEventListener("click",()=>{const n=t.find(l=>l.id===Number(e.dataset.id));n&&_(n)})})}function _(t){s=t.id,f=t.image_url||"",h.value=t.title||"",v.value=t.date||"",w.value=t.description||"",g.value="",g.required=!1,I.textContent="Leave empty to keep the current image.",B.textContent="Edit Baking",m.textContent="Update Baking",E.style.display="inline-flex",b.scrollIntoView({behavior:"smooth"})}function x(){s=null,f="",b.reset(),g.required=!0,I.textContent="",B.textContent="+ Add Baking",m.textContent="Save Baking",E.style.display="none"}E.addEventListener("click",()=>{x()});b.addEventListener("submit",async t=>{t.preventDefault(),m.disabled=!0,m.textContent="Saving...";try{const a=h.value.trim(),e=v.value,n=w.value.trim(),l=g.files[0];if(!a||!e||!s&&!l){alert(s?"Please fill in the title and date.":"Please fill in the title, date and image.");return}let c="";if(l){const r=l.name.split(".").pop(),o=`${Date.now()}-${crypto.randomUUID()}.${r}`,{error:d}=await i.storage.from("baking").upload(o,l,{cacheControl:"3600",upsert:!1});if(d)throw d;const{data:$}=i.storage.from("baking").getPublicUrl(o);c=$.publicUrl}if(s){const r={title:a,date:e,description:n};c&&(r.image_url=c);const{error:o}=await i.from("baking").update(r).eq("id",s);if(o)throw o;if(c&&f)try{const d=f.split("/baking/")[1];d&&await i.storage.from("baking").remove([d])}catch(d){console.warn("Old image could not be removed:",d)}alert("Baking updated successfully ♡")}else{const{error:r}=await i.from("baking").insert({title:a,date:e,description:n,image_url:c});if(r)throw r;alert("Baking added successfully ♡")}x(),await k()}catch(a){console.error(a),alert("Failed to save baking: "+a.message)}finally{m.disabled=!1,m.textContent=s?"Update Baking":"Save Baking"}});C.addEventListener("click",async()=>{await i.auth.signOut(),window.location.href="/admin"});function y(t){return String(t).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;")}const A=await U();A&&await k();
