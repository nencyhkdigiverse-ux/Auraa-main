document.addEventListener("DOMContentLoaded", function () {
    gsap.registerPlugin(ScrollTrigger);

    // ===== Scrollytelling Hero Implementation =====
    const canvas = document.getElementById("hero-sequence");
    const context = canvas ? canvas.getContext("2d") : null;

    if (canvas && context) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;


        const frameCount = 40;
        const currentFrame = index => `/static/Gauu maata/eg-${(index + 1).toString().padStart(3, '0')}.jpg`;
        // const currentFrame = index => `/static/PICS ART/eg-${(index + 1).toString().padStart(3, '0')}.jpg`;

        const images = [];
        const airpods = {
            frame: 0
        };

        // Preload images
        for (let i = 0; i < frameCount; i++) {
            const img = new Image();
            img.src = currentFrame(i);
            images.push(img);
        }

        // Render function to simulate object-fit: cover
        const render = () => {
            if (!images[airpods.frame] || !images[airpods.frame].complete) return;

            context.clearRect(0, 0, canvas.width, canvas.height);
            const img = images[airpods.frame];

            const hRatio = canvas.width / img.width;
            const vRatio = canvas.height / img.height;
            const ratio = Math.max(hRatio, vRatio);

            const centerShift_x = (canvas.width - img.width * ratio) / 2;
            const centerShift_y = (canvas.height - img.height * ratio) / 2;

            context.drawImage(img, 0, 0, img.width, img.height,
                centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
        };

        // Ensure first frame renders when loaded
        images[0].onload = render;

        // GSAP ScrollTrigger for Frame Scrubbing
        let frameTl = gsap.timeline({
            scrollTrigger: {
                trigger: ".scrolly-hero",
                start: "top top",
                end: "bottom bottom",
                scrub: 0.5
            }
        });

        frameTl.to(airpods, {
            frame: frameCount - 1,
            snap: "frame",
            ease: "none",
            duration: 1, // Ensure this spans the entire timeline duration (0 to 1)
            onUpdate: render
        });

        // --- Text Overlays (Synchronized with Frame Timeline) ---
        // Timeline runs from 0 to 1 as we scroll scrolly-hero from top-top to bottom-bottom

        // 0% Text: Starts visible, fades out & moves up
        frameTl.to(".hero-text-0", { opacity: 0, y: -50, duration: 0.2 }, 0);

        // 30% Text: Slide Up In (0.3), Stay, Slide Up Out (0.55)
        // We use fromTo to ensure the starting position is reset for the entrance
        frameTl.fromTo(".hero-text-30",
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 0.05 },
            0.3
        );
        frameTl.to(".hero-text-30", { opacity: 0, y: -50, duration: 0.05 }, 0.55);

        // 60% Text: Slide Up In (0.65), Stays visible
        frameTl.fromTo(".hero-text-60",
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 0.05 },
            0.65
        );

        // Handle Resize
        window.addEventListener("resize", () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            render();
        });
    }

    // Initialize Lenis for Smooth Scroll
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
    });

    function raf(time) {
        lenis.raf(time);
        ScrollTrigger.update();
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Sync ScrollTrigger with Lenis
    lenis.on('scroll', ScrollTrigger.update);

    // Hero Animations
    const tl = gsap.timeline();

    tl.to(".hero-title", {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.5
    })
        .to(".hero-subtitle", {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out"
        }, "-=0.5")
        .to(".btn-hero", {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out"
        }, "-=0.5");

    // Parallax Effect for Bottle
    gsap.to(".bottle-mockup", {
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: true
        },
        y: 200,
        ease: "none"
    });

    // Reveal Elements on Scroll
    gsap.utils.toArray('.glass').forEach(element => {
        gsap.from(element, {
            scrollTrigger: {
                trigger: element,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            opacity: 0,
            y: 50,
            duration: 0.8,
            ease: "power3.out"
        });
    });

    // ===== Smooth Scroll Animations for Occasions Section =====
    // Title animation - slides in from top
    gsap.from(".occasions-title", {
        scrollTrigger: {
            trigger: ".occasions",
            start: "top 90%",
            end: "top 60%",
            scrub: 1, // Smooth scrubbing effect
        },
        y: -50,
        opacity: 0,
        ease: "power2.out"
    });

    // Subtitle animation - fades in
    gsap.from(".occasions-subtitle", {
        scrollTrigger: {
            trigger: ".occasions",
            start: "top 85%",
            end: "top 55%",
            scrub: 1,
        },
        y: -30,
        opacity: 0,
        ease: "power2.out"
    });

    // Cards animation - staggered and non-uniform entrance
    const cards = gsap.utils.toArray('.occasion-card');
    if (cards.length >= 3) {
        // Left Card
        gsap.from(cards[0], {
            scrollTrigger: {
                trigger: ".occasions",
                start: "top 70%",
                end: "top 30%",
                scrub: 1.5,
            },
            x: -100,
            opacity: 0,
            rotation: -5,
            ease: "power2.out"
        });

        // Middle (Featured) Card
        gsap.from(cards[1], {
            scrollTrigger: {
                trigger: ".occasions",
                start: "top 65%",
                end: "top 25%",
                scrub: 1.5,
            },
            y: 50,
            scale: 0.8,
            opacity: 0,
            ease: "back.out(1.7)"
        });

        // Right Card
        gsap.from(cards[2], {
            scrollTrigger: {
                trigger: ".occasions",
                start: "top 70%",
                end: "top 30%",
                scrub: 1.5,
            },
            x: 100,
            opacity: 0,
            rotation: 5,
            ease: "power2.out"
        });
    }

    // Individual Floating Animation for Cards (Staggered and unique)
    cards.forEach((card, index) => {
        gsap.to(card, {
            y: index % 2 === 0 ? 15 : -15,
            duration: 2 + Math.random(),
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            delay: index * 0.5
        });
    });

    // ===== Mobile Horizontal Scroll-Linked Activation =====
    // This activates the "futuristic" effects as the user drags/slides through cards
    if (window.innerWidth <= 768) {
        gsap.utils.toArray('.occasion-card').forEach(card => {
            ScrollTrigger.create({
                trigger: card,
                scroller: ".occasions-grid", // The grid is the scroll container
                horizontal: true,
                start: "left center+=100",
                end: "right center-=100",
                toggleClass: "active",
                // markers: true 
            });
        });
    }

    // Header Blur Effect on Scroll
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(255, 255, 255, 0.8)';
            header.style.backdropFilter = 'blur(20px)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.2)'; // Back to initial glass
            header.style.backdropFilter = 'blur(12px)';
        }
    });

    // ===== About Page Animations =====
    if (document.querySelector('.about-hero')) {
        // Hero Content Animation
        gsap.from(".about-hero-content > *", {
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.3,
            ease: "power3.out"
        });

        // Common Reveal Animations
        const reveals = [
            { selector: ".reveal-left", x: -100 },
            { selector: ".reveal-right", x: 100 },
            { selector: ".reveal-up", y: 100 }
        ];

        reveals.forEach(reveal => {
            const elements = gsap.utils.toArray(reveal.selector);

            // Group elements by their parent to apply stagger within sections
            const groups = new Map();
            elements.forEach(el => {
                const parent = el.parentElement;
                if (!groups.has(parent)) groups.set(parent, []);
                groups.get(parent).push(el);
            });

            groups.forEach(groupElements => {
                gsap.from(groupElements, {
                    scrollTrigger: {
                        trigger: groupElements[0], // Trigger based on the first element in the group
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    },
                    x: reveal.x || 0,
                    y: reveal.y || 0,
                    opacity: 0,
                    duration: 1.2,
                    stagger: 0.2,
                    ease: "power2.out"
                });
            });
        });


        // Sustainability Stats Counter Effect
        gsap.utils.toArray('.s-val').forEach(stat => {
            const finalVal = stat.innerText;
            if (finalVal !== '∞' && finalVal.includes('%')) {
                const num = parseInt(finalVal);
                stat.innerText = '0%';
                ScrollTrigger.create({
                    trigger: stat,
                    start: "top 90%",
                    onEnter: () => {
                        let count = { val: 0 };
                        gsap.to(count, {
                            val: num,
                            duration: 2,
                            onUpdate: () => {
                                stat.innerText = Math.round(count.val) + '%';
                            }
                        });
                    }
                });
            }
        });
    }

    // Mobile Menu Toggle
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuBtn && nav) {
        menuBtn.addEventListener('click', () => {
            menuBtn.classList.toggle('active');
            nav.classList.toggle('active');
            document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : 'auto';
        });

        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuBtn.classList.remove('active');
                nav.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
    }


    // // Process Animation (Unique Sliding Dot & Button Highlights)
    const processTl = gsap.timeline({
        scrollTrigger: {
            trigger: ".process-teaser",
            start: "top 60%",
            end: "bottom 30%", // End earlier for bottle reveal
            scrub: 1.5,
        }
    });

    processTl
        // Dot travels down the line
        .from(".water-drop", { opacity: 0, duration: 0.5 })

        // Phase 1: To Rock (Gaushala Farm)
        .to(".water-drop", { top: "185px", duration: 1, ease: "none" })
        .to(".layer-rock", { opacity: 1, scale: 1.05, duration: 0.5 }, "<")
        .to(".layer-rock", { opacity: 0.5, scale: 1, duration: 0.5 })

        // Phase 2: To Sand (Quality Testing)
        .to(".water-drop", { top: "300px", duration: 1, ease: "none" })
        .to(".layer-sand", { opacity: 1, scale: 1.05, duration: 0.5 }, "<")
        .to(".layer-sand", { opacity: 0.5, scale: 1, duration: 0.5 })

        // Phase 3: To Charcoal (Pasteurization)
        .to(".water-drop", { top: "415px", duration: 1, ease: "none" })
        .to(".layer-charcoal", { opacity: 1, scale: 1.05, duration: 0.5 }, "<")
        .to(".layer-charcoal", { opacity: 0.5, scale: 1, duration: 0.5 })

        // Silhouette Reveal: Bottle silhouette slides up from bottom at the very end
        .to(".final-bottle", {
            opacity: 1,
            y: 0, // Slide to its final bottom: 5% position
            duration: 1.5,
            ease: "power2.out"
        }, "-=0.2")

        // Phase 4: Dot finishes and fades out
        .to(".water-drop", { top: "530px", opacity: 0, duration: 0.8, ease: "none" });


    // Tilt effect for process layers
    const processLayers = document.querySelectorAll('.layer');
    processLayers.forEach(layer => {
        layer.addEventListener('mousemove', (e) => {
            const rect = layer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 5; // More pronounced tilt
            const rotateY = (centerX - x) / 5;

            gsap.to(layer, {
                rotationX: rotateX,
                rotationY: rotateY,
                transformPerspective: 1000,
                duration: 0.5,
                ease: "power2.out"
            });
        });

        layer.addEventListener('mouseleave', () => {
            gsap.to(layer, {
                rotationX: 0,
                rotationY: 0,
                duration: 0.5,
                ease: "power2.out"
            });
        });
    });


    // ===== FUTURISTIC PRODUCTS PAGE ANIMATIONS =====
    if (document.querySelector('.products-futuristic')) {
        // Title Animation
        gsap.from(".futuristic-title", {
            y: 100,
            opacity: 0,
            duration: 1.2,
            ease: "power4.out"
        });

        // Cards Entrance with ScrollTrigger
        gsap.to(".cyber-glass", {
            scrollTrigger: {
                trigger: ".product-grid",
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.2,
            ease: "power3.out"
        });

        // Background Elements
        gsap.from(".glow-orb", {
            scale: 0,
            opacity: 0,
            duration: 2,
            stagger: 0.5,
            ease: "elastic.out(1, 0.5)"
        });

        // Card Tilt Effect (Vanilla JS + GSAP)
        const cards = document.querySelectorAll('.cyber-glass');
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;

                gsap.to(card, {
                    rotationX: rotateX,
                    rotationY: rotateY,
                    transformPerspective: 1000,
                    duration: 0.5,
                    ease: "power2.out"
                });
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    rotationX: 0,
                    rotationY: 0,
                    duration: 0.5,
                    ease: "power2.out"
                });
            });
        });
    }

    // Footer Reveal Animation
    gsap.from(".footer-col", {
        scrollTrigger: {
            trigger: ".footer-futuristic",
            start: "top 85%",
            toggleActions: "play none none reverse"
        },
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out"
    });

    // ===== QUALITY SHOWCASE ANIMATIONS =====
    if (document.querySelector('.quality-showcase')) {
        const showcaseTl = gsap.timeline({
            scrollTrigger: {
                trigger: ".quality-showcase",
                start: "top 70%",
                toggleActions: "play none none reverse"
            }
        });

        showcaseTl
            .from(".bg-text-main", {
                scale: 1.2,
                opacity: 0,
                duration: 1.5,
                ease: "power2.out"
            })
            .from(".bg-text-sub", {
                y: 30,
                opacity: 0,
                duration: 1,
                ease: "power2.out"
            }, "-=1")
            .from(".main-bottle", {
                y: 100,
                opacity: 0,
                duration: 1.2,
                ease: "power3.out"
            }, "-=0.8")
            .from(".bottle-glow", {
                scale: 0,
                opacity: 0,
                duration: 1.5,
                ease: "back.out(1.7)"
            }, "-=1")
            .to(".callout", {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.2,
                ease: "power2.out"
            }, "-=0.5")
            .from(".callout-line line", {
                attr: {
                    x2: (i, target) => {
                        const parentWidth = target.parentElement.getAttribute('width');
                        return target.closest('.callout-group').classList.contains('left') ? 0 : parentWidth;
                    }
                },
                scaleX: 0,
                transformOrigin: (index, target) => {
                    return target.closest('.callout-group').classList.contains('left') ? "left center" : "left center";
                },
                duration: 0.8,
                stagger: 0.2,
                ease: "power2.inOut"
            }, "-=1");
    }
});

// Ensure ScrollTrigger refreshes after everything is loaded
window.addEventListener('load', () => {
    ScrollTrigger.refresh();
});
