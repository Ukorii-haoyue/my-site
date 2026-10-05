document.addEventListener(
    "DOMContentLoaded",
    ()=>{


        const sections =
            document.querySelectorAll(".reveal");


        const observer =
            new IntersectionObserver(
                (entries)=>{


                    entries.forEach(entry=>{


                        if(entry.isIntersecting){

                            entry.target.classList.add(
                                "show"
                            );

                        }


                    });


                },
                {
                    threshold:.2
                });


        sections.forEach(
            section=>{
                observer.observe(section);
            });


    });