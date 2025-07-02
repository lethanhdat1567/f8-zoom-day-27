const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// Elements
const listEle = $(".list");
const btns = $$(".btn");
const likeTotal = $("#like-total");
const disLikeTotal = $("#dislike-total");

// Variables
const items = [
    {
        id: 1,
        thumbnail:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=60",
        title: "Nguyễn Minh Anh",
    },
    {
        id: 2,
        thumbnail:
            "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&auto=format&fit=crop&q=60",
        title: "Trần Thảo Vy",
    },
    {
        id: 3,
        thumbnail:
            "https://images.unsplash.com/photo-1544725176-7c40e5a2c9f9?w=600&auto=format&fit=crop&q=60",
        title: "Phạm Gia Bảo",
    },
    {
        id: 4,
        thumbnail:
            "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=60",
        title: "Lê Khánh Linh",
    },
    {
        id: 5,
        thumbnail:
            "https://images.unsplash.com/photo-1546967191-fdfb13ed6b1e?w=600&auto=format&fit=crop&q=60",
        title: "Vũ Quang Huy",
    },
    {
        id: 6,
        thumbnail:
            "https://images.unsplash.com/photo-1524253482453-3fed8d2fe12b?w=600&auto=format&fit=crop&q=60",
        title: "Đặng Ngọc Hân",
    },
];

const startPos = {
    x: 0,
    y: 0,
};
const liked = [];
const disliked = [];

// State
let isDragging = false;
let currentIndex = items.length - 1;
let statusState = null;

listEle.ontouchstart = function (event) {
    isDragging = true;
    startPos.x = event.touches[0].clientX;
    startPos.y = event.touches[0].clientY;
};

listEle.ontouchend = function (event) {
    if (!items.length) return;
    const itemEle = getElement();

    if (itemEle) {
        const distanceX = event.changedTouches[0].clientX - startPos.x;

        if (distanceX >= -50 && distanceX <= 50) {
            itemEle.style.transform = "none";
            return;
        }

        handleVote();
        resetItem();
    }
};
function handleVote() {
    if (statusState === "liked") {
        liked.push(items[currentIndex]);
    } else if (statusState === "disliked") {
        disliked.push(items[currentIndex]);
    }
}

listEle.ontouchmove = function (event) {
    if (isDragging && items.length > 0) {
        const itemEle = getElement();
        if (itemEle) {
            const distanceX = event.touches[0].clientX - startPos.x;

            if (distanceX > 50) {
                statusState = "liked";
            } else if (distanceX < -50) {
                statusState = "disliked";
            } else {
                statusState = "meh";
            }
            cardAnimation();
        }
    }
};

btns.forEach((btn) => {
    btn.ontouchend = () => {
        btn.classList.add("active");

        btn.ontransitionend = () => {
            btn.classList.remove("active");
        };

        if (statusState === "meh" || !items.length) return;

        statusState = btn.dataset.type;
        cardAnimation();
        resetItem();
    };
});

const renderItems = function () {
    const html = items
        .map((item) => {
            return `<div class="item" data-index="${item.id}">
                    <img
                        class="item-thumbnail"
                        src="${item.thumbnail}"
                    />
                    <h2 class="item-name">${item.title}</h2>
                </div>`;
        })
        .join("");

    listEle.innerHTML = html;
};

function getElement() {
    const currentItem = items[currentIndex];

    const itemEle = document.querySelector(`[data-index='${currentItem.id}']`);

    return itemEle;
}

function resetItem() {
    if (!items.length) return;
    const itemEle = getElement();
    isDragging = false;
    startPos.x = 0;
    startPos.y = 0;
    items.pop();
    currentIndex = items.length - 1;
    itemEle.style.transition = `ease 1s`;
    itemEle.style.opacity = `0`;
    statusState = null;
    itemEle.ontransitionend = () => {
        itemEle.remove();
        likeTotal.innerText = liked.length;
        disLikeTotal.innerText = disliked.length;
    };
}

function cardAnimation() {
    const itemEle = getElement();

    if (statusState === "liked") {
        itemEle.style.transform = `rotate(10deg) translate(30px, -30px)`;
        itemEle.style.border = `1px solid green`;
    } else if (statusState === "disliked") {
        itemEle.style.transform = `rotate(-10deg) translate(-30px, -30px)`;
        itemEle.style.border = `1px solid red`;
    } else {
        itemEle.style.transform = "none";
        itemEle.style.border = `1px solid #ccc`;
    }
}

renderItems();
