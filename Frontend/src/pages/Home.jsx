import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2, Users, GitBranch, Calendar, CheckCircle,
  ArrowRight, Shield, Zap, BarChart3, Phone, Globe,
  MessageCircle, UserCheck, Star, ChevronRight
} from 'lucide-react';

const features = [
  {
    icon: Users,
    title: 'All your leads, one place',
    desc: "No more sticky notes or scattered spreadsheets. Every enquiry — from WhatsApp, Facebook, website or referral — lands right here.",
    color: 'bg-indigo-50 text-indigo-600'
  },
  {
    icon: GitBranch,
    title: 'See your pipeline at a glance',
    desc: "A visual Kanban board that shows exactly where every lead stands — from first contact to final booking.",
    color: 'bg-purple-50 text-purple-600'
  },
  {
    icon: Calendar,
    title: 'Schedule visits without the chaos',
    desc: "Book property visits, assign agents, and track outcomes. Know who's visiting what property and when.",
    color: 'bg-blue-50 text-blue-600'
  },
  {
    icon: BarChart3,
    title: 'Numbers that actually matter',
    desc: "Live stats on leads, conversions, and today's visits. Know your team's performance without digging through data.",
    color: 'bg-green-50 text-green-600'
  },
  {
    icon: Shield,
    title: 'Right access for the right people',
    desc: "Admins see everything. Managers handle their team. Agents focus on their own leads. Clean, simple, secure.",
    color: 'bg-orange-50 text-orange-600'
  },
  {
    icon: Zap,
    title: 'Leads assigned automatically',
    desc: "Round-robin assignment means no lead sits unattended. The next available agent gets it — fair and instant.",
    color: 'bg-yellow-50 text-yellow-600'
  }
];

const steps = [
  {
    num: '1',
    title: 'Customer enquires',
    desc: 'They fill a simple form on your website, WhatsApp, or Facebook. Takes 30 seconds.',
    color: 'bg-indigo-600'
  },
  {
    num: '2',
    title: 'Agent gets assigned',
    desc: "The system picks the next available agent automatically. No manual work needed.",
    color: 'bg-purple-600'
  },
  {
    num: '3',
    title: 'Visit gets scheduled',
    desc: "Agent contacts the lead, updates the status, and books a property visit.",
    color: 'bg-blue-600'
  },
  {
    num: '4',
    title: 'Deal is closed',
    desc: "Visit happens, outcome is recorded. Lead moves to Booked — or back to follow-up.",
    color: 'bg-green-600'
  }
];

const roles = [
  {
    role: 'Admin',
    emoji: '👑',
    tagline: 'Full control',
    bg: 'bg-indigo-50 border-indigo-200',
    badge: 'bg-indigo-600',
    points: ['Manage all leads and agents', 'Create and edit user accounts', 'View complete analytics', 'Full system access']
  },
  {
    role: 'Manager',
    emoji: '🧑‍💼',
    tagline: 'Team oversight',
    bg: 'bg-purple-50 border-purple-200',
    badge: 'bg-purple-600',
    points: ['View and manage all leads', 'Add leads manually', 'Schedule visits', 'Monitor agent activity']
  },
  {
    role: 'Agent',
    emoji: '🤝',
    tagline: 'Focused work',
    bg: 'bg-blue-50 border-blue-200',
    badge: 'bg-blue-600',
    points: ['See only assigned leads', 'Update lead status', 'Manage own visits', 'Update profile']
  }
];

const sources = [
  { icon: Globe, label: 'Website' },
  { icon: MessageCircle, label: 'WhatsApp' },
  { icon: Star, label: 'Facebook' },
  { icon: UserCheck, label: 'Referral' }
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Building2 size={16} className="text-white" />
          </div>
          <span className="font-bold text-slate-900 text-lg tracking-tight">LeadFlow CRM</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/lead')}
            className="text-sm text-slate-600 hover:text-slate-900 font-medium px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Submit Enquiry
          </button>
          <button
            onClick={() => navigate('/login')}
            className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 font-medium flex items-center gap-1.5 transition-colors"
          >
            Sign In <ChevronRight size={14} />
          </button>
        </div>
      </nav>

      <section className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white px-6 py-28 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-800/20 via-transparent to-transparent" />
        <div className="max-w-3xl mx-auto relative">
          <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-8">
            <Building2 size={12} /> Built for PG & Property Booking Teams
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-6 tracking-tight">
            Stop losing leads.<br />
            <span className="text-indigo-400">Start closing deals.</span>
          </h1>
          <p className="text-slate-300 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            LeadFlow CRM helps your team capture every enquiry, follow up faster, and turn property visits into bookings — without the spreadsheet mess.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate('/login')}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              Go to Dashboard <ArrowRight size={16} />
            </button>
            <button
              onClick={() => navigate('/lead')}
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Submit a Property Enquiry
            </button>
          </div>
        </div>
      </section>

      <section className="bg-slate-800 px-6 py-5">
        <div className="max-w-3xl mx-auto flex flex-wrap items-center justify-center gap-8">
          <span className="text-slate-400 text-sm">Captures leads from:</span>
          {sources.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-slate-300 text-sm font-medium">
              <Icon size={15} className="text-indigo-400" /> {label}
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Everything your team needs</h2>
            <p className="text-slate-500 max-w-lg mx-auto">Designed for property teams who move fast and can't afford to let a lead slip through.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${color}`}>
                  <Icon size={20} />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2 text-base">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">How it works</h2>
            <p className="text-slate-500">From first enquiry to signed deal — here's the flow.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map(({ num, title, desc, color }) => (
              <div key={num} className="relative">
                <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center text-white font-bold text-lg mb-4`}>
                  {num}
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">One tool, three roles</h2>
            <p className="text-slate-500">Everyone on your team gets exactly what they need — no more, no less.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {roles.map(({ role, emoji, tagline, bg, badge, points }) => (
              <div key={role} className={`rounded-2xl border p-6 ${bg}`}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{emoji}</span>
                  <div>
                    <span className={`${badge} text-white text-xs font-bold px-2.5 py-1 rounded-full`}>{role}</span>
                    <p className="text-slate-500 text-xs mt-1">{tagline}</p>
                  </div>
                </div>
                <ul className="space-y-2.5">
                  {points.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm text-slate-700">
                      <CheckCircle size={14} className="text-green-500 mt-0.5 shrink-0" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 bg-indigo-600 text-white text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-indigo-100 mb-8 leading-relaxed">
            Sign in with your team credentials, or let a customer submit their property enquiry right now.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate('/login')}
              className="bg-white text-indigo-700 font-semibold px-6 py-3 rounded-xl hover:bg-indigo-50 flex items-center justify-center gap-2 transition-colors"
            >
              Team Login <ArrowRight size={16} />
            </button>
            <button
              onClick={() => navigate('/lead')}
              className="border border-white/40 text-white font-semibold px-6 py-3 rounded-xl hover:bg-indigo-500 flex items-center justify-center gap-2 transition-colors"
            >
              <Phone size={16} /> Submit Enquiry
            </button>
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-slate-500 px-6 py-8 text-center text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Building2 size={15} className="text-indigo-400" />
          <span className="text-white font-semibold">LeadFlow CRM</span>
        </div>
        <p>Made for property & PG booking teams who mean business.</p>
      </footer>
    </div>
  );
}
