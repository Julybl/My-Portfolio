/* ==================================================
   JULIETA BLAER PORTFOLIO
   MAIN JAVASCRIPT
================================================== */

document.addEventListener("DOMContentLoaded", () => {


    /* ==================================================
       CURRENT YEAR
    ================================================== */

    const currentYear = document.getElementById("current-year");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }


    /* ==================================================
       MOBILE MENU
    ================================================== */

    const mobileMenuButton =
        document.querySelector(".mobile-menu-button");

    const mobileNavigation =
        document.querySelector(".mobile-navigation");


    if (mobileMenuButton && mobileNavigation) {

        mobileMenuButton.addEventListener("click", () => {

            const isOpen =
                mobileMenuButton.getAttribute("aria-expanded") === "true";

            mobileMenuButton.setAttribute(
                "aria-expanded",
                String(!isOpen)
            );

            mobileNavigation.classList.toggle(
                "is-open",
                !isOpen
            );

        });


        /* CLOSE MOBILE MENU WHEN CLICKING A LINK */

        mobileNavigation
            .querySelectorAll("a")
            .forEach(link => {

                link.addEventListener("click", () => {

                    mobileMenuButton.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                    mobileNavigation.classList.remove(
                        "is-open"
                    );

                });

            });

    }


    /* ==================================================
       SCROLL REVEAL
    ================================================== */

    const revealElements =
        document.querySelectorAll(".reveal");


    if ("IntersectionObserver" in window) {

        const revealObserver =
            new IntersectionObserver(
                (entries, observer) => {

                    entries.forEach(entry => {

                        if (entry.isIntersecting) {

                            entry.target.classList.add(
                                "visible"
                            );

                            observer.unobserve(
                                entry.target
                            );

                        }

                    });

                },
                {
                    threshold: 0.08,
                    rootMargin: "0px 0px -40px 0px"
                }
            );


        revealElements.forEach(element => {

            revealObserver.observe(element);

        });

    } else {

        revealElements.forEach(element => {

            element.classList.add("visible");

        });

    }


    /* ==================================================
       PROJECT IMAGE VIEWER
    ================================================== */

    const viewer =
        document.getElementById("image-viewer");

    const viewerStage =
        document.getElementById("image-viewer-stage");

    const viewerImage =
        document.getElementById("image-viewer-image");

    const viewerTitle =
        document.getElementById("image-viewer-title");

    const closeButton =
        document.getElementById("image-viewer-close");

    const zoomInButton =
        document.getElementById("zoom-in");

    const zoomOutButton =
        document.getElementById("zoom-out");

    const zoomResetButton =
        document.getElementById("zoom-reset");

    const zoomLevel =
        document.getElementById("zoom-level");

    const backdrop =
        document.querySelector(
            ".image-viewer-backdrop"
        );


    /* ==================================================
       VIEWER STATE
    ================================================== */

    let zoom = 1;

    let translateX = 0;
    let translateY = 0;

    let isDragging = false;

    let startX = 0;
    let startY = 0;

    let startTranslateX = 0;
    let startTranslateY = 0;

    let previousBodyOverflow = "";


    /* ==================================================
       UPDATE TRANSFORM
    ================================================== */

    function updateImageTransform() {

        viewerImage.style.transform =
            `translate3d(${translateX}px, ${translateY}px, 0)
             scale(${zoom})`;

        zoomLevel.textContent =
            `${Math.round(zoom * 100)}%`;

    }


    /* ==================================================
       RESET VIEW
    ================================================== */

    function resetImageView() {

        zoom = 1;

        translateX = 0;
        translateY = 0;

        updateImageTransform();

    }


    /* ==================================================
       OPEN VIEWER
    ================================================== */

    function openViewer(imageSrc, title, altText) {

        if (!viewer || !viewerImage) {
            return;
        }


        viewerImage.src = imageSrc;

        viewerImage.alt = altText || title || "Project image";

        viewerTitle.textContent =
            title || "Project";


        resetImageView();


        viewer.classList.add("is-open");

        viewer.setAttribute(
            "aria-hidden",
            "false"
        );


        /* SAVE CURRENT BODY STATE */

        previousBodyOverflow =
            document.body.style.overflow;


        /*
            ONLY LOCK BODY SCROLL WHILE
            THE VIEWER IS ACTUALLY OPEN.
        */

        document.body.style.overflow = "hidden";


        /*
            Wait until image has loaded so
            browser knows its real dimensions.
        */

        viewerImage.onload = () => {

            resetImageView();

        };


        closeButton?.focus();

    }


    /* ==================================================
       CLOSE VIEWER
    ================================================== */

    function closeViewer() {

        if (!viewer) {
            return;
        }


        viewer.classList.remove(
            "is-open"
        );

        viewer.setAttribute(
            "aria-hidden",
            "true"
        );


        /*
            RESTORE PAGE SCROLL
        */

        document.body.style.overflow =
            previousBodyOverflow;


        viewerImage.src = "";

        resetImageView();

    }


    /* ==================================================
       PROJECT BUTTONS
    ================================================== */

    const projectButtons =
        document.querySelectorAll(
            ".project-image"
        );


    projectButtons.forEach(button => {

        button.addEventListener(
            "click",
            event => {

                /*
                    IMPORTANT:
                    Prevent any browser default
                    behavior.
                */

                event.preventDefault();

                event.stopPropagation();


                const image =
                    button.querySelector("img");


                if (!image) {
                    return;
                }


                const imageSrc =
                    button.dataset.projectImage ||
                    image.currentSrc ||
                    image.src;


                const title =
                    button.dataset.projectTitle ||
                    button
                        .closest(".project-card")
                        ?.querySelector("h3")
                        ?.textContent
                        .trim() ||
                    "Project";


                openViewer(
                    imageSrc,
                    title,
                    image.alt
                );

            }
        );

    });


    /* ==================================================
       CLOSE BUTTON
    ================================================== */

    closeButton?.addEventListener(
        "click",
        event => {

            event.preventDefault();

            closeViewer();

        }
    );


    /* ==================================================
       BACKDROP CLOSE
    ================================================== */

    backdrop?.addEventListener(
        "click",
        event => {

            event.preventDefault();

            closeViewer();

        }
    );


    /* ==================================================
       ZOOM IN
    ================================================== */

    zoomInButton?.addEventListener(
        "click",
        event => {

            event.preventDefault();

            zoom = Math.min(
                zoom + 0.25,
                5
            );

            updateImageTransform();

        }
    );


    /* ==================================================
       ZOOM OUT
    ================================================== */

    zoomOutButton?.addEventListener(
        "click",
        event => {

            event.preventDefault();

            zoom = Math.max(
                zoom - 0.25,
                0.5
            );


            if (zoom === 1) {

                translateX = 0;
                translateY = 0;

            }


            updateImageTransform();

        }
    );


    /* ==================================================
       RESET ZOOM
    ================================================== */

    zoomResetButton?.addEventListener(
        "click",
        event => {

            event.preventDefault();

            resetImageView();

        }
    );


    /* ==================================================
       MOUSE WHEEL ZOOM
    ================================================== */

    viewerStage?.addEventListener(
        "wheel",
        event => {

            if (!viewer.classList.contains("is-open")) {
                return;
            }


            event.preventDefault();


            const direction =
                event.deltaY < 0
                    ? 0.2
                    : -0.2;


            zoom = Math.min(
                Math.max(
                    zoom + direction,
                    0.5
                ),
                5
            );


            if (zoom <= 1) {

                zoom = 1;

                translateX = 0;
                translateY = 0;

            }


            updateImageTransform();

        },
        {
            passive: false
        }
    );


    /* ==================================================
       MOUSE DRAG
    ================================================== */

    viewerStage?.addEventListener(
        "mousedown",
        event => {

            if (zoom <= 1) {
                return;
            }


            if (event.button !== 0) {
                return;
            }


            isDragging = true;

            viewerStage.classList.add(
                "is-dragging"
            );

            viewerImage.classList.add(
                "is-dragging"
            );


            startX = event.clientX;
            startY = event.clientY;

            startTranslateX = translateX;
            startTranslateY = translateY;

        }
    );


    window.addEventListener(
        "mousemove",
        event => {

            if (!isDragging) {
                return;
            }


            translateX =
                startTranslateX +
                (event.clientX - startX);


            translateY =
                startTranslateY +
                (event.clientY - startY);


            updateImageTransform();

        }
    );


    window.addEventListener(
        "mouseup",
        () => {

            if (!isDragging) {
                return;
            }


            isDragging = false;

            viewerStage.classList.remove(
                "is-dragging"
            );

            viewerImage.classList.remove(
                "is-dragging"
            );

        }
    );


    /* ==================================================
       TOUCH DRAG
    ================================================== */

    let touchStartX = 0;
    let touchStartY = 0;

    let touchStartTranslateX = 0;
    let touchStartTranslateY = 0;


    viewerStage?.addEventListener(
        "touchstart",
        event => {

            if (zoom <= 1) {
                return;
            }


            const touch =
                event.touches[0];


            touchStartX =
                touch.clientX;

            touchStartY =
                touch.clientY;


            touchStartTranslateX =
                translateX;

            touchStartTranslateY =
                translateY;

        },
        {
            passive: true
        }
    );


    viewerStage?.addEventListener(
        "touchmove",
        event => {

            if (zoom <= 1) {
                return;
            }


            const touch =
                event.touches[0];


            translateX =
                touchStartTranslateX +
                (touch.clientX - touchStartX);


            translateY =
                touchStartTranslateY +
                (touch.clientY - touchStartY);


            updateImageTransform();


            event.preventDefault();

        },
        {
            passive: false
        }
    );


    /* ==================================================
       KEYBOARD
    ================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (
                !viewer ||
                !viewer.classList.contains("is-open")
            ) {
                return;
            }


            /* ESC */

            if (event.key === "Escape") {

                closeViewer();

                return;

            }


            /* + */

            if (
                event.key === "+" ||
                event.key === "="
            ) {

                zoom = Math.min(
                    zoom + 0.25,
                    5
                );

                updateImageTransform();

            }


            /* - */

            if (event.key === "-") {

                zoom = Math.max(
                    zoom - 0.25,
                    0.5
                );


                if (zoom <= 1) {

                    zoom = 1;

                    translateX = 0;
                    translateY = 0;

                }


                updateImageTransform();

            }


            /* 0 = RESET */

            if (event.key === "0") {

                resetImageView();

            }

        }
    );


    /* ==================================================
       CUSTOM CURSOR
    ================================================== */

    const cursor =
        document.querySelector(".cursor");

    const cursorDot =
        document.querySelector(".cursor-dot");


    if (
        cursor &&
        cursorDot &&
        window.matchMedia("(pointer: fine)").matches
    ) {

        let mouseX = 0;
        let mouseY = 0;

        let cursorX = 0;
        let cursorY = 0;


        document.addEventListener(
            "mousemove",
            event => {

                mouseX = event.clientX;
                mouseY = event.clientY;


                cursorDot.style.transform =
                    `translate3d(
                        ${mouseX}px,
                        ${mouseY}px,
                        0
                    )`;

            }
        );


        function animateCursor() {

            cursorX +=
                (mouseX - cursorX) * 0.15;

            cursorY +=
                (mouseY - cursorY) * 0.15;


            cursor.style.transform =
                `translate3d(
                    ${cursorX}px,
                    ${cursorY}px,
                    0
                )`;


            requestAnimationFrame(
                animateCursor
            );

        }


        animateCursor();

    }


});