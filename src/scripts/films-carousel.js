// src/scripts/films-carousel.js

let _wheelBound = false;

function initFilmsCarousel() {
    const track = document.getElementById("carouselTrack");
    const container = document.querySelector(".carousel-container");
    if (!track || !container) return;

    const items = Array.from(track.getElementsByClassName("carousel-item"));
    if (!items.length) return;

    const buttons = Array.from(document.querySelectorAll(".page-nav-btn"));
    const titleDisplay = document.getElementById("carouselActiveTitle");

    let currentIndex = Math.floor(items.length / 2);
    let isMouseInside = false;
    let isThrottled = false;

    function render() {
        items.forEach((item, index) => {
            const offset = index - currentIndex;
            if (offset === 0) {
                item.style.cssText = "transform:translate3d(0,0,0) rotate(0) scale(1.2); z-index:10; opacity:1; pointer-events:auto;";
                item.classList.add("active");
                if (titleDisplay) titleDisplay.textContent = item.getAttribute("data-title");
            } else {
                item.classList.remove("active");
                const tx = offset * 75;
                item.style.cssText = `transform:translate3d(${tx}%,35px,0) rotate(-12deg) scale(0.85); z-index:${10 - Math.abs(offset)};`;
                if (Math.abs(offset) <= 2) {
                    item.style.opacity = Math.abs(offset) === 1 ? "0.75" : "0.25";
                    item.style.pointerEvents = "auto";
                } else {
                    item.style.opacity = "0";
                    item.style.pointerEvents = "none";
                }
            }
        });
        buttons.forEach((btn, i) => {
            btn.classList.toggle("active", i === currentIndex);
        });
    }

    function goTo(index) {
        currentIndex = Math.max(0, Math.min(items.length - 1, index));
        render();
    }

    // 点击卡片
    items.forEach((item, index) => {
        item.onclick = (e) => {
            if (index === currentIndex) {
                const link = item.querySelector(".card-frame");
                if (link) window.location.href = link.href;
            } else {
                e.preventDefault();
                goTo(index);
            }
        };
    });

    // 点击页码
    buttons.forEach((btn, index) => {
        btn.onclick = () => goTo(index);
    });

    // 鼠标进入/离开
    container.onmouseenter = () => { isMouseInside = true; };
    container.onmouseleave = () => { isMouseInside = false; };

    // 滚轮（只绑定一次，通过闭包变量控制）
    if (!_wheelBound) {
        _wheelBound = true;
        window.addEventListener("wheel", (e) => {
            if (!isMouseInside) return;
            if (isThrottled) return;

            if (e.deltaY > 0 && currentIndex < items.length - 1) {
                e.preventDefault();
                isThrottled = true;
                goTo(currentIndex + 1);
                setTimeout(() => { isThrottled = false; }, 400);
            } else if (e.deltaY < 0 && currentIndex > 0) {
                e.preventDefault();
                isThrottled = true;
                goTo(currentIndex - 1);
                setTimeout(() => { isThrottled = false; }, 400);
            }
        }, { passive: false });
    }

    render();
}

window.initFilmsCarousel = initFilmsCarousel;
document.addEventListener("DOMContentLoaded", initFilmsCarousel);
