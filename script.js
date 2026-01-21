

 document.getElementById("year").textContent = new Date().getFullYear();

    // Toast
    function showToast(message){
      document.getElementById("toastMsg").textContent = message;
      const t = new bootstrap.Toast(document.getElementById("liveToast"));
      t.show();
    }

    // Navbar shadow on scroll
    const mainNav = document.getElementById("mainNav");
    window.addEventListener("scroll", () => {
      if (window.scrollY > 10) mainNav.classList.add("nav-shadow");
      else mainNav.classList.remove("nav-shadow");
    });

    // Golden cursor smooth line trail
    const canvas = document.getElementById("cursorCanvas");
    const ctx = canvas.getContext("2d");
    const dot = document.getElementById("cursorDot");

    function resizeCanvas(){
      canvas.width = window.innerWidth * devicePixelRatio;
      canvas.height = window.innerHeight * devicePixelRatio;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    let points = [];
    const maxPoints = 28;

    window.addEventListener("mousemove", (e)=>{
      dot.style.left = e.clientX + "px";
      dot.style.top  = e.clientY + "px";
      points.push({x:e.clientX, y:e.clientY, life:1});
      if(points.length > maxPoints) points.shift();
    });

    function drawTrail(){
      ctx.clearRect(0,0,window.innerWidth, window.innerHeight);
      ctx.globalCompositeOperation = "lighter";

      if(points.length > 2){
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);

        for(let i=1; i<points.length-1; i++){
          const xc = (points[i].x + points[i+1].x)/2;
          const yc = (points[i].y + points[i+1].y)/2;
          ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
        }

        ctx.lineWidth = 3;
        ctx.lineCap = "round";

        const g = ctx.createLinearGradient(points[0].x, points[0].y, points[points.length-1].x, points[points.length-1].y);
        g.addColorStop(0, "rgba(214,179,90,0)");
        g.addColorStop(.35,"rgba(214,179,90,.40)");
        g.addColorStop(1, "rgba(214,179,90,.92)");
        ctx.strokeStyle = g;

        ctx.shadowColor = "rgba(214,179,90,.55)";
        ctx.shadowBlur = 18;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      points = points.map(p => ({...p, life: p.life - 0.05})).filter(p => p.life > 0);
      ctx.globalCompositeOperation = "source-over";
      requestAnimationFrame(drawTrail);
    }
    drawTrail();

    // ---------------- GSAP ANIMATIONS ----------------
    gsap.registerPlugin(ScrollTrigger);

    // Intro hero timeline
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from(".hero-chip", { y: 12, opacity: 0, duration: 0.6 })
      .from(".hero-title", { y: 18, opacity: 0, duration: 0.7 }, "-=0.25")
      .from(".hero-sub", { y: 16, opacity: 0, duration: 0.6 }, "-=0.35")
      .from(".hero-cta a", { y: 10, opacity: 0, duration: 0.5, stagger: 0.12 }, "-=0.25")
      .from(".stat-card", { y: 14, opacity: 0, duration: 0.6, stagger: 0.12 }, "-=0.20")
      .from(".hero-form", { y: 18, opacity: 0, duration: 0.7 }, "-=0.35");

    // Section headers reveal
    function revealPair(head, sub){
      gsap.from(head, {
        scrollTrigger: { trigger: head, start: "top 85%" },
        y: 14, opacity: 0, duration: 0.7, ease: "power3.out"
      });
      gsap.from(sub, {
        scrollTrigger: { trigger: head, start: "top 85%" },
        y: 10, opacity: 0, duration: 0.6, ease: "power3.out", delay: 0.08
      });
    }
    revealPair(".services-head", ".services-sub");
    revealPair(".process-head", ".process-sub");
    revealPair(".why-head", ".why-sub");
    revealPair(".contact-head", ".contact-sub");

    // Cards reveal on scroll (stagger)
    function revealCards(selector, trigger){
      gsap.from(selector, {
        scrollTrigger: { trigger: trigger, start: "top 80%" },
        y: 18, opacity: 0, duration: 0.7, stagger: 0.08, ease: "power3.out"
      });
    }
    revealCards(".service-card", "#services");
    revealCards(".process-card", "#process");
    revealCards(".why-item", "#why");

    gsap.from(".why-card, .contact-mini", {
      scrollTrigger: { trigger: "#why", start: "top 80%" },
      y: 18, opacity: 0, duration: 0.8, stagger: 0.12, ease: "power3.out"
    });

    gsap.from(".contact-card", {
      scrollTrigger: { trigger: "#contact", start: "top 80%" },
      y: 18, opacity: 0, duration: 0.9, ease: "power3.out"
    });



function enable3DTilt(elementsSelector){
      document.querySelectorAll(elementsSelector).forEach((card) => {
        const strength = 10; // tilt strength
        const lift = 8;

        const onMove = (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const cx = rect.width / 2;
          const cy = rect.height / 2;
          const rx = ((y - cy) / cy) * -strength;
          const ry = ((x - cx) / cx) * strength;

          gsap.to(card, {
            duration: 0.25,
            rotateX: rx,
            rotateY: ry,
            y: -lift,
            boxShadow: "0 28px 70px rgba(2, 8, 23, .16)",
            ease: "power2.out"
          });
        };

        const onLeave = () => {
          gsap.to(card, {
            duration: 0.35,
            rotateX: 0,
            rotateY: 0,
            y: 0,
            boxShadow: "0 18px 45px rgba(2, 8, 23, .12)",
            ease: "power2.out"
          });
        };

        card.addEventListener("mousemove", onMove);
        card.addEventListener("mouseleave", onLeave);
      });
    }
    enable3DTilt(".card3d");