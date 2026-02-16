/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCreateAccount = () => {
    navigate({ to: "/auth/signup" });
  };

  const handleLogin = () => {
    navigate({ to: "/auth/login" });
  };

  return (
    <div style={styles.homepage}>
      {/* Animated Background Elements */}
      <div style={styles.animatedBg}></div>
      <div style={styles.gridOverlay}></div>
      
      {/* Floating Particles */}
      <div style={{ ...styles.particle, top: "20%", left: "10%", animationDelay: "0s" }}></div>
      <div style={{ ...styles.particle, top: "60%", left: "80%", animationDelay: "2s" }}></div>
      <div style={{ ...styles.particle, top: "40%", left: "60%", animationDelay: "4s" }}></div>
      <div style={{ ...styles.particle, top: "80%", left: "20%", animationDelay: "1s" }}></div>

      {/* Navigation Bar */}
      <nav style={{
        ...styles.navbar,
        background: scrollY > 50 ? "rgba(10, 10, 15, 0.95)" : "rgba(10, 10, 15, 0.8)",
        boxShadow: scrollY > 50 ? "0 10px 40px rgba(0, 0, 0, 0.5)" : "none",
      }}>
        <div style={styles.container}>
          <div style={styles.navContent}>
            <div style={styles.logo}>EDUFLOW</div>
            <div style={styles.navLinks}>
              <a href="#features" style={styles.navLink}>Features</a>
              <a href="#benefits" style={styles.navLink}>Benefits</a>
              <a href="#pricing" style={styles.navLink}>Pricing</a>
              <button
                style={styles.navButton}
                onClick={handleLogin}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#00d9ff";
                  e.currentTarget.style.color = "#0a0a0f";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#00d9ff";
                }}
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.container}>
          <div style={styles.heroContent}>
            <h1 style={styles.mainTitle}>
              Transform Your Future with <span style={styles.gradientText}>Next-Gen Learning</span>
            </h1>
            <p style={styles.subtitle}>
              Experience the most advanced Learning Management System designed for modern education. 
              Master new skills, advance your career, and achieve your dreams through our cutting-edge platform.
            </p>

            <div style={styles.ctaButtons}>
              <button
                style={{ ...styles.btn, ...styles.btnPrimary }}
                onClick={handleCreateAccount}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px) scale(1.05)";
                  e.currentTarget.style.boxShadow = "0 20px 60px rgba(0, 217, 255, 0.6)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.boxShadow = "0 10px 40px rgba(0, 217, 255, 0.3)";
                }}
              >
                🎓 Start Learning Free
              </button>
              <button
                style={{ ...styles.btn, ...styles.btnSecondary }}
                onClick={handleLogin}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(0, 217, 255, 0.1)";
                  e.currentTarget.style.transform = "translateY(-3px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                🔐 Login to Continue
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* What is LMS Section */}
      <section style={styles.section} id="about">
        <div style={styles.container}>
          <h2 style={styles.sectionTitle}>What is a Learning Management System?</h2>
          <p style={styles.sectionDescription}>
            A Learning Management System (LMS) is a comprehensive digital platform that revolutionizes 
            the way we learn and teach. It's your complete educational ecosystem that brings together 
            students, instructors, content, and technology in one seamless experience.
          </p>
          <p style={styles.sectionDescription}>
            Imagine having access to world-class education at your fingertips, available 24/7, 
            personalized to your learning style, and tracked to ensure your success. That's the power 
            of a modern LMS like EduFlow.
          </p>
          
          <div style={styles.highlightBox}>
            <h4 style={styles.highlightTitle}>💡 Did You Know?</h4>
            <p style={styles.highlightText}>
              Companies using LMS platforms see an average of 42% increase in employee productivity 
              and a 50% reduction in training costs. The global e-learning market is projected to 
              reach $375 billion by 2026.
            </p>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section style={{ ...styles.section, ...styles.featuresSection }} id="features">
        <div style={styles.container}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Powerful Features That Drive Success</h2>
            <p style={styles.sectionSubtitle}>
              Everything you need to create, deliver, and manage exceptional learning experiences
            </p>
          </div>

          <div style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Learning Section */}
      <section style={styles.interactiveSection}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitle}>Experience Interactive Learning</h2>
          <p style={styles.sectionSubtitle}>
            Engage with content in ways that make learning stick
          </p>

          <div style={styles.interactiveGrid}>
            {interactiveLearning.map((item, index) => (
              <InteractiveCard key={index} {...item} />
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section style={styles.section} id="benefits">
        <div style={styles.container}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Why Choose EduFlow LMS?</h2>
            <p style={styles.sectionSubtitle}>
              Join the learning revolution and experience education reimagined
            </p>
          </div>

          <div style={styles.benefitsGrid}>
            {benefits.map((benefit, index) => (
              <BenefitCard key={index} {...benefit} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section style={styles.section} id="testimonials">
        <div style={styles.container}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>What Our Learners Say</h2>
            <p style={styles.sectionSubtitle}>
              Real stories from real students who transformed their careers
            </p>
          </div>

          <div style={styles.testimonialsGrid}>
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* Learning Paths Section */}
      <section style={{ ...styles.section, ...styles.pathsSection }}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitle}>Choose Your Learning Path</h2>
          <p style={styles.sectionSubtitle}>
            Tailored learning journeys for every goal
          </p>

          <div style={styles.pathsGrid}>
            {learningPaths.map((path, index) => (
              <PathCard key={index} {...path} />
            ))}
          </div>
        </div>
      </section>

      {/* Who Benefits Section */}
      <section style={styles.section}>
        <div style={styles.container}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Built for Everyone</h2>
            <p style={styles.sectionSubtitle}>
              Whether you're a student, professional, or organization—we've got you covered
            </p>
          </div>

          <div style={styles.audienceGrid}>
            {audiences.map((audience, index) => (
              <AudienceCard key={index} {...audience} />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section style={styles.pricingSection} id="pricing">
        <div style={styles.container}>
          <h2 style={styles.sectionTitle}>Simple, Transparent Pricing</h2>
          <p style={styles.sectionSubtitle}>
            Start free, upgrade when you're ready
          </p>

          <div style={styles.pricingGrid}>
            {pricingPlans.map((plan, index) => (
              <PricingCard key={index} {...plan} onCTA={plan.isPopular ? handleCreateAccount : handleLogin} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section style={{ ...styles.section, ...styles.faqSection }}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitle}>Frequently Asked Questions</h2>
          <div style={styles.faqGrid}>
            {faqs.map((faq, index) => (
              <FAQItem key={index} {...faq} />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section style={styles.ctaSection}>
        <div style={styles.container}>
          <div style={styles.ctaContent}>
            <h2 style={styles.ctaTitle}>Ready to Transform Your Learning Journey?</h2>
            <p style={styles.ctaDescription}>
              Join thousands of learners who are already advancing their skills and careers with EduFlow. 
              Start your free account today—no credit card required.
            </p>

            <div style={styles.ctaButtons}>
              <button
                style={{ ...styles.btn, ...styles.btnPrimary, ...styles.btnLarge }}
                onClick={handleCreateAccount}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px) scale(1.05)";
                  e.currentTarget.style.boxShadow = "0 20px 60px rgba(0, 217, 255, 0.6)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.boxShadow = "0 10px 40px rgba(0, 217, 255, 0.3)";
                }}
              >
                🚀 Create Free Account
              </button>
              <button
                style={{ ...styles.btn, ...styles.btnSecondary, ...styles.btnLarge }}
                onClick={handleLogin}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(0, 217, 255, 0.1)";
                  e.currentTarget.style.transform = "translateY(-3px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                🔐 Login to Enroll
              </button>
            </div>

            <div style={styles.ctaFeatures}>
              <span style={styles.ctaFeature}>✓ Free forever plan</span>
              <span style={styles.ctaFeature}>✓ No credit card needed</span>
              <span style={styles.ctaFeature}>✓ Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.container}>
          <div style={styles.footerContent}>
            <div style={styles.footerSection}>
              <h3 style={styles.footerLogo}>EDUFLOW</h3>
              <p style={styles.footerDescription}>
                Empowering learners worldwide with cutting-edge education technology.
              </p>
            </div>

            <div style={styles.footerSection}>
              <h4 style={styles.footerTitle}>Product</h4>
              <a href="#features" style={styles.footerLink}>Features</a>
              <a href="#benefits" style={styles.footerLink}>Benefits</a>
              <a href="#pricing" style={styles.footerLink}>Pricing</a>
            </div>

            <div style={styles.footerSection}>
              <h4 style={styles.footerTitle}>Company</h4>
              <a href="#" style={styles.footerLink}>About Us</a>
              <a href="#" style={styles.footerLink}>Contact</a>
              <a href="#" style={styles.footerLink}>Careers</a>
            </div>

            <div style={styles.footerSection}>
              <h4 style={styles.footerTitle}>Legal</h4>
              <a href="#" style={styles.footerLink}>Privacy Policy</a>
              <a href="#" style={styles.footerLink}>Terms of Service</a>
            </div>
          </div>

          <div style={styles.footerBottom}>
            <p>&copy; 2026 EduFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Keyframes Animation */}
      <style>{keyframes}</style>
    </div>
  );
}

// Feature Card Component
function FeatureCard({ number, title, description, icon, index }: any) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        ...styles.featureItem,
        transform: isHovered ? "translateY(-10px)" : "translateY(0)",
        boxShadow: isHovered
          ? "0 20px 60px rgba(0, 217, 255, 0.3)"
          : "0 10px 40px rgba(0, 0, 0, 0.3)",
        animationDelay: `${index * 0.1}s`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={styles.featureIcon}>{icon}</div>
      <div style={styles.featureNumber}>{number}</div>
      <h3 style={styles.featureTitle}>{title}</h3>
      <p style={styles.featureDescription}>{description}</p>
    </div>
  );
}

// Interactive Card Component
function InteractiveCard({ icon, title, description }: any) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        ...styles.interactiveCard,
        transform: isHovered ? "scale(1.05)" : "scale(1)",
        borderColor: isHovered ? "#00d9ff" : "rgba(0, 217, 255, 0.2)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={styles.interactiveIcon}>{icon}</div>
      <h3 style={styles.interactiveTitle}>{title}</h3>
      <p style={styles.interactiveDescription}>{description}</p>
    </div>
  );
}

// Benefit Card Component
function BenefitCard({ icon, title, description, index }: any) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        ...styles.benefitCard,
        transform: isHovered ? "translateY(-8px) scale(1.02)" : "translateY(0) scale(1)",
        boxShadow: isHovered
          ? "0 20px 60px rgba(0, 217, 255, 0.4)"
          : "0 10px 40px rgba(0, 217, 255, 0.2)",
        animationDelay: `${index * 0.15}s`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={styles.benefitIcon}>{icon}</div>
      <h3 style={styles.benefitTitle}>{title}</h3>
      <p style={styles.benefitDescription}>{description}</p>
    </div>
  );
}

// Testimonial Card Component
function TestimonialCard({ name, role, company, testimonial, rating, image }: any) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        ...styles.testimonialCard,
        transform: isHovered ? "translateY(-5px)" : "translateY(0)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={styles.testimonialRating}>
        {"⭐".repeat(rating)}
      </div>
      <p style={styles.testimonialText}>"{testimonial}"</p>
      <div style={styles.testimonialAuthor}>
        <div style={styles.testimonialAvatar}>{image}</div>
        <div>
          <div style={styles.testimonialName}>{name}</div>
          <div style={styles.testimonialRole}>{role} at {company}</div>
        </div>
      </div>
    </div>
  );
}

// Learning Path Card Component
function PathCard({ icon, title, description, courses, duration }: any) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        ...styles.pathCard,
        transform: isHovered ? "translateY(-8px)" : "translateY(0)",
        borderColor: isHovered ? "#00d9ff" : "rgba(0, 217, 255, 0.2)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={styles.pathIcon}>{icon}</div>
      <h3 style={styles.pathTitle}>{title}</h3>
      <p style={styles.pathDescription}>{description}</p>
      <div style={styles.pathMeta}>
        <span style={styles.pathMetaItem}>📚 {courses} courses</span>
        <span style={styles.pathMetaItem}>⏱️ {duration}</span>
      </div>
    </div>
  );
}

// Audience Card Component
function AudienceCard({ icon, title, items, color }: any) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        ...styles.audienceCard,
        transform: isHovered ? "translateY(-8px)" : "translateY(0)",
        boxShadow: isHovered
          ? "0 20px 60px rgba(0, 0, 0, 0.5)"
          : "0 10px 40px rgba(0, 0, 0, 0.3)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{ ...styles.audienceIcon, background: color }}>{icon}</div>
      <h3 style={styles.audienceTitle}>{title}</h3>
      <ul style={styles.audienceList}>
        {items.map((item: string, index: number) => (
          <li key={index} style={styles.audienceListItem}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

// Pricing Card Component
function PricingCard({ title, price, period, features, isPopular, onCTA }: any) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        ...styles.pricingCard,
        ...(isPopular ? styles.pricingCardPopular : {}),
        transform: isHovered ? "translateY(-10px) scale(1.02)" : "translateY(0)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isPopular && <div style={styles.popularBadge}>Most Popular</div>}
      <h3 style={styles.pricingTitle}>{title}</h3>
      <div style={styles.pricingPrice}>
        <span style={styles.pricingAmount}>{price}</span>
        {period && <span style={styles.pricingPeriod}>/{period}</span>}
      </div>
      <ul style={styles.pricingFeatures}>
        {features.map((feature: string, index: number) => (
          <li key={index} style={styles.pricingFeature}>
            ✓ {feature}
          </li>
        ))}
      </ul>
      <button
        style={{
          ...styles.pricingButton,
          ...(isPopular ? styles.pricingButtonPopular : {}),
        }}
        onClick={onCTA}
        onMouseEnter={(e) => {
          if (isPopular) {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.boxShadow = "0 10px 30px rgba(0, 217, 255, 0.5)";
          }
        }}
        onMouseLeave={(e) => {
          if (isPopular) {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 5px 20px rgba(0, 217, 255, 0.3)";
          }
        }}
      >
        {isPopular ? "Get Started" : "Learn More"}
      </button>
    </div>
  );
}

// FAQ Item Component
function FAQItem({ question, answer }: any) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      style={{
        ...styles.faqItem,
        borderColor: isOpen ? "#00d9ff" : "rgba(0, 217, 255, 0.2)",
      }}
      onClick={() => setIsOpen(!isOpen)}
    >
      <div style={styles.faqQuestion}>
        <span>{question}</span>
        <span style={{
          ...styles.faqIcon,
          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
        }}>▼</span>
      </div>
      {isOpen && (
        <div style={styles.faqAnswer}>{answer}</div>
      )}
    </div>
  );
}

// Data Arrays
const features = [
  {
    number: "01",
    icon: "📚",
    title: "Course Management",
    description: "Create, organize, and deliver structured learning content with our intuitive course builder.",
  },
  {
    number: "02",
    icon: "👥",
    title: "User Management",
    description: "Manage students, instructors, and administrators with role-based access control.",
  },
  {
    number: "03",
    icon: "📊",
    title: "Progress Tracking",
    description: "Monitor learning progress with detailed analytics and comprehensive reports.",
  },
  {
    number: "04",
    icon: "✅",
    title: "Interactive Assessments",
    description: "Create engaging quizzes and tests with automated grading and instant feedback.",
  },
  {
    number: "05",
    icon: "💬",
    title: "Communication Hub",
    description: "Foster collaboration through discussion forums, live chat, and messaging.",
  },
  {
    number: "06",
    icon: "🏆",
    title: "Certifications",
    description: "Award digital certificates upon course completion with verifiable credentials.",
  },
];

const interactiveLearning = [
  {
    icon: "🎮",
    title: "Gamification",
    description: "Earn points, badges, and rewards as you progress through courses.",
  },
  {
    icon: "🧪",
    title: "Hands-On Labs",
    description: "Practice with real-world projects and interactive environments.",
  },
  {
    icon: "🎯",
    title: "Adaptive Learning",
    description: "AI adjusts difficulty based on your performance and pace.",
  },
  {
    icon: "👥",
    title: "Peer Learning",
    description: "Collaborate on projects and learn from peers worldwide.",
  },
];

const benefits = [
  {
    icon: "🌍",
    title: "Learn Anywhere, Anytime",
    description: "Access your courses 24/7 from any device. Study at your own pace, on your schedule.",
  },
  {
    icon: "📈",
    title: "Scalable & Flexible",
    description: "Whether training 10 or 10,000 learners, our platform scales with you effortlessly.",
  },
  {
    icon: "💰",
    title: "Cost-Effective",
    description: "Reduce training costs significantly while improving learning outcomes.",
  },
  {
    icon: "🎯",
    title: "Track Everything",
    description: "Comprehensive analytics give you insights into engagement and effectiveness.",
  },
  {
    icon: "🔒",
    title: "Secure & Reliable",
    description: "Bank-level encryption and compliance with international security standards.",
  },
  {
    icon: "⚡",
    title: "Quick Setup",
    description: "Get up and running in minutes with our intuitive interface and support.",
  },
];

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Data Scientist",
    company: "Tech Corp",
    rating: 5,
    image: "👩‍💼",
    testimonial: "EduFlow transformed my learning experience. The courses helped me land my dream job. The platform is intuitive and the content is excellent!",
  },
  {
    name: "Rahul Verma",
    role: "CEO",
    company: "StartupHub",
    rating: 5,
    image: "👨‍💼",
    testimonial: "We trained our entire team using EduFlow. The ROI is incredible and our productivity increased significantly. Highly recommended!",
  },
  {
    name: "Ananya Patel",
    role: "Student",
    company: "IIT Delhi",
    rating: 5,
    image: "👩‍🎓",
    testimonial: "The best learning platform I've used. The mobile app lets me learn anywhere, and I've completed multiple certifications already!",
  },
  {
    name: "Vikram Singh",
    role: "Manager",
    company: "InfoTech",
    rating: 5,
    image: "👨‍💻",
    testimonial: "As a working professional, EduFlow's flexibility is perfect. I can learn at my own pace and the certificates are recognized by employers.",
  },
];

const learningPaths = [
  {
    icon: "💻",
    title: "Full-Stack Development",
    description: "Master front-end and back-end development from scratch.",
    courses: 25,
    duration: "6 months",
  },
  {
    icon: "📊",
    title: "Data Science & AI",
    description: "Learn Python, machine learning, and build AI applications.",
    courses: 30,
    duration: "8 months",
  },
  {
    icon: "🎨",
    title: "UX/UI Design",
    description: "Design beautiful, user-centric interfaces and experiences.",
    courses: 18,
    duration: "4 months",
  },
  {
    icon: "📱",
    title: "Mobile Development",
    description: "Build native iOS and Android apps with modern frameworks.",
    courses: 22,
    duration: "5 months",
  },
];

const audiences = [
  {
    icon: "👨‍🎓",
    title: "Students & Learners",
    color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    items: [
      "Access thousands of courses across subjects",
      "Learn at your own pace with flexibility",
      "Earn recognized certificates",
      "Connect with global learners",
    ],
  },
  {
    icon: "👨‍🏫",
    title: "Educators & Trainers",
    color: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    items: [
      "Create and monetize courses easily",
      "Reach students worldwide",
      "Use advanced analytics",
      "Automate administrative tasks",
    ],
  },
  {
    icon: "🏢",
    title: "Organizations",
    color: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    items: [
      "Train employees at scale",
      "Reduce training costs significantly",
      "Ensure compliance tracking",
      "Measure training ROI",
    ],
  },
  {
    icon: "🎓",
    title: "Institutions",
    color: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    items: [
      "Offer hybrid programs",
      "Increase enrollment capacity",
      "Streamline administration",
      "Improve student outcomes",
    ],
  },
];

const pricingPlans = [
  {
    title: "Free",
    price: "₹0",
    period: "forever",
    isPopular: false,
    features: [
      "Access to 50+ free courses",
      "Basic progress tracking",
      "Community forum access",
      "Mobile app access",
      "Email support",
    ],
  },
  {
    title: "Pro",
    price: "₹2,499",
    period: "month",
    isPopular: true,
    features: [
      "Unlimited course access",
      "Advanced analytics",
      "Priority support 24/7",
      "Downloadable resources",
      "Custom learning paths",
      "All certificates included",
    ],
  },
  {
    title: "Enterprise",
    price: "Custom",
    period: null,
    isPopular: false,
    features: [
      "Everything in Pro",
      "Dedicated account manager",
      "Custom branding",
      "Advanced security",
      "Custom integrations",
      "SLA guarantee",
    ],
  },
];

const faqs = [
  {
    question: "How do I get started with EduFlow?",
    answer: "Simply click the 'Create Free Account' button, fill in your details, and you'll have instant access. No credit card required!",
  },
  {
    question: "Can I try premium features before upgrading?",
    answer: "Yes! We offer a 14-day free trial of our Pro plan. Explore all features risk-free and cancel anytime.",
  },
  {
    question: "Are the certificates recognized by employers?",
    answer: "Absolutely! Our certificates are verified and recognized by employers. Each includes a unique verification code.",
  },
  {
    question: "Can I access courses offline?",
    answer: "Yes, with our mobile app, you can download courses and learn offline. Perfect for learning on the go!",
  },
  {
    question: "What support options are available?",
    answer: "We offer 24/7 support via chat and email. Pro users get priority support with faster response times.",
  },
  {
    question: "Do you offer refunds?",
    answer: "Yes, we offer a 30-day money-back guarantee on all paid plans. If you're not satisfied, we'll refund you in full.",
  },
];

// Comprehensive Styles Object
const styles: any = {
  homepage: {
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
    lineHeight: 1.6,
    color: "#ffffff",
    backgroundColor: "#0a0a0f",
    position: "relative",
    overflow: "hidden",
  },
  animatedBg: {
    position: "fixed",
    top: "-50%",
    left: "-50%",
    width: "200%",
    height: "200%",
    background: "radial-gradient(circle at 20% 50%, rgba(0, 217, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(123, 47, 247, 0.1) 0%, transparent 50%), radial-gradient(circle at 40% 20%, rgba(255, 0, 110, 0.08) 0%, transparent 50%)",
    animation: "bgRotate 20s linear infinite",
    zIndex: 0,
    pointerEvents: "none",
  },
  gridOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundImage: "linear-gradient(rgba(0, 217, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 217, 255, 0.03) 1px, transparent 1px)",
    backgroundSize: "50px 50px",
    animation: "gridMove 20s linear infinite",
    zIndex: 0,
    pointerEvents: "none",
  },
  particle: {
    position: "fixed",
    width: "4px",
    height: "4px",
    background: "#00d9ff",
    borderRadius: "50%",
    opacity: 0.6,
    animation: "float 15s ease-in-out infinite",
    zIndex: 0,
    pointerEvents: "none",
  },
  navbar: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    padding: "1.5rem 0",
    zIndex: 1000,
    backdropFilter: "blur(20px)",
    borderBottom: "1px solid rgba(0, 217, 255, 0.1)",
    transition: "all 0.3s ease",
  },
  navContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    fontSize: "1.8rem",
    fontWeight: 900,
    background: "linear-gradient(135deg, #00d9ff, #7b2ff7)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    letterSpacing: "0.05em",
    cursor: "pointer",
  },
  navLinks: {
    display: "flex",
    gap: "2.5rem",
    alignItems: "center",
  },
  navLink: {
    color: "#b0b0c8",
    textDecoration: "none",
    fontSize: "0.95rem",
    fontWeight: 500,
    transition: "color 0.3s ease",
    cursor: "pointer",
  },
  navButton: {
    padding: "0.7rem 2rem",
    background: "transparent",
    border: "2px solid #00d9ff",
    color: "#00d9ff",
    borderRadius: "50px",
    fontSize: "0.9rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.3s ease",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 2rem",
    position: "relative",
    zIndex: 1,
  },
  hero: {
    padding: "10rem 0 6rem",
    position: "relative",
    zIndex: 1,
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    textAlign: "center",
  },
  heroContent: {
    maxWidth: "900px",
    margin: "0 auto",
  },
  mainTitle: {
    fontSize: "4rem",
    fontWeight: 900,
    marginBottom: "1.5rem",
    lineHeight: 1.2,
    animation: "fadeInUp 0.8s ease-out 0.2s both",
  },
  gradientText: {
    background: "linear-gradient(135deg, #00d9ff, #7b2ff7)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  subtitle: {
    fontSize: "1.25rem",
    lineHeight: 1.8,
    color: "#b0b0c8",
    marginBottom: "2.5rem",
    animation: "fadeInUp 0.8s ease-out 0.4s both",
  },
  ctaButtons: {
    display: "flex",
    gap: "1.5rem",
    justifyContent: "center",
    flexWrap: "wrap",
    marginBottom: "2rem",
    animation: "fadeInUp 0.8s ease-out 0.6s both",
  },
  btn: {
    padding: "1.2rem 3rem",
    fontSize: "1rem",
    fontWeight: 600,
    border: "none",
    borderRadius: "50px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  btnPrimary: {
    background: "linear-gradient(135deg, #00d9ff, #7b2ff7)",
    color: "#0a0a0f",
    boxShadow: "0 10px 40px rgba(0, 217, 255, 0.3)",
  },
  btnSecondary: {
    background: "transparent",
    color: "#00d9ff",
    border: "2px solid #00d9ff",
  },
  btnLarge: {
    padding: "1.3rem 3.5rem",
    fontSize: "1.1rem",
  },
  section: {
    padding: "6rem 0",
    position: "relative",
    zIndex: 1,
    backgroundColor: "#13131a",
  },
  featuresSection: {
    backgroundColor: "#0a0a0f",
  },
  pathsSection: {
    backgroundColor: "#0a0a0f",
  },
  faqSection: {
    backgroundColor: "#0a0a0f",
  },
  sectionHeader: {
    textAlign: "center",
    marginBottom: "4rem",
  },
  sectionTitle: {
    fontSize: "3rem",
    fontWeight: 900,
    marginBottom: "1rem",
    background: "linear-gradient(135deg, #ffffff, #00d9ff)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    textTransform: "uppercase",
    letterSpacing: "0.02em",
  },
  sectionSubtitle: {
    fontSize: "1.2rem",
    color: "#b0b0c8",
    maxWidth: "700px",
    margin: "0 auto",
  },
  sectionDescription: {
    fontSize: "1.15rem",
    lineHeight: 1.8,
    marginBottom: "1.5rem",
    color: "#b0b0c8",
    maxWidth: "900px",
    margin: "0 auto 1.5rem",
  },
  highlightBox: {
    background: "rgba(0, 217, 255, 0.05)",
    border: "1px solid rgba(0, 217, 255, 0.2)",
    borderRadius: "16px",
    padding: "2rem",
    marginTop: "2rem",
    maxWidth: "900px",
    margin: "2rem auto 0",
  },
  highlightTitle: {
    fontSize: "1.3rem",
    marginBottom: "1rem",
    color: "#00d9ff",
  },
  highlightText: {
    fontSize: "1rem",
    color: "#b0b0c8",
    lineHeight: 1.7,
  },
  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "2rem",
  },
  featureItem: {
    background: "rgba(26, 26, 36, 0.6)",
    backdropFilter: "blur(20px)",
    padding: "2.5rem",
    borderRadius: "24px",
    border: "1px solid rgba(0, 217, 255, 0.2)",
    transition: "all 0.4s ease",
    animation: "fadeInUp 0.6s ease-out both",
  },
  featureIcon: {
    fontSize: "3rem",
    marginBottom: "1.5rem",
  },
  featureNumber: {
    fontSize: "2.5rem",
    fontWeight: 900,
    background: "linear-gradient(135deg, #00d9ff, #7b2ff7)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    opacity: 0.3,
    marginBottom: "1rem",
  },
  featureTitle: {
    fontSize: "1.4rem",
    fontWeight: 700,
    marginBottom: "1rem",
    color: "#ffffff",
  },
  featureDescription: {
    fontSize: "1rem",
    lineHeight: 1.7,
    color: "#b0b0c8",
  },
  interactiveSection: {
    padding: "6rem 0",
    background: "rgba(13, 13, 26, 0.5)",
    position: "relative",
    zIndex: 1,
  },
  interactiveGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "2rem",
    marginTop: "3rem",
  },
  interactiveCard: {
    background: "rgba(26, 26, 36, 0.6)",
    backdropFilter: "blur(20px)",
    padding: "2rem",
    borderRadius: "20px",
    border: "2px solid rgba(0, 217, 255, 0.2)",
    textAlign: "center",
    transition: "all 0.3s ease",
    cursor: "pointer",
  },
  interactiveIcon: {
    fontSize: "3rem",
    marginBottom: "1rem",
  },
  interactiveTitle: {
    fontSize: "1.2rem",
    fontWeight: 700,
    marginBottom: "0.5rem",
    color: "#ffffff",
  },
  interactiveDescription: {
    fontSize: "0.95rem",
    color: "#b0b0c8",
    lineHeight: 1.6,
  },
  benefitsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "2rem",
    marginTop: "3rem",
  },
  benefitCard: {
    background: "rgba(26, 26, 36, 0.6)",
    backdropFilter: "blur(20px)",
    padding: "2.5rem",
    borderRadius: "24px",
    border: "1px solid rgba(0, 217, 255, 0.2)",
    transition: "all 0.4s ease",
    animation: "fadeInUp 0.6s ease-out both",
  },
  benefitIcon: {
    fontSize: "3rem",
    marginBottom: "1.5rem",
  },
  benefitTitle: {
    fontSize: "1.4rem",
    fontWeight: 700,
    marginBottom: "1rem",
    color: "#ffffff",
  },
  benefitDescription: {
    fontSize: "1rem",
    lineHeight: 1.7,
    color: "#b0b0c8",
  },
  testimonialsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "2rem",
    marginTop: "3rem",
  },
  testimonialCard: {
    background: "rgba(26, 26, 36, 0.6)",
    backdropFilter: "blur(20px)",
    padding: "2.5rem",
    borderRadius: "24px",
    border: "1px solid rgba(0, 217, 255, 0.2)",
    transition: "all 0.3s ease",
  },
  testimonialRating: {
    fontSize: "1.2rem",
    marginBottom: "1rem",
  },
  testimonialText: {
    fontSize: "1.1rem",
    lineHeight: 1.8,
    color: "#b0b0c8",
    marginBottom: "2rem",
    fontStyle: "italic",
  },
  testimonialAuthor: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  testimonialAvatar: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #00d9ff, #7b2ff7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.5rem",
  },
  testimonialName: {
    fontSize: "1.1rem",
    fontWeight: 700,
    color: "#ffffff",
  },
  testimonialRole: {
    fontSize: "0.95rem",
    color: "#b0b0c8",
  },
  pathsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "2rem",
    marginTop: "3rem",
  },
  pathCard: {
    background: "rgba(26, 26, 36, 0.6)",
    backdropFilter: "blur(20px)",
    padding: "2rem",
    borderRadius: "24px",
    border: "2px solid rgba(0, 217, 255, 0.2)",
    transition: "all 0.4s ease",
    cursor: "pointer",
  },
  pathIcon: {
    fontSize: "3rem",
    marginBottom: "1.5rem",
  },
  pathTitle: {
    fontSize: "1.3rem",
    fontWeight: 700,
    marginBottom: "1rem",
    color: "#ffffff",
  },
  pathDescription: {
    fontSize: "0.95rem",
    lineHeight: 1.6,
    color: "#b0b0c8",
    marginBottom: "1.5rem",
  },
  pathMeta: {
    display: "flex",
    gap: "1rem",
    flexWrap: "wrap",
  },
  pathMetaItem: {
    fontSize: "0.85rem",
    color: "#00d9ff",
  },
  audienceGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "2rem",
    marginTop: "3rem",
  },
  audienceCard: {
    background: "rgba(26, 26, 36, 0.6)",
    backdropFilter: "blur(20px)",
    padding: "2.5rem",
    borderRadius: "24px",
    border: "1px solid rgba(0, 217, 255, 0.2)",
    transition: "all 0.4s ease",
  },
  audienceIcon: {
    width: "60px",
    height: "60px",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "2rem",
    marginBottom: "1.5rem",
  },
  audienceTitle: {
    fontSize: "1.5rem",
    fontWeight: 700,
    marginBottom: "1.5rem",
    color: "#ffffff",
  },
  audienceList: {
    listStyle: "none",
    padding: 0,
  },
  audienceListItem: {
    fontSize: "1rem",
    lineHeight: 2,
    color: "#b0b0c8",
    paddingLeft: "1.5rem",
    position: "relative",
  },
  pricingSection: {
    padding: "6rem 0",
    background: "rgba(13, 13, 26, 0.5)",
    position: "relative",
    zIndex: 1,
  },
  pricingGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "2rem",
    marginTop: "3rem",
  },
  pricingCard: {
    background: "rgba(26, 26, 36, 0.6)",
    backdropFilter: "blur(20px)",
    padding: "3rem 2.5rem",
    borderRadius: "24px",
    border: "1px solid rgba(0, 217, 255, 0.2)",
    transition: "all 0.4s ease",
    position: "relative",
  },
  pricingCardPopular: {
    border: "2px solid #00d9ff",
    boxShadow: "0 20px 60px rgba(0, 217, 255, 0.3)",
  },
  popularBadge: {
    position: "absolute",
    top: "-15px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "linear-gradient(135deg, #00d9ff, #7b2ff7)",
    color: "#0a0a0f",
    padding: "0.5rem 1.5rem",
    borderRadius: "50px",
    fontSize: "0.85rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
  },
  pricingTitle: {
    fontSize: "1.8rem",
    fontWeight: 700,
    marginBottom: "1rem",
    color: "#ffffff",
  },
  pricingPrice: {
    marginBottom: "2rem",
  },
  pricingAmount: {
    fontSize: "3.5rem",
    fontWeight: 900,
    background: "linear-gradient(135deg, #00d9ff, #7b2ff7)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  pricingPeriod: {
    fontSize: "1.2rem",
    color: "#b0b0c8",
  },
  pricingFeatures: {
    listStyle: "none",
    padding: 0,
    marginBottom: "2rem",
  },
  pricingFeature: {
    fontSize: "1rem",
    color: "#b0b0c8",
    lineHeight: 2.5,
  },
  pricingButton: {
    width: "100%",
    padding: "1rem",
    background: "transparent",
    border: "2px solid #00d9ff",
    color: "#00d9ff",
    borderRadius: "50px",
    fontSize: "1rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.3s ease",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
  },
  pricingButtonPopular: {
    background: "linear-gradient(135deg, #00d9ff, #7b2ff7)",
    color: "#0a0a0f",
    border: "none",
    boxShadow: "0 5px 20px rgba(0, 217, 255, 0.3)",
  },
  faqGrid: {
    maxWidth: "800px",
    margin: "3rem auto 0",
  },
  faqItem: {
    background: "rgba(26, 26, 36, 0.6)",
    backdropFilter: "blur(20px)",
    padding: "2rem",
    borderRadius: "16px",
    border: "1px solid rgba(0, 217, 255, 0.2)",
    marginBottom: "1rem",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  faqQuestion: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "1.1rem",
    fontWeight: 600,
    color: "#ffffff",
  },
  faqIcon: {
    fontSize: "0.8rem",
    color: "#00d9ff",
    transition: "transform 0.3s ease",
  },
  faqAnswer: {
    marginTop: "1rem",
    fontSize: "1rem",
    lineHeight: 1.7,
    color: "#b0b0c8",
    animation: "fadeIn 0.3s ease-out",
  },
  ctaSection: {
    padding: "8rem 0",
    background: "linear-gradient(135deg, rgba(0, 217, 255, 0.1) 0%, rgba(123, 47, 247, 0.1) 100%)",
    borderTop: "1px solid rgba(0, 217, 255, 0.2)",
    borderBottom: "1px solid rgba(0, 217, 255, 0.2)",
    position: "relative",
    zIndex: 1,
    textAlign: "center",
  },
  ctaContent: {
    maxWidth: "900px",
    margin: "0 auto",
  },
  ctaTitle: {
    fontSize: "3rem",
    fontWeight: 900,
    marginBottom: "1.5rem",
    background: "linear-gradient(135deg, #ffffff, #00d9ff)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  ctaDescription: {
    fontSize: "1.2rem",
    color: "#b0b0c8",
    marginBottom: "3rem",
    lineHeight: 1.8,
  },
  ctaFeatures: {
    display: "flex",
    gap: "2rem",
    justifyContent: "center",
    flexWrap: "wrap",
    marginTop: "2rem",
  },
  ctaFeature: {
    color: "#00d9ff",
    fontSize: "0.95rem",
    fontWeight: 600,
  },
  footer: {
    padding: "4rem 0 2rem",
    background: "#0a0a0f",
    borderTop: "1px solid rgba(0, 217, 255, 0.1)",
    position: "relative",
    zIndex: 1,
  },
  footerContent: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr 1fr",
    gap: "3rem",
    marginBottom: "3rem",
  },
  footerSection: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  footerLogo: {
    fontSize: "1.5rem",
    fontWeight: 900,
    background: "linear-gradient(135deg, #00d9ff, #7b2ff7)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    marginBottom: "0.5rem",
  },
  footerDescription: {
    fontSize: "0.95rem",
    color: "#b0b0c8",
    lineHeight: 1.6,
  },
  footerTitle: {
    fontSize: "1.1rem",
    fontWeight: 700,
    color: "#ffffff",
    marginBottom: "0.5rem",
  },
  footerLink: {
    color: "#b0b0c8",
    textDecoration: "none",
    fontSize: "0.95rem",
    transition: "color 0.3s ease",
    cursor: "pointer",
  },
  footerBottom: {
    textAlign: "center",
    paddingTop: "2rem",
    borderTop: "1px solid rgba(0, 217, 255, 0.1)",
    color: "#b0b0c8",
    fontSize: "0.9rem",
  },
};

// Keyframes for animations
const keyframes = `
  @keyframes bgRotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes gridMove {
    0% { transform: translate(0, 0); }
    100% { transform: translate(50px, 50px); }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes float {
    0%, 100% {
      transform: translate(0, 0) scale(1);
      opacity: 0.6;
    }
    33% {
      transform: translate(100px, -100px) scale(1.5);
      opacity: 0.3;
    }
    66% {
      transform: translate(-80px, 80px) scale(0.8);
      opacity: 0.8;
    }
  }

  li::before {
    content: "✓";
    position: absolute;
    left: 0;
    color: #00d9ff;
    font-weight: bold;
  }

  @media (max-width: 1024px) {
    .featuresGrid, .benefitsGrid {
      grid-template-columns: repeat(2, 1fr) !important;
    }
    .testimonialsGrid, .audienceGrid, .pricingGrid {
      grid-template-columns: 1fr !important;
    }
    .pathsGrid, .interactiveGrid {
      grid-template-columns: repeat(2, 1fr) !important;
    }
    .footerContent {
      grid-template-columns: 1fr 1fr !important;
    }
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 2.5rem !important;
    }
    .featuresGrid, .benefitsGrid, .pathsGrid, .interactiveGrid {
      grid-template-columns: 1fr !important;
    }
    .footerContent {
      grid-template-columns: 1fr !important;
    }
    .navLinks {
      display: none !important;
    }
  }
`;