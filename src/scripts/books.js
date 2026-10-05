/* =========================================================
   UKO'S LIBRARY
   Book Page Interaction
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const books = document.querySelectorAll(".book-page");

    if (!books.length) return;


    /* ---------------------------------------------
       默认第一本打开
    --------------------------------------------- */

    let activeBook = books[0];

    books.forEach((book) => {

        /* 鼠标进入 */

        book.addEventListener("mouseenter", () => {

            books.forEach((item) => {
                item.classList.remove("is-active");
            });

            book.classList.add("is-active");

            activeBook = book;

        });


        /* 点击也可以打开 */

        book.addEventListener("click", () => {

            books.forEach((item) => {
                item.classList.remove("is-active");
            });

            book.classList.add("is-active");

            activeBook = book;

        });

    });


    /* ---------------------------------------------
       鼠标离开整个书籍区域
       保持最后一本打开
    --------------------------------------------- */

    const pages = document.querySelector(".books-pages");

    if (pages) {

        pages.addEventListener("mouseleave", () => {

            if (activeBook) {
                activeBook.classList.add("is-active");
            }

        });

    }

});