document.addEventListener(
    "DOMContentLoaded",
    ()=>{


        const books =
            document.querySelectorAll(
                ".book-item"
            );



        books.forEach(book=>{


            book.addEventListener(
                "mouseenter",
                ()=>{

                    book.style.zIndex="10";

                });


            book.addEventListener(
                "mouseleave",
                ()=>{

                    book.style.zIndex="1";

                });


        });


    });