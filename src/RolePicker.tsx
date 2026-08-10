import { Stethoscope } from "lucide-react";

const routes = [
  {
    path: "/super-admin",
    label: "Super Admin",
    description: "Platform controls, analytics, roles, security, and system settings.",
    accent: "bg-violet-600",
  },
  {
    path: "/admin",
    label: "Admin",
    description: "Operations dashboard for doctors, patients, clinics, finance, and reviews.",
    accent: "bg-blue-600",
  },
  {
    path: "/doctor",
    label: "Doctor",
    description: "Doctor workspace for appointments, patients, schedules, and consultations.",
    accent: "bg-teal-600",
  },
  {
    path: "/patient",
    label: "Patient",
    description: "Patient portal for finding doctors, bookings, records, payments, and profile.",
    accent: "bg-sky-600",
  },
];

export default function RolePicker() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-8">
        <header className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-500">
            <Stethoscope className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">MedCare</h1>
            <p className="text-sm text-slate-400">Role portals</p>
          </div>
        </header>

        <section className="flex flex-1 items-center py-12">
          <div className="w-full">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-teal-300">Choose portal</p>
            <h2 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
              Four dashboards are combined in one app with separate URLs.
            </h2>
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {routes.map((route) => (
                <a
                  key={route.path}
                  href={route.path}
                  className="group rounded-lg border border-white/10 bg-white/[0.04] p-5 transition hover:border-teal-300/60 hover:bg-white/[0.07]"
                >
                  <div className={`mb-5 h-1.5 w-16 rounded-full ${route.accent}`} />
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-lg font-semibold">{route.label}</h3>
                    <span className="text-sm text-slate-400 transition group-hover:text-teal-200">{route.path}</span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{route.description}</p>
                </a>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
