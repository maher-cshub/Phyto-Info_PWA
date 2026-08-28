
import firebase_app from "./util.js"
import {getDatabase, ref, onValue, onChildAdded, onChildRemoved} from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";

const user_search_input = document.getElementById("user-search-input");
user_search_input.addEventListener("input", search_items);

const database = getDatabase(firebase_app);
const results_area = document.getElementById("results-area");

let info_btns = null;


//events

function initVars(){
    info_btns = document.querySelectorAll("#item-info-btn");
    info_btns.forEach(button =>{
        button.addEventListener("click", getInfo);
    })
}


function getInfo(e){
    const chosen_item = e.target.closest("[item_id]");
    if (!chosen_item) return;
    const item_id = chosen_item.getAttribute("item_id");
    localStorage.setItem("selected_item_to_preview", item_id);
    window.location.href = "details.html";
}


function search_items(e){
    const input = e.target.value.trim().toLowerCase();
    const items = Array.from(results_area.children);
    items.forEach(element => {
        const title = element.querySelector("#item-title");
        if (!title) return;
        if (title.textContent.trim().toLowerCase().includes(input)){
            element.style.removeProperty("display");
        } else {
            element.style.display = "none";
        }
    });
}

function saveElement(element){
    const item = document.createElement("div");
    item.setAttribute("id", "item");
    item.setAttribute("item_id", element[0]);
    item.innerHTML = `
        <div id="item-image">
            <img src="${element[1]["image"]}" alt="${element[1]["name"]}">
        </div>
        <div id="item-details">
            <h1 id="item-title">${element[1]["name"]}</h1>
            <button class="info-btn-cls" id="item-info-btn">GET INFO</button>
        </div>
    `;

    results_area.appendChild(item);
}

async function getAllItems(){
    try {
        const items_ref = ref(database, "items");
        await onValue(items_ref, function(snapshot){
            if (snapshot.exists()){
                let items = Object.entries(snapshot.val());
                localStorage.setItem("items", JSON.stringify(items));
            } else {
                localStorage.setItem("items", JSON.stringify([]));
            }
        });
    } catch (error) {
        alert("Please check your internet connection");
    }
}


async function refreshData(){
    await getAllItems();

    results_area.innerHTML = "";

    let items = JSON.parse(localStorage.getItem("items"));

    items.forEach(saveElement);

    initVars();
}


onChildAdded(ref(database, "items"), (snapshot, key) => {
    refreshData();
});


onChildRemoved(ref(database, "items"), (snapshot) => {
    const deleted_item = document.querySelector(`[item_id="${snapshot.key}"]`);
    if (deleted_item) deleted_item.remove();
    let items = JSON.parse(localStorage.getItem("items"));
    items = items.filter(item => item[0] !== snapshot.key);
    localStorage.setItem("items", JSON.stringify(items));
});


setInterval(() => {
    localStorage.removeItem("items");
    refreshData();
}, 60000);
