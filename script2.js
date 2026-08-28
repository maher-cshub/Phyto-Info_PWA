import firebase_app from "./util.js";
import {getDatabase, ref, get} from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";

const item_image = document.querySelector("#item-image");


function updateDOM(){
    const coll = document.getElementsByClassName("collapsible");
    for (let i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function() {
            this.classList.toggle("active");
            const content = this.nextElementSibling;
            if (content.style.maxHeight){
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = "70vh";
            }
            content.classList.toggle("active-content");
        });
    }
}

function setContent(items){
    const infos = Object.entries(items);
    const contentarea = document.getElementById("content-area");
    infos.forEach(info => {
        const div1 = document.createElement("div");
        const div2 = document.createElement("div");
        div1.setAttribute("class", "collapsible");
        div2.setAttribute("class", "content");
        div1.innerHTML = `<span>${info[0]}</span>`;
        div2.innerHTML = `<iframe srcdoc="${info[1]}" frameborder="0"></iframe>`;
        contentarea.appendChild(div1);
        contentarea.appendChild(div2);
    });
}

function LoadPage(){
    const database = getDatabase(firebase_app);
    const target_id = localStorage.getItem("selected_item_to_preview");
    const target_ref = ref(database, `items/${target_id}`);
    get(target_ref)
    .then((snapshot) => {
        const item = snapshot.val();
        item_image.querySelector("img").setAttribute("src", item["image"]);
        item_image.querySelector("img").addEventListener("error", function(){
            this.src = "/assets/logo.svg";
        });
        item_image.querySelector("span").textContent = item["name"];
        if (item["infos"] != null && item["infos"] != undefined){
            setContent(item["infos"]);
        }
        updateDOM();
    })
    .catch((error) => {
        console.error("Failed to load item:", error);
    });
}


document.addEventListener("DOMContentLoaded", () => {
    LoadPage();
    const loader = document.querySelector(".loader-active");
    loader.classList.add("loader-hidden");
    loader.addEventListener("transitionend", () => {
        loader.remove();
    });
});
