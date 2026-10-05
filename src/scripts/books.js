/* =========================================================
   UKO'S LIBRARY
   Book Page Interaction
   ========================================================= */

function initBooksAccordion() {

    const books = document.querySelectorAll(".book-page");

    if (!books.length) return;

    let activeBook = books[0];

    books.forEach((book) => {

        book.addEventListener("mouseenter", () => {
            books.forEach((item) => item.classList.remove("is-active"));
            book.classList.add("is-active");
            activeBook = book;
        });

        book.addEventListener("click", () => {
            books.forEach((item) => item.classList.remove("is-active"));
            book.classList.add("is-active");
            activeBook = book;
        });

    });

    const pages = document.querySelector(".books-pages");
    if (pages) {
        pages.addEventListener("mouseleave", () => {
            if (activeBook) activeBook.classList.add("is-active");
        });
    }
}

// 暴露给客户端渲染后调用
window.initBooksAccordion = initBooksAccordion;

// 首次加载也执行（SSR 模式下有数据时）
document.addEventListener("DOMContentLoaded", initBooksAccordion);
