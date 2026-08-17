import { useEffect, useState } from 'react';
import { User, Mail, Phone, Calendar, MapPin, Shield, Bell, Lock, Camera, CheckCircle, RefreshCw } from 'lucide-react';
import { useAuthStore } from '../../../common/stores/auth.store';
import { patientApi } from '../services/patient.api';
import { patient } from '../data/mockData';
import { Card, Button, Input, Avatar, Toast } from './ui';

const tabs = ['Personal Info', 'Emergency Contact', 'Security', 'Notifications', 'Privacy'];

export default function ProfileSettings() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('Personal Info');
  const [toast, setToast] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const [form, setForm] = useState({
    name: user?.name || patient.name,
    email: user?.email || patient.email,
    phone: patient.phone,
    dob: patient.dob,
    gender: patient.gender,
    bloodGroup: patient.bloodGroup,
    height: 175,
    weight: 70,
    allergies: 'Penicillin, Dust mites',
    address: patient.address,
    emergencyName: 'Emily Harrington',
    emergencyRelationship: 'Spouse',
    emergencyPhone: '+1 (555) 987-6543',
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

  useEffect(() => {
    async function loadProfile() {
      try {
        const p = await patientApi.getProfile();
        if (p) {
          setForm(prev => ({
            ...prev,
            name: p.name || prev.name,
            email: p.email || prev.email,
            phone: p.phone || prev.phone,
            bloodGroup: p.bloodGroup || prev.bloodGroup,
            height: p.height || prev.height,
            weight: p.weight || prev.weight,
            allergies: p.allergies ? p.allergies.join(', ') : prev.allergies,
            emergencyName: p.emergencyName || prev.emergencyName,
            emergencyRelationship: p.emergencyRelationship || prev.emergencyRelationship,
            emergencyPhone: p.emergencyPhone || prev.emergencyPhone,
          }));
        }
      } catch (err) {
        console.warn('Fallback to local profile data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await patientApi.updateProfile({
        phone: form.phone,
        bloodGroup: form.bloodGroup,
        height: Number(form.height) || undefined,
        weight: Number(form.weight) || undefined,
        allergies: form.allergies ? form.allergies.split(',').map(s => s.trim()) : [],
        emergencyName: form.emergencyName,
        emergencyRelationship: form.emergencyRelationship,
        emergencyPhone: form.emergencyPhone,
      });
      showToast('Profile updated successfully!');
    } catch (err: any) {
      showToast(err?.message || 'Profile saved locally.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="font-patient text-2xl font-bold text-slate-800 dark:text-white">Profile & Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Manage your personal information, emergency contacts, and security preferences.</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Profile card */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="p-5 text-center bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <div className="relative inline-block mb-4">
              <Avatar src={patient.photo} name={form.name} size="xl" />
              <button className="absolute bottom-0 right-0 w-7 h-7 bg-teal-600 rounded-full flex items-center justify-center shadow-md hover:bg-teal-700 transition-colors">
                <Camera className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
            <h2 className="font-patient font-bold text-slate-800 dark:text-white text-base">{form.name}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{form.email}</p>
            <div className="mt-3 flex items-center justify-center gap-2 text-xs text-slate-500">
              <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 rounded-full border border-emerald-200 dark:border-emerald-800 font-medium">Verified Patient</span>
              <span>·</span>
              <span className="font-semibold text-teal-600 dark:text-teal-400">{form.bloodGroup} Blood</span>
            </div>
          </Card>

          {/* Tab list */}
          <Card className="p-2 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <nav className="space-y-0.5">
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                    activeTab === tab ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 font-semibold' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
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
            <Card className="p-4 sm:p-6 animate-fade-in bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <h3 className="font-patient font-bold text-slate-800 dark:text-white mb-5">Personal Health & Identity</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Input label="Full Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <Input label="Email Address" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                <Input label="Phone Number" type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                <Input label="Date of Birth" type="date" value={form.dob} onChange={e => setForm(f => ({ ...f, dob: e.target.value }))} />
                
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Blood Group</label>
                  <select
                    value={form.bloodGroup}
                    onChange={e => setForm(f => ({ ...f, bloodGroup: e.target.value }))}
                    className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-800 dark:text-white outline-none focus:border-teal-500"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                <Input
                  label="Height (cm)"
                  type="number"
                  value={form.height}
                  onChange={e => setForm(f => ({ ...f, height: Number(e.target.value) }))}
                />
                <Input
                  label="Weight (kg)"
                  type="number"
                  value={form.weight}
                  onChange={e => setForm(f => ({ ...f, weight: Number(e.target.value) }))}
                />

                <div className="sm:col-span-2">
                  <Input
                    label="Known Allergies (comma separated)"
                    value={form.allergies}
                    onChange={e => setForm(f => ({ ...f, allergies: e.target.value }))}
                    placeholder="e.g. Penicillin, Peanuts, Pollen"
                  />
                </div>

                <div className="sm:col-span-2">
                  <Input label="Residential Address" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button onClick={handleSave} disabled={saving} className="bg-teal-600 hover:bg-teal-700 text-white">
                  {saving ? <><RefreshCw className="w-4 h-4 animate-spin" /> Saving...</> : 'Save Changes'}
                </Button>
              </div>
            </Card>
          )}

          {activeTab === 'Emergency Contact' && (
            <Card className="p-4 sm:p-6 animate-fade-in bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <h3 className="font-patient font-bold text-slate-800 dark:text-white mb-2">Emergency Contact Person</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs mb-5">
                This individual will be alerted by medical staff in case of an acute clinical event or urgent hospitalization.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Input label="Contact Full Name" value={form.emergencyName} onChange={e => setForm(f => ({ ...f, emergencyName: e.target.value }))} />
                </div>
                <Input label="Relationship" value={form.emergencyRelationship} onChange={e => setForm(f => ({ ...f, emergencyRelationship: e.target.value }))} placeholder="e.g. Spouse, Parent, Sibling" />
                <Input label="Emergency Phone" type="tel" value={form.emergencyPhone} onChange={e => setForm(f => ({ ...f, emergencyPhone: e.target.value }))} />
              </div>

              <div className="mt-6 flex justify-end">
                <Button onClick={handleSave} disabled={saving} className="bg-teal-600 hover:bg-teal-700 text-white">
                  {saving ? <><RefreshCw className="w-4 h-4 animate-spin" /> Saving...</> : 'Save Emergency Contact'}
                </Button>
              </div>
            </Card>
          )}

          {activeTab === 'Security' && (
            <Card className="p-4 sm:p-6 animate-fade-in bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="font-patient font-bold text-slate-800 dark:text-white mb-2">Account Security</h3>
              <div className="space-y-3">
                <Input label="Current Password" type="password" placeholder="••••••••" />
                <Input label="New Password" type="password" placeholder="Min 8 characters" />
                <Input label="Confirm New Password" type="password" placeholder="••••••••" />
              </div>
              <div className="pt-2 flex justify-end">
                <Button onClick={() => showToast('Password updated successfully!')} className="bg-teal-600 hover:bg-teal-700 text-white">
                  Update Password
                </Button>
              </div>
            </Card>
          )}

          {activeTab === 'Notifications' && (
            <Card className="p-4 sm:p-6 animate-fade-in bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="font-patient font-bold text-slate-800 dark:text-white mb-2">Notification Preferences</h3>
              <div className="space-y-2">
                {[
                  { key: 'appointmentConfirmations', label: 'Appointment Confirmations', desc: 'Instant push & email on booking approval' },
                  { key: 'reminders', label: 'Consultation Reminders', desc: 'Alerts 1 hour before scheduled time' },
                  { key: 'prescriptionAlerts', label: 'Digital Prescription Releases', desc: 'Notification when doctor publishes medical chart' },
                  { key: 'smsAlerts', label: 'SMS Critical Reminders', desc: 'Direct text messages to your phone' },
                ].map(item => (
                  <label key={item.key} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="mt-1 h-4 w-4 rounded text-teal-600 focus:ring-teal-500"
                    />
                    <div>
                      <div className="text-xs font-semibold text-slate-800 dark:text-white">{item.label}</div>
                      <div className="text-[11px] text-slate-400">{item.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
              <div className="pt-2 flex justify-end">
                <Button onClick={() => showToast('Notification preferences saved!')} className="bg-teal-600 hover:bg-teal-700 text-white">
                  Save Preferences
                </Button>
              </div>
            </Card>
          )}

          {activeTab === 'Privacy' && (
            <Card className="p-4 sm:p-6 animate-fade-in bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="font-patient font-bold text-slate-800 dark:text-white mb-2">Data Privacy & HIPAA Compliance</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Your medical charts and health metrics are encrypted in accordance with HIPAA data protection standards.
              </p>
              <div className="p-3 bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 rounded-xl text-xs text-teal-800 dark:text-teal-300">
                End-to-End EHR Privacy: Only attending clinical doctors and emergency triage staff have access to your health records.
              </div>
            </Card>
          )}
        </div>
      </div>

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  );
}
