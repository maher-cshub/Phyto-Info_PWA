const themeIcon = document.getElementById("theme-icon");
const appUI = document.getElementById("app-ui");

themeIcon.addEventListener("click", changeTheme);

function changeTheme() {
    const isLight = appUI.classList.contains("light-theme");
    if (isLight) {
        appUI.classList.replace("light-theme", "dark-theme");
        themeIcon.src = "/assets/sun.svg";
        localStorage.setItem("theme", "dark-theme");
    } else {
        appUI.classList.replace("dark-theme", "light-theme");
        themeIcon.src = "/assets/moon.svg";
        localStorage.setItem("theme", "light-theme");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
        appUI.className = savedTheme;
        themeIcon.src = savedTheme === "dark-theme" ? "/assets/sun.svg" : "/assets/moon.svg";
    }
});
