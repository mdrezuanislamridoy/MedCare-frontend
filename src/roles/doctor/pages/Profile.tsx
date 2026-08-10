import { useState } from "react";
import { Camera, Save, Star, Users, Briefcase } from "lucide-react";
import { doctorProfile } from "../data/mockData";

export default function Profile({ onToast }: { onToast: (msg: string) => void }) {
  const [profile, setProfile] = useState(doctorProfile);
  const [activeTab, setActiveTab] = useState<"personal" | "clinic" | "online">("personal");

  const update = (field: string, value: string | number) => setProfile((p) => ({ ...p, [field]: value }));

  const tabs = [
    { key: "personal", label: "Personal Info" },
    { key: "clinic", label: "Clinic Info" },
    { key: "online", label: "Online Consultation" },
  ] as const;

  return (
    <div className="animate-fade-in space-y-5">
      <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>

      {/* Profile Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-start gap-6">
          <div className="relative flex-shrink-0">
            <img src={profile.avatar} alt={profile.name} className="w-24 h-24 rounded-2xl object-cover bg-slate-100" />
            <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-teal-600 hover:bg-teal-700 text-white rounded-lg flex items-center justify-center shadow-md transition-colors">
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-slate-900">{profile.name}</h2>
            <p className="text-teal-600 font-medium">{profile.specialty}</p>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-slate-600">
              <span className="flex items-center gap-1"><Star className="w-4 h-4 text-amber-400 fill-amber-400" /> 4.8 · 312 reviews</span>
              <span className="flex items-center gap-1"><Users className="w-4 h-4 text-slate-400" /> {profile.totalPatients.toLocaleString()} patients</span>
              <span className="flex items-center gap-1"><Briefcase className="w-4 h-4 text-slate-400" /> {profile.experience} experience</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {profile.qualifications.map((q) => (
                <span key={q} className="text-xs bg-teal-50 text-teal-700 border border-teal-200 px-2.5 py-1 rounded-full font-medium">{q}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="border-b border-slate-100 px-5">
          <div className="flex gap-0">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-3.5 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.key ? "border-teal-600 text-teal-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-5">
          {activeTab === "personal" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Full Name</label>
                <input value={profile.name} onChange={(e) => update("name", e.target.value)} className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Specialty</label>
                <input value={profile.specialty} onChange={(e) => update("specialty", e.target.value)} className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Email</label>
                <input type="email" value={profile.email} onChange={(e) => update("email", e.target.value)} className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Phone</label>
                <input value={profile.phone} onChange={(e) => update("phone", e.target.value)} className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Experience</label>
                <input value={profile.experience} onChange={(e) => update("experience", e.target.value)} className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Consultation Fee ($)</label>
                <input type="number" value={profile.consultationFee} onChange={(e) => update("consultationFee", Number(e.target.value))} className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-slate-700 block mb-1">About / Bio</label>
                <textarea value={profile.about} onChange={(e) => update("about", e.target.value)} rows={4} className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none" />
              </div>
            </div>
          )}

          {activeTab === "clinic" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Clinic Name</label>
                <input value={profile.clinicName} onChange={(e) => update("clinicName", e.target.value)} className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Registration Number</label>
                <input value={profile.registrationNumber} className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 bg-slate-50 text-slate-500 cursor-not-allowed" disabled />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-slate-700 block mb-1">Clinic Address</label>
                <textarea value={profile.clinicAddress} onChange={(e) => update("clinicAddress", e.target.value)} rows={2} className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none" />
              </div>
            </div>
          )}

          {activeTab === "online" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <div className="font-medium text-slate-900 text-sm">Accept Online Consultations</div>
                  <div className="text-xs text-slate-500">Allow patients to book video/chat consultations</div>
                </div>
                <div className="w-10 h-5 rounded-full bg-teal-500 relative cursor-pointer flex-shrink-0">
                  <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-white rounded-full shadow" />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <div className="font-medium text-slate-900 text-sm">Auto-Accept Appointments</div>
                  <div className="text-xs text-slate-500">Automatically confirm new appointment requests</div>
                </div>
                <div className="w-10 h-5 rounded-full bg-slate-300 relative cursor-pointer flex-shrink-0">
                  <span className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Online Consultation Fee ($)</label>
                <input type="number" defaultValue={120} className="w-full md:w-48 text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
            </div>
          )}

          <div className="mt-5 pt-5 border-t border-slate-100 flex justify-end">
            <button onClick={() => onToast("Profile updated successfully")} className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors">
              <Save className="w-4 h-4" /> Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
