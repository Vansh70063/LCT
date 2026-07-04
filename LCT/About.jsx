
Action: file_editor create /app/frontend/src/pages/About.jsx --file-text "import React from \"react\";
import { Phone, Mail, Instagram, ShieldCheck, Clock, Award, Compass, MessageSquare } from \"lucide-react\";

export default function About() {
  const values = [
    { title: \"Precision & Creativity\", desc: \"Every line of code and piece of design is crafted with deep attention to detail.\", icon: Compass },
    { title: \"Absolute Punctuality\", desc: \"Whether it is an academic submission or a commercial web launch, we deliver on time.\", icon: Clock },
    { title: \"Sustained Trust\", desc: \"Unlimited revisions and clear communication paths ensure our clients are always satisfied.\", icon: ShieldCheck },
  ];

  return (
    <div className=\"relative overflow-hidden pt-12 pb-24\">
      {/* Ambient background glow */}
      <div className=\"absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[160px] pointer-events-none\" />

      <div className=\"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20\">
        {/* About Hero Section */}
        <section className=\"grid grid-cols-1 lg:grid-cols-12 gap-12 items-center\">
          <div className=\"lg:col-span-7 space-y-6 text-left\">
            <span className=\"text-xs font-bold uppercase tracking-[0.2em] text-orange-500\">WHO WE ARE</span>
            <h1 className=\"text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter leading-none\">
              LastChoiceTech <br />
              <span className=\"bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-orange-500\">
                Services
              </span>
            </h1>
            <p className=\"text-zinc-300 text-lg leading-relaxed font-semibold\">
              \"One Solution. Endless Possibilities.\"
            </p>
            <p className=\"text-zinc-400 leading-relaxed text-base\">
              LastChoiceTech Services is a premier hybrid tech startup specializing in elite digital delivery and high-quality student academic support. We bridge the gap between creative visual execution and robust technical engineering. Our team operates at the intersection of modern web architectures, space planning, business identity, and advanced educational documentation.
            </p>
          </div>

          {/* Visual Collaboration Image */}
          <div className=\"lg:col-span-5 relative group\">
            <div className=\"absolute -inset-1 bg-gradient-to-r from-blue-600 to-orange-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500\" />
            <div className=\"relative bg-[#121214] border border-white/10 rounded-2xl overflow-hidden shadow-2xl\">
              <img
                src=\"https://images.unsplash.com/photo-1522071820081-009f0129c71c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwxfHxtb2Rlcm4l2BvZmZpY2UlMjB0ZWFtJTIwc3RhcnR1cHxlbnwwfHx8fDE3ODMxNDM0NjZ8MA&ixlib=rb-4.1.0&q=85\"
                alt=\"Our collaborative team\"
                className=\"w-full h-auto object-cover opacity-80 group-hover:scale-[1.02] transition-all duration-500\"
              />
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className=\"space-y-12\">
          <div className=\"text-center space-y-4\">
            <h2 className=\"text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight\">Our Pillars of Excellence</h2>
            <p className=\"text-zinc-500 text-sm max-w-2xl mx-auto\">
              How we sustain our signature brand across commercial and educational client systems.
            </p>
          </div>

          <div className=\"grid grid-cols-1 md:grid-cols-3 gap-8\">
            {values.map((val, idx) => (
              <div key={idx} className=\"bg-[#121214] border border-white/10 p-8 rounded-xl space-y-4 hover:border-orange-500/40 transition-colors duration-300\">
                <div className=\"w-12 h-12 bg-orange-950/20 border border-orange-500/20 rounded-lg flex items-center justify-center text-orange-500\">
                  <val.icon className=\"w-6 h-6\" />
                </div>
                <h3 className=\"text-xl font-medium text-white\">{val.title}</h3>
                <p className=\"text-zinc-400 text-sm leading-relaxed\">{val.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Beautiful Interactive Contact Details Card */}
        <section className=\"bg-[#121214] border border-white/10 rounded-2xl p-8 md:p-12 relative overflow-hidden text-left\">
          <div className=\"absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none\" />
          
          <div className=\"grid grid-cols-1 lg:grid-cols-12 gap-12\">
            <div className=\"lg:col-span-6 space-y-6\">
              <span className=\"text-xs font-bold uppercase tracking-[0.2em] text-blue-400\">CONNECT WITH OUR AGENTS</span>
              <h2 className=\"text-2xl sm:text-3xl font-bold tracking-tight\">Get in Touch Directly</h2>
              <p className=\"text-zinc-400 text-sm leading-relaxed\">
                Whether you prefer calling our direct hotlines, messaging via WhatsApp, or discussing over email, our agents are available 24/7 to solve your needs.
              </p>

              <div className=\"space-y-4 pt-4\">
                <div className=\"flex items-center gap-4 text-zinc-300\">
                  <div className=\"w-10 h-10 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-center text-blue-400 shrink-0\">
                    <Mail className=\"w-5 h-5\" />
                  </div>
                  <div>
                    <p className=\"text-xs text-zinc-500 font-semibold uppercase\">Email Support</p>
                    <a href=\"mailto:lastchoicetechservice@gmail.com\" className=\"text-sm font-medium hover:text-white transition-colors\">
                      lastchoicetechservice@gmail.com
                    </a>
                  </div>
                </div>

                <div className=\"flex items-center gap-4 text-zinc-300\">
                  <div className=\"w-10 h-10 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-center text-pink-500 shrink-0\">
                    <Instagram className=\"w-5 h-5\" />
                  </div>
                  <div>
                    <p className=\"text-xs text-zinc-500 font-semibold uppercase\">Instagram Handle</p>
                    <a
                      href=\"https://instagram.com/lastchoicetechservices\"
                      target=\"_blank\"
                      rel=\"noopener noreferrer\"
                      className=\"text-sm font-medium hover:text-white transition-colors\"
                    >
                      @lastchoicetechservices
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className=\"lg:col-span-6 bg-black/40 border border-white/5 rounded-xl p-8 space-y-6\">
              <h3 className=\"font-semibold text-lg text-white\">Call/WhatsApp Support</h3>
              <p className=\"text-zinc-500 text-xs\">Direct Indian Regional Support Lines</p>
              
              <div className=\"space-y-4\">
                <a
                  href=\"tel:+917006328209\"
                  className=\"flex items-center justify-between p-4 bg-zinc-900/50 border border-white/5 rounded-lg hover:border-blue-500/50 hover:bg-zinc-900 transition-all duration-300\"
                >
                  <span className=\"text-sm font-medium text-zinc-300\">Primary Support Line</span>
                  <span className=\"text-sm font-bold text-blue-400\">+91 7006328209</span>
                </a>

                <a
                  href=\"tel:+919103519800\"
                  className=\"flex items-center justify-between p-4 bg-zinc-900/50 border border-white/5 rounded-lg hover:border-blue-500/50 hover:bg-zinc-900 transition-all duration-300\"
                >
                  <span className=\"text-sm font-medium text-zinc-300\">Alternate Support Line 1</span>
                  <span className=\"text-sm font-bold text-orange-400\">+91 9103519800</span>
                </a>

                <a
                  href=\"tel:+917051542143\"
                  className=\"flex items-center justify-between p-4 bg-zinc-900/50 border border-white/5 rounded-lg hover:border-blue-500/50 hover:bg-zinc-900 transition-all duration-300\"
                >
                  <span className=\"text-sm font-medium text-zinc-300\">Alternate Support Line 2</span>
                  <span className=\"text-sm font-bold text-blue-400\">+91 7051542143</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
"
