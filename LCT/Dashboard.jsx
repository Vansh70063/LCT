
Action: file_editor create /app/frontend/src/pages/Dashboard.jsx --file-text "import React, { useState, useEffect } from \"react\";
import { useSearchParams, useNavigate } from \"react-router-dom\";
import axios from \"axios\";
import { useAuth } from \"@/context/AuthContext\";
import { 
  Sparkles, Plus, Calendar, AlertCircle, CheckCircle2, 
  Clock, Play, Ban, Trash2, Loader2, ArrowRight, FileText 
} from \"lucide-react\";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParamsState] = useSearchParams();
  const [services, setServices] = useState([]);
  const [requests, setRequests] = useState([]);
  
  // Form State
  const [selectedService, setSelectedService] = useState(\"\");
  const [description, setDescription] = useState(\"\");
  const [deadline, setDeadline] = useState(\"\");
  
  // AI Assist State
  const [aiPrompt, setAiPrompt] = useState(\"\");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(\"\");

  // UI General State
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(\"\");
  const [formSuccess, setFormSuccess] = useState(\"\");
  const [listLoading, setListLoading] = useState(true);

  const initialServiceKey = searchParams.get(\"service\") || \"\";

  // Guard: If not logged in, redirect to login
  useEffect(() => {
    if (user === false) {
      navigate(\"/login?redirect=dashboard\");
    } else if (user && user.role === \"admin\") {
      navigate(\"/admin\");
    }
  }, [user, navigate]);

  // Fetch Services (Prices) & Requests
  const fetchData = async () => {
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || \"\";
      
      const pricesRes = await axios.get(`${backendUrl}/api/prices`);
      setServices(pricesRes.data);
      
      if (initialServiceKey && pricesRes.data.some(s => s.key === initialServiceKey)) {
        setSelectedService(initialServiceKey);
      } else if (pricesRes.data.length > 0) {
        setSelectedService(pricesRes.data[0].key);
      }

      const reqRes = await axios.get(`${backendUrl}/api/requests`);
      setRequests(reqRes.data);
    } catch (e) {
      console.error(\"Error fetching dashboard data:\", e);
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === \"client\") {
      fetchData();
    }
  }, [user]);

  // Sync chosen service from URL query if changed
  useEffect(() => {
    if (initialServiceKey && services.some(s => s.key === initialServiceKey)) {
      setSelectedService(initialServiceKey);
    }
  }, [initialServiceKey, services]);

  const handleAISuggest = async () => {
    if (!aiPrompt) {
      setAiError(\"Please type a brief idea for the AI to elaborate on.\");
      return;
    }
    
    const serviceObj = services.find(s => s.key === selectedService);
    const serviceName = serviceObj ? serviceObj.name : \"Selected Service\";

    setAiLoading(true);
    setAiError(\"\");
    setFormError(\"\");

    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || \"\";
      const { data } = await axios.post(`${backendUrl}/api/ai/suggest`, {
        service_name: serviceName,
        prompt_hint: aiPrompt
      });
      
      if (data.suggestion) {
        setDescription(data.suggestion);
        setAiPrompt(\"\");
      } else if (data.error) {
        setAiError(`AI Assistance Error: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      setAiError(\"Connection error while requesting AI assist. Please draft manually.\");
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    if (!selectedService || !description || !deadline) {
      setFormError(\"Please fill out all request fields.\");
      return;
    }

    setFormLoading(true);
    setFormError(\"\");
    setFormSuccess(\"\");

    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || \"\";
      await axios.post(`${backendUrl}/api/requests`, {
        service_key: selectedService,
        description,
        deadline
      });

      setFormSuccess(\"Your project request has been submitted successfully!\");
      setDescription(\"\");
      setDeadline(\"\");
      setAiPrompt(\"\");
      
      // Clear URL service parameter to avoid double picking
      setSearchParamsState({});

      // Refetch requests
      const reqRes = await axios.get(`${backendUrl}/api/requests`);
      setRequests(reqRes.data);
    } catch (err) {
      console.error(err);
      setFormError(err.response?.data?.detail || \"Failed to submit request. Please try again.\");
    } finally {
      setFormLoading(false);
    }
  };

  const handleCancelRequest = async (id) => {
    if (!window.confirm(\"Are you sure you want to cancel this request?\")) {
      return;
    }

    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || \"\";
      await axios.delete(`${backendUrl}/api/requests/${id}`);
      
      // Update list
      setRequests(requests.filter(r => r.id !== id));
    } catch (err) {
      alert(err.response?.data?.detail || \"Failed to cancel request.\");
    }
  };

  const getStatusBadge = (status, id) => {
    const baseClass = \"inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border \";
    switch (status) {
      case \"Pending\":
        return (
          <span data-testid={`request-status-${id}`} className={`${baseClass} text-yellow-500 bg-yellow-950/20 border-yellow-500/20`}>
            <Clock className=\"w-3.5 h-3.5\" />
            Pending Approval
          </span>
        );
      case \"Approved\":
        return (
          <span data-testid={`request-status-${id}`} className={`${baseClass} text-blue-400 bg-blue-950/20 border-blue-500/20`}>
            <CheckCircle2 className=\"w-3.5 h-3.5\" />
            Approved
          </span>
        );
      case \"In Progress\":
        return (
          <span data-testid={`request-status-${id}`} className={`${baseClass} text-indigo-400 bg-indigo-950/20 border-indigo-500/20`}>
            <Play className=\"w-3.5 h-3.5\" />
            In Progress
          </span>
        );
      case \"Completed\":
        return (
          <span data-testid={`request-status-${id}`} className={`${baseClass} text-green-400 bg-green-950/20 border-green-500/20`}>
            <CheckCircle2 className=\"w-3.5 h-3.5\" />
            Completed
          </span>
        );
      case \"Cancelled\":
        return (
          <span data-testid={`request-status-${id}`} className={`${baseClass} text-red-400 bg-red-950/20 border-red-500/20`}>
            <Ban className=\"w-3.5 h-3.5\" />
            Cancelled
          </span>
        );
      default:
        return (
          <span data-testid={`request-status-${id}`} className={`${baseClass} text-zinc-400 bg-zinc-900 border-zinc-700`}>
            {status}
          </span>
        );
    }
  };

  return (
    <div className=\"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12\">
      {/* Welcome Heading */}
      <section className=\"text-left space-y-2 mb-12 border-b border-white/5 pb-6\">
        <h1 className=\"text-3xl font-bold tracking-tight\">
          Welcome, {user ? user.name : \"Client\"}
        </h1>
        <p className=\"text-zinc-500 text-sm\">
          Request new deliverables, monitor status progress, and leverage our elite AI specification tools.
        </p>
      </section>

      <div className=\"grid grid-cols-1 lg:grid-cols-12 gap-8 text-left\">
        {/* Left Column: Form Section */}
        <div className=\"lg:col-span-6 space-y-6\">
          <div className=\"bg-[#121214] border border-white/10 p-6 sm:p-8 rounded-xl relative overflow-hidden\">
            <div className=\"absolute top-0 right-0 w-40 h-40 bg-blue-500/5 rounded-full blur-2xl pointer-events-none\" />
            
            <h2 className=\"text-xl font-bold text-white mb-6 flex items-center gap-2\">
              <Plus className=\"w-5 h-5 text-blue-500\" />
              New Service Request
            </h2>

            {formError && (
              <div className=\"bg-red-950/20 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm mb-6 flex items-start gap-2\">
                <AlertCircle className=\"w-4 h-4 shrink-0 mt-0.5\" />
                <span>{formError}</span>
              </div>
            )}

            {formSuccess && (
              <div className=\"bg-green-950/20 border border-green-500/20 text-green-400 p-3 rounded-lg text-sm mb-6 flex items-start gap-2\">
                <CheckCircle2 className=\"w-4 h-4 shrink-0 mt-0.5\" />
                <span>{formSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSubmitRequest} className=\"space-y-6\">
              {/* Choose Service */}
              <div className=\"space-y-1.5\">
                <label className=\"text-xs font-bold uppercase tracking-wider text-zinc-400\">
                  Select Deliverable Category
                </label>
                <select
                  required
                  data-testid=\"request-service-select\"
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className=\"w-full px-3.5 py-2.5 bg-zinc-900 border border-white/10 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors\"
                >
                  {services.map((s) => (
                    <option key={s.key} value={s.key}>
                      {s.name} ({s.category.toUpperCase()} - Starting: ₹{s.price.toLocaleString(\"en-IN\")})
                    </option>
                  ))}
                </select>
              </div>

              {/* AI Assistant Tool Box */}
              <div className=\"border border-white/5 bg-zinc-950/40 p-4 rounded-lg space-y-3 relative\">
                <div className=\"flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-400\">
                  <Sparkles className=\"w-4 h-4\" />
                  Elite AI Description Helper
                </div>
                <p className=\"text-zinc-500 text-[11px] leading-relaxed\">
                  Struggling with what details to include? Type a brief concept idea below and our AI agent will write structured technical specifications directly into your Project Description below!
                </p>
                
                {aiError && (
                  <div className=\"text-red-400 text-xs font-medium\">
                    {aiError}
                  </div>
                )}

                <div className=\"flex gap-2\">
                  <input
                    type=\"text\"
                    data-testid=\"ai-prompt-input\"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder=\"e.g. 'e-commerce for high-end clothing brand' or 'notes on electrostatics'\"
                    className=\"flex-grow px-3 py-1.5 bg-zinc-900 border border-white/10 rounded text-xs text-white focus:outline-none focus:border-orange-500\"
                  />
                  <button
                    type=\"button\"
                    onClick={handleAISuggest}
                    disabled={aiLoading || !selectedService}
                    data-testid=\"ai-suggest-button\"
                    className=\"bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white text-xs font-bold px-3 py-1.5 rounded transition-all duration-300 shrink-0 flex items-center gap-1\"
                  >
                    {aiLoading ? (
                      <>
                        <Loader2 data-testid=\"ai-loading\" className=\"w-3.5 h-3.5 animate-spin\" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        Generate
                        <ArrowRight className=\"w-3 h-3\" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Project Description Textarea */}
              <div className=\"space-y-1.5\">
                <div className=\"flex justify-between items-baseline\">
                  <label className=\"text-xs font-bold uppercase tracking-wider text-zinc-400\">
                    Project Requirements / Description
                  </label>
                  <span className=\"text-[10px] text-zinc-500 font-medium\">
                    Detailed formatting helps our delivery team
                  </span>
                </div>
                <textarea
                  required
                  rows={6}
                  data-testid=\"request-description-textarea\"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder=\"Provide precise specifications of what you want built, designed or made. (You can use the AI Assist block above to generate professional requirements!)\"
                  className=\"w-full px-3.5 py-2.5 bg-zinc-900 border border-white/10 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors text-sm font-sans\"
                />
              </div>

              {/* Target Deadline Input */}
              <div className=\"space-y-1.5\">
                <label className=\"text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1\">
                  <Calendar className=\"w-3.5 h-3.5 text-blue-500\" />
                  Requested Completion Deadline
                </label>
                <input
                  type=\"date\"
                  required
                  data-testid=\"request-deadline-input\"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className=\"w-full px-3.5 py-2.5 bg-zinc-900 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors\"
                />
              </div>

              {/* Submit Button */}
              <button
                type=\"submit\"
                disabled={formLoading}
                data-testid=\"request-submit-button\"
                className=\"w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold py-3 rounded-lg shadow-lg\"
              >
                {formLoading ? (
                  <>
                    <Loader2 className=\"w-4 h-4 animate-spin\" />
                    Submitting Project Request...
                  </>
                ) : (
                  <>
                    Submit Request
                    <ArrowRight className=\"w-4 h-4\" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Request Board Section */}
        <div className=\"lg:col-span-6 space-y-6\">
          <div className=\"bg-[#121214] border border-white/10 p-6 rounded-xl min-h-[400px]\">
            <h2 className=\"text-xl font-bold text-white mb-6 flex items-center gap-2\">
              <FileText className=\"w-5 h-5 text-orange-500\" />
              Your Requests Board
            </h2>

            {listLoading ? (
              <div className=\"flex flex-col items-center justify-center py-20 gap-3\">
                <Loader2 className=\"w-8 h-8 text-orange-500 animate-spin\" />
                <p className=\"text-zinc-500 text-xs\">Fetching active board requests...</p>
              </div>
            ) : requests.length === 0 ? (
              <div className=\"flex flex-col items-center justify-center py-20 text-center space-y-4 border border-dashed border-white/5 rounded-lg bg-zinc-950/20\">
                <AlertCircle className=\"w-10 h-10 text-zinc-600\" />
                <div className=\"space-y-1\">
                  <p className=\"text-white text-sm font-semibold\">No requests submitted yet</p>
                  <p className=\"text-zinc-500 text-xs max-w-xs\">
                    Your submitted requests will appear here on this board, allowing you to track status live.
                  </p>
                </div>
              </div>
            ) : (
              <div data-testid=\"requests-list\" className=\"space-y-4 max-h-[600px] overflow-y-auto pr-1\">
                {requests.map((req) => (
                  <div
                    key={req.id}
                    data-testid={`request-item-${req.id}`}
                    className=\"p-5 bg-black/40 border border-white/5 rounded-lg space-y-4 hover:border-white/10 transition-colors\"
                  >
                    <div className=\"flex flex-wrap justify-between items-start gap-2\">
                      <div className=\"space-y-0.5\">
                        <span className=\"text-[10px] font-bold text-blue-400 uppercase tracking-wider\">
                          {req.category}
                        </span>
                        <h3 className=\"font-bold text-white text-base\">
                          {req.service_name}
                        </h3>
                      </div>
                      <div>
                        {getStatusBadge(req.status, req.id)}
                      </div>
                    </div>

                    <p className=\"text-zinc-400 text-xs leading-relaxed line-clamp-3 whitespace-pre-line bg-zinc-900/50 p-3 border border-white/5 rounded font-mono\">
                      {req.description}
                    </p>

                    <div className=\"pt-3 border-t border-white/5 flex flex-wrap items-center justify-between text-xs text-zinc-500 gap-2\">
                      <div>
                        Target Deadline: <span className=\"font-bold text-zinc-300\">{req.deadline}</span>
                      </div>
                      <div className=\"flex items-center gap-4\">
                        <div>
                          Lock Price: <span className=\"font-bold text-orange-400\">₹{req.price_at_request.toLocaleString(\"en-IN\")}</span>
                        </div>
                        {req.status === \"Pending\" && (
                          <button
                            onClick={() => handleCancelRequest(req.id)}
                            data-testid={`request-cancel-button-${req.id}`}
                            className=\"text-red-500 hover:text-red-400 transition-colors p-1 hover:bg-red-950/20 rounded flex items-center gap-1 font-semibold\"
                            title=\"Cancel Request\"
                          >
                            <Trash2 className=\"w-3.5 h-3.5\" />
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
"