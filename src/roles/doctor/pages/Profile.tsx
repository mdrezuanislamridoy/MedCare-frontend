import { useEffect, useState } from "react";
import { Camera, Save, Star, Users, Briefcase, RefreshCw } from "lucide-react";
import { useAuthStore } from "../../../common/stores/auth.store";
import { doctorApi } from "../services/doctor.api";

export default function Profile({ onToast }: { onToast: (msg: string) => void }) {
  const { user } = useAuthStore();
  const rawName = user?.name || (user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : "Doctor");
  const docDisplayName = rawName.startsWith("Dr.") ? rawName : `Dr. ${rawName}`;
  const docInitials = (rawName.replace(/^Dr\.\s*/, '').slice(0, 2) || "DR").toUpperCase();

  const [profile, setProfile] = useState<any>({
    name: docDisplayName,
    email: user?.email || "",
    phone: user?.phoneNumber || "",
    specialty: "General Medicine",
    about: "",
    experience: "5+ years",
    totalPatients: 0,
    rating: 5.0,
    reviewCount: 0,
    qualifications: ["MD", "MBBS"],
    consultationFee: 150,
    clinicName: "MedCare Health Center",
    clinicAddress: "Medical Plaza, Suite 400",
  });
  const [activeTab, setActiveTab] = useState<"personal" | "clinic" | "online">("personal");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDoctorProfile() {
      try {
        const p = await doctorApi.getProfile();
        if (p) {
          setProfile((prev: any) => ({
            ...prev,
            name: p.name || docDisplayName,
            email: p.email || user?.email || prev.email,
            specialty: p.specialty || prev.specialty,
            about: p.bio || prev.about,
            consultationFee: p.consultationFee || prev.consultationFee,
            experience: p.experienceYears ? `${p.experienceYears} years` : prev.experience,
            qualifications: p.qualifications?.length ? p.qualifications : prev.qualifications,
            rating: p.rating ?? prev.rating,
            reviewCount: p.reviewCount ?? prev.reviewCount,
          }));
        }
      } catch (err) {
        console.warn("Could not load doctor profile from API:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDoctorProfile();
  }, [user]);

  const update = (field: string, value: string | number) => setProfile((p: any) => ({ ...p, [field]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await doctorApi.updateProfile({
        specialty: profile.specialty,
        bio: profile.about,
        consultationFee: Number(profile.consultationFee) || 150,
        qualifications: profile.qualifications,
        roomNumber: (profile as any).roomNumber || "Room 204",
      });
      onToast("Doctor profile updated successfully!");
    } catch (err: any) {
      onToast(err?.message || "Profile updated locally.");
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { key: "personal", label: "Personal Info" },
    { key: "clinic", label: "Clinic Info" },
    { key: "online", label: "Online Consultation" },
  ] as const;

  return (
    <div className="animate-fade-in space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Clinical Profile</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Manage your medical specialties, consultation fees, and bio.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md shadow-teal-600/20 transition-all disabled:opacity-60"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </div>

      {/* Profile Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
        <div className="flex items-start gap-6">
          <div className="relative flex-shrink-0">
            <div className="w-24 h-24 rounded-2xl bg-teal-600 flex items-center justify-center text-white font-bold text-2xl shadow-inner">
              {docInitials}
            </div>
            <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-teal-700 hover:bg-teal-800 text-white rounded-lg flex items-center justify-center shadow-md transition-colors">
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{profile.name}</h2>
            <p className="text-teal-600 dark:text-teal-400 font-semibold">{profile.specialty}</p>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1"><Star className="w-4 h-4 text-amber-400 fill-amber-400" /> {profile.rating || "5.0"} · {profile.reviewCount || 0} reviews</span>
              <span className="flex items-center gap-1"><Users className="w-4 h-4 text-slate-400" /> {Number(profile.totalPatients || 0).toLocaleString()} patients treated</span>
              <span className="flex items-center gap-1"><Briefcase className="w-4 h-4 text-slate-400" /> {profile.experience}</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {profile.qualifications?.map((q: string) => (
                <span key={q} className="text-xs bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 px-2.5 py-1 rounded-full font-medium">{q}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="border-b border-slate-100 dark:border-slate-800 px-5">
          <div className="flex gap-0">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-3.5 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.key ? "border-teal-600 text-teal-600 dark:text-teal-400 font-semibold" : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400"}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {activeTab === "personal" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">Full Medical Name</label>
                <input value={profile.name} onChange={(e) => update("name", e.target.value)} className="w-full text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">Clinical Specialty</label>
                <input value={profile.specialty} onChange={(e) => update("specialty", e.target.value)} className="w-full text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">Email Address</label>
                <input type="email" value={profile.email} onChange={(e) => update("email", e.target.value)} className="w-full text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">Phone Number</label>
                <input value={profile.phone} onChange={(e) => update("phone", e.target.value)} className="w-full text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">Biography & Clinical Philosophy</label>
                <textarea rows={3} value={profile.about} onChange={(e) => update("about", e.target.value)} className="w-full text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
            </div>
          )}

          {activeTab === "clinic" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">Clinic Name</label>
                <input value={profile.clinicName} onChange={(e) => update("clinicName", e.target.value)} className="w-full text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">Consultation Fee ($ USD)</label>
                <input type="number" value={profile.consultationFee} onChange={(e) => update("consultationFee", Number(e.target.value))} className="w-full text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">Clinic Address</label>
                <input value={profile.clinicAddress} onChange={(e) => update("clinicAddress", e.target.value)} className="w-full text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
            </div>
          )}

          {activeTab === "online" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-teal-50 dark:bg-teal-950/30 rounded-xl border border-teal-200 dark:border-teal-800">
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white text-sm">Teleconsultation Availability</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Accept instant high-definition video visits from patients anywhere</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
