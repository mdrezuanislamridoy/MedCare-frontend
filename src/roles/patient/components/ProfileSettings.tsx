import { useState } from 'react';
import { User, Mail, Phone, Calendar, MapPin, Shield, Bell, Lock, Camera, CheckCircle } from 'lucide-react';
import { patient } from '../data/mockData';
import { Card, Button, Input, Avatar, Toast } from './ui';

const tabs = ['Personal Info', 'Emergency Contact', 'Security', 'Notifications', 'Privacy'];

export default function ProfileSettings() {
  const [activeTab, setActiveTab] = useState('Personal Info');
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const [form, setForm] = useState({
    name: patient.name,
    email: patient.email,
    phone: patient.phone,
    dob: patient.dob,
    gender: patient.gender,
    bloodGroup: patient.bloodGroup,
    address: patient.address,
  });

  const [notifPrefs, setNotifPrefs] = useState({
    appointmentConfirmations: true,
    reminders: true,
    cancellations: true,
    paymentUpdates: true,
    prescriptionAlerts: true,
    doctorMessages: true,
    promotions: false,
    smsAlerts: true,
    emailDigest: false,
  });

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="font-patient text-2xl font-semibold text-slate-800">Profile & Settings</h1>
        <p className="text-slate-500 text-sm mt-0.5">Manage your personal information, security, and preferences.</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Profile card */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="p-5 text-center">
            <div className="relative inline-block mb-4">
              <Avatar src={patient.photo} name={patient.name} size="xl" />
              <button className="absolute bottom-0 right-0 w-7 h-7 bg-teal-600 rounded-full flex items-center justify-center shadow-md hover:bg-teal-700 transition-colors">
                <Camera className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
            <h2 className="font-patient font-semibold text-slate-800">{patient.name}</h2>
            <p className="text-sm text-slate-500 mt-0.5">{patient.email}</p>
            <div className="mt-3 flex items-center justify-center gap-2 text-xs text-slate-500">
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200 font-medium">Verified</span>
              <span>·</span>
              <span>{patient.bloodGroup} Blood</span>
            </div>
          </Card>

          {/* Tab list */}
          <Card className="p-2">
            <nav className="space-y-0.5">
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                    activeTab === tab ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {tab === 'Personal Info' && <User className="w-4 h-4 flex-shrink-0" />}
                  {tab === 'Emergency Contact' && <Phone className="w-4 h-4 flex-shrink-0" />}
                  {tab === 'Security' && <Shield className="w-4 h-4 flex-shrink-0" />}
                  {tab === 'Notifications' && <Bell className="w-4 h-4 flex-shrink-0" />}
                  {tab === 'Privacy' && <Lock className="w-4 h-4 flex-shrink-0" />}
                  {tab}
                </button>
              ))}
            </nav>
          </Card>
        </div>

        {/* Settings content */}
        <div className="lg:col-span-3">
          {activeTab === 'Personal Info' && (
            <Card className="p-4 sm:p-6 animate-fade-in">
              <h3 className="font-patient font-semibold text-slate-800 mb-5">Personal Information</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Input label="Full Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <Input label="Email Address" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                <Input label="Phone Number" type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                <Input label="Date of Birth" type="date" value={form.dob} onChange={e => setForm(f => ({ ...f, dob: e.target.value }))} />
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-slate-700">Gender</label>
                  <div className="flex gap-2">
                    {['Male', 'Female', 'Other'].map(g => (
                      <button
                        key={g}
                        onClick={() => setForm(f => ({ ...f, gender: g }))}
                        className={`flex-1 py-2 text-sm font-medium rounded-lg border transition-colors ${form.gender === g ? 'bg-teal-600 text-white border-teal-600' : 'border-slate-200 text-slate-600 hover:bg-teal-50'}`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-slate-700">Blood Group</label>
                  <select
                    value={form.bloodGroup}
                    onChange={e => setForm(f => ({ ...f, bloodGroup: e.target.value }))}
                    className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 bg-white text-slate-700"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => <option key={bg}>{bg}</option>)}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-slate-700 block mb-1">Address</label>
                  <textarea
                    value={form.address}
                    onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                    rows={2}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 resize-none transition"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-5">
                <Button onClick={() => showToast('Profile updated successfully.')}>Save Changes</Button>
              </div>
            </Card>
          )}

          {activeTab === 'Emergency Contact' && (
            <Card className="p-4 sm:p-6 animate-fade-in">
              <h3 className="font-patient font-semibold text-slate-800 mb-5">Emergency Contact</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Contact Name" defaultValue={patient.emergencyContact.name} />
                <Input label="Relationship" defaultValue={patient.emergencyContact.relation} />
                <Input label="Phone Number" type="tel" defaultValue={patient.emergencyContact.phone} />
              </div>
              <div className="flex justify-end mt-5">
                <Button onClick={() => showToast('Emergency contact updated.')}>Save Changes</Button>
              </div>
            </Card>
          )}

          {activeTab === 'Security' && (
            <Card className="p-4 sm:p-6 animate-fade-in space-y-5">
              <h3 className="font-patient font-semibold text-slate-800">Security Settings</h3>

              <div className="grid sm:grid-cols-1 gap-4 max-w-md">
                <Input label="Current Password" type="password" placeholder="••••••••" />
                <Input label="New Password" type="password" placeholder="••••••••" />
                <Input label="Confirm New Password" type="password" placeholder="••••••••" />
              </div>
              <Button onClick={() => showToast('Password changed successfully.')}>Update Password</Button>

              <div className="border-t border-slate-100 pt-5">
                <h4 className="font-medium text-slate-700 mb-3">Two-Factor Authentication</h4>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div>
                    <p className="text-sm font-medium text-slate-700">Authenticator App</p>
                    <p className="text-xs text-slate-500">Use an authenticator app for extra security</p>
                  </div>
                  <div className="relative">
                    <input type="checkbox" className="sr-only" id="2fa" />
                    <label htmlFor="2fa" className="flex items-center cursor-pointer">
                      <div className="relative w-10 h-6 bg-slate-200 rounded-full">
                        <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow transition-transform" />
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-5">
                <h4 className="font-medium text-slate-700 mb-3">Active Sessions</h4>
                {[
                  { device: 'Chrome on Windows', location: 'Mumbai, India', time: 'Active now', current: true },
                  { device: 'Safari on iPhone', location: 'Mumbai, India', time: '2 hours ago', current: false },
                ].map((session, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-slate-700">{session.device}</p>
                      <p className="text-xs text-slate-400">{session.location} · {session.time}</p>
                    </div>
                    {session.current
                      ? <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded-full">Current</span>
                      : <Button size="sm" variant="ghost" className="text-red-500 hover:bg-red-50">Revoke</Button>
                    }
                  </div>
                ))}
              </div>
            </Card>
          )}

          {activeTab === 'Notifications' && (
            <Card className="p-4 sm:p-6 animate-fade-in">
              <h3 className="font-patient font-semibold text-slate-800 mb-5">Notification Preferences</h3>
              <div className="space-y-1">
                {(Object.entries(notifPrefs) as [keyof typeof notifPrefs, boolean][]).map(([key, val]) => {
                  const labels: Record<string, { label: string; desc: string }> = {
                    appointmentConfirmations: { label: 'Appointment Confirmations', desc: 'Notify when appointments are confirmed' },
                    reminders: { label: 'Appointment Reminders', desc: 'Reminders before your appointments' },
                    cancellations: { label: 'Cancellations & Changes', desc: 'Doctor cancellations and reschedule requests' },
                    paymentUpdates: { label: 'Payment Updates', desc: 'Payment receipts and pending payment alerts' },
                    prescriptionAlerts: { label: 'Prescription Alerts', desc: 'New prescriptions from your doctors' },
                    doctorMessages: { label: 'Doctor Messages', desc: 'Direct messages from your healthcare team' },
                    promotions: { label: 'Offers & Promotions', desc: 'Health tips, offers, and platform updates' },
                    smsAlerts: { label: 'SMS Alerts', desc: 'Receive notifications via SMS' },
                    emailDigest: { label: 'Weekly Email Summary', desc: 'Summary of your health activity' },
                  };
                  const info = labels[key];
                  return (
                    <div key={key} className="flex items-center justify-between py-3.5 border-b border-slate-100 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-slate-700">{info.label}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{info.desc}</p>
                      </div>
                      <button
                        onClick={() => setNotifPrefs(p => ({ ...p, [key]: !val }))}
                        className={`relative w-10 h-6 rounded-full transition-colors flex-shrink-0 ${val ? 'bg-teal-600' : 'bg-slate-200'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${val ? 'left-5' : 'left-1'}`} />
                      </button>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-end mt-5">
                <Button onClick={() => showToast('Preferences saved.')}>Save Preferences</Button>
              </div>
            </Card>
          )}

          {activeTab === 'Privacy' && (
            <Card className="p-4 sm:p-6 animate-fade-in space-y-5">
              <h3 className="font-patient font-semibold text-slate-800">Privacy & Data</h3>
              <div className="space-y-3">
                {[
                  { title: 'Profile Visibility', desc: 'Control who can see your profile information' },
                  { title: 'Medical Data Sharing', desc: 'Allow doctors to access your medical history' },
                  { title: 'Analytics', desc: 'Help us improve by sharing usage analytics' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div>
                      <p className="text-sm font-medium text-slate-700">{item.title}</p>
                      <p className="text-xs text-slate-500">{item.desc}</p>
                    </div>
                    <button className="relative w-10 h-6 rounded-full bg-teal-600 flex-shrink-0">
                      <div className="absolute top-1 left-5 w-4 h-4 rounded-full bg-white shadow" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-100 pt-4 space-y-3">
                <Button variant="secondary" className="w-full justify-center" onClick={() => showToast('Data export requested. You will receive an email.')}>
                  Export My Data
                </Button>
                <Button variant="ghost" className="w-full justify-center text-red-500 hover:bg-red-50">
                  Delete Account
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  );
}
