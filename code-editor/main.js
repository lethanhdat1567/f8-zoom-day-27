const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// Elements
const wrapper = $(".wrapper");
const editorInput = $("#editor-input");
const preview = $(".preview");
const menu = $(".menu");
const menuItems = menu.querySelectorAll(".menu-item");
const zoom = $("#zoom");

// Code editor
editorInput.oninput = function (event) {
    if (event.target.value) {
        window.addEventListener("beforeunload", warningReload);
    } else {
        window.removeEventListener("beforeunload", warningReload);
    }
    preview.srcdoc = event.target.value;
};

// Warning reset
function warningReload(event) {
    event.preventDefault();
}

// Zoom
zoom.onclick = () => {
    if (!document.fullscreenElement) {
        wrapper.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
};
// Menu
document.oncontextmenu = function (event) {
    event.preventDefault();
    menu.hidden = false;

    handleMenuView(event);
};

document.onmousedown = function (event) {
    if (event.target.closest(".menu")) return;
    menu.hidden = true;
};

// Menu Items
menuItems.forEach((item) => {
    item.onclick = function (event) {
        const type = item.dataset.type;

        menuAction[type]();
    };
});

function handleMenuView(event) {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const menuWidth = menu.offsetWidth;
    const menuHeight = menu.offsetHeight;

    let posX = event.clientX;
    let posY = event.clientY;

    const viewportMenuX = menuWidth + posX;
    const viewportMenuY = menuHeight + posY;

    if (viewportMenuX > viewportWidth) {
        posX = posX - menuWidth;
    }
    if (viewportMenuY > viewportHeight) {
        posY = posY - menuHeight;
    }

    Object.assign(menu.style, {
        left: `${posX}px`,
        top: `${posY}px`,
    });
}

const menuAction = {
    destroy() {
        editorInput.value = "";
        preview.srcdoc = "";

        menu.hidden = true;
        editorInput.focus();

        window.removeEventListener("beforeunload", warningReload);
    },
};
