"use client";

import { useState, useEffect, useRef } from 'react';
import { Mail, Linkedin, Code, Briefcase, GraduationCap, HomeIcon, User } from 'lucide-react';

// --- Main Page Component ---
export default function Home() {
  const [activeSection, setActiveSection] = useState('home');
  const sections = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const navItems = [
    { id: 'home', name: 'Home', icon: HomeIcon },
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'portfolio', name: 'Portfolio', icon: Briefcase },
    { id: 'contact', name: 'Contact', icon: Mail },
  ];
  
  // Scroll Spy Logic
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      let currentSection = 'home';
      for (const sectionId in sections.current) {
        const section = sections.current[sectionId];
        if (section && section.offsetTop <= scrollPosition && section.offsetTop + section.offsetHeight > scrollPosition) {
          currentSection = sectionId;
          break;
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    sections.current[id]?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="bg-[#0D0D0D] text-[#C5C6C7] font-mono min-h-screen">
      <Header navItems={navItems} activeSection={activeSection} scrollToSection={scrollToSection} />
      
      <div className="container mx-auto px-4 pt-20 md:pt-24 max-w-4xl">
        <div ref={el => sections.current['home'] = el} id="home"><LandingSection /></div>
        <div ref={el => sections.current['profile'] = el} id="profile"><ProfileSection /></div>
        <div ref={el => sections.current['portfolio'] = el} id="portfolio"><PortfolioSection /></div>
        <div ref={el => sections.current['contact'] = el} id="contact"><ContactSection /></div>
      </div>
      
      <Footer />
    </main>
  );
}

// --- Header Component ---
const Header = ({ navItems, activeSection, scrollToSection }: { navItems: any[], activeSection: string, scrollToSection: (id: string) => void }) => (
  <header className="fixed top-0 left-0 right-0 z-50 bg-[#0D0D0D]/80 backdrop-blur-sm border-b border-[#39FF14]/20">
    <div className="container mx-auto px-4 py-3 flex justify-between items-center max-w-4xl">
      <div className="flex items-center space-x-2">
        <span className="text-[#39FF14] text-xl md:text-2xl font-bold">SP&gt;</span>
      </div>
      <nav className="hidden md:flex items-center space-x-6">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => scrollToSection(item.id)}
            className={`text-sm uppercase tracking-wider transition-all duration-300 ${activeSection === item.id ? 'text-[#39FF14]' : 'text-[#C5C6C7] hover:text-[#39FF14]'}`}
          >
            {item.name}
            {activeSection === item.id && <span className="inline-block w-2 h-4 bg-[#39FF14] animate-pulse ml-1"></span>}
          </button>
        ))}
      </nav>
      {/* Mobile Nav */}
      <nav className="md:hidden flex items-center space-x-4">
         {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => scrollToSection(item.id)}
            className={`transition-all duration-300 ${activeSection === item.id ? 'text-[#39FF14]' : 'text-[#C5C6C7] hover:text-[#39FF14]'}`}
          >
            <item.icon size={20} />
          </button>
        ))}
      </nav>
    </div>
  </header>
);


// --- Typing Effect Component ---
const TypingEffect = ({ text }: { text: string }) => {
  const [displayedText, setDisplayedText] = useState('');
  useEffect(() => {
    let i = 0;
    const intervalId = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;
      if (i === text.length) {
        clearInterval(intervalId);
      }
    }, 100);
    return () => clearInterval(intervalId);
  }, [text]);

  return <span className="relative">{displayedText}<span className="absolute right-[-10px] w-2 h-8 bg-[#39FF14] animate-pulse"></span></span>;
};


// --- Section Components ---
const Section = ({ title, icon: Icon, children }: { title: string, icon: React.ElementType, children: React.ReactNode }) => (
  <section className="py-12 md:py-16 border-b border-[#39FF14]/20">
    <h2 className="text-2xl md:text-3xl font-bold text-[#39FF14] mb-8 flex items-center">
      <Icon className="mr-3" size={28} />
      {title}
    </h2>
    {children}
  </section>
);

const LandingSection = () => (
  <div className="min-h-screen flex flex-col justify-center items-start -mt-20">
    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
      <TypingEffect text="Shreyas Patil" />
    </h1>
    <p className="text-xl md:text-2xl text-[#39FF14] mb-6">
      $ <span className="text-white">Product Manager</span>
    </p>
    <p className="max-w-xl text-md md:text-lg text-[#C5C6C7]">
      &gt; Building impactful products at the intersection of technology and user needs.
    </p>
  </div>
);

const ProfileSection = () => (
  <Section title="Profile" icon={User}>
    <div className="space-y-12">
      <div>
        <h3 className="text-xl font-bold text-white mb-4">About Me</h3>
        <p className="text-[#C5C6C7] leading-relaxed">
          A results-driven Product Manager with a strong foundation in software engineering. My journey from coding in FinTech to leading product strategy in EdTech has equipped me with a unique ability to bridge the gap between technical execution and user-centric vision. I thrive on solving complex problems and delivering products that create tangible value and exceptional user experiences.
        </p>
      </div>
      <div>
        <h3 className="text-xl font-bold text-white mb-6 flex items-center"><Briefcase className="mr-2 text-[#39FF14]" />Experience</h3>
        <div className="space-y-6">
          <div className="pl-4 border-l-2 border-[#39FF14]/50">
            <p className="font-bold text-white">Product Manager</p>
            <p className="text-sm text-[#C5C6C7]">UNEXT Learning (Manipal Education)</p>
            <p className="text-xs text-[#39FF14]">May 2025 - Present</p>
            <ul className="list-disc list-inside mt-2 text-[#C5C6C7] space-y-1">
              <li>Led ideation & development of ULabs, a browser-based coding platform, enhancing UX for 150,000+ students.</li>
              <li>Drove stakeholder consensus and designed seamless LMS integration for a successful pilot with 500+ learners.</li>
            </ul>
          </div>
          <div className="pl-4 border-l-2 border-[#39FF14]/50">
            <p className="font-bold text-white">Software Engineer, Database and Cloud Migration</p>
            <p className="text-sm text-[#C5C6C7]">Experian</p>
            <p className="text-xs text-[#39FF14]">June 2021 - May 2023</p>
            <ul className="list-disc list-inside mt-2 text-[#C5C6C7] space-y-1">
              <li>Drove $1M+ in cost reduction by leading AWS cloud migration of key data modules.</li>
              <li>Empowered 130K+ new users by contributing to the global launch of Experian Go.</li>
            </ul>
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-xl font-bold text-white mb-6 flex items-center"><GraduationCap className="mr-2 text-[#39FF14]" />Education</h3>
        <div className="space-y-4">
           <div className="pl-4 border-l-2 border-[#39FF14]/50">
            <p className="font-bold text-white">PG Diploma in Business Management</p>
            <p className="text-sm text-[#C5C6C7]">XLRI Jamshedpur</p>
          </div>
          <div className="pl-4 border-l-2 border-[#39FF14]/50">
            <p className="font-bold text-white">Bachelor of Engineering, Computer Science</p>
            <p className="text-sm text-[#C5C6C7]">BITS Pilani</p>
          </div>
        </div>
      </div>
    </div>
  </Section>
);

const portfolioItems = [
  {
    title: 'ULabs Platform',
    description: 'A browser-based coding platform supporting 50+ languages with AI-powered evaluation to enhance learning outcomes.',
    role: 'Led ideation, development, and LMS integration as Product Manager.',
    impact: 'Successfully piloted with 500+ learners, impacting 150,000+ students across 3 universities.'
  },
  {
    title: 'Experian Go',
    description: 'A global initiative to provide fair credit access to underserved populations worldwide.',
    role: 'Contributed as a Software Engineer to the core data modules and global launch.',
    impact: 'Empowered over 130,000 new users to build their credit history.'
  },
  {
    title: 'AI-Powered PM Interview Prep App',
    description: 'An independent project to create a web and mobile platform for product manager interview preparation using agentic AI.',
    role: 'Product Lead, responsible for market research, roadmap definition, and full-stack development.',
    impact: 'MVP ready for launch on Google Play Store, targeting aspiring PMs.'
  }
];

const PortfolioSection = () => (
  <Section title="Portfolio" icon={Code}>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {portfolioItems.map((item, index) => (
        <div key={index} className="border border-[#39FF14]/30 p-6 rounded-md bg-[#1a1a1a]/50 hover:border-[#39FF14] transition-all duration-300">
          <h3 className="text-xl font-bold text-[#39FF14] mb-2">{item.title}</h3>
          <p className="text-[#C5C6C7] mb-4 text-sm">{item.description}</p>
          <p className="text-white text-sm"><span className="font-bold">My Role:</span> {item.role}</p>
          <p className="text-white text-sm mt-2"><span className="font-bold">Impact:</span> {item.impact}</p>
        </div>
      ))}
    </div>
  </Section>
);


const ContactSection = () => (
  <Section title="Contact" icon={Mail}>
    <div className="text-center">
        <p className="text-lg text-white mb-4">Let's connect and build something great.</p>
        <p className="text-md text-[#C5C6C7] mb-8">
          Feel free to reach out for collaborations or a chat.
        </p>
        <div className="flex justify-center items-center space-x-6">
          <a href="mailto:shreyaspatil9904@gmail.com" className="inline-flex items-center text-[#C5C6C7] hover:text-[#39FF14] transition-colors duration-300">
            <Mail className="mr-2" />
            Email
          </a>
          <a href="https://linkedin.com/in/shreyas-patil-09/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-[#C5C6C7] hover:text-[#39FF14] transition-colors duration-300">
            <Linkedin className="mr-2" />
            LinkedIn
          </a>
        </div>
      </div>
  </Section>
);

const Footer = () => (
    <footer className="text-center py-6 border-t border-[#39FF14]/20">
        <p className="text-[#C5C6C7] text-sm">
            Coded with <span className="text-[#39FF14] animate-pulse">&lt;3</span> by Shreyas Patil
        </p>
    </footer>
);
