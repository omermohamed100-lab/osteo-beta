'use client';

import { useState, useEffect } from 'react';
import ArabicContentWarning from '@/components/admin/ArabicContentWarning';

export default function ContactInfoSettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    address: '',
    addressAr: '',
    facebook: '',
    instagram: '',
    linkedin: '',
  });

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data) {
          setFormData({
            email: data.email || '',
            phone: data.phone || '',
            address: data.address || '',
            addressAr: data.addressAr || (data.address === 'Cairo, Egypt' ? 'القاهرة، مصر' : ''),
            facebook: data.facebook || '',
            instagram: data.instagram || '',
            linkedin: data.linkedin || '',
          });
        }
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMessage('Settings saved successfully!');
      } else {
        setMessage('Failed to save settings.');
      }
    } catch {
      setMessage('Error saving settings.');
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (isLoading) return <div role="status" aria-live="polite">Loading settings…</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Site Settings</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-4 sm:p-8">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Contact Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label htmlFor="settings-email" className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
              <input id="settings-email" aria-describedby="settings-email-hint" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border border-gray-300 rounded-md p-2 focus:ring-brand-500 focus:border-brand-500" />
              <p id="settings-email-hint" className="mt-1 text-xs text-gray-500">Contact form submissions will be sent to this email.</p>
            </div>
            <div>
              <label htmlFor="settings-phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input id="settings-phone" type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border border-gray-300 rounded-md p-2 focus:ring-brand-500 focus:border-brand-500" />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="settings-address" className="block text-sm font-medium text-gray-700 mb-1">Office Address</label>
              <input id="settings-address" type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full border border-gray-300 rounded-md p-2 focus:ring-brand-500 focus:border-brand-500" />
            </div>
            <div className="md:col-span-2"><label htmlFor="settings-address-ar" className="block text-sm font-medium text-gray-700 mb-1">Office Address (Arabic)</label><input id="settings-address-ar" dir="rtl" lang="ar" type="text" value={formData.addressAr} onChange={e => setFormData({...formData, addressAr: e.target.value})} className="w-full border border-gray-300 rounded-md p-2 focus:ring-brand-500 focus:border-brand-500" /></div>
            <div className="md:col-span-2">
              <ArabicContentWarning missingFields={formData.address.trim() && !formData.addressAr.trim() ? ['office address'] : []} />
            </div>
          </div>

          <h2 className="text-lg font-medium text-gray-900 mb-6 border-t border-gray-100 pt-8">Social Links</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label htmlFor="settings-facebook" className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
              <input id="settings-facebook" type="url" value={formData.facebook} onChange={e => setFormData({...formData, facebook: e.target.value})} className="w-full border border-gray-300 rounded-md p-2 focus:ring-brand-500 focus:border-brand-500" />
            </div>
            <div>
              <label htmlFor="settings-instagram" className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
              <input id="settings-instagram" type="url" value={formData.instagram} onChange={e => setFormData({...formData, instagram: e.target.value})} className="w-full border border-gray-300 rounded-md p-2 focus:ring-brand-500 focus:border-brand-500" />
            </div>
            <div>
              <label htmlFor="settings-linkedin" className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
              <input id="settings-linkedin" type="url" value={formData.linkedin} onChange={e => setFormData({...formData, linkedin: e.target.value})} className="w-full border border-gray-300 rounded-md p-2 focus:ring-brand-500 focus:border-brand-500" />
            </div>
          </div>

          <div className="flex items-center justify-end border-t border-gray-100 pt-6">
            {message && <span role={message.includes('success') ? 'status' : 'alert'} aria-live="polite" className={`mr-4 ${message.includes('success') ? 'text-green-700' : 'text-red-700'}`}>{message}</span>}
            <button 
              type="submit" 
              disabled={isSaving}
              aria-busy={isSaving}
              className="min-h-11 bg-brand-600 hover:bg-brand-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:cursor-wait disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
