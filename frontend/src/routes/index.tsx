/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import {
  BookOpen, Users, BarChart3, CheckCircle, MessageSquare, Award,
  Gamepad2, FlaskConical, Target, Laptop, Globe, TrendingUp,
  DollarSign, ShieldCheck, Zap, ArrowRight, Star,
  GraduationCap, Building2, Menu,
} from "lucide-react"

export const Route = createFileRoute("/")({
  component: HomePage,
})

// ─── Page ─────────────────────────────────────────────────────────────────────
function HomePage() {
  const navigate = useNavigate()
  const toSignup = () => navigate({ to: "/auth/signup" })
  const toLogin  = () => navigate({ to: "/auth/login"  })

  return (
    <div className="edu-root">
      <style>{css}</style>

      {/* ── Navbar — mobile toggle is pure CSS via hidden checkbox ── */}
      <nav className="edu-nav">
        <div className="edu-container edu-nav__inner">
          <span className="edu-logo" onClick={toLogin}>EDUFLOW</span>

          {/* Hidden checkbox drives mobile menu open/close — no useState needed */}
          <input type="checkbox" id="edu-menu-toggle" className="edu-menu-checkbox" />

          <div className="edu-nav__links">
            <a href="#features" className="edu-nav__link">Features</a>
            <a href="#benefits" className="edu-nav__link">Benefits</a>
            <a href="#pricing"  className="edu-nav__link">Pricing</a>
          </div>

          <div className="edu-nav__actions">
            <button className="edu-btn edu-btn--ghost"    onClick={toLogin}>Login</button>
            <button className="edu-btn edu-btn--primary"  onClick={toSignup}>Get Started</button>
          </div>

          {/* Label acts as hamburger — toggles checkbox above */}
          <label htmlFor="edu-menu-toggle" className="edu-hamburger" aria-label="Toggle menu">
            <Menu size={22} />
          </label>
        </div>

        {/* Mobile drawer — shown/hidden via CSS when checkbox is checked */}
        <div className="edu-mobile-drawer">
          <a href="#features" className="edu-mobile-link">Features</a>
          <a href="#benefits" className="edu-mobile-link">Benefits</a>
          <a href="#pricing"  className="edu-mobile-link">Pricing</a>
          <div className="edu-mobile-actions">
            <button className="edu-btn edu-btn--ghost   edu-btn--full" onClick={toLogin}>Login</button>
            <button className="edu-btn edu-btn--primary edu-btn--full" onClick={toSignup}>Get Started</button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="edu-hero">
        <div className="edu-blob edu-blob--1" />
        <div className="edu-blob edu-blob--2" />

        <div className="edu-container edu-hero__body">
          <div className="edu-hero__badge">
            <Star size={12} fill="currentColor" />
            Trusted by 50,000+ learners
          </div>

          <h1 className="edu-hero__title">
            Learn smarter.<br />
            <span className="edu-accent">Grow faster.</span>
          </h1>

          <p className="edu-hero__sub">
            EduFlow is a modern Learning Management System built for students,
            instructors, and organisations who want real results — not just content.
          </p>

          <div className="edu-hero__cta">
            <button className="edu-btn edu-btn--primary edu-btn--lg" onClick={toSignup}>
              Start for free <ArrowRight size={15} />
            </button>
            <button className="edu-btn edu-btn--outline edu-btn--lg" onClick={toLogin}>
              Login to continue
            </button>
          </div>

          <div className="edu-hero__stats">
            {[
              { value: "50K+",  label: "Learners"          },
              { value: "1,200+",label: "Courses"           },
              { value: "98%",   label: "Satisfaction"      },
              { value: "42%",   label: "Productivity boost"},
            ].map(s => (
              <div key={s.label} className="edu-hero__stat">
                <span className="edu-hero__stat-val">{s.value}</span>
                <span className="edu-hero__stat-lbl">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="edu-section edu-section--white" id="features">
        <div className="edu-container">
          <SectionHeader label="Platform Features" title="Everything you need to learn — and teach" sub="Built for modern education with tools that actually make a difference." />
          <div className="edu-grid edu-grid--3">
            {features.map((f, i) => (
              <div key={i} className="edu-feature-card edu-reveal" style={{ "--delay": `${i * 60}ms` } as any}>
                <div className="edu-feature-card__icon"><f.icon size={18} /></div>
                <h3 className="edu-feature-card__title">{f.title}</h3>
                <p  className="edu-feature-card__desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Indigo strip ── */}
      <div className="edu-strip">
        <div className="edu-container edu-grid edu-grid--4">
          {interactive.map((item, i) => (
            <div key={i} className="edu-strip__card">
              <div className="edu-strip__icon"><item.icon size={20} /></div>
              <h4 className="edu-strip__title">{item.title}</h4>
              <p  className="edu-strip__desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Benefits ── */}
      <section className="edu-section edu-section--slate" id="benefits">
        <div className="edu-container">
          <SectionHeader label="Why EduFlow" title="Benefits that go beyond a course list" sub="We designed EduFlow around one question: what do learners actually need?" />
          <div className="edu-grid edu-grid--3">
            {benefits.map((b, i) => (
              <div key={i} className="edu-benefit-card edu-reveal" style={{ "--delay": `${i * 60}ms` } as any}>
                <div className="edu-benefit-card__icon" style={{ background: b.color }}><b.icon size={18} color="#fff" /></div>
                <h3 className="edu-benefit-card__title">{b.title}</h3>
                <p  className="edu-benefit-card__desc">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="edu-section edu-section--white">
        <div className="edu-container">
          <SectionHeader label="Student Stories" title="Real results from real learners" sub="Thousands of people have already changed their careers with EduFlow." />
          <div className="edu-grid edu-grid--2">
            {testimonials.map((t, i) => (
              <div key={i} className="edu-testimonial edu-reveal" style={{ "--delay": `${i * 80}ms` } as any}>
                <div className="edu-testimonial__stars">{"★".repeat(t.rating)}</div>
                <p className="edu-testimonial__text">"{t.text}"</p>
                <div className="edu-testimonial__author">
                  <div className="edu-testimonial__avatar">{t.avatar}</div>
                  <div>
                    <div className="edu-testimonial__name">{t.name}</div>
                    <div className="edu-testimonial__meta">{t.role} · {t.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Audience ── */}
      <section className="edu-section edu-section--slate">
        <div className="edu-container">
          <SectionHeader label="For Everyone" title="Built for every kind of learner" sub="Whether you're a student, professional, or running an organisation." />
          <div className="edu-grid edu-grid--4">
            {audiences.map((a, i) => (
              <div key={i} className="edu-audience-card edu-reveal" style={{ "--delay": `${i * 70}ms` } as any}>
                <div className="edu-audience-card__icon" style={{ background: a.color }}><a.icon size={18} color="#fff" /></div>
                <h3 className="edu-audience-card__title">{a.title}</h3>
                <ul className="edu-audience-card__list">
                  {a.items.map((item: string, j: number) => (
                    <li key={j}><CheckCircle size={12} className="edu-check" />{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="edu-section edu-section--white" id="pricing">
        <div className="edu-container">
          <SectionHeader label="Pricing" title="Simple, honest pricing" sub="Start free. Upgrade only when you need to." />
          <div className="edu-grid edu-grid--3">
            {pricing.map((p, i) => (
              <div key={i} className={`edu-pricing-card edu-reveal ${p.popular ? "edu-pricing-card--popular" : ""}`} style={{ "--delay": `${i * 80}ms` } as any}>
                {p.popular && <div className="edu-pricing-card__badge">Most Popular</div>}
                <h3 className="edu-pricing-card__title">{p.title}</h3>
                <div className="edu-pricing-card__price">
                  <span className="edu-pricing-card__amount">{p.price}</span>
                  {p.period && <span className="edu-pricing-card__period">/{p.period}</span>}
                </div>
                <ul className="edu-pricing-card__features">
                  {p.featureList.map((f: string, j: number) => (
                    <li key={j}><CheckCircle size={13} className="edu-check" />{f}</li>
                  ))}
                </ul>
                <button
                  className={`edu-btn ${p.popular ? "edu-btn--primary" : "edu-btn--outline"} edu-btn--full`}
                  onClick={p.popular ? toSignup : toLogin}
                >
                  {p.popular ? "Get Started" : "Learn More"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ — uses native <details>/<summary> — zero JS needed ── */}
      <section className="edu-section edu-section--slate">
        <div className="edu-container">
          <SectionHeader label="FAQ" title="Common questions" sub="" />
          <div className="edu-faq">
            {faqs.map((f, i) => (
              <details key={i} className="edu-faq__item">
                <summary className="edu-faq__question">{f.question}</summary>
                <p className="edu-faq__answer">{f.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="edu-cta-section">
        <div className="edu-container edu-cta-section__inner">
          <h2 className="edu-cta-section__title">Ready to start your journey?</h2>
          <p className="edu-cta-section__sub">Join 50,000+ learners. No credit card required.</p>
          <div className="edu-hero__cta">
            <button className="edu-btn edu-btn--white   edu-btn--lg" onClick={toSignup}>Create free account <ArrowRight size={15} /></button>
            <button className="edu-btn edu-btn--outline-white edu-btn--lg" onClick={toLogin}>Login to enroll</button>
          </div>
          <div className="edu-cta-section__perks">
            <span>✓ Free forever plan</span>
            <span>✓ No credit card needed</span>
            <span>✓ Cancel anytime</span>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="edu-footer">
        <div className="edu-container edu-footer__grid">
          <div>
            <span className="edu-logo" style={{ color: "#fff" }}>EDUFLOW</span>
            <p className="edu-footer__tagline">Empowering learners worldwide.</p>
          </div>
          {[
            { label: "Product", links: [["#features","Features"],["#benefits","Benefits"],["#pricing","Pricing"]] },
            { label: "Company", links: [["#","About"],["#","Contact"],["#","Careers"]] },
            { label: "Legal",   links: [["#","Privacy Policy"],["#","Terms of Service"]] },
          ].map(group => (
            <div key={group.label} className="edu-footer__group">
              <strong>{group.label}</strong>
              {group.links.map(([href, text]) => <a key={text} href={href}>{text}</a>)}
            </div>
          ))}
        </div>
        <div className="edu-footer__bottom edu-container">
          <p>© 2026 EduFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

// ─── Section Header ────────────────────────────────────────────────────────────
function SectionHeader({ label, title, sub }: { label: string; title: string; sub: string }) {
  return (
    <div className="edu-section-header">
      <span className="edu-section-header__label">{label}</span>
      <h2 className="edu-section-header__title">{title}</h2>
      {sub && <p className="edu-section-header__sub">{sub}</p>}
    </div>
  )
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const features = [
  { icon: BookOpen,      title: "Course Management",    desc: "Create and deliver structured courses with our intuitive builder. Drag-drop modules, add videos, quizzes, and documents." },
  { icon: Users,         title: "User Management",       desc: "Role-based access for students, instructors, and admins. Manage cohorts and track enrolments effortlessly." },
  { icon: BarChart3,     title: "Progress Analytics",    desc: "Real-time dashboards showing completion rates, engagement, and learning outcomes." },
  { icon: CheckCircle,   title: "Assessments & Quizzes", desc: "Auto-graded assessments with instant feedback. Schedule deadlines and set passing criteria." },
  { icon: MessageSquare, title: "Discussion Forums",      desc: "Built-in forums and messaging to encourage peer-to-peer learning and instructor support." },
  { icon: Award,         title: "Certifications",        desc: "Award verified digital certificates on completion. Shareable on LinkedIn with one click." },
]

const interactive = [
  { icon: Gamepad2,     title: "Gamification",      desc: "Points, badges & leaderboards" },
  { icon: FlaskConical, title: "Hands-On Labs",     desc: "Real-world projects & exercises" },
  { icon: Target,       title: "Adaptive Learning", desc: "AI-adjusted difficulty per learner" },
  { icon: Laptop,       title: "Learn Anywhere",    desc: "Full mobile & offline support" },
]

const benefits = [
  { icon: Globe,       title: "Learn Anytime",     desc: "Access all your courses 24/7 from any device, anywhere in the world.", color: "#6366f1" },
  { icon: TrendingUp,  title: "Track Everything",  desc: "Detailed analytics give you and your instructors a clear view of progress.", color: "#0ea5e9" },
  { icon: DollarSign,  title: "Cost Effective",    desc: "Replace expensive in-person training. Companies save up to 50% on training costs.", color: "#10b981" },
  { icon: ShieldCheck, title: "Secure & Reliable", desc: "Bank-grade encryption, 99.9% uptime SLA, and full GDPR compliance.", color: "#f59e0b" },
  { icon: Zap,         title: "Quick Setup",       desc: "Get your first course live in minutes. No technical knowledge needed.", color: "#ef4444" },
  { icon: Users,       title: "Collaborative",     desc: "Foster community with group projects, peer review, and discussion boards.", color: "#8b5cf6" },
]

const testimonials = [
  { name: "Priya Sharma", role: "Data Scientist",   company: "Tech Corp",  rating: 5, avatar: "👩‍💼", text: "EduFlow transformed how I learn. The course quality is exceptional and I landed my dream job within 3 months of completing the Data Science track." },
  { name: "Rahul Verma",  role: "CEO",              company: "StartupHub", rating: 5, avatar: "👨‍💼", text: "We trained our entire 200-person team with EduFlow. Productivity went up 42% and onboarding time was cut in half. Worth every rupee." },
  { name: "Ananya Patel", role: "Student",          company: "IIT Delhi",  rating: 5, avatar: "👩‍🎓", text: "The mobile app is brilliant. I finished two certifications while commuting. The UI is clean and everything just works." },
  { name: "Vikram Singh", role: "Product Manager",  company: "InfoTech",   rating: 5, avatar: "👨‍💻", text: "Certificates are recognised by top employers. I got two callbacks within a week of adding my EduFlow certificate to my resume." },
]

const audiences = [
  { icon: GraduationCap, title: "Students",       color: "#6366f1", items: ["1,200+ courses across subjects", "Learn at your own pace", "Earn verified certificates", "Connect with global peers"] },
  { icon: Users,         title: "Educators",      color: "#0ea5e9", items: ["Create & monetise courses", "Reach students worldwide", "Advanced analytics included", "Automate admin tasks"] },
  { icon: Building2,     title: "Organisations",  color: "#10b981", items: ["Train teams at any scale", "Cut training costs by 50%", "Compliance tracking built-in", "Measure training ROI"] },
  { icon: BookOpen,      title: "Institutions",   color: "#f59e0b", items: ["Offer hybrid programmes", "Increase enrolment capacity", "Streamline administration", "Improve student outcomes"] },
]

const pricing = [
  { title: "Free",       price: "₹0",     period: "forever", popular: false, featureList: ["50+ free courses","Basic progress tracking","Community forum","Mobile app access","Email support"] },
  { title: "Pro",        price: "₹2,499", period: "month",   popular: true,  featureList: ["Unlimited course access","Advanced analytics","Priority 24/7 support","Downloadable resources","Custom learning paths","All certificates included"] },
  { title: "Enterprise", price: "Custom", period: null,       popular: false, featureList: ["Everything in Pro","Dedicated account manager","Custom branding","Advanced security","Custom integrations","SLA guarantee"] },
]

const faqs = [
  { question: "How do I get started?",                     answer: "Click 'Create Free Account', fill in your details and you have instant access — no credit card required." },
  { question: "Can I try Pro features before upgrading?",  answer: "Yes! We offer a 14-day free trial of our Pro plan. Explore everything risk-free and cancel anytime." },
  { question: "Are certificates recognised by employers?", answer: "Absolutely. Each certificate includes a unique verification code and is endorsed by our industry partners." },
  { question: "Can I access courses offline?",             answer: "Yes, our mobile app lets you download courses and learn completely offline — perfect for commutes." },
  { question: "Do you offer refunds?",                     answer: "We offer a 30-day money-back guarantee on all paid plans. No questions asked." },
]

// ─── CSS ──────────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Playfair+Display:wght@700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .edu-root {
    font-family: 'DM Sans', sans-serif;
    color: #1e293b;
    background: #f8fafc;
    -webkit-font-smoothing: antialiased;
  }

  /* ── Tokens ── */
  :root {
    --indigo: #6366f1;
    --indigo-dark: #4f46e5;
    --indigo-light: #eef2ff;
    --slate-50:  #f8fafc;
    --slate-100: #f1f5f9;
    --slate-200: #e2e8f0;
    --slate-400: #94a3b8;
    --slate-600: #475569;
    --slate-800: #1e293b;
    --radius: 14px;
  }

  /* ── Layout ── */
  .edu-container { max-width: 1160px; margin: 0 auto; padding: 0 1.25rem; }
  .edu-accent    { color: var(--indigo); }
  .edu-check     { color: var(--indigo); flex-shrink: 0; }
  .edu-logo {
    font-family: 'Playfair Display', serif;
    font-size: 1.35rem; font-weight: 800;
    color: var(--indigo); cursor: pointer; letter-spacing: -.02em;
  }

  /* ── Buttons ── */
  .edu-btn {
    display: inline-flex; align-items: center; justify-content: center; gap: .4rem;
    padding: .6rem 1.35rem; font-size: .9rem; font-weight: 600;
    border-radius: 50px; border: 2px solid transparent;
    cursor: pointer; transition: all .2s ease; white-space: nowrap;
    font-family: 'DM Sans', sans-serif;
  }
  .edu-btn--primary       { background: var(--indigo); color: #fff; border-color: var(--indigo); box-shadow: 0 4px 14px rgba(99,102,241,.3); }
  .edu-btn--primary:hover { background: var(--indigo-dark); border-color: var(--indigo-dark); transform: translateY(-1px); box-shadow: 0 6px 20px rgba(99,102,241,.4); }
  .edu-btn--ghost         { background: transparent; color: var(--slate-600); }
  .edu-btn--ghost:hover   { background: var(--indigo-light); color: var(--indigo); }
  .edu-btn--outline       { background: transparent; color: var(--indigo); border-color: var(--indigo); }
  .edu-btn--outline:hover { background: var(--indigo-light); }
  .edu-btn--outline-white { background: transparent; color: #fff; border-color: rgba(255,255,255,.6); }
  .edu-btn--outline-white:hover { background: rgba(255,255,255,.12); border-color: #fff; }
  .edu-btn--white         { background: #fff; color: var(--indigo); border-color: #fff; }
  .edu-btn--white:hover   { background: #f0f4ff; }
  .edu-btn--lg   { padding: .85rem 1.9rem; font-size: 1rem; }
  .edu-btn--full { width: 100%; }

  /* ─────────────────────────────────────────────
     NAVBAR — scroll effect via animation-timeline
     Mobile menu — pure CSS checkbox trick
  ───────────────────────────────────────────── */
  .edu-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
    background: rgba(248,250,252,.88);
    backdrop-filter: blur(14px);
    border-bottom: 1px solid transparent;
    transition: background .3s, border-color .3s, box-shadow .3s;
  }
  /* Scroll-driven navbar shadow — no JS, no useState */
  @supports (animation-timeline: scroll()) {
    .edu-nav {
      animation: navScroll linear both;
      animation-timeline: scroll();
      animation-range: 0px 80px;
    }
    @keyframes navScroll {
      from { background: rgba(248,250,252,.5); }
      to   { background: rgba(255,255,255,.97); border-color: #e2e8f0; box-shadow: 0 1px 8px rgba(0,0,0,.07); }
    }
  }

  .edu-nav__inner {
    display: flex; align-items: center; gap: 2rem; height: 64px;
  }
  .edu-nav__links {
    display: flex; gap: 1.75rem; flex: 1;
  }
  .edu-nav__link {
    font-size: .9rem; font-weight: 500; color: var(--slate-600);
    text-decoration: none; transition: color .2s;
  }
  .edu-nav__link:hover { color: var(--indigo); }
  .edu-nav__actions { display: flex; gap: .75rem; }

  /* Hidden checkbox for mobile menu — no useState */
  .edu-menu-checkbox { display: none; }
  .edu-hamburger {
    display: none; cursor: pointer; color: var(--slate-800);
    background: none; border: none; padding: .25rem; margin-left: auto;
  }

  /* Mobile drawer — hidden by default, shown when checkbox is checked */
  .edu-mobile-drawer {
    display: none;
    flex-direction: column; gap: .4rem;
    padding: .75rem 1.25rem 1.25rem;
    background: #fff;
    border-top: 1px solid var(--slate-200);
    box-shadow: 0 8px 24px rgba(0,0,0,.08);
  }
  .edu-mobile-link {
    padding: .75rem 1rem; border-radius: 8px;
    color: var(--slate-800); font-weight: 500;
    text-decoration: none; transition: background .2s;
  }
  .edu-mobile-link:hover { background: var(--indigo-light); color: var(--indigo); }
  .edu-mobile-actions { display: flex; flex-direction: column; gap: .5rem; margin-top: .5rem; }

  /* When checkbox is checked → show drawer */
  .edu-menu-checkbox:checked ~ .edu-mobile-drawer { display: flex; }

  /* ── Hero ── */
  .edu-hero {
    position: relative; overflow: hidden;
    padding: 9rem 0 5rem; text-align: center;
    background: linear-gradient(155deg, #eef2ff 0%, #f8fafc 60%);
    min-height: 100vh; display: flex; align-items: center; justify-content: center;
  }
  .edu-blob {
    position: absolute; border-radius: 50%;
    pointer-events: none; filter: blur(80px); opacity: .45;
  }
  .edu-blob--1 {
    width: 460px; height: 460px;
    background: radial-gradient(circle, #c7d2fe, #a5b4fc);
    top: -80px; right: -80px;
    animation: blobFloat 9s ease-in-out infinite;
  }
  .edu-blob--2 {
    width: 340px; height: 340px;
    background: radial-gradient(circle, #bfdbfe, #93c5fd);
    bottom: -60px; left: -60px;
    animation: blobFloat 11s ease-in-out infinite reverse;
  }
  @keyframes blobFloat {
    0%,100% { transform: translate(0,0) scale(1); }
    50%      { transform: translate(20px,-20px) scale(1.06); }
  }

  .edu-hero__body {
    position: relative; z-index: 1;
    max-width: 740px; margin: 0 auto;
  }
  .edu-hero__badge {
    display: inline-flex; align-items: center; gap: .4rem;
    background: var(--indigo-light); color: var(--indigo);
    padding: .32rem 1rem; border-radius: 50px;
    font-size: .8rem; font-weight: 700; margin-bottom: 1.5rem;
    animation: fadeUp .6s ease both;
  }
  .edu-hero__title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2.4rem, 6vw, 4rem);
    font-weight: 800; line-height: 1.18;
    color: var(--slate-800); margin-bottom: 1.25rem;
    animation: fadeUp .7s .1s ease both;
  }
  .edu-hero__sub {
    font-size: clamp(.95rem, 2.2vw, 1.1rem);
    color: var(--slate-600); line-height: 1.75;
    max-width: 560px; margin: 0 auto 2rem;
    animation: fadeUp .7s .2s ease both;
  }
  .edu-hero__cta {
    display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;
    margin-bottom: 3rem;
    animation: fadeUp .7s .3s ease both;
  }
  .edu-hero__stats {
    display: flex; justify-content: center; gap: 2.5rem; flex-wrap: wrap;
    animation: fadeUp .7s .4s ease both;
  }
  .edu-hero__stat      { text-align: center; }
  .edu-hero__stat-val  { display: block; font-size: 1.6rem; font-weight: 800; color: var(--indigo); }
  .edu-hero__stat-lbl  { font-size: .78rem; color: var(--slate-400); font-weight: 500; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Sections ── */
  .edu-section { padding: 5rem 0; }
  .edu-section--white { background: #fff; }
  .edu-section--slate { background: var(--slate-50); }

  /* Scroll-reveal via @keyframes + animation-timeline where supported, fallback opacity:1 */
  .edu-reveal {
    opacity: 0;
    transform: translateY(24px);
    animation: revealUp .55s ease both;
    animation-play-state: paused;
  }
  @supports (animation-timeline: view()) {
    .edu-reveal {
      animation-timeline: view();
      animation-range: entry 0% entry 35%;
      animation-play-state: running;
      animation-delay: var(--delay, 0ms);
    }
  }
  /* Fallback: just show everything if animation-timeline unsupported */
  @supports not (animation-timeline: view()) {
    .edu-reveal { opacity: 1; transform: none; }
  }
  @keyframes revealUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Section Header ── */
  .edu-section-header { text-align: center; margin-bottom: 3rem; }
  .edu-section-header__label {
    display: inline-block;
    background: var(--indigo-light); color: var(--indigo);
    padding: .28rem .9rem; border-radius: 50px;
    font-size: .76rem; font-weight: 700;
    text-transform: uppercase; letter-spacing: .07em; margin-bottom: .85rem;
  }
  .edu-section-header__title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.7rem, 4vw, 2.4rem);
    font-weight: 800; color: var(--slate-800); line-height: 1.2; margin-bottom: .7rem;
  }
  .edu-section-header__sub { color: var(--slate-600); font-size: .97rem; max-width: 580px; margin: 0 auto; }

  /* ── Grids ── */
  .edu-grid      { display: grid; gap: 1.25rem; }
  .edu-grid--2   { grid-template-columns: repeat(2, 1fr); }
  .edu-grid--3   { grid-template-columns: repeat(3, 1fr); }
  .edu-grid--4   { grid-template-columns: repeat(4, 1fr); }

  /* ── Feature Cards ── */
  .edu-feature-card {
    background: var(--slate-50); border: 1px solid var(--slate-200);
    border-radius: var(--radius); padding: 1.6rem;
    transition: border-color .2s, box-shadow .2s, transform .2s;
  }
  .edu-feature-card:hover { border-color: var(--indigo); box-shadow: 0 4px 20px rgba(99,102,241,.12); transform: translateY(-3px); }
  .edu-feature-card__icon {
    width: 38px; height: 38px; border-radius: 10px;
    background: var(--indigo-light); color: var(--indigo);
    display: flex; align-items: center; justify-content: center; margin-bottom: .9rem;
  }
  .edu-feature-card__title { font-size: .97rem; font-weight: 700; color: var(--slate-800); margin-bottom: .4rem; }
  .edu-feature-card__desc  { font-size: .86rem; color: var(--slate-600); line-height: 1.65; }

  /* ── Indigo Strip ── */
  .edu-strip { padding: 2.75rem 0; background: linear-gradient(135deg, #6366f1, #818cf8); }
  .edu-strip__card  { text-align: center; padding: 1rem; color: #fff; }
  .edu-strip__icon  {
    width: 44px; height: 44px; border-radius: 12px;
    background: rgba(255,255,255,.18); display: flex; align-items: center;
    justify-content: center; margin: 0 auto .7rem;
  }
  .edu-strip__title { font-size: .92rem; font-weight: 700; margin-bottom: .3rem; }
  .edu-strip__desc  { font-size: .8rem; opacity: .8; line-height: 1.5; }

  /* ── Benefit Cards ── */
  .edu-benefit-card {
    background: #fff; border: 1px solid var(--slate-200);
    border-radius: var(--radius); padding: 1.6rem;
    transition: box-shadow .2s, transform .2s;
  }
  .edu-benefit-card:hover { box-shadow: 0 8px 28px rgba(0,0,0,.09); transform: translateY(-3px); }
  .edu-benefit-card__icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: .9rem; }
  .edu-benefit-card__title { font-size: .97rem; font-weight: 700; color: var(--slate-800); margin-bottom: .4rem; }
  .edu-benefit-card__desc  { font-size: .86rem; color: var(--slate-600); line-height: 1.65; }

  /* ── Testimonials ── */
  .edu-testimonial {
    background: #fff; border: 1px solid var(--slate-200);
    border-radius: var(--radius); padding: 1.75rem;
    transition: box-shadow .2s, transform .2s;
  }
  .edu-testimonial:hover { box-shadow: 0 8px 28px rgba(0,0,0,.09); transform: translateY(-2px); }
  .edu-testimonial__stars  { color: #f59e0b; margin-bottom: .7rem; }
  .edu-testimonial__text   { color: var(--slate-600); line-height: 1.75; margin-bottom: 1.4rem; font-style: italic; font-size: .92rem; }
  .edu-testimonial__author { display: flex; align-items: center; gap: .9rem; }
  .edu-testimonial__avatar { width: 42px; height: 42px; border-radius: 50%; background: var(--indigo-light); display: flex; align-items: center; justify-content: center; font-size: 1.25rem; }
  .edu-testimonial__name   { font-size: .9rem; font-weight: 700; color: var(--slate-800); }
  .edu-testimonial__meta   { font-size: .78rem; color: var(--slate-400); }

  /* ── Audience ── */
  .edu-audience-card {
    background: #fff; border: 1px solid var(--slate-200);
    border-radius: var(--radius); padding: 1.4rem;
    transition: box-shadow .2s, transform .2s;
  }
  .edu-audience-card:hover { box-shadow: 0 6px 20px rgba(0,0,0,.08); transform: translateY(-2px); }
  .edu-audience-card__icon  { width: 42px; height: 42px; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: .9rem; }
  .edu-audience-card__title { font-size: .93rem; font-weight: 700; color: var(--slate-800); margin-bottom: .7rem; }
  .edu-audience-card__list  { list-style: none; display: flex; flex-direction: column; gap: .45rem; }
  .edu-audience-card__list li { display: flex; align-items: flex-start; gap: .4rem; font-size: .81rem; color: var(--slate-600); line-height: 1.5; }

  /* ── Pricing ── */
  .edu-pricing-card {
    background: #fff; border: 1.5px solid var(--slate-200);
    border-radius: var(--radius); padding: 2rem; position: relative;
    transition: box-shadow .2s, transform .2s;
  }
  .edu-pricing-card:hover { box-shadow: 0 8px 28px rgba(0,0,0,.09); transform: translateY(-3px); }
  .edu-pricing-card--popular { border-color: var(--indigo); box-shadow: 0 0 0 3px rgba(99,102,241,.1); }
  .edu-pricing-card__badge {
    position: absolute; top: -12px; left: 50%; transform: translateX(-50%);
    background: var(--indigo); color: #fff;
    padding: .28rem 1rem; border-radius: 50px;
    font-size: .73rem; font-weight: 700; white-space: nowrap;
    text-transform: uppercase; letter-spacing: .05em;
  }
  .edu-pricing-card__title    { font-size: 1.05rem; font-weight: 700; color: var(--slate-800); margin-bottom: .45rem; }
  .edu-pricing-card__price    { margin-bottom: 1.2rem; }
  .edu-pricing-card__amount   { font-size: 2.1rem; font-weight: 800; color: var(--indigo); }
  .edu-pricing-card__period   { font-size: .85rem; color: var(--slate-400); }
  .edu-pricing-card__features { list-style: none; margin-bottom: 1.5rem; display: flex; flex-direction: column; gap: .5rem; }
  .edu-pricing-card__features li { display: flex; align-items: center; gap: .4rem; font-size: .86rem; color: var(--slate-600); }

  /* ── FAQ — native details/summary, zero JS ── */
  .edu-faq { max-width: 700px; margin: 0 auto; display: flex; flex-direction: column; gap: .65rem; }
  .edu-faq__item {
    background: #fff; border: 1px solid var(--slate-200);
    border-radius: var(--radius); overflow: hidden;
    transition: border-color .2s;
    cursor: pointer;
  }
  .edu-faq__item[open] { border-color: var(--indigo); }
  .edu-faq__question {
    display: flex; justify-content: space-between; align-items: center;
    padding: 1.1rem 1.4rem;
    font-weight: 600; font-size: .93rem; color: var(--slate-800);
    list-style: none; user-select: none;
  }
  .edu-faq__question::-webkit-details-marker { display: none; }
  /* CSS-only chevron via ::after */
  .edu-faq__question::after {
    content: '›';
    font-size: 1.2rem; color: var(--slate-400);
    transition: transform .25s, color .25s;
    transform: rotate(90deg);
  }
  .edu-faq__item[open] .edu-faq__question::after { transform: rotate(270deg); color: var(--indigo); }
  .edu-faq__answer { padding: 0 1.4rem 1.1rem; font-size: .88rem; color: var(--slate-600); line-height: 1.7; }

  /* ── CTA section ── */
  .edu-cta-section { background: linear-gradient(135deg, #6366f1, #818cf8); padding: 5rem 0; text-align: center; color: #fff; }
  .edu-cta-section__inner  { max-width: 680px; margin: 0 auto; }
  .edu-cta-section__title  { font-family: 'Playfair Display', serif; font-size: clamp(1.7rem,4vw,2.4rem); font-weight: 800; margin-bottom: .7rem; }
  .edu-cta-section__sub    { opacity: .85; font-size: .97rem; margin-bottom: 2rem; }
  .edu-cta-section__perks  { display: flex; gap: 1.5rem; justify-content: center; flex-wrap: wrap; margin-top: 1.5rem; font-size: .82rem; opacity: .85; font-weight: 600; }

  /* ── Footer ── */
  .edu-footer { background: var(--slate-800); padding: 3.5rem 0 0; color: var(--slate-400); }
  .edu-footer__tagline  { font-size: .83rem; margin-top: .5rem; line-height: 1.6; max-width: 200px; }
  .edu-footer__grid     { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 2.5rem; margin-bottom: 2.5rem; }
  .edu-footer__group    { display: flex; flex-direction: column; gap: .55rem; }
  .edu-footer__group strong { color: #fff; font-size: .88rem; margin-bottom: .2rem; }
  .edu-footer__group a  { color: var(--slate-400); text-decoration: none; font-size: .83rem; transition: color .2s; }
  .edu-footer__group a:hover { color: #fff; }
  .edu-footer__bottom   { border-top: 1px solid rgba(255,255,255,.08); padding: 1.2rem 0; font-size: .8rem; }

  /* ── Responsive ── */
  @media (max-width: 1024px) {
    .edu-grid--4 { grid-template-columns: repeat(2, 1fr); }
    .edu-grid--3 { grid-template-columns: repeat(2, 1fr); }
    .edu-footer__grid { grid-template-columns: 1fr 1fr; }
  }

  @media (max-width: 768px) {
    /* Hide desktop nav, show hamburger */
    .edu-nav__links, .edu-nav__actions { display: none; }
    .edu-hamburger { display: flex; }

    .edu-grid--2,
    .edu-grid--3,
    .edu-grid--4 { grid-template-columns: 1fr; }

    .edu-hero { padding: 7rem 0 4rem; min-height: auto; }
    .edu-hero__stats { gap: 1.25rem; }

    .edu-strip .edu-grid--4 { grid-template-columns: repeat(2, 1fr); }
    .edu-footer__grid { grid-template-columns: 1fr 1fr; }
    .edu-cta-section__perks { flex-direction: column; align-items: center; gap: .5rem; }
  }

  @media (max-width: 480px) {
    .edu-footer__grid { grid-template-columns: 1fr; }
    .edu-strip .edu-grid--4 { grid-template-columns: 1fr; }
    .edu-hero__cta { flex-direction: column; align-items: stretch; }
    .edu-hero__cta .edu-btn { justify-content: center; }
    .edu-hero__stats { gap: 1rem; }
    .edu-hero__stat-val { font-size: 1.3rem; }
  }
`