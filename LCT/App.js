
Action: file_editor create /app/frontend/src/App.js --file-text "import React, { useEffect } from \"react\";
import \"@/App.css\";
import { BrowserRouter, Routes, Route } from \"react-router-dom\";
import { AuthProvider } from \"@/context/AuthContext\";
import Layout from \"@/components/Layout\";
import Home from \"@/pages/Home\";
import About from \"@/pages/About\";
import Services from \"@/pages/Services\";
import Portfolio from \"@/pages/Portfolio\";
import Login from \"@/pages/Login\";
import Register from \"@/pages/Register\";
import Dashboard from \"@/pages/Dashboard\";
import Admin from \"@/pages/Admin\";

function App() {
  useEffect(() => {
    // Add dark mode by default to support modern high-contrast aesthetic
    document.documentElement.classList.add(\"dark\");
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path=\"/\" element={<Home />} />
            <Route path=\"/about\" element={<About />} />
            <Route path=\"/services\" element={<Services />} />
            <Route path=\"/portfolio\" element={<Portfolio />} />
            <Route path=\"/login\" element={<Login />} />
            <Route path=\"/register\" element={<Register />} />
            <Route path=\"/dashboard\" element={<Dashboard />} />
            <Route path=\"/admin\" element={<Admin />} />
            {/* Catch-all fallback */}
            <Route path=\"*\" element={<Home />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
"