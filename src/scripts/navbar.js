document.addEventListener("DOMContentLoaded", () => {

  const navbar =
    document.getElementById("uko-navbar");

  const menuToggle =
    document.getElementById("menu-toggle");

  if (!navbar) return;


  /* =====================================================
     SCROLL
     ===================================================== */

  const handleScroll = () => {
    const hero = document.getElementById("hero");
    const transitionDistance = hero ? hero.offsetHeight : window.innerHeight;
    const progress = Math.min(
      1,
      Math.max(0, window.scrollY / transitionDistance)
    );

    navbar.style.setProperty(
      "--navbar-progress",
      progress.toString()
    );

    if (window.scrollY >= transitionDistance) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

  };

  window.addEventListener(
    "scroll",
    handleScroll,
    { passive: true }
  );

  handleScroll();


  /* =====================================================
     NAVIGATION
     ===================================================== */

  const links =
    navbar.querySelectorAll(
      'a[href^="#"]'
    );

  links.forEach(link => {

    link.addEventListener("click", event => {

      const href =
        link.getAttribute("href");

      if (!href || href === "#") {
        return;
      }

      const target =
        document.querySelector(href);

      /*
       * 如果目标不存在，不拦截浏览器默认行为。
       * 这样不会出现“点击以后什么都没发生”的假死状态。
       */
      if (!target) {
        return;
      }

      event.preventDefault();

      /*
       * 计算 Navbar 高度
       */
      const navbarHeight =
        navbar.querySelector(".navbar-inner")
          ?.offsetHeight || 0;

      const targetTop =
        target.getBoundingClientRect().top +
        window.scrollY -
        navbarHeight;

      window.scrollTo({
        top: Math.max(0, targetTop),
        behavior: "smooth"
      });


      /*
       * 关闭手机菜单
       */
      navbar.classList.remove("menu-open");

      if (menuToggle) {

        menuToggle.classList.remove("open");

        menuToggle.setAttribute(
          "aria-expanded",
          "false"
        );

      }

    });

  });


  /* =====================================================
     MOBILE MENU
     ===================================================== */

  if (menuToggle) {

    menuToggle.addEventListener(
      "click",
      () => {

        const isOpen =
          navbar.classList.toggle(
            "menu-open"
          );

        menuToggle.classList.toggle(
          "open",
          isOpen
        );

        menuToggle.setAttribute(
          "aria-expanded",
          String(isOpen)
        );

      }
    );

  }


  /* =====================================================
     ACTIVE SECTION
     ===================================================== */

  const sectionIds = [
    "hero",
    "diary",
    "films",
    "books",
    "baking",
    "friends"
  ];

  const sections =
    sectionIds
      .map(id =>
        document.getElementById(id)
      )
      .filter(Boolean);

  const navLinks =
    navbar.querySelectorAll(
      ".nav-link"
    );


  const updateActiveLink = () => {

    if (!sections.length) return;

    const currentPosition =
      window.scrollY +
      window.innerHeight * 0.35;

    let currentId =
      sections[0].id;

    sections.forEach(section => {

      if (
        section.offsetTop <=
        currentPosition
      ) {
        currentId =
          section.id;
      }

    });

    navLinks.forEach(link => {

      const href =
        link.getAttribute("href");

      link.classList.toggle(
        "active",
        href === `#${currentId}`
      );

    });

  };

  window.addEventListener(
    "scroll",
    updateActiveLink,
    { passive: true }
  );

  updateActiveLink();

});