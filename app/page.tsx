"use client";

import { useState, useEffect, useRef } from 'react';
import { Mail, Linkedin, Code, Briefcase, GraduationCap, HomeIcon, User } from 'lucide-react';

// --- Type Definition for Navigation Items ---
type NavItem = {
  id: string;
  name: string;
  icon: React.ElementType;
};

// --- Custom Hook for Viewport Detection ---
const useInView = (ref: React.RefObject<Element>, options: IntersectionObserverInit = { threshold: 0.5 }) => {
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsInView(true);
                observer.disconnect(); // Ensures it only triggers once
            }
        }, options);

        observer.observe(element);

        return () => observer.disconnect();
    }, [ref, options]);

    return isInView;
};

// Define props type to avoid inline 'any' and satisfy strict linting rules
type TypeOnScrollViewProps = {
  text: string;
  as?: React.ElementType;
  className?: string;
  speed?: number;
  [key: string]: unknown; // Use 'unknown' instead of 'any' for better type safety
};

// --- New Typing Component Triggered by Scrolling into View (FIXED) ---
const TypeOnScrollView = ({ text, as: Component = 'span', className, speed = 30, ...props }: TypeOnScrollViewProps) => {
    const [displayedText, setDisplayedText] = useState('');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ref = useRef<any>(null); // FIX: Use 'any' with an eslint disable to solve the polymorphic ref typing issue
    const isInView = useInView(ref);
    const [hasStarted, setHasStarted] = useState(false);

    // Effect 1: Trigger the start of the animation when in view
    useEffect(() => {
        if (isInView && !hasStarted) {
            setHasStarted(true);
        }
    }, [isInView, hasStarted]);

    // Effect 2: Run the typing animation once `hasStarted` is true
    useEffect(() => {
        if (hasStarted) {
            const interval = setInterval(() => {
                setDisplayedText(currentText => {
                    if (currentText.length === text.length) {
                        clearInterval(interval);
                        return currentText;
                    }
                    return text.slice(0, currentText.length + 1);
                });
            }, speed);
            return () => clearInterval(interval);
        }
    }, [hasStarted, text, speed]);

    // Render an invisible placeholder to prevent layout shift
    if (!hasStarted) {
        return <Component ref={ref} className={`${className || ''} opacity-0`} {...props}>{text}</Component>;
    }

    const isTyping = displayedText.length < text.length;

    return (
        <Component ref={ref} className={className} {...props}>
            {displayedText}
            {isTyping && <span className="inline-block w-2 h-5 bg-[#39FF14] animate-pulse ml-1"></span>}
        </Component>
    );
};


// --- Main Page Component ---
export default function Home() {
  const [activeSection, setActiveSection] = useState('home');
  const sections = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const navItems: NavItem[] = [
    { id: 'home', name: 'Home', icon: HomeIcon },
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'portfolio', name: 'Portfolio', icon: Briefcase },
    { id: 'contact', name: 'Contact', icon: Mail },
  ];
  
  // Scroll Spy Logic
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3; 
      let currentSection = '';
      for (const sectionId in sections.current) {
        const section = sections.current[sectionId];
        if (section && section.offsetTop <= scrollPosition && section.offsetTop + section.offsetHeight > scrollPosition) {
          currentSection = sectionId;
          break;
        }
      }
      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    sections.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const setSectionRef = (key: string) => (el: HTMLDivElement | null) => {
    sections.current[key] = el;
  };

  return (
    <main className="bg-[#0D0D0D] text-[#C5C6C7] font-mono min-h-screen">
      <Header navItems={navItems} activeSection={activeSection} scrollToSection={scrollToSection} />
      
      <div className="container mx-auto px-4 pt-24 md:pt-28 max-w-4xl">
        <div className="space-y-24">
          <div ref={setSectionRef('home')} id="home">
              <Section>
                  <LandingSection />
              </Section>
          </div>
          <div ref={setSectionRef('profile')} id="profile">
              <Section>
                  <ProfileSection />
              </Section>
          </div>
          <div ref={setSectionRef('portfolio')} id="portfolio">
              <Section>
                  <PortfolioSection />
              </Section>
          </div>
          <div ref={setSectionRef('contact')} id="contact">
              <Section>
                  <ContactSection />
              </Section>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}

// --- Header Component ---
const Header = ({ navItems, activeSection, scrollToSection }: { navItems: NavItem[], activeSection: string, scrollToSection: (id: string) => void }) => (
  <header className="fixed top-0 left-0 right-0 z-50 bg-[#0D0D0D]/80 backdrop-blur-sm border-b border-[#39FF14]/20">
    <div className="container mx-auto px-4 py-4 flex justify-end items-center max-w-4xl">
      <nav className="flex items-center space-x-4">
        <span className="text-sm md:text-base text-[#39FF14]">SP:\showcase\&gt; cd</span>
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => scrollToSection(item.id)}
            className={`text-sm md:text-base tracking-wider transition-all duration-300 ${activeSection === item.id ? 'text-[#39FF14]' : 'text-[#C5C6C7] hover:text-[#39FF14]'}`}
          >
            {item.name}
            {activeSection === item.id && <span className="hidden md:inline-block w-2 h-5 bg-[#39FF14] animate-pulse ml-1"></span>}
          </button>
        ))}
      </nav>
    </div>
  </header>
);

// --- Section Component (Terminal Window) ---
const Section = ({ children }: { children: React.ReactNode }) => (
    <div className="border border-[#39FF14]/30 rounded-md bg-[#1a1a1a]/50">
      <div className="flex items-center space-x-2 p-3 bg-black/30 rounded-t-md border-b border-[#39FF14]/30">
          <span className="w-3 h-3 bg-red-500 rounded-full"></span>
          <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
          <span className="w-3 h-3 bg-green-500 rounded-full"></span>
      </div>
      <div className="p-6 md:p-8">
        {children}
      </div>
    </div>
  );

const LandingSection = () => (
    <div className="flex flex-col justify-center items-start py-8 md:py-12">
        <TypeOnScrollView as="h1" text="Shreyas Patil" className="text-4xl md:text-6xl font-bold text-white mb-4" speed={70} />
        <p className="text-xl md:text-2xl text-[#39FF14] mb-6">
            $ <TypeOnScrollView as="span" text="Product Manager" className="text-white" />
        </p>
        <TypeOnScrollView as="p" text="> Building impactful products at the intersection of technology and user needs." className="max-w-xl text-md md:text-lg text-[#C5C6C7]" />
    </div>
);

// --- Collapsible Block Component ---
const CollapsibleBlock = ({ summary, detailContent, isExperience = false, title, company, dates }: { 
    summary: string;
    detailContent: string;
    isExperience?: boolean;
    title?: string;
    company?: string;
    dates?: string;
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const StaticContent = ({ text }: { text: string }) => (
        <div className="text-[#C5C6C7] space-y-2">
            {text.split('\n').map((line, index) => {
                const isBullet = line.trim().startsWith('•');
                const content = isBullet ? line.trim().substring(1).trim() : line;
                if (!content) return null;
                return (
                    <div key={index} className="flex items-start">
                        {isBullet && <span className="mr-3 text-[#39FF14]">$&gt;</span>}
                        <p className="flex-1 leading-relaxed">{content}</p>
                    </div>
                );
            })}
        </div>
    );

    return (
        <div>
            {isExperience ? (
                <div className="pl-4 border-l-2 border-[#39FF14]/50">
                    <TypeOnScrollView as="p" text={title || ''} className="font-bold text-white" />
                    <TypeOnScrollView as="p" text={company || ''} className="text-sm text-[#C5C6C7]" />
                    <TypeOnScrollView as="p" text={dates || ''} className="text-xs text-[#39FF14] mb-2" />
                    <TypeOnScrollView as="p" text={summary} className="text-[#C5C6C7] italic" />
                </div>
            ) : (
                 <TypeOnScrollView as="p" text={summary} className="text-[#C5C6C7] italic" />
            )}

            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="text-[#39FF14] mt-3 hover:underline text-sm pl-4 md:pl-0"
            >
                {isOpen ? '[ close ]' : '[ README.md ]'}
            </button>

            {isOpen && (
                <div className="mt-4 p-4 bg-[#000000]/50 border border-[#39FF14]/30 rounded-md">
                     <div className="flex items-center space-x-2 mb-2 pb-2 border-b border-[#39FF14]/20">
                        <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                        <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                        <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                    </div>
                    <StaticContent text={detailContent} />
                </div>
            )}
        </div>
    );
};


const ProfileSection = () => {
    const aboutMe = {
        summary: "Engineer-turned-Product Manager, building AI-powered learning platforms and data-driven FinTech solutions.",
        detail: "I’m a Product Manager with a strong foundation in computer science and experience across FinTech and EdTech. At Experian, I delivered $1M+ in savings via AWS migration and helped launch Experian Go for 130K+ new users. At UNext, I led the ideation and launch of ULabs, a browser-based coding platform transforming 150K+ student experiences."
    };

    const unext = {
        title: "Product Manager",
        company: "UNEXT Learning (Manipal Education)",
        dates: "May 2025 - Present",
        summary: "Built UNext Labs, an AI-powered coding platform, scaling to 150K+ students across 3 universities.",
        detail: "• Led ideation & roadmap for ULabs, supporting 50+ languages with AI-driven evaluation & remote proctoring.\n• Designed seamless LMS integration; piloted with 500+ learners, driving adoption across 3 universities.\n• Improved learning outcomes by enabling real-time feedback and rubric-based assessments."
    };

    const experian = {
        title: "Software Engineer, Database and Cloud Migration",
        company: "Experian",
        dates: "June 2021 - May 2023",
        summary: "Drove $1M+ cost savings through AWS cloud migration & enabled global credit access for 130K+ users.",
        detail: "• Led AWS cloud migration of critical data modules, achieving $1M+ savings and 20% efficiency gains.\n• Contributed to global launch of Experian Go, empowering 130K+ people access to fair credit.\n• Automated 50+ tests in Python & Bash, saving 30+ hours/month in development workflows.\n• Collaborated with 15+ stakeholders and authored 20+ PRDs and Confluence docs."
    };

    return (
        <>
            <h2 className="text-2xl md:text-3xl font-bold text-[#39FF14] mb-8 flex items-center">
                <User className="mr-3" size={28} />
                <TypeOnScrollView text="Profile" />
            </h2>
            <div className="space-y-12">
                <div>
                    <TypeOnScrollView as="h3" text="About Me" className="text-xl font-bold text-white mb-4" />
                    <CollapsibleBlock summary={aboutMe.summary} detailContent={aboutMe.detail} />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center"><Briefcase className="mr-2 text-[#39FF14]" /><TypeOnScrollView text="Experience" /></h3>
                    <div className="space-y-6">
                        <CollapsibleBlock 
                            isExperience 
                            title={unext.title} 
                            company={unext.company} 
                            dates={unext.dates} 
                            summary={unext.summary} 
                            detailContent={unext.detail} 
                        />
                        <CollapsibleBlock 
                            isExperience 
                            title={experian.title} 
                            company={experian.company} 
                            dates={experian.dates} 
                            summary={experian.summary} 
                            detailContent={experian.detail}
                        />
                    </div>
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center"><GraduationCap className="mr-2 text-[#39FF14]" /><TypeOnScrollView text="Education" /></h3>
                    <div className="space-y-4">
                        <div className="pl-4 border-l-2 border-[#39FF14]/50">
                            <TypeOnScrollView as="p" text="MBA (Business Management)" className="font-bold text-white" />
                            <TypeOnScrollView as="p" text="XLRI Jamshedpur" className="text-sm text-[#C5C6C7]" />
                        </div>
                        <div className="pl-4 border-l-2 border-[#39FF14]/50">
                            <TypeOnScrollView as="p" text="B.E. Computer Science" className="font-bold text-white" />
                            <TypeOnScrollView as="p" text="BITS Pilani" className="text-sm text-[#C5C6C7]" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

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
    <>
        <h2 className="text-2xl md:text-3xl font-bold text-[#39FF14] mb-8 flex items-center">
            <Code className="mr-3" size={28} />
            <TypeOnScrollView text="Portfolio" />
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {portfolioItems.map((item, index) => (
                <div key={index} className="border border-[#39FF14]/30 p-6 rounded-md bg-[#1a1a1a]/50 hover:border-[#39FF14] transition-all duration-300">
                    <TypeOnScrollView as="h3" text={item.title} className="text-xl font-bold text-[#39FF14] mb-2" />
                    <TypeOnScrollView as="p" text={item.description} className="text-[#C5C6C7] mb-4 text-sm" />
                    <p className="text-white text-sm"><TypeOnScrollView as="span" text="My Role:" className="font-bold" /> <TypeOnScrollView as="span" text={item.role} /></p>
                    <p className="text-white text-sm mt-2"><TypeOnScrollView as="span" text="Impact:" className="font-bold" /> <TypeOnScrollView as="span" text={item.impact} /></p>
                </div>
            ))}
        </div>
    </>
);


const ContactSection = () => (
    <>
        <h2 className="text-2xl md:text-3xl font-bold text-[#39FF14] mb-8 flex items-center">
            <Mail className="mr-3" size={28} />
            <TypeOnScrollView text="Contact" />
        </h2>
        <div className="text-center">
            <TypeOnScrollView as="p" text="Let's connect and build something great." className="text-lg text-white mb-4" />
            <TypeOnScrollView as="p" text="Feel free to reach out for collaborations or a chat." className="text-md text-[#C5C6C7] mb-8" />
            <div className="flex justify-center items-center space-x-6">
            <a href="mailto:shreyaspatil9904@gmail.com" className="inline-flex items-center text-[#C5C6C7] hover:text-[#39FF14] transition-colors duration-300">
                <Mail className="mr-2" />
                <TypeOnScrollView text="Email" />
            </a>
            <a href="https://linkedin.com/in/shreyas-patil-09/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-[#C5C6C7] hover:text-[#39FF14] transition-colors duration-300">
                <Linkedin className="mr-2" />
                <TypeOnScrollView text="LinkedIn" />
            </a>
            </div>
        </div>
    </>
);

const Footer = () => (
    <footer className="text-center py-6 border-t border-[#39FF14]/20">
        <p className="text-[#C5C6C7] text-sm">
            <TypeOnScrollView text="Coded with " as="span" />
            <span className="text-[#39FF14] animate-pulse">&lt;3</span> 
            <TypeOnScrollView text=" by Shreyas Patil" as="span" />
        </p>
    </footer>
);