import { useNavigate } from "react-router-dom";
import { getToken } from "../utils/token";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const navigate = useNavigate();
  const isLoggedIn = !!getToken();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [typed, setTyped] = useState("");
  const [counters, setCounters] = useState({ products: 0, accuracy: 0, users: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const fullText = "Made for You";

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i <= fullText.length) {
        setTyped(fullText.slice(0, i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 80);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const ease = 1 - Math.pow(1 - progress, 3);
      setCounters({
        products: Math.round(ease * 10000),
        accuracy: Math.round(ease * 98),
        users: Math.round(ease * 5000),
      });
      if (step >= steps) clearInterval(timer);
    }, interval);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: { x: number; y: number; vx: number; vy: number; size: number; opacity: number }[] = [];
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
      });
    }

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(239,68,68,${p.opacity})`;
        ctx.fill();
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(239,68,68,${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] overflow-hidden relative">

      <div className="fixed pointer-events-none" style={{
        left: mousePos.x - 200,
        top: mousePos.y - 200,
        width: 400,
        height: 400,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(239,68,68,0.08) 0%, transparent 70%)",
        zIndex: 0,
        transition: "left 0.1s ease, top 0.1s ease",
      }} />

      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }} />

      <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(239,68,68,0.12) 0%, transparent 70%)", zIndex: 0 }} />
      <div className="absolute top-[200px] left-[-100px] w-[400px] h-[400px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(239,68,68,0.06) 0%, transparent 70%)", zIndex: 0 }} />
      <div className="absolute top-[300px] right-[-100px] w-[400px] h-[400px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(239,68,68,0.06) 0%, transparent 70%)", zIndex: 0 }} />

      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
        zIndex: 0
      }} />

      <div className="absolute top-32 left-16 w-3 h-3 rounded-full bg-red-500/30 pointer-events-none" style={{ animation: "float 4s ease-in-out infinite", zIndex: 0 }} />
      <div className="absolute top-48 right-24 w-2 h-2 rounded-full bg-red-500/20 pointer-events-none" style={{ animation: "float 6s ease-in-out infinite 1s", zIndex: 0 }} />
      <div className="absolute top-64 left-1/3 w-1.5 h-1.5 rounded-full bg-red-500/40 pointer-events-none" style={{ animation: "float 5s ease-in-out infinite 0.5s", zIndex: 0 }} />
      <div className="absolute top-40 right-1/3 w-2.5 h-2.5 rounded-full bg-red-500/20 pointer-events-none" style={{ animation: "float 7s ease-in-out infinite 2s", zIndex: 0 }} />

      <section className="relative max-w-6xl mx-auto px-6 pt-28 pb-20 text-center" style={{ zIndex: 1 }}>
        <div className="inline-block text-xs font-semibold tracking-widest text-red-500 uppercase mb-8 border border-red-500/30 px-4 py-1.5 rounded-full"
          style={{ animation: "fadeInDown 0.6s ease forwards", background: "rgba(239,68,68,0.05)" }}>
          AI-Powered Recommendations
        </div>

        <h1 className="text-6xl md:text-7xl font-bold text-white leading-tight mb-6"
          style={{ animation: "fadeInUp 0.7s ease 0.1s both" }}>
          Discover Products<br />
          <span className="text-red-500" style={{ textShadow: "0 0 40px rgba(239,68,68,0.4), 0 0 80px rgba(239,68,68,0.2)" }}>
            {typed}<span style={{ animation: "blink 1s infinite" }}>|</span>
          </span>
        </h1>

        <p className="text-lg text-gray-400 max-w-xl mx-auto mb-12" style={{ animation: "fadeInUp 0.7s ease 0.2s both" }}>
          Smart recommendations based on what you browse, love, and buy.
        </p>

        <div className="flex items-center justify-center gap-4" style={{ animation: "fadeInUp 0.7s ease 0.3s both" }}>
          {isLoggedIn ? (
            <>
              <button
                onClick={() => navigate("/dashboard")}
                className="py-3 px-8 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 border-none cursor-pointer"
                style={{ boxShadow: "0 0 20px rgba(239,68,68,0.3)", transition: "all 0.3s ease" }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 0 40px rgba(239,68,68,0.6)"; e.currentTarget.style.transform = "translateY(-2px) scale(1.02)"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 0 20px rgba(239,68,68,0.3)"; e.currentTarget.style.transform = "translateY(0) scale(1)"; }}
              >Go to Dashboard</button>
              <button
                onClick={() => navigate("/products")}
                className="py-3 px-8 border border-white/20 text-gray-300 font-medium rounded-lg hover:border-white/40 hover:text-white bg-transparent cursor-pointer"
                style={{ transition: "all 0.3s ease" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
              >Browse Products</button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/register")}
                className="py-3 px-8 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 border-none cursor-pointer"
                style={{ boxShadow: "0 0 20px rgba(239,68,68,0.3)", transition: "all 0.3s ease" }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 0 40px rgba(239,68,68,0.6)"; e.currentTarget.style.transform = "translateY(-2px) scale(1.02)"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 0 20px rgba(239,68,68,0.3)"; e.currentTarget.style.transform = "translateY(0) scale(1)"; }}
              >Get Started</button>
              <button
                onClick={() => navigate("/login")}
                className="py-3 px-8 border border-white/20 text-gray-300 font-medium rounded-lg hover:border-white/40 hover:text-white bg-transparent cursor-pointer"
                style={{ transition: "all 0.3s ease" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
              >Login</button>
            </>
          )}
        </div>
      </section>

      <section className="relative max-w-6xl mx-auto px-6 pb-16" style={{ zIndex: 1 }}>
        <div className="grid grid-cols-3 gap-6 border-y border-white/10 py-12" style={{ animation: "fadeInUp 0.7s ease 0.4s both" }}>
          {[
            { value: `${Math.round(counters.products / 1000)}K+`, label: "Products" },
            { value: `${counters.accuracy}%`, label: "Match Accuracy" },
            { value: `${Math.round(counters.users / 1000)}K+`, label: "Happy Users" },
          ].map((stat, i) => (
            <div key={i} className={`text-center ${i === 1 ? "border-x border-white/10" : ""}`}>
              <div className="text-4xl font-bold text-white mb-2" style={{ textShadow: "0 0 20px rgba(239,68,68,0.3)" }}>{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="relative max-w-6xl mx-auto px-6 pb-24" style={{ zIndex: 1 }}>
        <h2 className="text-2xl font-bold text-white text-center mb-10" style={{ animation: "fadeInUp 0.7s ease 0.5s both" }}>How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: "🔍", title: "Smart Discovery", desc: "Find products similar to what you love using item similarity algorithms." },
            { icon: "🛒", title: "Basket Analysis", desc: "See what others frequently buy together using market basket rules." },
            { icon: "⏱️", title: "Recently Viewed", desc: "Pick up right where you left off with your personal browsing history." },
          ].map((card, i) => (
            <div
              key={i}
              onClick={() => navigate(isLoggedIn ? "/dashboard" : "/login")}
              className="bg-[#111] border border-white/10 rounded-2xl p-6 cursor-pointer"
              style={{ animation: `fadeInUp 0.7s ease ${0.6 + i * 0.1}s both, floatCard ${4 + i}s ease-in-out infinite ${i * 0.5}s`, transition: "border-color 0.3s ease, box-shadow 0.3s ease" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(239,68,68,0.4)"; e.currentTarget.style.boxShadow = "0 0 40px rgba(239,68,68,0.15)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center text-xl mb-4" style={{ animation: `float ${3 + i}s ease-in-out infinite` }}>{card.icon}</div>
              <h3 className="font-semibold text-white mb-2">{card.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <style>{`
        @keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        @keyframes floatCard { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-6px); } }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
      `}</style>
    </div>
  );
}