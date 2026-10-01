import { useEffect, useMemo, useRef, useState } from "react";
import {
  Heart,
  ArrowRight,
  ArrowLeft,
  Menu,
  X,
  Check,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import { CONFIG, QUESTIONS, REASONS, LETTER } from "./data.jsx";

const NAV = [
  { id: "home", label: "Home" },
  { id: "quiz", label: "Questions" },
  { id: "why", label: "Why You?" },
  { id: "message", label: "Special Message" },
];

/* ---------------- Floating hearts background ---------------- */
function FloatingHearts({ count = 14 }) {
  const items = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 10 + Math.random() * 18,
        delay: Math.random() * 10,
        dur: 9 + Math.random() * 10,
        opacity: 0.25 + Math.random() * 0.4,
      })),
    [count]
  );
  return (
    <div className="floaters" aria-hidden="true">
      {items.map((h) => (
        <Heart
          key={h.id}
          fill="currentColor"
          style={{
            left: `${h.left}%`,
            width: h.size,
            height: h.size,
            animationDelay: `${h.delay}s`,
            animationDuration: `${h.dur}s`,
            opacity: h.opacity,
          }}
        />
      ))}
    </div>
  );
}

/* ---------------- Confetti (hearts burst) ---------------- */
function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 12 + Math.random() * 22,
        delay: Math.random() * 1.6,
        dur: 3 + Math.random() * 3,
        hue: ["#ff4d6d", "#ff758f", "#ffb3c1", "#ffd6a5", "#fff"][i % 5],
      })),
    []
  );
  return (
    <div className="confetti" aria-hidden="true">
      {pieces.map((p) => (
        <Heart
          key={p.id}
          fill={p.hue}
          color={p.hue}
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.dur}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ---------------- Navbar ---------------- */
function Navbar({ page, go, startQuiz }) {
  const [open, setOpen] = useState(false);
  const activeId = page === "result" ? "quiz" : page === "proposal" ? "" : page;
  const pick = (id) => {
    setOpen(false);
    if (id === "quiz") startQuiz();
    else go(id);
  };
  return (
    <header className="nav">
      <button className="brand" onClick={() => pick("home")}>
        <Heart size={20} fill="currentColor" /> <span>{CONFIG.siteName}</span>
      </button>
      <nav className={`links ${open ? "open" : ""}`}>
        {NAV.map((n) => (
          <button
            key={n.id}
            className={activeId === n.id ? "active" : ""}
            onClick={() => pick(n.id)}
          >
            {n.label}
          </button>
        ))}
        <button className="pill" onClick={() => pick("quiz")}>
          Let’s Go
        </button>
      </nav>
      <button
        className="burger"
        aria-label="Menu"
        onClick={() => setOpen((o) => !o)}
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>
    </header>
  );
}

/* ---------------- 1. Home ---------------- */
function Home({ name, setName, onStart }) {
  return (
    <section className="page home">
      <div className="sunset" />
      <div className="city" />
      <svg className="couple" viewBox="0 0 400 220" aria-hidden="true">
        <defs>
          <linearGradient id="hill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#1a1024" />
            <stop offset="1" stopColor="#0a0812" />
          </linearGradient>
        </defs>
        <path d="M0 170 Q120 140 260 160 T400 150 V220 H0Z" fill="url(#hill)" />
        {/* person 1 */}
        <circle cx="150" cy="92" r="17" fill="#0c0913" />
        <path d="M118 176 Q116 116 150 112 Q184 116 182 176Z" fill="#0c0913" />
        {/* person 2 (hair) */}
        <circle cx="208" cy="100" r="15" fill="#0c0913" />
        <path d="M178 176 Q178 124 208 120 Q238 124 236 176Z" fill="#0c0913" />
        <path d="M194 96 Q186 130 196 150" stroke="#0c0913" strokeWidth="9" fill="none" strokeLinecap="round" />
      </svg>

      <div className="hero">
        <h1>
          A Little Surprise
          <br />
          For {name ? name : "Someone Very Special"}
        </h1>
        <div className="divider">
          <span />
          <Heart size={22} fill="currentColor" />
          <span />
        </div>
        <p className="sub">
          This isn’t just a website...
          <br />
          It’s my heart, in questions, answers and a promise.
        </p>

        <input
          className="name-input"
          value={name}
          onChange={(e) => setName(e.target.value.slice(0, 20))}
          placeholder="Write her/his name (optional)"
          aria-label="Name"
        />

        <button className="btn primary" onClick={onStart}>
          Start <Sparkles size={16} />
        </button>
      </div>
      <div className="handwritten corner">
        Will you
        <br />
        be mine? <Heart size={14} fill="currentColor" />
      </div>
    </section>
  );
}

/* ---------------- 2. Question ---------------- */
function Quiz({ index, answers, setAnswer, onBack, onNext }) {
  const q = QUESTIONS[index];
  const chosen = answers[index];
  const pct = ((index + 1) / QUESTIONS.length) * 100;
  return (
    <section className="page dark">
      <FloatingHearts />
      <div className="badge">
        {index + 1}/{QUESTIONS.length}
      </div>
      <div className="progress">
        <div style={{ width: `${pct}%` }} />
      </div>
      <div className="card glass quiz">
        <Heart className="tiny" size={16} fill="currentColor" />
        <p className="qcount">
          Question {index + 1} of {QUESTIONS.length}
        </p>
        <h2>{q.q}</h2>
        <div className="options">
          {q.options.map((o, i) => (
            <button
              key={o}
              className={`option ${chosen === i ? "selected" : ""}`}
              onClick={() => setAnswer(index, i)}
            >
              <span className="radio" />
              {o}
            </button>
          ))}
        </div>
        <div className="row">
          <button className="btn ghost" onClick={onBack}>
            <ArrowLeft size={15} /> Back
          </button>
          <button
            className="btn primary"
            disabled={chosen === undefined}
            onClick={onNext}
          >
            Next <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </section>
  );
}

/* ---------------- 3. Result ---------------- */
function Result({ index, onNext }) {
  const r = QUESTIONS[index].reply;
  const last = index === QUESTIONS.length - 1;
  return (
    <section className="page light">
      <FloatingHearts count={10} />
      <div className="badge light-badge">
        {index + 1}/{QUESTIONS.length}
      </div>
      <div className="result">
        <Heart className="big-heart" size={70} fill="currentColor" />
        <h2>{r.title}</h2>
        <p>{r.text}</p>
        <button className="btn primary" onClick={onNext}>
          {last ? "Continue" : "Next Question"} <ArrowRight size={15} />
        </button>
      </div>
      <div className="bouquet" aria-hidden="true">
        <span className="flower f1" />
        <span className="flower f2" />
        <span className="flower f3" />
        <span className="flower f4" />
        <div className="note-card">
          You are
          <br />
          special
          <Heart size={12} fill="currentColor" />
        </div>
      </div>
      <div className="handwritten small-note">{r.note}</div>
    </section>
  );
}

/* ---------------- 4. Why I like you ---------------- */
function Why({ onBack, onNext }) {
  return (
    <section className="page dark why">
      <FloatingHearts count={8} />
      <div className="why-head">
        <h2>
          <Heart size={22} fill="currentColor" /> Why I Like You
        </h2>
        <p>Here are some real reasons why you mean so much to me...</p>
      </div>
      <div className="grid">
        {REASONS.map(({ icon: Icon, title, text }) => (
          <div className="card glass reason" key={title}>
            <Icon size={30} />
            <h3>{title}</h3>
            <p>{text}</p>
          </div>
        ))}
      </div>
      <div className="row wide">
        <button className="btn ghost" onClick={onBack}>
          <ArrowLeft size={15} /> Back
        </button>
        <button className="btn primary" onClick={onNext}>
          Next <ArrowRight size={15} />
        </button>
      </div>
    </section>
  );
}

/* ---------------- 5. Special message ---------------- */
function Message({ onNext }) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    setShown(0);
    const t = setInterval(
      () => setShown((s) => (s < LETTER.length ? s + 1 : s)),
      900
    );
    return () => clearInterval(t);
  }, []);
  return (
    <section className="page warm">
      <div className="badge">7/7</div>
      <div className="paper">
        <Heart className="tiny paper-heart" size={18} fill="currentColor" />
        <h2>A Special Message For You</h2>
        {LETTER.map((p, i) => (
          <p key={i} className={`line ${i < shown ? "on" : ""}`}>
            {p}
          </p>
        ))}
        <div className={`sign handwritten ${shown >= LETTER.length ? "on" : ""}`}>
          With all my heart,
          <br />
          <span>{CONFIG.signature}</span>
          <Heart size={16} fill="currentColor" />
        </div>
      </div>
      <div className="row corner-btn">
        <button className="btn primary" onClick={onNext}>
          Next <ArrowRight size={15} />
        </button>
      </div>
    </section>
  );
}

/* ---------------- 6. Proposal ---------------- */
function Proposal({ name, onRestart }) {
  const [said, setSaid] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [tries, setTries] = useState(0);
  const wrap = useRef(null);

  const dodge = () => {
    const w = wrap.current?.clientWidth || 300;
    const range = Math.min(120, w / 3);
    setPos({
      x: (Math.random() - 0.5) * 2 * range,
      y: (Math.random() - 0.5) * 2 * 70,
    });
    setTries((t) => t + 1);
  };

  if (said) {
    return (
      <section className="page night">
        <Confetti />
        <FloatingHearts count={16} />
        <div className="celebrate">
          <Heart size={90} fill="currentColor" className="beat" />
          <h2>
            Yaaay{name ? `, ${name}` : ""}! 💖
          </h2>
          <p>
            You just made me the happiest person alive.
            <br />
            Thank you for saying yes. This is only the beginning of us.
          </p>
          <div className="handwritten big">Forever yours...</div>
          <button className="btn ghost" onClick={onRestart}>
            <RotateCcw size={14} /> Start again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="page night">
      <div className="badge">7/7</div>
      <div className="lights" aria-hidden="true">
        {Array.from({ length: 22 }).map((_, i) => (
          <i key={i} style={{ animationDelay: `${(i % 7) * 0.4}s` }} />
        ))}
      </div>
      <div className="propose">
        <Heart className="tiny" size={18} fill="currentColor" />
        <h2>
          So... Will You
          <br />
          Be Mine?
        </h2>
        <p>
          You’ve seen the questions, the answers
          <br />
          and now the truth...
        </p>
        <p className="strong">I really like you. A lot.</p>

        <div className="answers" ref={wrap}>
          <button
            className="btn primary big-btn"
            style={{ transform: `scale(${1 + Math.min(tries, 6) * 0.06})` }}
            onClick={() => setSaid(true)}
          >
            <Heart size={15} fill="currentColor" /> Yes, I will!{" "}
            <Sparkles size={15} />
          </button>
          <button
            className="btn ghost big-btn maybe"
            style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
            onMouseEnter={dodge}
            onTouchStart={(e) => {
              e.preventDefault();
              dodge();
            }}
            onClick={dodge}
          >
            {tries > 3 ? "Okay... Yes 🥺" : "Maybe..."}
          </button>
        </div>
        <button className="link" onClick={() => setSaid(true)}>
          (Just kidding... it’s a yes! <Heart size={11} fill="currentColor" />)
        </button>
      </div>
      <div className="candle" aria-hidden="true" />
    </section>
  );
}

/* ---------------- App ---------------- */
export default function App() {
  const [page, setPage] = useState("home");
  const [qi, setQi] = useState(0);
  const [answers, setAnswers] = useState({});
  const [name, setName] = useState("");

  const go = (p) => {
    setPage(p);
    window.scrollTo({ top: 0 });
  };
  const startQuiz = () => {
    setQi(0);
    go("quiz");
  };
  const restart = () => {
    setAnswers({});
    setQi(0);
    go("home");
  };

  return (
    <div className="app">
      {page !== "home" && page !== "proposal" ? null : null}
      <Navbar page={page} go={go} startQuiz={startQuiz} />
      <main key={page + qi} className="fade">
        {page === "home" && (
          <Home name={name} setName={setName} onStart={startQuiz} />
        )}
        {page === "quiz" && (
          <Quiz
            index={qi}
            answers={answers}
            setAnswer={(i, v) => setAnswers((a) => ({ ...a, [i]: v }))}
            onBack={() => (qi === 0 ? go("home") : setQi(qi - 1))}
            onNext={() => go("result")}
          />
        )}
        {page === "result" && (
          <Result
            index={qi}
            onNext={() => {
              if (qi < QUESTIONS.length - 1) {
                setQi(qi + 1);
                go("quiz");
              } else go("why");
            }}
          />
        )}
        {page === "why" && (
          <Why
            onBack={() => {
              setQi(QUESTIONS.length - 1);
              go("quiz");
            }}
            onNext={() => go("message")}
          />
        )}
        {page === "message" && <Message onNext={() => go("proposal")} />}
        {page === "proposal" && <Proposal name={name} onRestart={restart} />}
      </main>
    </div>
  );
}
