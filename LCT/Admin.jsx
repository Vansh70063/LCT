
Action: file_editor create /app/frontend/src/pages/Admin.jsx --file-text "import React, { useState, useEffect } from \"react\";
import { useNavigate } from \"react-router-dom\";
import axios from \"axios\";
import { useAuth } from \"@/context/AuthContext\";
import { 
  Settings, FileText, CheckCircle2, Loader2, AlertCircle, 
  RefreshCw, DollarSign, ArrowRight, User2, Mail 
} from \"lucide-react\";

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [requests, setRequests] = useState([]);

  // Price inputs states map { key: { price: float, price_unit: str, description: str, saving: bool, success: bool, error: str } }
  const [priceStates, setPriceStates] = useState({});
  const [listLoading, setListLoading] = useState(true);
  const [requestsLoading, setRequestsLoading] = useState(true);

  // Status updating states map { id: { status: str, updating: bool } }
  const [statusStates, setStatusStates] = useState({});

  // Guard: if not admin, redirect
  useEffect(() => {
    if (user === false) {
      navigate(\"/login?redirect=admin\");
    } else if (user && user.role !== \"admin\") {
      navigate(\"/dashboard\");
    }
  }, [user, navigate]);

  const fetchPrices = async () => {
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || \"\";
      const { data } = await axios.get(`${backendUrl}/api/prices`);
      setServices(data);
      
      // Initialize inputs state
      const initialStates = {};
      data.forEach(s => {
        initialStates[s.key] = {
          price: s.price,
          price_unit: s.price_unit,
          description: s.description,
          saving: false,
          success: false,
          error: \"\"
        };
      });
      setPriceStates(initialStates);
    } catch (err) {
      console.error(\"Error fetching prices:\", err);
    } finally {
      setListLoading(false);
    }
  };

  const fetchRequests = async () => {
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || \"\";
      const { data } = await axios.get(`${backendUrl}/api/requests`);
      setRequests(data);
      
      // Initialize status dropdown state
      const initialStatus = {};
      data.forEach(r => {
        initialStatus[r.id] = {
          status: r.status,
          updating: false
        };
      });
      setStatusStates(initialStatus);
    } catch (err) {
      console.error(\"Error fetching admin requests:\", err);
    } finally {
      setRequestsLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === \"admin\") {
      fetchPrices();
      fetchRequests();
    }
  }, [user]);

  const handlePriceFieldChange = (key, field, value) => {
    setPriceStates(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value,
        success: false,
        error: \"\"
      }
    }));
  };

  const handleSavePrice = async (key) => {
    const state = priceStates[key];
    if (!state) return;

    setPriceStates(prev => ({
      ...prev,
      [key]: { ...prev[key], saving: true, error: \"\", success: false }
    }));

    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || \"\";
      await axios.put(`${backendUrl}/api/prices/${key}`, {
        price: parseFloat(state.price),
        price_unit: state.price_unit,
        description: state.description
      });

      setPriceStates(prev => ({
        ...prev,
        [key]: { ...prev[key], saving: false, success: true }
      }));
      
      // Clear success alert after 3 seconds
      setTimeout(() => {
        setPriceStates(prev => ({
          ...prev,
          [key]: prev[key] ? { ...prev[key], success: false } : null
        }));
      }, 3000);
    } catch (err) {
      console.error(err);
      setPriceStates(prev => ({
        ...prev,
        [key]: { 
          ...prev[key], 
          saving: false, 
          error: err.response?.data?.detail || \"Failed to update price.\" 
        }
      }));
    }
  };

  const handleStatusChange = (id, newStatus) => {
    setStatusStates(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        status: newStatus
      }
    }));
  };

  const handleUpdateStatus = async (id) => {
    const state = statusStates[id];
    if (!state) return;

    setStatusStates(prev => ({
      ...prev,
      [id]: { ...prev[id], updating: true }
    }));

    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || \"\";
      await axios.patch(`${backendUrl}/api/requests/${id}/status`, {
        status: state.status
      });

      // Update requests local list
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status: state.status } : r));
      
      setStatusStates(prev => ({
        ...prev,
        [id]: { ...prev[id], updating: false }
      }));
      
      alert(\"Request status updated successfully!\");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || \"Failed to update status.\");
      setStatusStates(prev => ({
        ...prev,
        [id]: { ...prev[id], updating: false }
      }));
    }
  };

  return (
    <div className=\"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12\">
      {/* Title */}
      <section className=\"text-left space-y-2 mb-12 border-b border-white/5 pb-6\">
        <div className=\"flex items-center gap-2\">
          <Settings className=\"w-8 h-8 text-orange-500 animate-spin-slow\" />
          <h1 className=\"text-3xl font-bold tracking-tight\">Admin Operations Console</h1>
        </div>
        <p className=\"text-zinc-500 text-sm\">
          Dynamic catalog price tuning, metadata editing, and global client project workflow management.
        </p>
      </section>

      <div className=\"grid grid-cols-1 lg:grid-cols-12 gap-8 text-left\">
        {/* Column 1: Manage Pricing (Panel 1) */}
        <div className=\"lg:col-span-6 space-y-6\">
          <div className=\"bg-[#121214] border border-white/10 p-6 rounded-xl\">
            <h2 className=\"text-xl font-bold text-white mb-6 flex items-center gap-2\">
              <DollarSign className=\"w-5 h-5 text-blue-500\" />
              Configure Service Pricing
            </h2>

            {listLoading ? (
              <div className=\"flex flex-col items-center justify-center py-20 gap-3\">
                <Loader2 className=\"w-8 h-8 text-blue-500 animate-spin\" />
                <p className=\"text-zinc-500 text-xs\">Loading metadata configurations...</p>
              </div>
            ) : (
              <div className=\"space-y-6 max-h-[750px] overflow-y-auto pr-1\">
                {services.map((service) => {
                  const state = priceStates[service.key] || {};
                  return (
                    <div
                      key={service.key}
                      className=\"p-5 bg-black/40 border border-white/5 rounded-lg space-y-4\"
                    >
                      <div className=\"flex justify-between items-baseline\">
                        <h3 className=\"font-bold text-white text-sm uppercase tracking-wide\">
                          {service.name} ({service.category})
                        </h3>
                        {state.success && (
                          <span className=\"text-[10px] text-green-400 font-bold uppercase flex items-center gap-1\">
                            <CheckCircle2 className=\"w-3.5 h-3.5\" />
                            Saved!
                          </span>
                        )}
                        {state.error && (
                          <span className=\"text-[10px] text-red-400 font-bold uppercase\">
                            Error saving
                          </span>
                        )}
                      </div>

                      <div className=\"grid grid-cols-2 gap-4\">
                        {/* Price Input */}
                        <div className=\"space-y-1\">
                          <label className=\"text-[10px] font-bold text-zinc-500 uppercase tracking-wider\">
                            Base Price (₹)
                          </label>
                          <input
                            type=\"number\"
                            required
                            data-testid={`admin-price-input-${service.key}`}
                            value={state.price != null ? state.price : \"\"}
                            onChange={(e) => handlePriceFieldChange(service.key, \"price\", e.target.value)}
                            className=\"w-full px-3 py-1.5 bg-zinc-900 border border-white/5 rounded text-xs text-white focus:outline-none focus:border-blue-500\"
                          />
                        </div>

                        {/* Price Unit */}
                        <div className=\"space-y-1\">
                          <label className=\"text-[10px] font-bold text-zinc-500 uppercase tracking-wider\">
                            Billing Unit
                          </label>
                          <input
                            type=\"text\"
                            required
                            data-testid={`admin-price-unit-input-${service.key}`}
                            value={state.price_unit || \"\"}
                            onChange={(e) => handlePriceFieldChange(service.key, \"price_unit\", e.target.value)}
                            placeholder=\"e.g. flat rate, starting at\"
                            className=\"w-full px-3 py-1.5 bg-zinc-900 border border-white/5 rounded text-xs text-white focus:outline-none focus:border-blue-500\"
                          />
                        </div>
                      </div>

                      {/* Description */}
                      <div className=\"space-y-1\">
                        <label className=\"text-[10px] font-bold text-zinc-500 uppercase tracking-wider\">
                          Service Catalog Description
                        </label>
                        <textarea
                          rows={2}
                          required
                          value={state.description || \"\"}
                          onChange={(e) => handlePriceFieldChange(service.key, \"description\", e.target.value)}
                          className=\"w-full px-3 py-1.5 bg-zinc-900 border border-white/5 rounded text-xs text-white focus:outline-none focus:border-blue-500 font-sans\"
                        />
                      </div>

                      {/* Save Button */}
                      <div className=\"flex justify-end pt-2\">
                        <button
                          type=\"button\"
                          onClick={() => handleSavePrice(service.key)}
                          disabled={state.saving}
                          data-testid={`admin-price-save-button-${service.key}`}
                          className=\"bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-[10px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded transition-colors flex items-center gap-1\"
                        >
                          {state.saving ? (
                            <>
                              <Loader2 className=\"w-3.5 h-3.5 animate-spin\" />
                              Saving...
                            </>
                          ) : (
                            <>
                              Apply Changes
                              <ArrowRight className=\"w-3.5 h-3.5\" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Column 2: Service Requests (Panel 2) */}
        <div className=\"lg:col-span-6 space-y-6\">
          <div className=\"bg-[#121214] border border-white/10 p-6 rounded-xl min-h-[500px]\">
            <h2 className=\"text-xl font-bold text-white mb-6 flex items-center gap-2\">
              <FileText className=\"w-5 h-5 text-orange-500\" />
              Global Requests Dashboard
            </h2>

            {requestsLoading ? (
              <div className=\"flex flex-col items-center justify-center py-20 gap-3\">
                <Loader2 className=\"w-8 h-8 text-orange-500 animate-spin\" />
                <p className=\"text-zinc-500 text-xs\">Loading client request list...</p>
              </div>
            ) : requests.length === 0 ? (
              <div className=\"flex flex-col items-center justify-center py-20 text-center space-y-4 border border-dashed border-white/5 rounded-lg bg-zinc-950/20\">
                <AlertCircle className=\"w-10 h-10 text-zinc-600\" />
                <p className=\"text-white text-sm font-semibold\">No requests recorded yet</p>
              </div>
            ) : (
              <div data-testid=\"admin-requests-list\" className=\"space-y-4 max-h-[750px] overflow-y-auto pr-1\">
                {requests.map((req) => {
                  const statusState = statusStates[req.id] || { status: req.status, updating: false };
                  return (
                    <div
                      key={req.id}
                      data-testid={`admin-request-item-${req.id}`}
                      className=\"p-5 bg-black/40 border border-white/5 rounded-lg space-y-4 hover:border-white/10 transition-colors\"
                    >
                      {/* Client Header */}
                      <div className=\"flex flex-wrap justify-between items-start gap-2 border-b border-white/5 pb-2\">
                        <div className=\"space-y-1\">
                          <span className=\"text-[10px] font-bold text-blue-400 uppercase tracking-wider\">
                            {req.category}
                          </span>
                          <h3 className=\"font-bold text-white text-base leading-none\">
                            {req.service_name}
                          </h3>
                        </div>
                        <div className=\"flex items-center gap-1.5 text-zinc-400 text-xs\">
                          <User2 className=\"w-3.5 h-3.5 text-orange-500 shrink-0\" />
                          <span className=\"font-medium text-zinc-300\">{req.client_name}</span>
                          <span className=\"text-zinc-600\">|</span>
                          <span className=\"text-zinc-500 font-mono text-[10px]\">{req.client_email}</span>
                        </div>
                      </div>

                      {/* Description */}
                      <div className=\"p-3 bg-zinc-900/50 border border-white/5 rounded text-xs text-zinc-400 font-mono leading-relaxed whitespace-pre-line max-h-32 overflow-y-auto\">
                        {req.description}
                      </div>

                      {/* Control Form */}
                      <div className=\"pt-3 flex flex-wrap items-center justify-between gap-4 text-xs\">
                        <div className=\"space-y-1\">
                          <p className=\"text-[10px] font-bold text-zinc-500 uppercase tracking-widest\">
                            Deadline Target
                          </p>
                          <p className=\"font-bold text-zinc-300\">{req.deadline}</p>
                        </div>
                        
                        <div className=\"space-y-1\">
                          <p className=\"text-[10px] font-bold text-zinc-500 uppercase tracking-widest\">
                            Locked Price
                          </p>
                          <p className=\"font-bold text-orange-400\">₹{req.price_at_request.toLocaleString(\"en-IN\")}</p>
                        </div>

                        {/* Status Dropdown */}
                        <div className=\"flex items-center gap-2\">
                          <div className=\"space-y-1 text-left\">
                            <label className=\"text-[9px] font-bold text-zinc-500 uppercase tracking-widest block\">
                              Set Status
                            </label>
                            <select
                              data-testid={`admin-status-select-${req.id}`}
                              value={statusState.status}
                              onChange={(e) => handleStatusChange(req.id, e.target.value)}
                              className=\"px-2 py-1.5 bg-zinc-900 border border-white/10 rounded text-xs text-white focus:outline-none focus:border-blue-500\"
                            >
                              <option value=\"Pending\">Pending</option>
                              <option value=\"Approved\">Approved</option>
                              <option value=\"In Progress\">In Progress</option>
                              <option value=\"Completed\">Completed</option>
                              <option value=\"Cancelled\">Cancelled</option>
                            </select>
                          </div>

                          <div className=\"pt-3\">
                            <button
                              type=\"button\"
                              onClick={() => handleUpdateStatus(req.id)}
                              disabled={statusState.updating || statusState.status === req.status}
                              data-testid={`admin-status-update-button-${req.id}`}
                              className=\"bg-orange-600 hover:bg-orange-700 disabled:bg-zinc-800 disabled:opacity-50 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded transition-colors\"
                            >
                              {statusState.updating ? \"Saving...\" : \"Update\"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
"
