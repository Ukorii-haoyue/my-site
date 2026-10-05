// src/scripts/films-carousel.js

document.addEventListener("DOMContentLoaded", () => {
    const track = document.getElementById("carouselTrack");
    const carouselContainer = document.querySelector(".carousel-container");

    if (!track || !carouselContainer) return;

    const items = Array.from(
        track.getElementsByClassName("carousel-item")
    );

    const buttons = Array.from(
        document.querySelectorAll(".page-nav-btn:not(.all-btn)")
    );

    const titleDisplay =
        document.getElementById("carouselActiveTitle");

    // =========================================================
    // 当前电影
    // =========================================================

    // 默认停在中间一张（数据来自 Supabase，数量不固定）
    let currentIndex = Math.floor(items.length / 2);

    // 鼠标是否位于电影区域
    let isMouseInside = false;

    // 滚轮节流
    let isThrottled = false;


    // =========================================================
    // 更新轮播
    // =========================================================

    function updateCarousel() {

        items.forEach((item, index) => {

            const offset = index - currentIndex;


            // =========================
            // 中间卡片
            // =========================

            if (offset === 0) {

                item.style.transform =
                    `translate3d(0, 0, 0)
                     rotate(0deg)
                     scale(1.2)`;

                item.style.zIndex = "10";
                item.style.opacity = "1";
                item.style.pointerEvents = "auto";

                item.classList.add("active");


                // 更新顶部标题

                if (titleDisplay) {

                    titleDisplay.textContent =
                        item.getAttribute("data-title");

                }

            }


            // =========================
            // 两侧卡片
            // =========================

            else {

                item.classList.remove("active");

                const translateX = offset * 75;
                const translateY = 35;
                const rotateDeg = -12;
                const scale = 0.85;


                item.style.transform =
                    `translate3d(
                        ${translateX}%,
                        ${translateY}px,
                        0
                    )
                    rotate(${rotateDeg}deg)
                    scale(${scale})`;


                item.style.zIndex =
                    String(10 - Math.abs(offset));


                // 只显示附近的卡片

                if (Math.abs(offset) <= 2) {

                    item.style.opacity =
                        Math.abs(offset) === 1
                            ? "0.75"
                            : "0.25";

                    item.style.pointerEvents = "auto";

                } else {

                    item.style.opacity = "0";
                    item.style.pointerEvents = "none";

                }

            }

        });


        // =====================================================
        // 更新底部数字
        // =====================================================

        buttons.forEach((btn, index) => {

            if (index === currentIndex) {

                btn.classList.add("active");

            } else {

                btn.classList.remove("active");

            }

        });

    }


    // =========================================================
    // 点击卡片
    // =========================================================

    items.forEach((item, index) => {

        item.addEventListener("click", (event) => {

            // =================================
            // 已经在中间的卡片：
            // 跳转到该部电影的随笔详情页
            // =================================

            if (index === currentIndex) {

                const link =
                    item.querySelector(".card-frame");

                if (link && link.href) {

                    window.location.href =
                        link.href;

                }

                return;

            }


            // =================================
            // 两侧卡片：先转到中间，不跳转
            // =================================

            event.preventDefault();

            currentIndex = index;

            updateCarousel();

        });

    });


    // =========================================================
    // 点击底部数字
    // =========================================================

    buttons.forEach((btn, index) => {

        btn.addEventListener("click", () => {

            currentIndex = index;

            updateCarousel();

        });

    });


    // =========================================================
    // 鼠标进入 / 离开 Films
    // =========================================================

    carouselContainer.addEventListener(
        "mouseenter",
        () => {

            isMouseInside = true;

        }
    );


    carouselContainer.addEventListener(
        "mouseleave",
        () => {

            isMouseInside = false;

        }
    );


    // =========================================================
    // 滚轮控制
    // =========================================================

    window.addEventListener(
        "wheel",
        (e) => {

            // =====================================================
            // 鼠标不在 Films 上
            // 网页正常滚动
            // =====================================================

            if (!isMouseInside) {

                return;

            }


            // =====================================================
            // 向下滚
            // =====================================================

            if (e.deltaY > 0) {

                // -----------------------------------------------
                // 还没有到最后一张
                // Films 接管滚轮
                // -----------------------------------------------

                if (currentIndex < items.length - 1) {

                    e.preventDefault();

                    if (isThrottled) return;

                    isThrottled = true;

                    currentIndex++;

                    updateCarousel();


                    setTimeout(() => {

                        isThrottled = false;

                    }, 400);

                    return;
                }


                // -----------------------------------------------
                // 已经是最后一张
                //
                // 不 preventDefault()
                // 网页恢复向下滚动
                // -----------------------------------------------

                isMouseInside = false;

                return;
            }


            // =====================================================
            // 向上滚
            // =====================================================

            if (e.deltaY < 0) {

                // -----------------------------------------------
                // 还没有到第一张
                // Films 接管滚轮
                // -----------------------------------------------

                if (currentIndex > 0) {

                    e.preventDefault();

                    if (isThrottled) return;

                    isThrottled = true;

                    currentIndex--;

                    updateCarousel();


                    setTimeout(() => {

                        isThrottled = false;

                    }, 400);

                    return;
                }


                // -----------------------------------------------
                // 已经是第一张
                //
                // 不 preventDefault()
                // 网页恢复向上滚动
                // -----------------------------------------------

                isMouseInside = false;

                return;
            }

        },
        {
            passive: false
        }
    );


    // =========================================================
    // 初始化
    // =========================================================

    updateCarousel();

});