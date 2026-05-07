"use client";

import { useState, useEffect, useRef } from "react";
import { 
  motion, 
  useMotionValue, 
  useSpring, 
  useScroll, 
  useTransform, 
  useInView, 
  animate, 
  AnimatePresence 
} from "framer-motion";

// ─── PALETTE ─────────────────────────────────────────────────────────────────
// Hitam  : #0a0a0a / #111 / #1a1a1a
// Merah  : #c0392b / #e74c3c / #ff2d2d
// Kuning : #f1c40f / #f39c12 / #ffe066

// ─── DATA ────────────────────────────────────────────────────────────────────
const REF_SITES = [
  "WIKIPEDIA", "GOOGLE SCHOLAR", "MAHKAMAH KONSTITUSI",
  "JURNAL HUKUM", "AMNESTY INTERNATIONAL", "ELSAM", "YLBHI"
];

const HERO_TEXTS = [
  "Freedom of Speech.", 
  "Kebebasan Berekspresi.", 
  "Hak Berpendapat.", 
  "Demokrasi Digital."
];

const MATERI_CARDS = [
  { id: "01", category: "HAK ASASI", title: "Hak Demokrasi", tags: "KEBEBASAN • EKSPRESI • PILAR NEGARA", desc: "Memahami esensi kebebasan berekspresi sebagai pilar utama negara hukum dan demokratis.", stat: "Pasal 28E", statLabel: "Landasan UUD 1945", img: "/materi-1.jpg", fullContent: "Di sini kamu bisa menulis materi lengkap tentang Hak Demokrasi. Jelaskan bagaimana kebebasan berekspresi menjadi indikator utama sehatnya sebuah negara demokrasi..." },
  { id: "02", category: "HUKUM", title: "Batasan Etik", tags: "KRITIK • UJARAN KEBENCIAN • REGULASI", desc: "Garis tipis antara kritik yang membangun dengan ujaran kebencian atau pencemaran nama baik.", stat: "UU ITE", statLabel: "Regulasi Ruang Digital", img: "/materi-2.jpg", fullContent: "Isi materi lengkap mengenai Batasan Etik. Berikan studi kasus tentang perbedaan mengkritik kebijakan pemerintah vs ujaran kebencian..." },
  { id: "03", category: "DIGITALISASI", title: "Era Disrupsi", tags: "SOSIAL MEDIA • PRIVASI • ANCAMAN", desc: "Tantangan baru berekspresi di media sosial, privasi, dan dinamika informasi tanpa batas.", stat: "204 Juta", statLabel: "Pengguna Internet RI", img: "/materi-3.jpg", fullContent: "Materi lengkap Era Disrupsi. Bahas tentang algoritma media sosial, echo chamber, dan bagaimana disinformasi menyebar..." },
  { id: "04", category: "KEWAJIBAN", title: "Tanggung Jawab", tags: "INDIVIDU • KETERTIBAN • HAK ORANG LAIN", desc: "Bagaimana warga negara menyeimbangkan hak individu dengan ketertiban umum.", stat: "100%", statLabel: "Kewajiban Warga Negara", img: "/materi-4.jpg", fullContent: "Uraian materi Tanggung Jawab. Hak asasi manusia selalu dibarengi dengan kewajiban asasi. Bagaimana kita mengontrol diri sendiri di ruang publik..." },
];

const WAWANCARA = [
  { id: "01", narsum: "Narasumber Pertama", role: "Aktivis Mahasiswa", desc: "Pandangan kritis dari sudut pandang pergerakan kampus terhadap regulasi negara yang dianggap membatasi ruang gerak demokrasi.", color: "#c0392b", img: "/narsum-1.jpg", fullContent: "Transkrip wawancara lengkap dengan narasumber pertama. (Ubah teks ini sesuai hasil wawancara kalian)." },
  { id: "02", narsum: "Narasumber Kedua", role: "Pakar Hukum", desc: "Analisis dari sisi legalitas dan regulasi yang berlaku. Bagaimana undang-undang dirancang untuk melindungi sekaligus mengatur kebebasan.", color: "#f1c40f", img: "/narsum-2.jpg", fullContent: "Transkrip wawancara lengkap dengan pakar hukum. (Ubah teks ini sesuai hasil wawancara kalian)." },
  { id: "03", narsum: "Narasumber Ketiga", role: "Jurnalis Independen", desc: "Realitas kebebasan pers di lapangan, ancaman somasi, dan tantangan menyampaikan fakta di era disinformasi.", color: "#c0392b", img: "/narsum-3.jpg", fullContent: "Transkrip wawancara lengkap dengan jurnalis. (Ubah teks ini sesuai hasil wawancara kalian)." },
  { id: "04", narsum: "Narasumber Keempat", role: "Masyarakat Umum", desc: "Bagaimana masyarakat awam menyaring informasi, merasa takut untuk berpendapat, dan ketidaktahuan akan batasan hukum.", color: "#f1c40f", img: "/narsum-4.jpg", fullContent: "Transkrip wawancara lengkap dengan masyarakat umum. (Ubah teks ini sesuai hasil wawancara kalian)." },
  { id: "05", narsum: "Narasumber Kelima", role: "Content Creator", desc: "Tantangan kebebasan berekspresi saat dihadapkan dengan algoritma platform digital dan pedoman komunitas yang ketat.", color: "#c0392b", img: "/narsum-5.jpg", fullContent: "Transkrip wawancara lengkap dengan content creator. (Ubah teks ini sesuai hasil wawancara kalian)." },
  { id: "06", narsum: "Narasumber Keenam", role: "Aparatur Negara", desc: "Tantangan penegakan hukum dalam menjaga stabilitas dan ketertiban nasional di tengah euforia kebebasan berpendapat online.", color: "#f1c40f", img: "/narsum-6.jpg", fullContent: "Transkrip wawancara lengkap dengan aparatur negara. (Ubah teks ini sesuai hasil wawancara kalian)." },
];

const KUISIONER = [
  { value: "78%", label: "Merasa dibatasi saat beropini di Sosmed", color: "#c0392b" },
  { value: "65%", label: "Pernah menghapus postingan karena takut UU ITE", color: "#f1c40f" },
  { value: "82%", label: "Setuju butuh revisi regulasi hukum", color: "#c0392b" },
  { value: "90%", label: "Mendukung kebebasan berpendapat yang beretika", color: "#f1c40f" },
];

const PASAL = [
  { title: "UUD 1945 Pasal 28E Ayat (3)", desc: "Setiap orang berhak atas kebebasan berserikat, berkumpul, dan mengeluarkan pendapat.", img: "/pasal-1.jpg", fullContent: "Pasal ini adalah fondasi utama konstitusi Indonesia yang menjamin hak asasi warga negaranya dalam beropini dan berserikat. Detail lebih lanjut dapat diubah di sini..." },
  { title: "UU No. 39 Tahun 1999 (HAM)", desc: "Setiap orang berhak untuk menyampaikan pendapat di muka umum.", img: "/pasal-2.jpg", fullContent: "Undang-Undang Hak Asasi Manusia memberikan kerangka hukum yang lebih spesifik mengenai perlindungan hak warga negara. Detail lebih lanjut dapat diubah di sini..." },
  { title: "UU ITE (Revisi Terakhir)", desc: "Mengatur tata cara dan batasan penyebaran informasi di ranah digital.", img: "/pasal-3.jpg", fullContent: "UU ITE sering kali menjadi pedang bermata dua. Di satu sisi melindungi dari kejahatan siber, di sisi lain pasal karetnya sering dikritik. Detail lebih lanjut dapat diubah di sini..." },
  { title: "KUHP Baru", desc: "Pasal-pasal krusial terkait penghinaan terhadap lembaga negara.", img: "/pasal-4.jpg", fullContent: "Pembaruan KUHP memuat beberapa pasal krusial tentang penghinaan terhadap presiden dan lembaga negara yang memicu perdebatan publik. Detail lebih lanjut dapat diubah di sini..." },
];

const MEMBERS = [
  { name: "Sebastian Kevin H.", role: "Developer / Concept", img: "/foto-kevin.jpg" },
  { name: "M. Luqman Arif C.", role: "Developer / Concept", img: "/tities.png" },
  { name: "Rayya", role: "UI/UX & Design", img: "/foto-rayya.jpg" },
  { name: "Qowwim", role: "Research & Data", img: "/foto-qowwim.jpg" },
  { name: "Fauzan", role: "Content & Copywriter", img: "/foto-fauzan.jpg" },
];

const SCREENSHOTS = [
  { id: 1, label: "Data Bukti 01" },
  { id: 2, label: "Data Bukti 02" },
  { id: 3, label: "Data Bukti 03" },
];

const GALLERY_IMAGES = [
  "/ss-1.jpg", "/materi-1.jpg", "/materi-2.jpg", "/ss-2.jpg", 
  "/ss-3.jpg", "/materi-3.jpg", "/materi-4.jpg", "/ss-1.jpg",
];

// ─── EASING ──────────────────────────────────────────────────────────────────
const EXPO = [0.16, 1, 0.3, 1];
const SMOOTH = [0.25, 0.46, 0.45, 0.94];

// ─── MARQUEE ─────────────────────────────────────────────────────────────────
function MarqueeRow({ items }: { items: string[] }) {
  const doubled = [...items, ...items, ...items, ...items, ...items];
  return (
    <div className="overflow-hidden py-5 border-y" style={{ borderColor: "rgba(192,57,43,0.25)" }}>
      <motion.div
        className="inline-flex gap-16"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
      >
        {doubled.map((item, i) => (
          <span key={i} style={{ color: "#666", fontSize: "11px", fontWeight: 600, letterSpacing: "0.22em" }} className="uppercase whitespace-nowrap">
            <span style={{ color: "#c0392b", marginRight: 12 }}>◆</span>{item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// ─── FADE-IN SECTION ─────────────────────────────────────────────────────────
function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-8%" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 48 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: EXPO }}
    >
      {children}
    </motion.div>
  );
}

// ─── ANIMATED NUMBER ─────────────────────────────────────────────────────────
function AnimatedStat({ value }: { value: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const isPercent = value.endsWith("%");
  const numStr = value.replace(/[^0-9]/g, "");
  const num = parseInt(numStr, 10);
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(0, num, {
      duration: 1.6,
      ease: SMOOTH,
      onUpdate: (v) => setDisplayed(Math.round(v)),
    });
    return () => controls.stop();
  }, [isInView, num]);

  return (
    <span ref={ref}>
      {displayed}{isPercent ? "%" : value.replace(numStr, "")}
    </span>
  );
}
// ─── NOISE TEXTURE SVG DATA URI ───────────────────────────────────────────────
const NOISE_BG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`;

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function DheroKWN() {
  const [scrolled, setScrolled] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const carouselRef = useRef(null);

  // States untuk Popups & Gallery
  const [popupData, setPopupData] = useState(null); // { title, subtitle, content, color, img }
  const [showGallery, setShowGallery] = useState(false);

  // State untuk animasi teks Hero
  const [heroTextIdx, setHeroTextIdx] = useState(0);

  // Cursor
  const cursorX = useMotionValue(-200);
  const cursorY = useMotionValue(-200);
  const cxs = useSpring(cursorX, { damping: 28, stiffness: 420, mass: 0.4 });
  const cys = useSpring(cursorY, { damping: 28, stiffness: 420, mass: 0.4 });

  useEffect(() => {
    const move = (e) => { cursorX.set(e.clientX - 6); cursorY.set(e.clientY - 6); };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroTextIdx((prev) => (prev + 1) % HERO_TEXTS.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (popupData || showGallery) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [popupData, showGallery]);

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, -80]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  const scrollLeft = () => carouselRef.current?.scrollBy({ left: -(carouselRef.current.offsetWidth + 32), behavior: "smooth" });
  const scrollRight = () => carouselRef.current?.scrollBy({ left: carouselRef.current.offsetWidth + 32, behavior: "smooth" });

  const openPopup = (data, color = "#c0392b") => {
    setPopupData({ ...data, themeColor: color });
  };

  return (
    <div className="min-h-screen font-sans cursor-default relative selection:bg-red-900 selection:text-white" style={{ background: "#0a0a0a", color: "#f2f2f2" }}>
      {/* Grain overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-60" style={{ backgroundImage: NOISE_BG, backgroundSize: "200px 200px" }} />

      {/* ── Custom Cursor ── */}
      <motion.div
        className="hidden md:flex items-center justify-center fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{ x: cxs, y: cys }}
      >
        <motion.div
          className="rounded-full"
          animate={{
            width: isHovering ? 60 : 12,
            height: isHovering ? 60 : 12,
            background: isHovering ? "rgba(255,255,255,0.1)" : "#c0392b",
            border: isHovering ? "1px solid rgba(255,255,255,0.4)" : "none",
            backdropFilter: isHovering ? "blur(4px)" : "none",
          }}
          transition={{ duration: 0.2, ease: SMOOTH }}
        />
      </motion.div>

      {/* ── Navbar ── */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-16"
        animate={{
          paddingTop: scrolled ? "20px" : "32px",
          paddingBottom: scrolled ? "20px" : "32px",
          backgroundColor: scrolled ? "rgba(10,10,10,0.85)" : "rgba(10,10,10,0)",
          backdropFilter: scrolled ? "blur(20px)" : "blur(0px)",
          borderBottom: scrolled ? "1px solid rgba(192,57,43,0.18)" : "1px solid rgba(192,57,43,0)",
        }}
        transition={{ duration: 0.5, ease: SMOOTH }}
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: EXPO }}
          style={{ fontWeight: 800, letterSpacing: "-0.04em", fontSize: "20px", color: "#f2f2f2" }}
        >
          KWN<span style={{ color: "#c0392b" }}>.</span>02
        </motion.div>

        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: EXPO }}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", color: "#888" }}
          className="uppercase hover:text-white transition-colors duration-300"
        >
          {/* Menu */}
        </motion.button>
      </motion.header>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col justify-between pt-28 overflow-hidden">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(192,57,43,0.15) 0%, transparent 65%)" }} />

        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
          style={{ y: heroY }}
        >
          <span style={{ fontSize: "clamp(120px,20vw,280px)", fontWeight: 900, letterSpacing: "-0.06em", color: "rgba(255,255,255,0.025)", lineHeight: 1 }}>
            SUARA
          </span>
        </motion.div>

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="flex-1 flex flex-col items-center justify-center px-8 md:px-16 max-w-[1100px] mx-auto w-full text-center z-10"
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.1, ease: EXPO }}
            className="flex flex-col items-center gap-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4, ease: EXPO }}
              style={{
                border: "1px solid rgba(192,57,43,0.4)",
                background: "rgba(192,57,43,0.08)",
                borderRadius: 999,
                padding: "8px 20px",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.22em",
                color: "#c0392b",
              }}
              className="uppercase"
            >
              Tugas Kewarganegaraan — 2026
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.3, delay: 0.5, ease: EXPO }}
              style={{ fontSize: "clamp(38px,6vw,84px)", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.1, color: "#f2f2f2", minHeight: "2.2em" }}
            >
              Mendefinisikan esensi<br />
              <div className="relative overflow-hidden inline-block w-full h-[1.1em] mt-2">
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={heroTextIdx}
                    initial={{ y: 80, opacity: 0, rotateX: -90 }}
                    animate={{ y: 0, opacity: 1, rotateX: 0 }}
                    exit={{ y: -80, opacity: 0, rotateX: 90 }}
                    transition={{ duration: 0.8, ease: SMOOTH }}
                    style={{ color: "#c0392b", display: "inline-block", position: "absolute", left: 0, right: 0 }}
                  >
                    {HERO_TEXTS[heroTextIdx]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7, ease: EXPO }}
              style={{ fontSize: "clamp(14px,1.3vw,18px)", color: "#777", maxWidth: 620, fontWeight: 300, lineHeight: 1.7 }}
            >
              Eksplorasi mendalam mengenai batasan, hak, dan realitas kebebasan berpendapat di era disrupsi digital yang mengubah cara kita terhubung.
            </motion.p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="w-full z-10"
        >
          <p style={{ textAlign: "center", fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", color: "#444", marginBottom: 16 }} className="uppercase">
            Referensi Utama Kami
          </p>
          <MarqueeRow items={REF_SITES} />
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* ── FOKUS MATERI ── */}
      <section className="px-8 md:px-16 py-32 md:py-48 max-w-[1600px] mx-auto" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <FadeUp className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <h2 style={{ fontSize: "clamp(40px,5vw,72px)", fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 1, color: "#f2f2f2" }}>
            Fokus<br /><span style={{ color: "#333" }}>Materi.</span>
          </h2>
          <p style={{ color: "#555", fontSize: "14px", maxWidth: 280, lineHeight: 1.7 }}>
            Klik pada area materi untuk membaca pemaparan lengkap tentang kajian kebebasan berpendapat.
          </p>
        </FadeUp>

        <div className="relative w-full">
          <div
            ref={carouselRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-6"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {MATERI_CARDS.map((card, idx) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, x: 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.08, ease: EXPO }}
                whileHover={{ scale: 0.98, borderColor: "rgba(192,57,43,0.5)" }}
                onClick={() => openPopup({ title: card.title, subtitle: card.category, content: card.fullContent, img: card.img })}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                className="w-full flex-shrink-0 snap-start flex flex-col md:flex-row gap-4 rounded-[28px] p-2 cursor-pointer transition-colors duration-300 group"
                style={{ minWidth: "100%", background: "#111", border: "1px solid rgba(255,255,255,0.05)" }}
              >
                <div className="w-full md:w-[58%] rounded-[20px] relative overflow-hidden" style={{ background: "#1a1a1a", aspectRatio: "16/10" }}>
                  <motion.img 
                    src={card.img} 
                    alt={card.title} 
                    className="absolute inset-0 object-cover w-full h-full" 
                    style={{ opacity: 0.3, mixBlendMode: "luminosity" }} 
                    whileHover={{ scale: 1.05, opacity: 0.5 }}
                    transition={{ duration: 0.8 }}
                  />
                  <div className="absolute top-6 right-6 w-3 h-3 rounded-full" style={{ background: "#c0392b" }} />
                  <div className="absolute inset-x-0 bottom-0 p-8 md:p-12 flex flex-col justify-end" style={{ background: "linear-gradient(to top, #111 0%, rgba(17,17,17,0.7) 60%, transparent 100%)" }}>
                    <motion.h3
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.7, ease: EXPO }}
                      style={{ fontSize: "clamp(40px,6vw,80px)", fontWeight: 800, letterSpacing: "-0.04em", color: "#f2f2f2", lineHeight: 1 }}
                    >
                      {card.stat}
                    </motion.h3>
                    <p style={{ fontSize: "18px", color: "#888", fontWeight: 400, marginTop: 8 }}>{card.statLabel}</p>
                  </div>
                </div>

                <div className="w-full md:w-[42%] p-8 md:p-12 flex flex-col justify-center relative">
                  <div className="absolute top-8 right-8 w-10 h-10 rounded-full border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-0 -translate-x-4">
                    ↗
                  </div>
                  <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", color: "#c0392b", background: "rgba(192,57,43,0.08)", border: "1px solid rgba(192,57,43,0.2)", borderRadius: 999, padding: "6px 16px", width: "fit-content", marginBottom: 24, display: "block" }}>
                    {card.category}
                  </span>
                  <h3 style={{ fontSize: "clamp(32px,4vw,56px)", fontWeight: 700, letterSpacing: "-0.04em", color: "#f2f2f2", marginBottom: 24, lineHeight: 1.1 }}>
                    {card.title}
                  </h3>
                  <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em", color: "#444", marginBottom: 12 }}>{card.tags}</p>
                  <p style={{ fontSize: "clamp(15px,1.2vw,18px)", color: "#666", fontWeight: 300, lineHeight: 1.7, maxWidth: 340 }}>{card.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-end gap-3 mt-6">
            {[{ fn: scrollLeft, icon: "←" }, { fn: scrollRight, icon: "→" }].map(({ fn, icon }, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.08, background: "#c0392b", color: "#fff" }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
                onClick={fn}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                style={{ width: 52, height: 52, borderRadius: "50%", background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)", color: "#888", fontSize: "18px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "none" }}
              >
                {icon}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* ── STATEMENT ── */}
      <section className="px-8 md:px-16 min-h-[80vh] flex items-center justify-center relative overflow-hidden py-24" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(192,57,43,0.05),transparent_70%)]" />

        <div className="max-w-[1100px] w-full z-10 text-center" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
          <FadeUp>
            <div style={{ fontSize: "80px", fontWeight: 900, color: "#c0392b", lineHeight: 1, marginBottom: 24, opacity: 0.7 }}>"</div>
          </FadeUp>

          <FadeUp delay={0.1}>
            <h2 style={{ fontSize: "clamp(32px,5vw,64px)", fontWeight: 400, letterSpacing: "-0.03em", lineHeight: 1.2, color: "#555" }}>
              Kami adalah{" "}
              <motion.span
                className="font-bold text-[#f2f2f2] relative inline-block"
                whileHover={{ scale: 1.05, color: "#c0392b" }}
              >
                kelompok mahasiswa
                <motion.div 
                  initial={{ scaleX: 0 }} 
                  whileInView={{ scaleX: 1 }} 
                  transition={{ duration: 1, delay: 0.5 }} 
                  className="absolute -bottom-2 left-0 w-full h-[2px] bg-[#c0392b] origin-left"
                />
              </motion.span>{" "}
              yang mengeksplorasi batas kebebasan berekspresi.
            </h2>
          </FadeUp>

          <FadeUp delay={0.2}>
            <h2 style={{ fontSize: "clamp(32px,5vw,64px)", fontWeight: 400, letterSpacing: "-0.03em", lineHeight: 1.2, color: "#555", marginTop: "clamp(24px,3vw,40px)" }}>
              Haruskah kita <span className="font-bold text-white italic">speak up</span> atau sekadar follow the rules? Inilah analisis kami tentang etika <span className="font-bold text-[#f2f2f2]">beropini di ruang digital.</span>
            </h2>
          </FadeUp>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* ── WAWANCARA ── */}
      <section className="px-8 md:px-16 py-32" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "#0a0a0a" }}>
        <div className="max-w-[1200px] mx-auto">
          <FadeUp className="mb-16">
            <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.22em", color: "#c0392b", border: "1px solid rgba(192,57,43,0.3)", background: "rgba(192,57,43,0.06)", borderRadius: 999, padding: "6px 16px", display: "inline-block", marginBottom: 16 }}>
              DATA WAWANCARA
            </span>
            <h2 style={{ fontSize: "clamp(40px,5vw,72px)", fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 1, color: "#333" }}>
              Insight &<br /><span style={{ color: "#f2f2f2" }}>Perspektif.</span>
            </h2>
          </FadeUp>

          <div className="relative flex flex-col" style={{ paddingBottom: "10vh" }}>
            {WAWANCARA.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-8%" }}
                transition={{ duration: 0.75, ease: EXPO }}
                className="sticky w-full rounded-[36px] p-8 md:p-14 flex flex-col justify-end overflow-hidden group"
                style={{
                  top: `calc(14vh + ${i * 20}px)`,
                  height: "74vh",
                  marginBottom: i !== WAWANCARA.length - 1 ? "28vh" : 0,
                  zIndex: i + 1,
                  background: "#111",
                  border: `1px solid rgba(255,255,255,0.05)`,
                  boxShadow: "0 -20px 60px rgba(0,0,0,0.7)",
                }}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.2, ease: EXPO }}
                  style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(to right, ${item.color}, transparent)`, transformOrigin: "left" }}
                />

                <div style={{ position: "absolute", top: 32, left: 40, fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", color: "#333" }}>
                  {item.id} / 06
                </div>

                {/* Avatar with Image replacing color block */}
                <div className="absolute right-8 md:right-14 top-8 md:top-14 w-24 h-24 md:w-48 md:h-48 rounded-full overflow-hidden" style={{ border: `3px solid ${item.color}22`, background: `${item.color}10` }}>
                  <img 
                    src={item.img} 
                    alt={item.narsum} 
                    className="w-full h-full object-cover opacity-60 mix-blend-luminosity group-hover:mix-blend-normal group-hover:opacity-100 transition-all duration-500" 
                  />
                </div>

                <div className="relative z-10 max-w-2xl">
                  <h3 style={{ fontSize: "clamp(28px,4vw,52px)", fontWeight: 700, letterSpacing: "-0.04em", color: item.color, marginBottom: 12, lineHeight: 1.1 }}>
                    {item.narsum}
                  </h3>
                  <span style={{ display: "inline-block", padding: "6px 18px", borderRadius: 999, border: `1px solid ${item.color}40`, color: item.color, fontSize: "13px", fontWeight: 600, marginBottom: 20 }}>
                    {item.role}
                  </span>
                  <p style={{ color: "#888", fontSize: "clamp(15px,1.2vw,18px)", fontWeight: 300, lineHeight: 1.7, marginBottom: 28 }}>
                    {item.desc}
                  </p>
                  <motion.button
                    onClick={() => openPopup({ title: item.narsum, subtitle: item.role, content: item.fullContent, img: item.img }, item.color)}
                    whileHover={{ scale: 1.04, background: item.color === "#c0392b" ? "#e74c3c" : "#f1c40f" }}
                    whileTap={{ scale: 0.97 }}
                    style={{ padding: "12px 24px", background: item.color, color: item.color === "#f1c40f" ? "#0a0a0a" : "#fff", fontWeight: 700, fontSize: "13px", borderRadius: 10, border: "none", cursor: "none" }}
                  >
                    Selengkapnya
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* ── KUISIONER ── */}
      <section className="px-8 md:px-16 py-32 md:py-48 max-w-[1200px] mx-auto">
        <FadeUp className="flex flex-col md:flex-row justify-between items-start md:items-center mb-20 gap-8">
          <div>
            <span style={{ display: "inline-block", fontSize: "10px", fontWeight: 700, letterSpacing: "0.22em", color: "#888", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)", borderRadius: 999, padding: "6px 16px", marginBottom: 16 }}>
              HIGHLIGHTS
            </span>
            <h2 style={{ fontSize: "clamp(32px,4vw,56px)", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.1, color: "#444" }}>
              Angka yang<br /><span style={{ color: "#f2f2f2", fontWeight: 800 }}>mewakili realitas</span>
            </h2>
          </div>
        </FadeUp>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-16 gap-x-12 lg:gap-x-24">
          {KUISIONER.map((stat, i) => (
            <FadeUp key={i} delay={i * 0.1}>
              <div className="flex flex-col">
                <div className="flex items-baseline gap-3 mb-2">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1, ease: [0.34, 1.56, 0.64, 1] }}
                    style={{ width: 10, height: 10, borderRadius: "50%", background: stat.color, flexShrink: 0, marginBottom: 6 }}
                  />
                  <h3 style={{ fontSize: "clamp(56px,8vw,96px)", fontWeight: 900, letterSpacing: "-0.05em", color: "#f2f2f2", lineHeight: 1 }}>
                    <AnimatedStat value={stat.value} />
                  </h3>
                </div>
                <p style={{ fontSize: "clamp(15px,1.2vw,20px)", color: "#555", fontWeight: 300, marginBottom: 20 }}>
                  {stat.label}
                </p>
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: i * 0.05, ease: EXPO }}
                  style={{ height: 1, background: "rgba(255,255,255,0.06)", transformOrigin: "left" }}
                />
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* ── PASAL ── */}
      <section className="px-8 md:px-16 py-32 md:py-48 max-w-[1600px] mx-auto" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex flex-col lg:flex-row gap-20">
          <FadeUp className="lg:w-1/3">
            <h2 style={{ fontSize: "clamp(40px,5vw,72px)", fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 1, color: "#f2f2f2", marginBottom: 20 }}>
              Landasan<br /><span style={{ color: "#333" }}>Hukum.</span>
            </h2>
            <div style={{ fontSize: "64px", color: "#c0392b", opacity: 0.5, lineHeight: 1 }}>⚖</div>
            <p style={{ color: "#555", fontSize: "16px", fontWeight: 300, maxWidth: 300, lineHeight: 1.7, marginTop: 16 }}>
              Regulasi yang menjamin sekaligus membatasi kebebasan berpendapat di Indonesia. Klik untuk melihat detail.
            </p>
          </FadeUp>

          <div className="lg:w-2/3">
            {PASAL.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.75, delay: i * 0.1, ease: EXPO }}
                whileHover={{ scale: 1.02, x: 10, backgroundColor: "rgba(255,255,255,0.02)" }}
                onClick={() => openPopup({ title: p.title, subtitle: "Kajian Hukum", content: p.fullContent, img: p.img })}
                className="group relative rounded-xl transition-all duration-300"
                style={{ padding: "40px 24px", borderBottom: i < PASAL.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent", cursor: "pointer" }}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <div className="absolute right-8 top-1/2 -translate-y-1/2 text-[#c0392b] text-2xl opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                  →
                </div>

                <div className="flex items-start gap-4 md:gap-8">
                  <motion.span
                    style={{ fontSize: "11px", fontWeight: 700, color: "#c0392b", letterSpacing: "0.1em", paddingTop: 8, minWidth: 24 }}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 + 0.3 }}
                  >
                    0{i + 1}
                  </motion.span>

                  {/* Thumbnail Pasal */}
                  <div className="w-16 h-16 md:w-24 md:h-24 flex-shrink-0 rounded-xl overflow-hidden bg-[#111] border border-white/10 hidden sm:block">
                    <img 
                      src={p.img} 
                      alt={p.title} 
                      className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity duration-300 mix-blend-luminosity group-hover:mix-blend-normal" 
                    />
                  </div>

                  <div className="pr-12">
                    <h3 style={{ fontSize: "clamp(20px,2.5vw,32px)", fontWeight: 700, letterSpacing: "-0.03em", color: "#f2f2f2", marginBottom: 12, transition: "color 0.3s" }}>
                      {p.title}
                    </h3>
                    <p style={{ color: "#555", fontSize: "clamp(14px,1.1vw,18px)", fontWeight: 300, lineHeight: 1.7, maxWidth: 560 }}>{p.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* ── TEAM ── */}
      <section className="px-8 md:px-16 py-32 md:py-48 max-w-[1200px] mx-auto" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <FadeUp className="mb-20 text-center">
          <h2 style={{ fontSize: "clamp(48px,6vw,96px)", fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 1 }}>
            The <span style={{ color: "#c0392b" }}>Team.</span>
          </h2>
          <p className="mt-4 text-[#666] max-w-md mx-auto">Penggagas, peneliti, dan pengembang di balik proyek dokumentasi kebebasan berpendapat ini.</p>
        </FadeUp>
        
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-16">
          {MEMBERS.map((member, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: EXPO }}
              className="group w-[45%] md:w-[28%] flex flex-col items-center text-center"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              style={{ cursor: "none" }}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -10 }}
                transition={{ duration: 0.5, ease: SMOOTH }}
                className="relative overflow-hidden rounded-full mb-6 w-40 h-40 md:w-56 md:h-56"
                style={{ background: "#111", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                <img
                  src={member.img}
                  alt={member.name}
                  className="object-cover w-full h-full"
                  style={{ opacity: 0.4, filter: "grayscale(100%)", transition: "opacity 0.8s ease, filter 0.8s ease" }}
                  onMouseEnter={(e) => { e.target.style.opacity = 1; e.target.style.filter = "grayscale(0%)"; }}
                  onMouseLeave={(e) => { e.target.style.opacity = 0.4; e.target.style.filter = "grayscale(100%)"; }}
                />
              </motion.div>
              <h4 style={{ fontSize: "clamp(18px,1.6vw,24px)", fontWeight: 600, letterSpacing: "-0.02em", marginBottom: 6, color: "#f2f2f2" }}>{member.name}</h4>
              <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", color: "#c0392b", textTransform: "uppercase" }}>{member.role}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* ── DOKUMENTASI ── */}
      <section
        className="px-8 md:px-16 w-full flex items-center justify-center relative overflow-hidden"
        style={{ minHeight: "100vh", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingTop: 96, paddingBottom: 48 }}
      >
        <div className="max-w-[1600px] w-full h-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          <FadeUp className="flex flex-col gap-5">
            <span style={{ display: "inline-block", fontSize: "10px", fontWeight: 700, letterSpacing: "0.22em", color: "#888", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)", borderRadius: 999, padding: "6px 16px", width: "fit-content" }}>
              HIGHLIGHTS
            </span>
            <h2 style={{ fontSize: "clamp(40px,6vw,80px)", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.05 }}>
              <span style={{ color: "#444", fontWeight: 400 }}>Dokumentasi</span><br />Bukti Digital.
            </h2>
            <motion.button
              onClick={() => setShowGallery(true)}
              whileHover={{ scale: 1.04, background: "#c0392b", borderColor: "#c0392b" }}
              whileTap={{ scale: 0.97 }}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              style={{ marginTop: 16, padding: "16px 36px", background: "rgba(255,255,255,0.02)", color: "#f2f2f2", fontWeight: 700, fontSize: "14px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.15)", cursor: "none", width: "fit-content", transition: "all 0.3s" }}
            >
              Lihat Semua Dokumentasi
            </motion.button>
          </FadeUp>

          <div
            className="relative overflow-hidden"
            style={{
              height: "85vh",
              maxHeight: "85vh",
              maskImage: "linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)",
            }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <motion.div
              className="flex flex-col gap-6 py-6"
              animate={{ y: ["0%", "-50%"] }}
              transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
            >
              {[...SCREENSHOTS, ...SCREENSHOTS, ...SCREENSHOTS, ...SCREENSHOTS].map((ss, idx) => (
                <motion.div
                  key={`${ss.id}-${idx}`}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.4, ease: SMOOTH }}
                  className="group flex-shrink-0 rounded-[24px] p-3"
                  style={{ background: "#111", border: "1px solid rgba(255,255,255,0.05)", cursor: "none" }}
                >
                  <div className="relative overflow-hidden rounded-[18px]" style={{ aspectRatio: "16/9", background: "#1a1a1a" }}>
                    <img src={`/ss-${ss.id}.jpg`} alt="" className="object-cover w-full h-full" style={{ opacity: 0.3, transition: "opacity 0.8s ease" }} />
                    <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(10,10,10,0.3)" }}>
                      <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.25em", color: "#555", background: "#111", padding: "6px 16px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.06)" }}>
                        SS 0{ss.id}
                      </span>
                    </div>
                  </div>
                  <div style={{ marginTop: 16, marginBottom: 4, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 8px" }}>
                    <p style={{ fontSize: "13px", fontWeight: 600, letterSpacing: "0.18em", color: "#555", textTransform: "uppercase" }}>{ss.label}</p>
                    <span style={{ fontSize: "16px", fontWeight: 700, color: "#333" }}>0{ss.id}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* ── FOOTER ── */}
      <footer className="relative overflow-hidden" style={{ padding: "120px 32px 40px", background: "#050505" }}>
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#c0392b]/30 to-transparent" />
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-20 relative z-10">
          <div>
            <span className="text-[#c0392b] text-xs font-bold tracking-[0.3em] mb-4 block uppercase">Reach Out</span>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: EXPO }}
              style={{ fontSize: "clamp(64px,10vw,160px)", fontWeight: 900, letterSpacing: "-0.05em", lineHeight: 0.9, color: "#1a1a1a", marginBottom: 32, cursor: "none", transition: "color 0.4s" }}
              whileHover={{ color: "#f2f2f2" }}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              Let's<br />Talk.
            </motion.h2>
            <a
              href="mailto:kwnkelompok2@upnvjt.edu"
              className="text-xl md:text-3xl font-light text-[#888] hover:text-[#c0392b] transition-colors duration-300 relative inline-block group pb-2"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              kwnkelompok2@upnvjt.edu
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#c0392b] transition-all duration-300 group-hover:w-full" />
            </a>
          </div>

          <div className="text-left md:text-right">
            {["Universitas Pembangunan Nasional 'Veteran' Jawa Timur", "Fakultas Ilmu Komputer", "Program Studi Informatika"].map((line, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: EXPO }}
                style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", color: "#444", textTransform: "uppercase", marginBottom: 12, cursor: "none" }}
                whileHover={{ color: "#f2f2f2", x: -5 }}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                {line}
              </motion.p>
            ))}
            <div className="w-full h-[1px] bg-white/5 my-8" />
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex gap-3">
                {["#c0392b", "#f1c40f", "#f2f2f2"].map((c) => (
                  <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c, opacity: 0.8 }} />
                ))}
              </div>
              <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.15em", color: "#555", textTransform: "uppercase" }}>
                © 2026. All Rights Reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* ── MODALS / POPUPS ── */}

      <AnimatePresence>
        {popupData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[999] flex items-center justify-center p-4 md:p-12 bg-black/80 backdrop-blur-md"
            onClick={() => setPopupData(null)}
          >
            <motion.div
              initial={{ y: 50, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 30, scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.5, ease: EXPO }}
              className="bg-[#111] border border-white/10 rounded-[32px] p-8 md:p-14 max-w-4xl w-full max-h-[85vh] overflow-y-auto relative shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setPopupData(null)}
                className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center rounded-full bg-black/50 hover:bg-white/20 text-white transition-colors z-20 backdrop-blur-sm"
              >
                ✕
              </button>

              {/* Tampilan Gambar di dalam Popup (Banner Area) */}
              {popupData.img && (
                <div className="w-full h-[200px] md:h-[320px] mb-8 rounded-2xl overflow-hidden relative border border-white/5">
                  <img src={popupData.img} alt={popupData.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-[#111]/40 to-transparent"></div>
                </div>
              )}

              <div className="relative z-10 -mt-16 md:-mt-24 pt-4">
                <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", color: popupData.themeColor || "#c0392b", background: `${popupData.themeColor || "#c0392b"}15`, border: `1px solid ${popupData.themeColor || "#c0392b"}30`, borderRadius: 999, padding: "6px 16px", width: "fit-content", marginBottom: 24, display: "block" }}>
                  {popupData.subtitle}
                </span>
                <h2 style={{ fontSize: "clamp(32px,5vw,64px)", fontWeight: 800, letterSpacing: "-0.04em", color: "#f2f2f2", marginBottom: 32, lineHeight: 1.1 }}>
                  {popupData.title}
                </h2>
                
                <div className="w-full h-[1px] bg-white/10 mb-8" />

                <div className="prose prose-invert prose-lg max-w-none text-[#999] leading-relaxed font-light">
                  <p>{popupData.content}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showGallery && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: "0%" }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ duration: 0.7, ease: EXPO }}
            className="fixed inset-0 z-[1000] bg-[#0a0a0a] overflow-y-auto overflow-x-hidden"
          >
            <div className="fixed top-0 left-0 w-full p-8 md:p-12 flex justify-between items-center z-[1001] bg-gradient-to-b from-[#0a0a0a] to-transparent">
              <h2 className="text-white text-2xl font-bold tracking-tighter">DOKUMENTASI<span className="text-[#c0392b]">.</span></h2>
              <button
                onClick={() => setShowGallery(false)}
                className="text-sm font-bold tracking-widest uppercase text-[#888] hover:text-white transition-colors"
              >
                Kembali
              </button>
            </div>

            <div className="pt-32 pb-24 px-4 md:px-12 max-w-[1800px] mx-auto">
              <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                {GALLERY_IMAGES.map((src, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: (i % 5) * 0.1, duration: 0.6 }}
                    className="break-inside-avoid relative group overflow-hidden rounded-xl bg-[#111] cursor-none"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                  >
                    <img
                      src={src}
                      alt={`Dokumentasi ${i+1}`}
                      className="w-full h-auto object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-black/40">
                      <span className="text-white text-xs tracking-[0.2em] font-bold border border-white/20 px-6 py-3 rounded-full backdrop-blur-sm">
                        LIHAT DETAIL
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}