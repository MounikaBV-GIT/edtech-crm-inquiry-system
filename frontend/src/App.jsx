import React from "react";
import { useEffect, useMemo, useState } from "react";
import {
  GraduationCap, ArrowRight, ShieldCheck, Search, Filter, LogOut,
  ClipboardList, Users, Clock3, CheckCircle2, Send, BookOpen, Menu, X
} from "lucide-react";
import api from "./api";

const CATEGORIES = ["Scholarship", "Concert", "Admission", "General Query"];
const USER_TYPES = ["Parent", "Student", "School"];
const STATUSES = ["New", "In Progress", "Resolved"];

function messageFrom(error) {
  const data = error?.response?.data;
  if (data?.message) return data.message;
  if (data?.errors) return Object.values(data.errors).flat().join(" ");
  return "Something went wrong. Please try again.";
}

function Header({ onAdmin, onHome, isAdmin }) {
  return <header className="topbar">
    <button className="brand" onClick={onHome} aria-label="Go to home">
      <span className="brand-icon"><GraduationCap size={23} /></span>
      <span>edu<span className="brand-accent">connect</span><small>INQUIRY MANAGEMENT</small></span>
    </button>
    <nav>
      <button className={!isAdmin ? "nav-link active" : "nav-link"} onClick={onHome}>Submit Inquiry</button>
      <button className="nav-admin" onClick={onAdmin}><ShieldCheck size={16} /> {isAdmin ? "Dashboard" : "Admin Login"}</button>
    </nav>
  </header>;
}

function PublicForm() {
  const initial = { user_type: "Parent", category: "Admission", name: "", email: "", phone: "", message: "" };
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState(null);
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setLoading(true); setNotice(null);
    try {
      await api.post("/inquiries/", form);
      setNotice({ type: "success", text: "Your inquiry has been submitted. Our team will get back to you soon." });
      setForm(initial);
    } catch (error) {
      setNotice({ type: "error", text: messageFrom(error) });
    } finally { setLoading(false); }
  }

  return <main>
    <section className="hero">
      <div className="hero-copy">
        <span className="eyebrow"><span className="eyebrow-dot" /> YOUR NEXT CHAPTER STARTS HERE</span>
        <h1>Big dreams begin<br />with a <span>conversation.</span></h1>
        <p>Have a question about admissions, scholarships, or our programs? Tell us what you need. We're here to help you find the right path.</p>
        <div className="hero-points">
          <div><span className="point-icon"><CheckCircle2 size={17}/></span> Personal guidance</div>
          <div><span className="point-icon"><CheckCircle2 size={17}/></span> Quick responses</div>
          <div><span className="point-icon"><CheckCircle2 size={17}/></span> Support at every step</div>
        </div>
        <div className="hero-note"><div className="note-icon"><BookOpen size={19}/></div><span><strong>Not sure where to start?</strong><small>Share your question and our team will guide you.</small></span></div>
      </div>
      <div className="form-card">
        <div className="form-heading"><div><span className="card-kicker">LET'S CONNECT</span><h2>Send us an inquiry</h2><p>Fill in the details below and we'll be in touch.</p></div><div className="form-heading-icon"><Send size={21}/></div></div>
        {notice && <div className={`notice ${notice.type}`} role="status">{notice.text}</div>}
        <form onSubmit={submit}>
          <div className="field-grid">
            <label>Your role <span className="required">*</span><select name="user_type" value={form.user_type} onChange={change}>{USER_TYPES.map(x=><option key={x}>{x}</option>)}</select></label>
            <label>Inquiry category <span className="required">*</span><select name="category" value={form.category} onChange={change}>{CATEGORIES.map(x=><option key={x}>{x}</option>)}</select></label>
          </div>
          <label>Full name <span className="required">*</span><input name="name" value={form.name} onChange={change} placeholder="e.g. Mounika BV" required minLength="2" maxLength="150" /></label>
          <div className="field-grid">
            <label>Email address <span className="required">*</span><input type="email" name="email" value={form.email} onChange={change} placeholder="you@example.com" required maxLength="254" /></label>
            <label>Phone number <span className="required">*</span><input type="tel" name="phone" value={form.phone} onChange={change} placeholder="+91 98765 43210" required minLength="7" maxLength="30" /></label>
          </div>
          <label>Your message <span className="required">*</span><textarea name="message" value={form.message} onChange={change} placeholder="Tell us a little about what you're looking for..." rows="4" required maxLength="5000" /></label>
          <button className="submit-button" type="submit" disabled={loading}>{loading ? "Submitting..." : "Submit inquiry"} <ArrowRight size={17}/></button>
          <p className="privacy-note"><ShieldCheck size={14}/> Your information is kept private and used only to respond to your inquiry.</p>
        </form>
      </div>
    </section>
    <section className="bottom-benefits">
      <div><span className="benefit-icon"><Users size={20}/></span><span><strong>People-first support</strong><small>Real help for your education journey</small></span></div>
      <div><span className="benefit-icon"><Clock3 size={20}/></span><span><strong>Every question matters</strong><small>We make time to understand your needs</small></span></div>
      <div><span className="benefit-icon"><GraduationCap size={20}/></span><span><strong>Your future, your way</strong><small>Guidance tailored to your goals</small></span></div>
    </section>
  </main>;
}

function Login({ onLogin, onBack }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function submit(e) {
    e.preventDefault(); setLoading(true); setError("");
    try {
      const response = await api.post("/auth/login/", { username, password });
      sessionStorage.setItem("adminToken", response.data.token);
      sessionStorage.setItem("adminUsername", response.data.username);
      onLogin();
    } catch (err) { setError(messageFrom(err)); }
    finally { setLoading(false); }
  }
  return <main className="login-wrap">
    <div className="login-card">
      <div className="login-icon"><ShieldCheck size={27}/></div>
      <span className="card-kicker">ADMINISTRATION</span><h1>Welcome back</h1>
      <p>Sign in to securely manage education inquiries.</p>
      {error && <div className="notice error">{error}</div>}
      <form onSubmit={submit}>
        <label>Username<input value={username} onChange={e=>setUsername(e.target.value)} autoComplete="username" required /></label>
        <label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} autoComplete="current-password" required /></label>
        <button className="submit-button" disabled={loading}>{loading ? "Signing in..." : "Sign in securely"} <ArrowRight size={17}/></button>
      </form>
      <button className="back-link" onClick={onBack}>← Back to inquiry form</button>
      <div className="secure-foot"><ShieldCheck size={14}/> Protected admin access</div>
    </div>
  </main>;
}

function Dashboard({ onLogout }) {
  const [inquiries, setInquiries] = useState([]);
  const [category, setCategory] = useState("");
  const [userType, setUserType] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true); setError("");
    const params = {};
    if (category) params.category = category;
    if (userType) params.user_type = userType;
    if (search.trim()) params.search = search.trim();
    api.get("/admin/inquiries/", { params })
      .then(r => { if (active) setInquiries(r.data); })
      .catch(err => {
        if (active) {
          setError(messageFrom(err));
          if (err?.response?.status === 401) onLogout();
        }
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [category, userType, search]);

  const stats = useMemo(() => ({
    total: inquiries.length,
    fresh: inquiries.filter(i => i.status === "New").length,
    progress: inquiries.filter(i => i.status === "In Progress").length,
    resolved: inquiries.filter(i => i.status === "Resolved").length
  }), [inquiries]);

  async function updateStatus(id, value) {
    setUpdating(id); setError("");
    try {
      const response = await api.patch(`/admin/inquiries/${id}/`, { status: value });
      setInquiries(current => current.map(i => i.id === id ? response.data.inquiry : i));
    } catch (err) { setError(messageFrom(err)); }
    finally { setUpdating(null); }
  }

  return <main className="dashboard">
    <div className="dashboard-heading"><div><span className="card-kicker">OVERVIEW</span><h1>Inquiry dashboard</h1><p>Review and manage incoming education inquiries.</p></div><button className="logout-button" onClick={onLogout}><LogOut size={16}/> Log out</button></div>
    {error && <div className="notice error">{error}</div>}
    <div className="stat-grid">
      <div className="stat-card"><span className="stat-icon purple"><ClipboardList size={19}/></span><span className="stat-label">Matching inquiries</span><strong>{stats.total}</strong></div>
      <div className="stat-card"><span className="stat-icon orange"><Clock3 size={19}/></span><span className="stat-label">New</span><strong>{stats.fresh}</strong></div>
      <div className="stat-card"><span className="stat-icon blue"><Users size={19}/></span><span className="stat-label">In progress</span><strong>{stats.progress}</strong></div>
      <div className="stat-card"><span className="stat-icon green"><CheckCircle2 size={19}/></span><span className="stat-label">Resolved</span><strong>{stats.resolved}</strong></div>
    </div>
    <section className="table-card">
      <div className="table-heading"><div><h2>All inquiries</h2><p>Search, filter, and update inquiry status.</p></div><span className="count-pill">{inquiries.length} records</span></div>
      <div className="filters">
        <div className="search-box"><Search size={17}/><input aria-label="Search by name or phone" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name or phone..." /></div>
        <div className="filter-box"><Filter size={16}/><select aria-label="Filter by category" value={category} onChange={e=>setCategory(e.target.value)}><option value="">All categories</option>{CATEGORIES.map(x=><option key={x}>{x}</option>)}</select></div>
        <div className="filter-box"><Users size={16}/><select aria-label="Filter by user type" value={userType} onChange={e=>setUserType(e.target.value)}><option value="">All user types</option>{USER_TYPES.map(x=><option key={x}>{x}</option>)}</select></div>
        {(category || userType || search) && <button className="clear-filters" onClick={()=>{setCategory("");setUserType("");setSearch("");}}>Clear</button>}
      </div>
      <div className="table-scroll"><table><thead><tr><th>CONTACT</th><th>USER TYPE</th><th>CATEGORY</th><th>DATE</th><th>STATUS</th><th>MESSAGE</th></tr></thead>
        <tbody>
          {loading ? <tr><td colSpan="6" className="empty-state">Loading inquiries...</td></tr> :
          inquiries.length === 0 ? <tr><td colSpan="6" className="empty-state"><ClipboardList size={25}/><strong>No inquiries found</strong><span>Try changing your filters or search.</span></td></tr> :
          inquiries.map(item => <tr key={item.id}>
            <td><div className="contact-name">{item.name}</div><div className="contact-detail">{item.email}</div><div className="contact-detail">{item.phone}</div></td>
            <td><span className="type-pill">{item.user_type}</span></td>
            <td>{item.category}</td>
            <td className="date-cell">{new Date(item.created_at).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}</td>
            <td><select className={`status-select status-${item.status.toLowerCase().replace(" ","-")}`} value={item.status} disabled={updating === item.id} onChange={e=>updateStatus(item.id,e.target.value)} aria-label={`Status for ${item.name}`}>{STATUSES.map(s=><option key={s}>{s}</option>)}</select></td>
            <td><span className="message-cell" title={item.message}>{item.message}</span></td>
          </tr>)}
        </tbody></table></div>
      <div className="table-footer"><span>Showing {inquiries.length} matching inquiry{inquiries.length===1?"":"ies"}</span><span><span className="live-dot"/> Live database records</span></div>
    </section>
  </main>;
}

export default function App() {
  const [page, setPage] = useState(sessionStorage.getItem("adminToken") ? "dashboard" : "home");
  const [mobileMenu, setMobileMenu] = useState(false);
  function logout() {
    sessionStorage.removeItem("adminToken"); sessionStorage.removeItem("adminUsername"); setPage("login");
  }
  return <div className="app-shell">
    <Header isAdmin={page === "dashboard"} onHome={()=>setPage("home")} onAdmin={()=>setPage(sessionStorage.getItem("adminToken") ? "dashboard" : "login")} />
    {page === "home" && <PublicForm />}
    {page === "login" && <Login onLogin={()=>setPage("dashboard")} onBack={()=>setPage("home")} />}
    {page === "dashboard" && <Dashboard onLogout={logout} />}
    <footer className="footer"><div className="footer-brand"><GraduationCap size={18}/> edu<span>connect</span></div><span>Making every education inquiry count.</span><span>© {new Date().getFullYear()} EduConnect</span></footer>
  </div>;
}
