
Action: file_editor create /app/frontend/src/pages/Home.jsx --file-text "import React from \"react\";
import { Link } from \"react-router-dom\";
import { ArrowRight, Laptop, Palette, Briefcase, GraduationCap, CheckCircle, Shield, Award, Sparkles } from \"lucide-react\";

export default function Home() {
  const benefits = [
    { title: \"Quality Work\", desc: \"Rigorous standards for code, assets, and document production.\", icon: Award },
    { title: \"On-Time Delivery\", desc: \"Never miss a milestone or submission deadline.\", icon: CheckCircle },
    { title: \"Client Satisfaction\", desc: \"100% satisfaction or unlimited free iterations.\", icon: Sparkles },
    { title: \"24/7 Support\", desc: \"Continuous communication updates for your peace of mind.\", icon: Shield },
  ];

  const whoWeServe = [
    \"Businesses & Startups\",
    \"Shops & Retailers\",
    \"Coaching Institutes\",
    \"Students & Researchers\",
    \"Individuals & Creators\",
  ];

  return (
    <div className=\"relative overflow-hidden\">
      {/* Glow Ambient Effects */}
      <div className=\"absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none\" />
      <div className=\"absolute top-1/3 right-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-[120px] pointer-events-none\" />

      {/* Hero Section */}
      <section className=\"relative pt-20 pb-20 md:pt-32 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto\">
        <div className=\"grid grid-cols-1 lg:grid-cols-12 gap-12 items-center\">
          {/* Hero Text */}
          <div className=\"lg:col-span-7 space-y-8 text-left\">
            <div className=\"inline-flex items-center gap-2 border border-white/10 px-3 py-1 rounded-full bg-white/5 backdrop-blur\">
              <span className=\"text-xs font-bold uppercase tracking-[0.2em] text-blue-500\">LastChoiceTech Services</span>
              <span className=\"w-1.5 h-1.5 bg-green-500 rounded-full animate-ping\" />
            </div>
            
            <h1 className=\"text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-zinc-400\">
              Creative Solutions for <br />
              <span className=\"bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-orange-500\">
                Businesses & Students
              </span>
            </h1>

            <p className=\"text-zinc-400 text-lg leading-relaxed max-w-2xl\">
              Helping businesses grow digitally with top-tier technology and design while assisting students with exceptional, highly professional academic resources.
            </p>

            <div className=\"flex flex-wrap gap-4\">
              <Link
                to=\"/services\"
                data-testid=\"home-get-started\"
                className=\"flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-medium px-6 py-3 rounded-lg shadow-lg shadow-blue-500/15 transition-all duration-300\"
              >
                Explore Services
                <ArrowRight className=\"w-4 h-4\" />
              </Link>
              <Link
                to=\"/portfolio\"
                data-testid=\"home-view-portfolio\"
                className=\"flex items-center gap-2 border border-white/10 hover:border-orange-500 hover:text-orange-500 font-medium px-6 py-3 rounded-lg bg-white/5 transition-all duration-300\"
              >
                View Past Projects
              </Link>
            </div>
          </div>

          {/* Hero Visual Poster / Banner */}
          <div className=\"lg:col-span-5 relative group\">
            <div className=\"absolute -inset-1.5 bg-gradient-to-r from-blue-600 to-orange-500 rounded-2xl blur opacity-30 group-hover:opacity-40 transition duration-1000 group-hover:duration-200\" />
            <div className=\"relative bg-[#121214] border border-white/10 rounded-2xl overflow-hidden shadow-2xl\">
              <img
                src=\"https://customer-assets.emergentagent.com/job_ab9b035c-6550-4b11-9765-a7bbf827fb79/artifacts/v9oamfm9_poster.png\"
                alt=\"LastChoiceTech Flyer and Services\"
                className=\"w-full h-auto object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300\"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid: Core Service Categories */}
      <section className=\"py-20 bg-black/40 border-y border-white/5 px-4 sm:px-6 lg:px-8\">
        <div className=\"max-w-7xl mx-auto\">
          <div className=\"text-center space-y-4 mb-16\">
            <h2 className=\"text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight\">
              Our Multi-disciplinary Services
            </h2>
            <p className=\"text-zinc-500 text-sm sm:text-base max-w-2xl mx-auto\">
              We leverage professional quality workflows across four crucial sectors of the modern landscape.
            </p>
          </div>

          {/* Bento layout */}
          <div className=\"grid grid-cols-1 md:grid-cols-12 gap-6\">
            {/* Box 1: Digital */}
            <div className=\"md:col-span-8 bg-[#121214] border border-white/10 p-8 rounded-xl relative group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40\">
              <div className=\"absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none\" />
              <div className=\"flex flex-col h-full justify-between\">
                <div>
                  <div className=\"w-12 h-12 bg-blue-950/40 border border-blue-500/20 rounded-lg flex items-center justify-center text-blue-500 mb-6\">
                    <Laptop className=\"w-6 h-6\" />
                  </div>
                  <h3 className=\"text-xl sm:text-2xl font-medium tracking-tight mb-2 text-white\">Digital Services</h3>
                  <p className=\"text-zinc-400 text-sm sm:text-base mb-6 max-w-xl\">
                    High performance custom websites, sleek layouts, logo-matching visuals, visiting card templates, roll-up banner formats, and printing layouts.
                  </p>
                </div>
                <div className=\"flex flex-wrap gap-2\">
                  <span className=\"text-xs bg-white/5 border border-white/5 px-3 py-1 rounded-full text-zinc-300\">Website Development</span>
                  <span className=\"text-xs bg-white/5 border border-white/5 px-3 py-1 rounded-full text-zinc-300\">Graphic Editing</span>
                  <span className=\"text-xs bg-white/5 border border-white/5 px-3 py-1 rounded-full text-zinc-300\">Poster & T-Shirt Design</span>
                </div>
              </div>
            </div>

            {/* Box 2: Design */}
            <div className=\"md:col-span-4 bg-[#121214] border border-white/10 p-8 rounded-xl relative group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/40\">
              <div className=\"absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl pointer-events-none\" />
              <div className=\"flex flex-col h-full justify-between\">
                <div>
                  <div className=\"w-12 h-12 bg-orange-950/40 border border-orange-500/20 rounded-lg flex items-center justify-center text-orange-500 mb-6\">
                    <Palette className=\"w-6 h-6\" />
                  </div>
                  <h3 className=\"text-xl sm:text-2xl font-medium tracking-tight mb-2 text-white\">Interior Design</h3>
                  <p className=\"text-zinc-400 text-sm leading-relaxed mb-6\">
                    Professional, immersive interior layout visualization and custom space architectural planning.
                  </p>
                </div>
                <div>
                  <span className=\"text-xs bg-white/5 border border-white/5 px-3 py-1 rounded-full text-zinc-300\">Interior & Room Designing</span>
                </div>
              </div>
            </div>

            {/* Box 3: Business */}
            <div className=\"md:col-span-4 bg-[#121214] border border-white/10 p-8 rounded-xl relative group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/40\">
              <div className=\"absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl pointer-events-none\" />
              <div className=\"flex flex-col h-full justify-between\">
                <div>
                  <div className=\"w-12 h-12 bg-orange-950/40 border border-orange-500/20 rounded-lg flex items-center justify-center text-orange-500 mb-6\">
                    <Briefcase className=\"w-6 h-6\" />
                  </div>
                  <h3 className=\"text-xl sm:text-2xl font-medium tracking-tight mb-2 text-white\">Business Branding</h3>
                  <p className=\"text-zinc-400 text-sm leading-relaxed mb-6\">
                    High quality corporate identity layout kits, corporate presentations, and comprehensive branding solutions.
                  </p>
                </div>
                <div>
                  <span className=\"text-xs bg-white/5 border border-white/5 px-3 py-1 rounded-full text-zinc-300\">Presentation & Brand Kits</span>
                </div>
              </div>
            </div>

            {/* Box 4: Student */}
            <div className=\"md:col-span-8 bg-[#121214] border border-white/10 p-8 rounded-xl relative group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40\">
              <div className=\"absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none\" />
              <div className=\"flex flex-col h-full justify-between\">
                <div>
                  <div className=\"w-12 h-12 bg-blue-950/40 border border-blue-500/20 rounded-lg flex items-center justify-center text-blue-500 mb-6\">
                    <GraduationCap className=\"w-6 h-6\" />
                  </div>
                  <h3 className=\"text-xl sm:text-2xl font-medium tracking-tight mb-2 text-white\">Student Academic Solutions</h3>
                  <p className=\"text-zinc-400 text-sm sm:text-base mb-6 max-w-xl\">
                    High quality digital notes preparation, formatting, referencing, competitive test series summaries, and presentation layout support.
                  </p>
                </div>
                <div className=\"flex flex-wrap gap-2\">
                  <span className=\"text-xs bg-white/5 border border-white/5 px-3 py-1 rounded-full text-zinc-300\">Assignment Making</span>
                  <span className=\"text-xs bg-white/5 border border-white/5 px-3 py-1 rounded-full text-zinc-300\">Notes & PPT Making</span>
                  <span className=\"text-xs bg-white/5 border border-white/5 px-3 py-1 rounded-full text-zinc-300\">Exam Test series</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className=\"py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8\">
        <div className=\"text-center space-y-4 mb-16\">
          <h2 className=\"text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight\">
            Why Partner with LastChoiceTech?
          </h2>
          <p className=\"text-zinc-500 text-sm max-w-2xl mx-auto\">
            Our work represents the ultimate choice in professional deliverables, combining creativity and precision.
          </p>
        </div>

        <div className=\"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8\">
          {benefits.map((benefit, i) => (
            <div key={i} className=\"bg-[#121214] border border-white/10 p-6 rounded-xl relative group transition-all duration-300 hover:border-blue-500/30\">
              <div className=\"w-10 h-10 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center text-orange-500 mb-4 group-hover:text-blue-400 transition-colors\">
                <benefit.icon className=\"w-5 h-5\" />
              </div>
              <h3 className=\"font-semibold text-white mb-2\">{benefit.title}</h3>
              <p className=\"text-zinc-400 text-xs sm:text-sm leading-relaxed\">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Who We Serve Section */}
      <section className=\"py-16 bg-gradient-to-b from-[#0a0a0c] to-transparent border-t border-white/5\">
        <div className=\"max-w-5xl mx-auto px-4 sm:px-6 text-center\">
          <h2 className=\"text-xl sm:text-2xl font-semibold tracking-tight mb-8\">
            Who We Serve
          </h2>
          <div className=\"flex flex-wrap justify-center gap-3\">
            {whoWeServe.map((target, idx) => (
              <span
                key={idx}
                className=\"bg-[#121214] border border-white/10 hover:border-blue-500/50 hover:text-blue-400 transition-colors cursor-default px-5 py-2 rounded-lg text-sm font-medium text-zinc-300 shadow-sm\"
              >
                {target}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className=\"py-20 bg-gradient-to-r from-blue-950/20 to-orange-950/10 border-t border-white/5 relative\">
        <div className=\"max-w-4xl mx-auto text-center px-4 sm:px-6 space-y-6\">
          <h2 className=\"text-3xl sm:text-4xl font-bold tracking-tight\">
            Ready to Accelerate Your Projects?
          </h2>
          <p className=\"text-zinc-400 text-sm sm:text-base max-w-xl mx-auto\">
            Create an account in seconds, define your goals, use our elite AI requirements helper, and let us handle the rest.
          </p>
          <div className=\"flex justify-center gap-4 pt-4\">
            <Link
              to=\"/register\"
              data-testid=\"home-cta-signup\"
              className=\"bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-all duration-300\"
            >
              Get Started Now
            </Link>
            <Link
              to=\"/about\"
              data-testid=\"home-cta-about\"
              className=\"border border-white/10 hover:border-white text-zinc-300 px-6 py-3 rounded-lg hover:bg-white/5 transition-all duration-300\"
            >
              Meet the Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
"
