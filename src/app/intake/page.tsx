'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function IntakePage() {
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [form, setForm] = useState({
    fullName: '', phone: '', email: '', preferredContact: 'phone',
    dob: '', lastFourSSN: '', recordType: 'misdemeanor', caseNumber: '',
    countyOfResidence: '', countyOfFiling: '', countyOfConviction: '',
    yearOfIncident: '', incidentDescription: '', referralSource: '',
    completedProbation: false, outstandingFines: false,
    onProbation: false, multipleCases: false,
  });

  const set = (k: string, v: string | boolean) =>
    setForm(f => ({ ...f, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('submitting');
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Server error');
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') return (
    <div style={{ maxWidth: 600, margin: '80px auto', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#16a34a', fontSize: 32 }}>✅ Submitted!</h1>
      <p style={{ fontSize: 18, marginTop: 16 }}>
        Thank you! Your intake form has been received. We will be in touch shortly.
      </p>
      <button onClick={() => router.push('/')}
        style={{ marginTop: 32, padding: '12px 28px', background: '#1d4ed8',
          color: '#fff', border: 'none', borderRadius: 8, fontSize: 16, cursor: 'pointer' }}>
        Back to Home
      </button>
    </div>
  );

  const input = (label: string, key: string, type = 'text', extra?: object) => (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>{label}</label>
      <input type={type} value={form[key as keyof typeof form] as string}
        onChange={e => set(key, e.target.value)}
        style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1',
          borderRadius: 6, fontSize: 15, boxSizing: 'border-box' }}
        {...extra} />
    </div>
  );

  const yesNo = (label: string, key: string) => (
    <div style={{ marginBottom: 18 }}>
      <label style={{ fontWeight: 600 }}>{label}</label>
      <div style={{ display: 'flex', gap: 24, marginTop: 8 }}>
        {['Yes', 'No'].map(opt => (
          <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
            <input type="radio" name={key}
              checked={form[key as keyof typeof form] === (opt === 'Yes')}
              onChange={() => set(key, opt === 'Yes')} />
            {opt}
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 680, margin: '40px auto', padding: '0 20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: 28, color: '#1e3a5f', marginBottom: 4 }}>Clean Slate Intake Form</h1>
      <p style={{ color: '#64748b', marginBottom: 32 }}>
        Please fill out all fields as completely as possible. Your information is kept confidential.
      </p>

      <form onSubmit={handleSubmit}>
        <h2 style={{ fontSize: 18, color: '#1d4ed8', borderBottom: '2px solid #e2e8f0',
          paddingBottom: 8, marginBottom: 20 }}>Personal Information</h2>

        {input('Full Name *', 'fullName')}
        {input('Phone Number *', 'phone', 'tel')}
        {input('Email Address *', 'email', 'email')}

        <div style={{ marginBottom: 18 }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Preferred Contact Method</label>
          <select value={form.preferredContact} onChange={e => set('preferredContact', e.target.value)}
            style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1',
              borderRadius: 6, fontSize: 15 }}>
            <option value="phone">Phone</option>
            <option value="email">Email</option>
            <option value="text">Text</option>
          </select>
        </div>

        {input('Date of Birth *', 'dob', 'date')}
        {input('Last 4 of SSN *', 'lastFourSSN', 'text', { maxLength: 4, placeholder: 'XXXX' })}

        <h2 style={{ fontSize: 18, color: '#1d4ed8', borderBottom: '2px solid #e2e8f0',
          paddingBottom: 8, margin: '28px 0 20px' }}>Case Information</h2>

        <div style={{ marginBottom: 18 }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Record Type *</label>
          <select value={form.recordType} onChange={e => set('recordType', e.target.value)}
            style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1',
              borderRadius: 6, fontSize: 15 }}>
            <option value="misdemeanor">Misdemeanor</option>
            <option value="felony">Felony</option>
            <option value="infraction">Infraction</option>
            <option value="arrest">Arrest (No Conviction)</option>
          </select>
        </div>

        {input('Case Number (if known)', 'caseNumber')}
        {input('County of Residence *', 'countyOfResidence')}
        {input('County of Filing', 'countyOfFiling')}
        {input('County of Conviction', 'countyOfConviction')}
        {input('Year of Incident *', 'yearOfIncident', 'text', { placeholder: 'e.g. 2018' })}

        <div style={{ marginBottom: 18 }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Brief Description of Incident *</label>
          <textarea value={form.incidentDescription}
            onChange={e => set('incidentDescription', e.target.value)} rows={4}
            style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1',
              borderRadius: 6, fontSize: 15, boxSizing: 'border-box', resize: 'vertical' }} />
        </div>

        <h2 style={{ fontSize: 18, color: '#1d4ed8', borderBottom: '2px solid #e2e8f0',
          paddingBottom: 8, margin: '28px 0 20px' }}>Additional Details</h2>

        {yesNo('Have you completed probation?', 'completedProbation')}
        {yesNo('Do you have outstanding fines or fees?', 'outstandingFines')}
        {yesNo('Are you currently on probation or parole?', 'onProbation')}
        {yesNo('Do you have multiple cases?', 'multipleCases')}

        {input('How did you hear about us?', 'referralSource', 'text',
          { placeholder: 'e.g. Google, friend, social media' })}

        {status === 'error' && (
          <p style={{ color: '#dc2626', background: '#fef2f2', padding: '12px 16px',
            borderRadius: 8, marginBottom: 16 }}>
            ⚠️ Something went wrong. Please try again or call us directly.
          </p>
        )}

        <button type="submit" disabled={status === 'submitting'}
          style={{ width: '100%', padding: '14px', background: status === 'submitting' ? '#94a3b8' : '#1d4ed8',
            color: '#fff', border: 'none', borderRadius: 8, fontSize: 17,
            fontWeight: 700, cursor: status === 'submitting' ? 'not-allowed' : 'pointer',
            marginTop: 8 }}>
          {status === 'submitting' ? 'Submitting...' : 'Submit Intake Form'}
        </button>
      </form>
    </div>
  );
}
