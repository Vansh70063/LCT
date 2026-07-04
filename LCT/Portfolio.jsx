
Action: file_editor create /app/frontend/src/pages/Portfolio.jsx --file-text "import React from \"react\";
import { Star, ArrowUpRight, ExternalLink, Quote } from \"lucide-react\";

export default function Portfolio() {
  const projects = [
    {
      key: \"quantum-ecommerce\",
      title: \"Quantum E-Commerce Platform\",
      category: \"Digital Services\",
      desc: \"An ultra-fast, high-converting React and FastAPI online storefront equipped with search indexing, animations, and micro-interaction states.\",
      img: \"https://images.unsplash.com/photo-1707836885254-79b6e3d7b18d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2OTV8MHwxfHNlYXJjaHwzfHxkaWdpdGFsJTIwcG9ydGZvbGlvJTIwd2Vic2l0ZSUyMG1vY2t1cHxlbnwwfHx8fDE3ODMxNDM0NjZ8MA&ixlib=rb-4.1.0&q=85\",
      tag: \"Web App\"
    },
    {
      key: \"luxe-loft\",
      title: \"Luxe Obsidian Living Room\",
      category: \"Design Services\",
      desc: \"A bespoke, photorealistic 3D room render and interior space planning design showcasing dark obsidian aesthetics and warm accent lighting.\",
      img: \"https://images.unsplash.com/photo-1627542557169-5ed71c66ed85?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2OTV8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwcG9ydGZvbGlvJTIwd2Vic2l0ZSUyMG1vY2t1cHxlbnwwfHx8fDE3ODMxNDM0NjZ8MA&ixlib=rb-4.1.0&q=85\",
      tag: \"3D Visualization\"
    },
    {
      key: \"pitch-deck\",
      title: \"SaaS Series-A Investment Pitch\",
      category: \"Business Services\",
      desc: \"An elite, highly visual presentation design with complex charts, financial layouts, and crisp vector assets designed for venture funding rounds.\",
      img: \"https://images.unsplash.com/photo-1771873680097-7506773a2b02?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzJ8MHwxfHNlYXJjaHwzfHxtb2Rlcm4lMjBhYnN0cmFjdCUyMHRlY2glMjBiYWNrZ3JvdW5kJTIwYmx1ZSUyMG9yYW5nZXxlbnwwfHx8fDE3ODMxNDM0NjZ8MA&ixlib=rb-4.1.0&q=85\",
      tag: \"Branding & Pitch\"
    },
    {
      key: \"neural-research\",
      title: \"Neural Network Academic Synthesis\",
      category: \"Student Services\",
      desc: \"Expertly compiled, double-referenced research thesis study notes and PPT preparation explaining high-dimensional optimization models.\",
      img: \"https://images.unsplash.com/photo-1522071820081-009f0129c71c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwxfHxtb2Rlcm4l2BvZmZpY2UlMjB0ZWFtJTIwc3RhcnR1cHxlbnwwfHx8fDE3ODMxNDM0NjZ8MA&ixlib=rb-4.1.0&q=85\",
      tag: \"Academic Guide\"
    }
  ];

  const reviews = [
    {
      author: \"Dr. Ananya Roy\",
      role: \"Dean of Computer Science Dept.\",
      text: \"LastChoiceTech delivered my presentation slide decks on extremely tight schedules. The visual clarity and structured flow of notes helped our lecture stand out beautifully.\",
      rating: 5
    },
    {
      author: \"Vikram Malhotra\",
      role: \"Founder, Zenith Fintech\",
      text: \"Our brand guidelines and SaaS platform landing page was designed and shipped flawlessly. The dark high-contrast layouts matched our company identity perfectly.\",
      rating: 5
    },
    {
      author: \"Sneha Gupta\",
      role: \"Retail Shop Owner\",
      text: \"The double-sided business card templates and rolls-up banners layouts are exceptional. They handled printing formatting and revisions without any complaint.\",
      rating: 5
    }
  ];

  return (
    <div className=\"relative pt-12 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-24\">
      {/* Ambient backgrounds */}
      <div className=\"absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none\" />
      <div className=\"absolute top-2/3 right-1/4 w-[350px] h-[350px] bg-orange-600/5 rounded-full blur-[120px] pointer-events-none\" />

      {/* Header */}
      <section className=\"text-left space-y-4 max-w-3xl\">
        <span className=\"text-xs font-bold uppercase tracking-[0.2em] text-orange-500\">PAST WORK</span>
        <h1 className=\"text-4xl sm:text-5xl font-bold tracking-tighter leading-none\">
          Our Featured Projects & <br />
          <span className=\"bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-orange-500\">
            Client Success Stories
          </span>
        </h1>
        <p className=\"text-zinc-400 leading-relaxed text-base\">
          A showcase of our world-class results for corporate brands and academic students alike, engineered to absolute perfection.
        </p>
      </section>

      {/* Projects Grid */}
      <section className=\"grid grid-cols-1 md:grid-cols-2 gap-8 text-left\">
        {projects.map((proj) => (
          <div
            key={proj.key}
            data-testid={`project-card-${proj.key}`}
            className=\"bg-[#121214] border border-white/10 rounded-xl overflow-hidden group hover:border-blue-500/30 transition-all duration-300 flex flex-col h-full\"
          >
            {/* Image container */}
            <div className=\"relative h-64 overflow-hidden bg-zinc-950\">
              <img
                src={proj.img}
                alt={proj.title}
                className=\"w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500\"
              />
              <span className=\"absolute bottom-4 left-4 bg-black/70 backdrop-blur border border-white/10 px-2.5 py-1 rounded text-xs font-semibold text-zinc-300\">
                {proj.tag}
              </span>
            </div>

            {/* Content info */}
            <div className=\"p-6 flex flex-col justify-between flex-grow space-y-4\">
              <div className=\"space-y-2\">
                <span className=\"text-xs font-bold text-blue-400 uppercase tracking-widest leading-none\">
                  {proj.category}
                </span>
                <h3 className=\"text-xl font-bold text-white tracking-tight group-hover:text-blue-400 transition-colors\">
                  {proj.title}
                </h3>
                <p className=\"text-zinc-400 text-sm leading-relaxed\">
                  {proj.desc}
                </p>
              </div>

              <div className=\"pt-4 border-t border-white/5 flex items-center justify-between\">
                <span className=\"text-xs text-zinc-500 font-semibold uppercase tracking-wider\">
                  Success Deliverable
                </span>
                <span className=\"text-blue-500 flex items-center gap-1 text-xs font-bold\">
                  Verified Case Study
                  <ArrowUpRight className=\"w-3.5 h-3.5\" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Testimonials section */}
      <section className=\"space-y-12\">
        <div className=\"text-left max-w-2xl border-l-2 border-orange-500 pl-4\">
          <span className=\"text-xs font-bold uppercase tracking-[0.2em] text-orange-500\">CLIENT VOICE</span>
          <h2 className=\"text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1\">Client Reviews & Verification</h2>
        </div>

        <div className=\"grid grid-cols-1 md:grid-cols-3 gap-6 text-left\">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              data-testid={`client-review-${idx}`}
              className=\"bg-[#121214] border border-white/10 p-6 rounded-xl relative flex flex-col justify-between space-y-6 hover:border-orange-500/20 transition-all duration-300\"
            >
              <Quote className=\"absolute top-6 right-6 w-8 h-8 text-white/5 pointer-events-none\" />
              
              <div className=\"space-y-4\">
                {/* Rating */}
                <div className=\"flex gap-1\">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className=\"w-4 h-4 fill-orange-500 text-orange-500\" />
                  ))}
                </div>
                {/* Quote Text */}
                <p className=\"text-zinc-300 text-sm italic leading-relaxed\">
                  \"{rev.text}\"
                </p>
              </div>

              {/* Author Info */}
              <div className=\"pt-4 border-t border-white/5\">
                <h4 className=\"font-bold text-sm text-white\">{rev.author}</h4>
                <p className=\"text-xs text-zinc-500 font-semibold\">{rev.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
"