import{s as E}from"./supabase.CogZFm8o.js";let y=!1;function u(){if(y)return;y=!0;const m=document.getElementById("guestbook-form"),p=document.getElementById("nickname"),r=document.getElementById("message"),s=document.getElementById("messages-list"),f=document.getElementById("message-count"),c=document.getElementById("character-count"),o=document.getElementById("submit-btn");if(!(m instanceof HTMLFormElement)||!(p instanceof HTMLInputElement)||!(r instanceof HTMLTextAreaElement)||!(s instanceof HTMLElement)||!(f instanceof HTMLElement)||!(c instanceof HTMLElement)||!(o instanceof HTMLButtonElement))return;async function h(){s.innerHTML=`
          <div class="empty-message">
            <span>♡</span>
            <p>Loading notes...</p>
          </div>
        `;try{const{data:e,error:t}=await E.from("guestbook").select("id, name, message, created_at").order("created_at",{ascending:!1});if(t){console.error("Error fetching messages:",t),s.innerHTML=`
              <div class="empty-message">
                <span>!</span>
                <p>Failed to load notes.</p>
              </div>
            `;return}L(e??[])}catch(e){console.error("Fetch error:",e),s.innerHTML=`
            <div class="empty-message">
              <span>!</span>
              <p>Something went wrong.</p>
            </div>
          `}}function L(e){if(s.innerHTML="",f.textContent=`${e.length} ${e.length===1?"note":"notes"}`,e.length===0){s.innerHTML=`
            <div class="empty-message">
              <span>♡</span>
              <p>No little notes yet...</p>
            </div>
          `;return}e.forEach(t=>{const n=document.createElement("article");n.className="message-card";const a=document.createElement("div");a.className="message-top";const i=document.createElement("span");i.className="message-name",i.textContent=t.name;const d=document.createElement("span");d.className="message-date";const C=new Date(t.created_at).toLocaleDateString("zh-CN",{year:"numeric",month:"2-digit",day:"2-digit"});d.textContent=C,a.appendChild(i),a.appendChild(d);const l=document.createElement("p");l.className="message-text",l.textContent=t.message;const g=document.createElement("span");g.className="message-heart",g.textContent="♡",n.appendChild(a),n.appendChild(l),n.appendChild(g),s.appendChild(n)})}r.addEventListener("input",()=>{c.textContent=`${r.value.length} / 300`}),m.addEventListener("submit",async e=>{e.preventDefault();const t=p.value.trim(),n=r.value.trim();if(!t||!n){alert("Please enter your name and message ♡");return}if(t.length>30){alert("Your name is too long.");return}if(n.length>300){alert("Your message is too long.");return}o.disabled=!0,o.textContent="Sending...";try{const{error:a}=await E.from("guestbook").insert([{name:t,message:n}]);if(a){console.error("Insert error:",a),alert("Failed to send your message. Please try again.");return}m.reset(),c.textContent="0 / 300",await h()}catch(a){console.error("Submit error:",a),alert("Something went wrong. Please try again.")}finally{o.disabled=!1,o.textContent="Leave it ♡"}}),h()}document.addEventListener("astro:page-load",u);document.readyState==="loading"?document.addEventListener("DOMContentLoaded",u,{once:!0}):u();
