
Action: file_editor create /app/frontend/src/pages/Services.jsx --file-text "import React, { useState, useEffect } from \"react\";
import { Link, useNavigate } from \"react-router-dom\";
import axios from \"axios\";
import { useAuth } from \"@/context/AuthContext\";
import { Laptop, Palette, Briefcase, GraduationCap, ArrowRight, Loader2, DollarSign } from \"lucide-react\";

export default function Services() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const backendUrl = process.env.REACT_APP_BACKEND_URL || \"\";
        const { data } = await axios.get(`${backendUrl}/api/prices`);
        setServices(data);
      } catch (err) {
        console.error(\"Error fetching service prices:\", err);
        setError(\"Unable to load live services catalog. Showing offline catalog.\");
        // Fallback offline catalog in case of DB disconnect
        setServices([
          { key: \"website-development\", name: \"Website Development\", category: \"digital\", price: 24999.0, price_unit: \"starting at\", description: \"Custom, responsive website built with modern frameworks like React, Tailwind, and FastAPI. Includes animations, SEO setup, and high-performance.\" },
          { key: \"graphic-editing\", name: \"Graphic Editing\", category: \"digital\", price: 1499.0, price_unit: \"per project\", description: \"Professional photo retouching, color grading, background removal, and vector asset generation for your marketing channels.\" },
          { key: \"visiting-card-design\", name: \"Visiting Card Design\", category: \"digital\", price: 999.0, price_unit: \"flat rate\", description: \"Elegant, double-sided business card designs with source files and print-ready files tailored to your brand identity.\" },
          { key: \"poster-banner-design\", name: \"Poster & Banner Design\", category: \"digital\", price: 1999.0, price_unit: \"per design\", description: \"Eye-catching commercial posters, social media banners, roll-up banners, and print advertisements.\" },
          { key: \"t-shirt-design\", name: \"T-shirt Design\", category: \"digital\", price: 1499.0, price_unit: \"per design\", description: \"Creative custom graphics, typography, and illustration files optimized for screen printing or print-on-demand.\" },
          { key: \"interior-room-design\", name: \"Interior & Room Designing\", category: \"design\", price: 14999.0, price_unit: \"per room\", description: \"3D visualization, spatial planning, furniture selection, and lighting theme consultation for modern residential or office spaces.\" },
          { key: \"presentation-design\", name: \"Presentation Design\", category: \"business\", price: 3999.0, price_unit: \"up to 15 slides\", description: \"High-impact PowerPoint or PDF decks for business pitches, investor rounds, or corporate reporting.\" },
          { key: \"business-branding\", name: \"Business Branding\", category: \"business\", price: 9999.0, price_unit: \"package\", description: \"Complete corporate identity package including logo design, color palette, brand guidelines book, and letterheads.\" },
          { key: \"notes-making\", name: \"Notes Making\", category: \"student\", price: 999.0, price_unit: \"per subject\", description: \"Comprehensive, clean, and structured digital summaries of academic lectures, textbooks, or specific course syllabi.\" },
          { key: \"assignment-making\", name: \"Assignment Making\", category: \"student\", price: 1499.0, price_unit: \"per assignment\", description: \"Premium academic research assistance, structured documentation, reference compiling, and formatting guidelines support.\" },
          { key: \"competitive-exam-tests\", name: \"Competitive Exam Tests\", category: \"student\", price: 1999.0, price_unit: \"test series\", description: \"Customized mock test preparation, subject-wise quizzes, and standard answers key for academic and entrance exams.\" },
          { key: \"presentation-making\", name: \"Presentation Making (PPT)\", category: \"student\", price: 1199.0, price_unit: \"up to 10 slides\", description: \"Visually appealing and highly coherent academic presentation slides tailored to school or university project guidelines.\" }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, []);

  const handleOrderRedirect = (serviceKey) => {
    if (!user) {
      navigate(`/login?redirect=dashboard&service=${serviceKey}`);
    } else {
      navigate(`/dashboard?service=${serviceKey}`);
    }
  };

  const categories = [
    {
      id: \"digital\",
      title: \"Digital Services\",
      desc: \"Top-tier custom software development, creative design layouts, and customized graphics production.\",
      icon: Laptop,
      colorClass: \"text-blue-500 bg-blue-950/20 border-blue-500/10\"
    },
    {
      id: \"design\",
      title: \"Design Services\",
      desc: \"Architectural consultation, immersive 3D space layouts, and functional room planning.\",
      icon: Palette,
      colorClass: \"text-orange-500 bg-orange-950/20 border-orange-500/10\"
    },
    {
      id: \"business\",
      title: \"Business Services\",
      desc: \"Elite investor pitching decks, brand identity books, and structured business assets.\",
      icon: Briefcase,
      colorClass: \"text-blue-400 bg-blue-900/10 border-blue-500/10\"
    },
    {
      id: \"student\",
      title: \"Student Services\",
      desc: \"Excellent, highly professional academic slides preparation, note summarization, and support.\",
      icon: GraduationCap,
      colorClass: \"text-orange-400 bg-orange-900/10 border-orange-500/10\"
    }
  ];

  return (
    <div className=\"relative pt-12 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto\">
      {/* Glow ambient background effects */}
      <div className=\"absolute top-0 right-1/4 w-80 h-80 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none\" />
      <div className=\"absolute bottom-1/4 left-1/4 w-80 h-80 bg-orange-600/5 rounded-full blur-[100px] pointer-events-none\" />

      {/* Header */}
      <section className=\"text-left space-y-4 mb-20 max-w-3xl\">
        <span className=\"text-xs font-bold uppercase tracking-[0.2em] text-blue-500\">SERVICE CATALOG</span>
        <h1 className=\"text-4xl sm:text-5xl font-bold tracking-tighter leading-none\">
          Our Specializations & <br />
          <span className=\"bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-orange-500\">
            Flexible Pricing Options
          </span>
        </h1>
        <p className=\"text-zinc-400 leading-relaxed text-base\">
          All service items are customizable. The starting prices shown below are retrieved dynamically from the central database. If you wish to hardcode static prices, simply edit the JSX values marked inside the comments.
        </p>
      </section>

      {loading ? (
        <div className=\"flex flex-col items-center justify-center py-20 gap-4\">
          <Loader2 className=\"w-12 h-12 text-blue-500 animate-spin\" />
          <p className=\"text-zinc-400 text-sm\">Loading dynamic catalogs and pricing...</p>
        </div>
      ) : (
        <div className=\"space-y-24\">
          {error && (
            <div className=\"bg-orange-950/20 border border-orange-500/20 text-orange-400 px-4 py-3 rounded-lg text-sm max-w-2xl\">
              {error}
            </div>
          )}

          {categories.map((cat) => {
            const categoryServices = services.filter((s) => s.category === cat.id);
            if (categoryServices.length === 0) return null;

            return (
              <div key={cat.id} className=\"space-y-8 text-left\">
                {/* Category Header */}
                <div className=\"flex items-start gap-4 border-b border-white/5 pb-4\">
                  <div className={`w-12 h-12 rounded-lg border flex items-center justify-center shrink-0 ${cat.colorClass}`}>
                    <cat.icon className=\"w-6 h-6\" />
                  </div>
                  <div>
                    <h2 className=\"text-2xl font-bold tracking-tight text-white\">{cat.title}</h2>
                    <p className=\"text-zinc-400 text-sm max-w-2xl mt-1\">{cat.desc}</p>
                  </div>
                </div>

                {/* Services Cards Grid */}
                <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6\">
                  {categoryServices.map((service) => (
                    <div
                      key={service.key}
                      data-testid={`service-card-${service.key}`}
                      className=\"bg-[#121214] border border-white/10 rounded-xl p-6 flex flex-col justify-between relative group hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(65,105,225,0.1)]\"
                    >
                      {/* Pricing Tag */}
                      <div className=\"absolute top-6 right-6 text-right\">
                        {/* 
                          ---------------------------------------------------------
                          PRICING PLACEHOLDER CODE SECTION (EDIT BELOW MANUALLY IF NEEDED):
                          If you want to override database pricing, replace {service.price} 
                          with static text (e.g. 24999) inside the tags below.
                          ---------------------------------------------------------
                        */}
                        <div className=\"text-xs text-zinc-500 font-semibold lowercase tracking-wide mb-0.5\">
                          {service.price_unit}
                        </div>
                        <div
                          data-testid={`service-price-${service.key}`}
                          className=\"text-lg sm:text-xl font-bold text-orange-500 tracking-tight\"
                        >
                          ₹{Number(service.price).toLocaleString(\"en-IN\")}
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className=\"space-y-4 pr-24 text-left\">
                        <h3 className=\"text-lg font-semibold text-white tracking-tight group-hover:text-blue-400 transition-colors\">
                          {service.name}
                        </h3>
                        <p className=\"text-zinc-400 text-xs sm:text-sm leading-relaxed line-clamp-4\">
                          {service.description}
                        </p>
                      </div>

                      {/* Action Button */}
                      <div className=\"pt-6 mt-6 border-t border-white/5 flex justify-end\">
                        <button
                          onClick={() => handleOrderRedirect(service.key)}
                          data-testid={`service-order-${service.key}`}
                          className=\"flex items-center gap-1.5 text-xs font-semibold text-zinc-300 group-hover:text-blue-400 transition-colors bg-white/5 border border-white/5 py-1.5 px-3 rounded-lg hover:bg-white/10\"
                        >
                          Request Service
                          <ArrowRight className=\"w-3.5 h-3.5\" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
"
