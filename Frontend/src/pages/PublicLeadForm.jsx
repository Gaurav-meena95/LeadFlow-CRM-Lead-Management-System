import React, { useState } from 'react';
import { Building2, CheckCircle } from 'lucide-react';
import api from '../services/api';

export default function PublicLeadForm() {
  const [form, setForm] = useState({ name: '', phone: '', source: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!form.name.trim()) return 'Name is required';
    if (!/^\d{10}$/.test(form.phone)) return 'Phone must be exactly 10 digits';
    if (!form.source) return 'Please select a source';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) return setError(err);
    setLoading(true);
    setError('');
    try {
      await api.post('/api/leads/public', form);
      setSuccess(true);
    } catch (e) {
      setError(e.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
            <Building2 size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">LeadFlow CRM</h1>
            <p className="text-slate-500 text-sm">Property Booking Enquiry</p>
          </div>
        </div>

        {success ? (
          <div className="text-center py-8">
            <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-800 mb-2">Thank you!</h2>
            <p className="text-slate-500">We've received your enquiry. Our team will contact you shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Book a Property Visit</h2>
            {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</p>}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
              <input
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="10-digit mobile number"
                maxLength={10}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">How did you hear about us?</label>
              <select
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={form.source}
                onChange={(e) => setForm({ ...form, source: e.target.value })}
              >
                <option value="">Select source</option>
                <option value="website">Website</option>
                <option value="facebook">Facebook</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="referral">Referral</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 font-medium text-sm disabled:opacity-50 mt-2"
            >
              {loading ? 'Submitting...' : 'Submit Enquiry'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
