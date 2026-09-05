import { useEffect, useRef, useState } from "react";
import "./App.css";

const rotatingWords = [
  "research...",
  "build...",
  "teach...",
  "create...",
  "transform.",
];

function useCountUp(target: number, duration: number = 1600) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;

      const progress = Math.min(
        (timestamp - startTime) / duration,
        1
      );

      const easedProgress =
        1 - Math.pow(1 - progress, 3);

      setCount(Math.floor(easedProgress * target));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [hasStarted, target, duration]);

  return { count, ref };
}

function App() {
  
  const [wordIndex, setWordIndex] = useState(0);
  const [displayedWord, setDisplayedWord] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [showNewsletterThankYou, setShowNewsletterThankYou] = useState(false);
  const audienceCount = useCountUp(50000);
  const speakingCount = useCountUp(100, 1800);
  const mentoringCount = useCountUp(10000, 2200);
  const serviceMessages = {
  positioning:
    "Good day Ms. Prisca, I am interested in your technology influence and brand positioning services. I would like to discuss how you can help position and amplify my brand.",

  website:
    "Good day Ms. Prisca, I am interested in your website development services. I would like to discuss a website project with you.",

  education:
    "Good day Ms. Prisca, I am interested in blockchain and Web3 education. I would like to discuss training or an educational collaboration.",

  speaking:
    "Good day Ms. Prisca, I would like to invite you to speak at an event. I would like to discuss your availability, speaking topics and engagement details.",

  writing:
    "Good day Ms. Prisca, I am interested in your technical writing and editing services. I would like to discuss a writing or editing project.",

  consulting:
    "Good day Ms. Prisca, I am interested in your IT consulting services. I would like to discuss a technology challenge or project with you."
};
  const [selectedService, setSelectedService] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();

  const form = event.currentTarget;
  const formData = new FormData(form);

  const data = {
    name: formData.get("name"),
    email: formData.get("email"),
    organization: formData.get("organization"),
    service: formData.get("service"),
    message: formData.get("message"),
  };

  try {
    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Something went wrong.");
    }

    alert("Your inquiry has been sent successfully.");

    form.reset();
    setSelectedService("");
    setContactMessage("");
  } catch (error) {
    console.error(error);

    alert(
      "Sorry, your inquiry could not be sent. Please try again."
    );
  }
};
  const handleServiceSelect = (
  service: keyof typeof serviceMessages,
  serviceName: string
) => {
  setSelectedService(serviceName);
  setContactMessage(serviceMessages[service]);

  setTimeout(() => {
    document
      .getElementById("contact")
      ?.scrollIntoView({ behavior: "smooth" });
  }, 50);
};

  useEffect(() => {
    const currentWord = rotatingWords[wordIndex];
    const typingSpeed = isDeleting ? 55 : 100;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        setDisplayedWord(
          currentWord.slice(0, displayedWord.length + 1)
        );

        if (displayedWord === currentWord) {
          setTimeout(() => setIsDeleting(true), 1100);
        }
      } else {
        setDisplayedWord(
          currentWord.slice(0, displayedWord.length - 1)
        );

        if (displayedWord === "") {
          setIsDeleting(false);
          setWordIndex(
            (current) => (current + 1) % rotatingWords.length
          );
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [displayedWord, isDeleting, wordIndex]);

  return (
    <div className="site-shell">

    
{/* NAVIGATION */}

<header className="navbar">

  <a href="/" className="brand">
    <span className="brand-name">Prisca Ekhaguere</span>
  </a>


  <div className="nav-actions">

    <a href="#contact" className="nav-cta">
      Work With Me
    </a>


    <button
      className="menu-toggle"
      type="button"
      aria-label="Open navigation menu"
      aria-expanded="false"
      onClick={(event) => {
        const button = event.currentTarget;
        const menu = document.getElementById("navigation-menu");

        if (!menu) return;

        const isOpen = menu.classList.toggle("menu-open");

        button.classList.toggle("menu-active", isOpen);
        button.setAttribute("aria-expanded", String(isOpen));
        button.setAttribute(
          "aria-label",
          isOpen ? "Close navigation menu" : "Open navigation menu"
        );
      }}
    >
      <span></span>
      <span></span>
      <span></span>
    </button>

  </div>


  <div className="navigation-menu" id="navigation-menu">

    <div className="navigation-menu-inner">

      <p className="eyebrow">
        EXPLORE
      </p>

      <nav>

        <a href="#about">
          <span>01</span>
          About
        </a>

        <a href="#research">
          <span>02</span>
          Research
        </a>

        <a href="#influence">
          <span>03</span>
          Influence
        </a>

        <a href="#services">
          <span>04</span>
          Services
        </a>

        <a href="#what-i-do">
          <span>05</span>
          What I Do
        </a>

        <a href="#newsletter">
          <span>06</span>
          Emerging Tech Today
        </a>

        <a href="#contact">
          <span>07</span>
          Contact
        </a>

      </nav>

    </div>

  </div>

</header>

      <main>

        {/* HERO */}

        <section className="hero">

          <div className="hero-grid"></div>

          <div className="hero-content">

            <p className="eyebrow">
              TECH INFLUENCER · CS RESEARCHER · SOFTWARE ENGINEER
            </p>

            <h1>
              Prisca
              <span>Ekhaguere</span>
            </h1>

            <div className="hero-statement">
              <span>I </span>

              <span className="typing-word">
                {displayedWord}
                <span className="cursor"></span>
              </span>
            </div>

            <p className="hero-description">
              A computer science researcher, technology advocate,
              founder, speaker and builder exploring how emerging
              technologies can solve real-world problems and shape
              what comes next.
            </p>

            <div className="hero-actions">

              <a href="#about" className="primary-button">
                Explore My Work
                <span>↗</span>
              </a>

              <a href="#services" className="secondary-button">
                Explore Services
              </a>

            </div>

          </div>

          <div className="hero-side-note">
            <span>01</span>
            <div></div>
            <span>
              EMERGING
              <br />
              TECH
            </span>
          </div>

          <div className="hero-bottom">
            <span>AI</span>
            <span>ROBOTICS</span>
            <span>BLOCKCHAIN</span>
            <span>WEB3</span>
            <span>AUTOMATION</span>
          </div>

        </section>


        {/* ABOUT */}

<section className="about-section" id="about">

  <div className="section-label">
    <span>ABOUT PRISCA</span>
  </div>

  <div className="about-grid">

    <div className="about-image-wrapper">

      <div className="image-frame">

        {/* YOUR PHOTO WILL GO HERE */}

        <img
          src="/prisca-image.jpg"
          alt="Prisca Ekhaguere"
          className="about-image"
        />
      </div>

      <p className="image-caption">
        PRISCA EKHAGUERE
        <span>EMERGING TECH · RESEARCH</span>
      </p>

    </div>


    <div className="about-content">

      <p className="about-intro">
        Technology is most powerful when it moves
        beyond the screen and into the real world.
      </p>

      <p>
        <strong>Prisca Ekhaguere</strong> is a computer science
        researcher, emerging technology advocate, technology
        communicator and founder working at the intersection of
        technology, innovation and real-world impact.
      </p>

      <p>
        Her work explores <strong>artificial intelligence, robotics,
        blockchain, Web3 and AI automation</strong>, with a particular
        research interest in using robotics and intelligent systems
        to advance agriculture and address practical challenges
        within agricultural environments.
      </p>

      <p>
        Beyond research, Prisca works with organizations, brands,
        founders and individuals to understand emerging technologies,
        communicate technical ideas clearly, strengthen digital
        presence and identify opportunities created by technological
        change.
      </p>

      <p>
        She is also a technology educator and influencer, using her
        platform to make complex technologies more accessible while
        connecting people and organizations with ideas shaping the
        future.
      </p>

      <div className="about-tags">
        <span>AI</span>
        <span>ROBOTICS</span>
        <span>BLOCKCHAIN</span>
        <span>WEB3</span>
        <span>AI AUTOMATION</span>
        <span>AGRICULTURE</span>
      </div>

    </div>

  </div>

</section>


{/* APTNICHE */}

<section className="aptniche-section" id="aptniche">

  <div className="aptniche-content">

    <p className="eyebrow">
      FOUNDER · APTNICHE
    </p>

    <h2>
      Turning technology
      <span>into advantage.</span>
    </h2>

    <p>
      Prisca is the founder of
      <strong> AptNiche</strong>, an AI automation and business
      workflow optimization company helping organizations 
      <strong> in any niche</strong> - <strong>AUTOMATE</strong> - identify
      what can be automated, understand where AI fits into their
      operations, <strong>POSITION</strong> - put themselves at the 
      forefront of an AI-driven future and <strong>TRANSFORM</strong> - 
      implement and integrate their workflows through intelligent systems.
    </p>

    <p>
      AptNiche brings together <strong>automation, artificial intelligence </strong>
      and <strong>business strategy</strong> to help organizations move from simply
      experimenting with emerging technology to using it with
      purpose.
    </p>

    <a
      href="https://aptniche.tech"
      target="_blank"
      rel="noopener noreferrer"
      className="aptniche-link"
      aria-label="Visit AptNiche, founded by Prisca Ekhaguere"
    >
      Visit AptNiche
      <span>↗</span>
    </a>

  </div>

  <div className="aptniche-mark" aria-hidden="true">
    <span>APT</span>
    <span>NICHE</span>
  </div>

</section>


{/* RESEARCH */}

<section className="research-section" id="research">

  <div className="section-label research-label">
    <span>RESEARCH</span>
  </div>

  <div className="research-heading">

    <p className="eyebrow">
      COMPUTER SCIENCE · ROBOTICS · AGRICULTURE
    </p>

    <h2>
      Building technology
      <span>for the real world.</span>
    </h2>

  </div>


  <div className="research-grid">

    <div className="research-number">

      <span>01</span>

      <div className="research-line"></div>

      <span>FIELD OF STUDY</span>

    </div>


    <div className="research-main">

      <h3>
        Robotics for
        <span>Agriculture</span>
      </h3>

      <p>
        Prisca's computer science research explores how
        <strong> robotics, intelligent systems and emerging
        technologies can contribute to the future of agriculture</strong>,
        with a focus on practical applications that can improve
        efficiency, productivity and decision-making.
      </p>

      <p>
        Her research sits at the intersection of
        <strong> computer science, robotics and agriculture</strong>,
        examining how technological systems can respond to real-world
        agricultural challenges while remaining useful to the people
        and environments they are designed to serve.
      </p>

      <p>
        This work reflects a broader interest in developing technology
        that does more than demonstrate what is technically possible —
        technology designed to create meaningful and measurable impact.
      </p>

      <a
        href="#contact"
        className="text-link"
      >
        Discuss research or collaboration
        <span>↗</span>
      </a>

    </div>


    <div className="research-image">

      <img
        src="/agricultural-robotics-photo.jpg"
        alt="Agricultural robot operating in a farming environment"
        loading="lazy"
        decoding="async"
      />

      <div className="research-image-label">
        ROBOTICS × AGRICULTURE
      </div>

    </div>

  </div>


  <div className="research-topics">

    <span>ROBOTICS</span>
    <span>AGRICULTURE</span>
    <span>COMPUTER SCIENCE</span>
    <span>INTELLIGENT SYSTEMS</span>
    <span>EMERGING TECHNOLOGY</span>

  </div>

</section>


{/* INFLUENCE */}

<section className="influence-section" id="influence">

  <div className="influence-content">

    <p className="eyebrow">
      INFLUENCE
    </p>

    <h2>
      Ideas travel
      <span>when people care.</span>
    </h2>

    <p className="influence-description">
      Prisca communicates emerging technology to an audience of
      <strong> over 50,000 technology-oriented people</strong>,
      connecting ideas, innovations, organizations, founders and
      brands across the technology ecosystem.
    </p>

    <p className="influence-description">
      Through educational content, technology conversations and
      strategic collaborations, she helps make emerging technologies
      easier to understand while giving relevant brands and ideas
      meaningful visibility within the technology community.
    </p>


    <div className="influence-stats">

  <div ref={audienceCount.ref}>

    <strong>
      {audienceCount.count.toLocaleString()}+
    </strong>

    <span>
      TECH-ORIENTED
      <br />
      AUDIENCE
    </span>

  </div>


  <div ref={speakingCount.ref}>

    <strong>
      {speakingCount.count.toLocaleString()}+
    </strong>

    <span>
      SPEAKING
      <br />
      ENGAGEMENTS
    </span>

  </div>


  <div ref={mentoringCount.ref}>

    <strong>
      {mentoringCount.count.toLocaleString()}+
    </strong>

    <span>
      INDIVIDUALS
      <br />
      MENTORED
    </span>

  </div>

</div>


    <a
      href="#services"
      className="influence-button"
    >
      Explore Collaboration
      <span>↗</span>
    </a>

  </div>


  <div className="influence-words" aria-hidden="true">

    <span>CONNECT</span>
    <span>EDUCATE</span>
    <span>INFLUENCE</span>
    <span>AMPLIFY</span>

  </div>

</section>
                {/* SERVICES */}

        <section className="services-section" id="services">

          <div className="services-header">

            <div>
              <p className="eyebrow">
                SERVICES
              </p>

              <h2>
                Technology,
                <span>with purpose.</span>
              </h2>
            </div>

            <p className="services-intro">
              From building digital experiences to communicating
              emerging technology, Prisca works across technology,
              education, influence and digital strategy.
            </p>

          </div>


          <div className="services-list">

            {/* SERVICE 1 */}

            <article className="service-card featured-service">

              <div className="service-top">
                <span>01</span>
                <span>INFLUENCE · POSITIONING</span>
              </div>

              <h3>
                Technology Influence
                <span>& Brand Positioning</span>
              </h3>

              <p>
                Put your brand in front of a growing technology-oriented
                audience through strategic collaborations, reposts and
                premium brand positioning.
              </p>

              <div className="pricing-grid">

                <div>
                  <strong>$200</strong>
                  <span>COLLABORATION POST</span>
                </div>

                <div>
                  <strong>$100</strong>
                  <span>REPOST</span>
                </div>

                <div>
                  <strong>$150</strong>
                  <span>REPOST + THOUGHT</span>
                </div>

                <div className="premium-price">
                  <strong>$3,500</strong>
                  <span>PREMIUM · MONTHLY</span>
                </div>

              </div>

              <p className="premium-description">
                A premium one-month brand positioning package designed
                to keep your brand consistently visible through Prisca's
                technology-focused content and conversations.
              </p>

              <button
  type="button"
  className="service-link"
  onClick={() => {
    handleServiceSelect(
      "positioning",
      "Technology Influence & Brand Positioning"
    );

    document.getElementById("contact")?.scrollIntoView({
      behavior: "smooth"
    });
  }}
>
  Discuss Brand Positioning
  <span>↗</span>
</button>

            </article>


            {/* SERVICE 2 */}

            <article className="service-card">

              <div className="service-top">
                <span>02</span>
                <span>BUILD · DIGITAL</span>
              </div>

              <h3>
                Website
                <span>Development</span>
              </h3>

              <p>
                Fast, responsive and modern websites built for
                businesses, founders, organizations and personal brands,
                with performance, usability and search visibility in mind.
              </p>

              <button
  type="button"
  className="service-link"
  onClick={() => {
    handleServiceSelect(
      "website",
      "Website Development"
    );

    document.getElementById("contact")?.scrollIntoView({
      behavior: "smooth"
    });
  }}
>
  Start a Website Project
  <span>↗</span>
</button>

            </article>


            {/* SERVICE 3 */}

            <article className="service-card">

              <div className="service-top">
                <span>03</span>
                <span>EDUCATION · WEB3</span>
              </div>

              <h3>
                Blockchain &
                <span>Web3 Education</span>
              </h3>

              <p>
                Practical education and training that makes blockchain
                and Web3 easier to understand, from foundational concepts
                to real-world applications.
              </p>

              <button
  type="button"
  className="service-link"
  onClick={() => {
    handleServiceSelect(
      "education",
      "Blockchain & Web3 Education"
    );

    document.getElementById("contact")?.scrollIntoView({
      behavior: "smooth"
    });
  }}
>
  Discuss Training
  <span>↗</span>
</button>

            </article>


            {/* SERVICE 4 */}

            <article className="service-card">

              <div className="service-top">
                <span>04</span>
                <span>EVENTS · SPEAKING</span>
              </div>

              <h3>
                Paid
                <span>Speaking Engagements</span>
              </h3>

              <p>
                Engaging talks, panels, workshops and keynotes covering
                AI, robotics, blockchain, Web3, emerging technologies
                and the future of technology.
              </p>

              <button
  type="button"
  className="service-link"
  onClick={() => {
    handleServiceSelect(
      "speaking",
      "Paid Speaking Engagement"
    );

    document.getElementById("contact")?.scrollIntoView({
      behavior: "smooth"
    });
  }}
>
  Invite Ms. Prisca to Speak
  <span>↗</span>
</button>

            </article>


            {/* SERVICE 5 */}

            <article className="service-card">

              <div className="service-top">
                <span>05</span>
                <span>CONTENT · RESEARCH</span>
              </div>

              <h3>
                Technical Writing
                <span>& Editing</span>
              </h3>

              <p>
                Clear, credible and technically accurate writing and
                editing for research, technology publications,
                documentation, thought leadership and digital content.
              </p>

              <button
  type="button"
  className="service-link"
  onClick={() => {
    handleServiceSelect(
      "writing",
      "Technical Writing & Editing"
    );

    document.getElementById("contact")?.scrollIntoView({
      behavior: "smooth"
    });
  }}
>
  Discuss a Writing Project
  <span>↗</span>
</button>

            </article>


            {/* SERVICE 6 */}

            <article className="service-card">

              <div className="service-top">
                <span>06</span>
                <span>STRATEGY · TECHNOLOGY</span>
              </div>

              <h3>
                IT
                <span>Consulting</span>
              </h3>

              <p>
                Technology guidance for organizations that need help
                understanding opportunities, evaluating solutions,
                improving digital workflows or making better technology
                decisions.
              </p>

              <button
  type="button"
  className="service-link"
  onClick={() => {
    handleServiceSelect(
      "consulting",
      "IT Consulting"
    );

    document.getElementById("contact")?.scrollIntoView({
      behavior: "smooth"
    });
  }}
>
  Discuss Your Challenge
  <span>↗</span>
</button>

            </article>

          </div>

        </section>
      
{/* WHAT I DO */}

<section className="what-i-do-section" id="what-i-do">

  <div className="section-label">
    <span>WHAT I DO</span>
  </div>

  <div className="what-i-do-header">

    <div>
      <p className="eyebrow">
        POSITIONING · EDUCATION · DEVELOPMENT
      </p>

      <h2>
        Bring technology
        <span>to life.</span>
      </h2>
    </div>

    <p className="what-i-do-intro">
      Prisca works across emerging technology, CS research,
      education, communication and digital strategy, helping
      people and organizations understand technology and turn
      ideas into meaningful outcomes.
    </p>

  </div>


  <div className="what-i-do-list">

    {/* AI & AUTOMATION */}

    <article className="what-i-do-item">

      <button
        type="button"
        className="what-i-do-trigger"
        onClick={(event) => {
          const item = event.currentTarget.closest(".what-i-do-item");

          if (item) {
            item.classList.toggle("is-open");
          }
        }}
      >

        <span className="what-i-do-number">
          01
        </span>

        <span className="what-i-do-title">
          AI & Automation
        </span>

        <span className="what-i-do-icon">
          +
        </span>

      </button>


      <div className="what-i-do-content">

        <p>
          Exploring artificial intelligence, AI automation and
          intelligent workflows that help organizations improve
          efficiency, understand emerging AI applications and
          prepare for an increasingly automated future.
        </p>

        <div className="what-i-do-keywords">
          <span>AI AUTOMATION</span>
          <span>ARTIFICIAL INTELLIGENCE</span>
          <span>INTELLIGENT WORKFLOWS</span>
          <span>EMERGING AI</span>
        </div>

      </div>

    </article>


    {/* ROBOTICS & AGRICULTURE */}

    <article className="what-i-do-item">

      <button
        type="button"
        className="what-i-do-trigger"
        onClick={(event) => {
          const item = event.currentTarget.closest(".what-i-do-item");

          if (item) {
            item.classList.toggle("is-open");
          }
        }}
      >

        <span className="what-i-do-number">
          02
        </span>

        <span className="what-i-do-title">
          Robotics & Agriculture
        </span>

        <span className="what-i-do-icon">
          +
        </span>

      </button>


      <div className="what-i-do-content">

        <p>
          Researching how robotics and intelligent systems can
          contribute to agricultural productivity, efficiency and
          practical problem solving across modern farming systems.
        </p>

        <div className="what-i-do-keywords">
          <span>AGRICULTURAL ROBOTICS</span>
          <span>ROBOTICS RESEARCH</span>
          <span>INTELLIGENT SYSTEMS</span>
          <span>AGRICULTURE TECHNOLOGY</span>
        </div>

      </div>

    </article>


    {/* BLOCKCHAIN & WEB3 */}

    <article className="what-i-do-item">

      <button
        type="button"
        className="what-i-do-trigger"
        onClick={(event) => {
          const item = event.currentTarget.closest(".what-i-do-item");

          if (item) {
            item.classList.toggle("is-open");
          }
        }}
      >

        <span className="what-i-do-number">
          03
        </span>

        <span className="what-i-do-title">
          Blockchain & Web3
        </span>

        <span className="what-i-do-icon">
          +
        </span>

      </button>


      <div className="what-i-do-content">

        <p>
          Making blockchain and Web3 easier to understand through
          practical education, technical communication and
          real-world applications of decentralized technologies.
        </p>

        <div className="what-i-do-keywords">
          <span>BLOCKCHAIN EDUCATION</span>
          <span>WEB3 EDUCATION</span>
          <span>DECENTRALIZED TECHNOLOGY</span>
        </div>

      </div>

    </article>


    {/* TECHNOLOGY COMMUNICATION */}

    <article className="what-i-do-item">

      <button
        type="button"
        className="what-i-do-trigger"
        onClick={(event) => {
          const item = event.currentTarget.closest(".what-i-do-item");

          if (item) {
            item.classList.toggle("is-open");
          }
        }}
      >

        <span className="what-i-do-number">
          04
        </span>

        <span className="what-i-do-title">
          Technology Communication
        </span>

        <span className="what-i-do-icon">
          +
        </span>

      </button>


      <div className="what-i-do-content">

        <p>
          Translating complex technical ideas into clear,
          credible and engaging content for researchers,
          organizations, technology companies and digital audiences.
        </p>

        <div className="what-i-do-keywords">
          <span>TECHNICAL WRITING</span>
          <span>TECHNICAL EDITING</span>
          <span>TECH STORYTELLING</span>
        </div>

      </div>

    </article>


    {/* DIGITAL PRESENCE */}

    <article className="what-i-do-item">

      <button
        type="button"
        className="what-i-do-trigger"
        onClick={(event) => {
          const item = event.currentTarget.closest(".what-i-do-item");

          if (item) {
            item.classList.toggle("is-open");
          }
        }}
      >

        <span className="what-i-do-number">
          05
        </span>

        <span className="what-i-do-title">
          Digital Presence & Brand Positioning
        </span>

        <span className="what-i-do-icon">
          +
        </span>

      </button>


      <div className="what-i-do-content">

        <p>
          Helping technology-focused brands, founders and
          organizations communicate their value, strengthen their
          digital presence and position themselves effectively
          within the technology ecosystem.
        </p>

        <div className="what-i-do-keywords">
          <span>BRAND POSITIONING</span>
          <span>TECH INFLUENCE</span>
          <span>WEBSITE DEVELOPMENT</span>
        </div>

      </div>

    </article>


    {/* SPEAKING & EDUCATION */}

    <article className="what-i-do-item">

      <button
        type="button"
        className="what-i-do-trigger"
        onClick={(event) => {
          const item = event.currentTarget.closest(".what-i-do-item");

          if (item) {
            item.classList.toggle("is-open");
          }
        }}
      >

        <span className="what-i-do-number">
          06
        </span>

        <span className="what-i-do-title">
          Speaking & Education
        </span>

        <span className="what-i-do-icon">
          +
        </span>

      </button>


      <div className="what-i-do-content">

        <p>
          Speaking and teaching on AI, robotics, blockchain,
          Web3 and emerging technologies through keynotes,
          workshops, training sessions and educational programs.
        </p>

        <div className="what-i-do-keywords">
          <span>TECHNOLOGY SPEAKING</span>
          <span>KEYNOTES</span>
          <span>WORKSHOPS</span>
          <span>TECHNOLOGY EDUCATION</span>
        </div>

      </div>

    </article>

  </div>


  <div className="what-i-do-bottom">

    <div>
      <p className="eyebrow">
        EMERGING TECHNOLOGY
      </p>

      <p>
        Exploring the technologies, ideas and questions shaping
        what comes next.
      </p>
    </div>

    <a href="#contact" className="text-link">
      Work with Me
      <span>↗</span>
    </a>

  </div>

</section>

        {/* CONTACT */}

<section className="contact-section" id="contact">

  <div className="contact-header">

    <div>
      <p className="eyebrow">
        CONTACT ME
      </p>

      <h2>
        Let's build
        <span>something meaningful.</span>
      </h2>
    </div>

    <p className="contact-intro">
      Whether you are looking to position a brand, build a website, educate a team, invite Ms. Prisca to speak, or solve
      a technology challenge, start the conversation here.
    </p>

  </div>


  <div className="contact-layout">
    

    {/* CONTACT FORM */}

    <div className="contact-form-wrapper">

      <form
  className="contact-form"
  onSubmit={handleSubmit}
>

        <div className="form-row">

          <div className="form-field">
            <label htmlFor="name">
              YOUR NAME
            </label>

            <input
              id="name"
              type="text"
              name="name"
              placeholder="Your name"
              required
            />
          </div>


          <div className="form-field">
            <label htmlFor="email">
              EMAIL
            </label>

            <input
              id="email"
              type="email"
              name="email"
              placeholder="you@example.com"
              required
            />
          </div>

        </div>


        <div className="form-field">

          <label htmlFor="organization">
            ORGANIZATION / BRAND
          </label>

          <input
            id="organization"
            type="text"
            name="organization"
            placeholder="Your organization or brand"
          />

        </div>


        <div className="form-field">

          <label htmlFor="service">
            WHAT CAN MS. PRISCA HELP WITH?
          </label>

          <select
  id="service"
  name="service"
  value={selectedService}
  onChange={(event) => setSelectedService(event.target.value)}
  required
>


            <option value="" disabled>
              Select a service
            </option>

            <option value="Technology Influence & Brand Positioning">
              Technology Influence & Brand Positioning
            </option>

            <option value="Website Development">
              Website Development
            </option>

            <option value="Blockchain & Web3 Education">
              Blockchain & Web3 Education
            </option>

            <option value="Paid Speaking Engagement">
              Paid Speaking Engagement
            </option>

            <option value="Technical Writing & Editing">
              Technical Writing & Editing
            </option>

            <option value="IT Consulting">
              IT Consulting
            </option>

            <option value="General Inquiry">
              General Inquiry
            </option>

          </select>

        </div>


        <div className="form-field">

          <label htmlFor="message">
            MESSAGE
          </label>

          <textarea
            id="message"
            name="message"
            rows={7}
            value={contactMessage}
            onChange={(event) => setContactMessage(event.target.value)}
            placeholder="Tell Prisca a little about what you have in mind..."
            required
          />

        </div>


        <button
          type="submit"
          className="contact-submit"
        >
          SEND INQUIRY
          <span>↗</span>
        </button>

      </form>

    </div>


    {/* CONTACT DETAILS */}

    <aside className="contact-details">

      <div className="contact-detail">

        <span className="contact-label">
          EMAIL
        </span>

        <a
          href="mailto:blockchaingoddess@gmail.com"
          className="contact-email"
        >
          Send an email
          <span>↗</span>
        </a>

      </div>


      <div className="contact-detail">

        <span className="contact-label">
          Available
        </span>

        <p>
          Globally
        </p>

      </div>


      <div className="contact-detail">

        <span className="contact-label">
          SERVICES
        </span>

        <p>
          Influence · Development
          <br />
          Education · Speaking
          <br />
          Writing · Consulting
        </p>

      </div>

    </aside>

  </div>

</section>

{/* NEWSLETTER */}

<section className="newsletter-section" id="newsletter">

  <div className="newsletter-inner">

    <div className="newsletter-copy">

      <p className="eyebrow">
        EMERGING TECH TODAY
      </p>

      <h2>
        Stay ahead
        <span>of what's next.</span>
      </h2>

      <p>
        <strong>Emerging Tech Today</strong> is Prisca Ekhaguere's newsletter on the
        technologies, ideas and opportunities shaping the future —
        from artificial intelligence and robotics to blockchain,
        Web3, automation and other emerging technologies.
      </p>

    </div>


    <div className="newsletter-signup">

      <p className="newsletter-label">
        JOIN THE EMERGING TECH COMMUNITY
      </p>

      <form
  className="newsletter-form"
  action="https://app.kit.com/forms/9885568/subscriptions"
  method="post"
  target="kit-newsletter-frame"
  onSubmit={(event) => {
    const form = event.currentTarget;
    const input = form.elements.namedItem(
      "email_address"
    ) as HTMLInputElement;

    if (!input.value.trim()) {
      event.preventDefault();
      return;
    }

    // Show the thank-you popup
    setShowNewsletterThankYou(true);

    // Clear the email field after submission
    setTimeout(() => {
      form.reset();
    }, 100);
  }}
>
  <input
    type="email"
    name="email_address"
    placeholder="Your email address"
    aria-label="Your email address"
    autoComplete="email"
    required
  />

  <button type="submit">
    SUBSCRIBE
    <span>↗</span>
  </button>
</form>

<iframe
  name="kit-newsletter-frame"
  title="Newsletter subscription"
  style={{ display: "none" }}
/>
{showNewsletterThankYou && (
  <div className="newsletter-thank-you">
    <div className="newsletter-thank-you-content">

      <div className="newsletter-thank-you-icon">✓</div>

      <h3>You're subscribed!</h3>

      <p>
        Thank you for subscribing to Emerging Tech Today.
      </p>

    </div>
  </div>
)}

      <p className="newsletter-note">
        No noise. Just emerging technology worth knowing about.
      </p>

    </div>

  </div>

</section>

{/* FOOTER */}

<footer className="site-footer">

  <div className="footer-top">

    <div className="footer-brand">

      <p className="eyebrow">
        PRISCA EKHAGUERE
      </p>

      <h2>
        Technology.
        <span>With purpose.</span>
      </h2>

      <p className="footer-description">
        CS researcher, blockchain educator and advocate of emerging tech
        working across AI, robotics, blockchain and Web3.
      </p>

    </div>


    <div className="footer-navigation">

      <div className="footer-column">

        <p className="footer-label">
          EXPLORE
        </p>

        <a href="#about">
          About
        </a>

        <a href="#services">
          Services
        </a>

        <a href="#newsletter">
          Newsletter
        </a>

        <a href="#contact">
          Contact
        </a>

      </div>


      <div className="footer-column">

        <p className="footer-label">
          SERVICES
        </p>

        <a href="#contact">
          Brand Positioning
        </a>

        <a href="#contact">
          Website Development
        </a>

        <a href="#contact">
          Web3 Education
        </a>

        <a href="#contact">
          Speaking
        </a>

      </div>


      <div className="footer-column">

        <p className="footer-label">
          SOCIALS
        </p>

        <a
          href="https://www.linkedin.com/in/priscaekhaguere/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Prisca Ekhaguere on LinkedIn"
        >
          LinkedIn ↗
        </a>

        <a
          href="https://x.com/bc_goddess"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Prisca Ekhaguere on X"
        >
          X ↗
        </a>

        <a
          href="https://www.instagram.com/blockchain_goddess"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Prisca Ekhaguere on Instagram"
        >
          Instagram ↗
        </a>

        <a
          href="https://www.tiktok.com/@blockchaingoddess"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Prisca Ekhaguere on TikTok"
        >
          TikTok ↗
        </a>

        <a
          href="https://www.facebook.com/share/1adiyiGqyW/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Prisca Ekhaguere on Facebook"
        >
          Facebook ↗
        </a>

      </div>

    </div>

  </div>


  {/* FOOTER STATEMENT */}

  <div className="footer-marquee">

    <div className="footer-marquee-track">

      <span>AI</span>
      <span>ROBOTICS</span>
      <span>BLOCKCHAIN</span>
      <span>WEB3</span>
      <span>EMERGING TECHNOLOGY</span>
      <span>AI</span>
      <span>ROBOTICS</span>
      <span>BLOCKCHAIN</span>
      <span>WEB3</span>
      <span>EMERGING TECHNOLOGY</span>

    </div>

  </div>


  {/* FOOTER BOTTOM */}

  <div className="footer-bottom">

    <p>
      © {new Date().getFullYear()} Prisca Ekhaguere. All rights reserved.
    </p>

    <a
      href="https://aptniche.tech"
      target="_blank"
      rel="noopener noreferrer"
    >
      Founded AptNiche ↗
    </a>

    <p>
      Global
    </p>

  </div>

</footer>
      </main>

    </div>
  );
}

export default App;