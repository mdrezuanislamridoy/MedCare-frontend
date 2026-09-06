import { useState, useEffect } from "react";
import { Card, PageHeader } from "../components/ui";
import { clinicManagerApi } from "../services/clinic-manager.api";
import { useAuthStore } from "../../../common/stores/auth.store";

export default function ClinicProfilePage() {
  const { user } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("MedCare Medical Branch");
  const [address, setAddress] = useState("450 Healthcare Boulevard, Suite 200");
  const [phone, setPhone] = useState("+1 (555) 019-2831");
  const [email, setEmail] = useState(user?.email || "clinic@medcare.health");

  useEffect(() => {
    async function loadClinic() {
      try {
        const clinics = await clinicManagerApi.getClinics();
        if (Array.isArray(clinics) && clinics.length > 0) {
          const c = clinics[0];
          if (c.name) setName(c.name);
          if (c.address) setAddress(c.address);
          if (c.phone) setPhone(c.phone);
          if (c.email) setEmail(c.email);
        }
      } catch (err) {
        console.warn("Could not load clinic profile:", err);
      }
    }
    loadClinic();
  }, []);

  const services = ["General Practice", "Cardiology", "Pediatrics", "Dermatology", "Orthopedics", "Physical Therapy"];
  const facilities = ["Waiting Lobby", "Diagnostics Lab", "Consultation Rooms", "Reception Desk", "Emergency Care"];
  const hours = [
    { day: "Monday", open: "8:00 AM", close: "6:00 PM" },
    { day: "Tuesday", open: "8:00 AM", close: "6:00 PM" },
    { day: "Wednesday", open: "8:00 AM", close: "6:00 PM" },
    { day: "Thursday", open: "8:00 AM", close: "6:00 PM" },
    { day: "Friday", open: "8:00 AM", close: "5:00 PM" },
    { day: "Saturday", open: "9:00 AM", close: "2:00 PM" },
    { day: "Sunday", open: "Closed", close: "" },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Clinic Profile"
        subtitle="Manage clinic details, working hours, services, and facilities"
        action={
          <button
            onClick={() => setEditing(!editing)}
            className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${
              editing ? "bg-blue-600 text-white hover:bg-blue-700" : "border border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            {editing ? "Save Changes" : "Edit Profile"}
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">Basic Information</h3>
          <div className="space-y-4">
            {[
              { label: "Clinic Name", val: name, set: setName },
              { label: "Address", val: address, set: setAddress },
              { label: "Phone", val: phone, set: setPhone },
              { label: "Email", val: email, set: setEmail },
            ].map((f) => (
              <div key={f.label}>
                <label className="block text-xs font-medium text-slate-500 mb-1">{f.label}</label>
                {editing ? (
                  <input
                    value={f.val}
                    onChange={(e) => f.set(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                  />
                ) : (
                  <p className="text-sm text-slate-700">{f.val}</p>
                )}
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">Working Hours</h3>
          <div className="space-y-2">
            {hours.map((h) => (
              <div key={h.day} className="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-0">
                <span className="text-sm text-slate-600 w-24">{h.day}</span>
                {h.open === "Closed" ? (
                  <span className="text-xs text-slate-400 font-medium">Closed</span>
                ) : (
                  <span className="text-sm text-slate-700 font-mono text-xs">
                    {h.open} — {h.close}
                  </span>
                )}
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-3">Clinical Services</h3>
          <div className="flex flex-wrap gap-2">
            {services.map((s) => (
              <span key={s} className="px-2.5 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                {s}
              </span>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-3">Facilities</h3>
          <div className="flex flex-wrap gap-2">
            {facilities.map((f) => (
              <span key={f} className="px-2.5 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded-full">
                {f}
              </span>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
