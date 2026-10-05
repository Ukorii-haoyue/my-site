import{s as n}from"./supabase.CogZFm8o.js";const v=document.getElementById("loading"),E=document.getElementById("books-section"),k=document.getElementById("books-list"),c=document.getElementById("add-book-btn"),m=document.getElementById("book-form"),I=document.getElementById("cancel-book-btn"),i=document.getElementById("save-book-btn"),h=document.getElementById("logout-btn");let s=null,f="";async function w(){const{data:{user:t}}=await n.auth.getUser();if(!t)return window.location.href="/admin",!1;const{data:d,error:e}=await n.from("profiles").select("is_admin").eq("id",t.id).single();return e||!d?.is_admin?(alert("You do not have administrator permission."),window.location.href="/admin",!1):!0}async function y(){const{data:t,error:d}=await n.from("books").select("id, title, author, description, image_url, created_at").order("created_at",{ascending:!1});if(d){console.error(d),k.innerHTML=`
          <p class="admin-error">
            Failed to load books: ${d.message}
          </p>
        `;return}if(!t||t.length===0){k.innerHTML=`
          <div class="admin-empty">
            <p>No books yet.</p>
            <span>Add your first book ♡</span>
          </div>
        `;return}k.innerHTML=t.map(e=>`

        <article class="admin-content-card">

          ${e.image_url?`
                <div class="admin-content-image">
                  <img
                    src="${e.image_url}"
                    alt="${e.title}"
                  />
                </div>
              `:`
                <div class="admin-content-image placeholder">
                  No Cover
                </div>
              `}


          <div class="admin-content-info">

            <h3>${e.title}</h3>

            <p class="admin-content-meta">
              ${e.author||"Unknown author"}
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
              data-image="${e.image_url||""}"
            >
              Delete
            </button>

          </div>

        </article>

      `).join(""),document.querySelectorAll(".admin-delete-btn").forEach(e=>{e.addEventListener("click",async()=>{const r=e.dataset.id,a=e.dataset.image;if(!confirm("Delete this book?"))return;const{error:l}=await n.from("books").delete().eq("id",r);if(l){alert("Delete failed: "+l.message);return}if(a){const o=a.split("/").pop();o&&await n.storage.from("books").remove([o])}await y()})}),document.querySelectorAll(".admin-edit-btn").forEach(e=>{e.addEventListener("click",()=>{const r=t.find(a=>a.id===Number(e.dataset.id));r&&U(r)})})}function b(){s=null,f="",document.getElementById("book-title").value="",document.getElementById("book-author").value="",document.getElementById("book-description").value="",document.getElementById("book-image").value="",document.getElementById("book-form-title").textContent="Add a new book",document.getElementById("book-image-hint").textContent="",i.textContent="Save Book",i.disabled=!1}function U(t){s=t.id,f=t.image_url||"",document.getElementById("book-title").value=t.title||"",document.getElementById("book-author").value=t.author||"",document.getElementById("book-description").value=t.description||"",document.getElementById("book-image").value="",document.getElementById("book-form-title").textContent="Edit this book",document.getElementById("book-image-hint").textContent="Leave empty to keep the current cover.",i.textContent="Update Book",m.style.display="block",c.style.display="none",m.scrollIntoView({behavior:"smooth"})}c.addEventListener("click",()=>{b(),m.style.display="block",c.style.display="none"});I.addEventListener("click",()=>{b(),m.style.display="none",c.style.display="inline-flex"});i.addEventListener("click",async()=>{const t=document.getElementById("book-title").value.trim(),d=document.getElementById("book-author").value.trim(),e=document.getElementById("book-description").value.trim(),r=document.getElementById("book-image");if(!t){alert("Please enter a book title.");return}i.disabled=!0,i.textContent="Saving...";let a=null;const u=r.files[0];if(u){const o=u.name.split(".").pop(),g=`${Date.now()}-${crypto.randomUUID()}.${o}`,{error:p}=await n.storage.from("books").upload(g,u,{cacheControl:"3600",upsert:!1});if(p){console.error(p),alert("Image upload failed: "+p.message),i.disabled=!1,i.textContent=s?"Update Book":"Save Book";return}const{data:B}=n.storage.from("books").getPublicUrl(g);a=B.publicUrl}let l;if(s){const o={title:t,author:d,description:e};a&&(o.image_url=a);const{error:g}=await n.from("books").update(o).eq("id",s);l=g}else{const{error:o}=await n.from("books").insert({title:t,author:d,description:e,image_url:a});l=o}if(l){console.error(l),alert("Failed to save book: "+l.message),i.disabled=!1,i.textContent=s?"Update Book":"Save Book";return}if(s&&a&&f){const o=f.split("/").pop();o&&await n.storage.from("books").remove([o])}alert(s?"Book updated successfully! ♡":"Book added successfully! ♡"),b(),m.style.display="none",c.style.display="inline-flex",await y()});h.addEventListener("click",async()=>{await n.auth.signOut(),window.location.href="/admin"});const $=await w();$&&(v.style.display="none",E.style.display="block",await y());
