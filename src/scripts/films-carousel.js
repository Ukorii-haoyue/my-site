// src/scripts/films-carousel.js

function initFilmsCarousel() {
    const track = document.getElementById("carouselTrack");
    const carouselContainer = document.querySelector(".carousel-container");

    if (!track || !carouselContainer) return;

    const items = Array.from(track.getElementsByClassName("carousel-item"));
    if (!items.length) return;

    const buttons = Array.from(
        document.querySelectorAll(".page-nav-btn:not(.film-all-link)")
    );

    const titleDisplay = document.getElementById("carouselActiveTitle");

    let currentIndex = Math.floor(items.length / 2);
    let isMouseInside = false;
    let isThrottled = false;

    function updateCarousel() {
        items.forEach((item, index) => {
            const offset = index - currentIndex;

            if (offset === 0) {
                item.style.transform = "translate3d(0, 0, 0) rotate(0deg) scale(1.2)";
                item.style.zIndex = "10";
                item.style.opacity = "1";
                item.style.pointerEvents = "auto";
                item.classList.add("active");
                if (titleDisplay) titleDisplay.textContent = item.getAttribute("data-title");
            } else {
                item.classList.remove("active");
                const translateX = offset * 75;
                const translateY = 35;
                const rotateDeg = -12;
                const scale = 0.85;
                item.style.transform = `translate3d(${translateX}%, ${translateY}px, 0) rotate(${rotateDeg}deg) scale(${scale})`;
                item.style.zIndex = String(10 - Math.abs(offset));
                if (Math.abs(offset) <= 2) {
                    item.style.opacity = Math.abs(offset) === 1 ? "0.75" : "0.25";
                    item.style.pointerEvents = "auto";
                } else {
                    item.style.opacity = "0";
                    item.style.pointerEvents = "none";
                }
            }
        });

        buttons.forEach((btn, index) => {
            if (index === currentIndex) btn.classList.add("active");
            else btn.classList.remove("active");
        });
    }

    // 移除旧的事件监听，避免重复绑定
    const newTrack = track.cloneNode(true);
    track.parentNode.replaceChild(newTrack, track);
    // 重新绑定 track 引用
    const freshItems = Array.from(newTrack.getElementsByClassName("carousel-item"));
    freshItems.forEach((item, index) => {
        item.addEventListener("click", (event) => {
            if (index === currentIndex) {
                const link = item.querySelector(".card-frame");
                if (link && link.href) window.location.href = link.href;
                return;
            }
            event.preventDefault();
            currentIndex = index;
            updateCarousel();
        });
    });

    buttons.forEach((btn, index) => {
        btn.addEventListener("click", () => {
            currentIndex = index;
            updateCarousel();
        });
    });

    carouselContainer.onmouseenter = () => { isMouseInside = true; };
    carouselContainer.onmouseleave = () => { isMouseInside = false; };

    window.onwheel = null;
    window.addEventListener("wheel", (e) => {
        if (!isMouseInside) return;
        if (e.deltaY > 0) {
            if (currentIndex < items.length - 1) {
                e.preventDefault();
                if (isThrottled) return;
                isThrottled = true;
                currentIndex++;
                updateCarousel();
                setTimeout(() => { isThrottled = false; }, 400);
                return;
            }
            isMouseInside = false;
            return;
        }
        if (e.deltaY < 0) {
            if (currentIndex > 0) {
                e.preventDefault();
                if (isThrottled) return;
                isThrottled = true;
                currentIndex--;
                updateCarousel();
                setTimeout(() => { isThrottled = false; }, 400);
                return;
            }
            isMouseInside = false;
            return;
        }
    }, { passive: false });

    updateCarousel();
}

window.initFilmsCarousel = initFilmsCarousel;

document.addEventListener("DOMContentLoaded", initFilmsCarousel);
