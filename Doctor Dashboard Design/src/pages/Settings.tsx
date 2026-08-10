import { useState } from "react";
import { Lock, Shield, Bell, Globe, Moon, Trash2, Save } from "lucide-react";

export default function Settings({ onToast }: { onToast: (msg: string) => void }) {
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [twoFA, setTwoFA] = useState(true);

  return (
    <div className="animate-fade-in space-y-5">
      <h1 className="text-2xl font-bold text-slate-900">Settings</h1>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Password & Security */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
              <Lock className="w-4 h-4 text-red-600" />
            </div>
            <h2 className="font-semibold text-slate-900">Password & Security</h2>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">Current Password</label>
              <input type="password" placeholder="••••••••" className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">New Password</label>
              <input type="password" placeholder="••••••••" className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">Confirm New Password</label>
              <input type="password" placeholder="••••••••" className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500" />
            </div>
            <button onClick={() => onToast("Password updated successfully")} className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
              <Save className="w-4 h-4" /> Update Password
            </button>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-teal-600" />
                <div>
                  <div className="text-sm font-medium text-slate-900">Two-Factor Authentication</div>
                  <div className="text-xs text-slate-500">Extra security via SMS or authenticator app</div>
                </div>
              </div>
              <div
                onClick={() => setTwoFA(!twoFA)}
                className={`w-10 h-5 rounded-full cursor-pointer relative transition-colors ${twoFA ? "bg-teal-500" : "bg-slate-200"}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${twoFA ? "translate-x-5" : "translate-x-0.5"}`} />
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <Bell className="w-4 h-4 text-blue-600" />
            </div>
            <h2 className="font-semibold text-slate-900">Notifications</h2>
          </div>
          <div className="space-y-3">
            {[
              { label: "Email Notifications", desc: "Receive notifications via email", value: emailNotifs, set: setEmailNotifs },
              { label: "SMS Notifications", desc: "Receive notifications via text message", value: smsNotifs, set: setSmsNotifs },
              { label: "Push Notifications", desc: "Browser and app push notifications", value: pushNotifs, set: setPushNotifs },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-slate-900">{item.label}</div>
                  <div className="text-xs text-slate-500">{item.desc}</div>
                </div>
                <div
                  onClick={() => item.set(!item.value)}
                  className={`w-10 h-5 rounded-full cursor-pointer relative transition-colors ${item.value ? "bg-teal-500" : "bg-slate-200"}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${item.value ? "translate-x-5" : "translate-x-0.5"}`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
              <Globe className="w-4 h-4 text-slate-600" />
            </div>
            <h2 className="font-semibold text-slate-900">Preferences</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">Language</label>
              <select className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white">
                <option>English (US)</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">Timezone</label>
              <select className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white">
                <option>Eastern Time (ET)</option>
                <option>Central Time (CT)</option>
                <option>Pacific Time (PT)</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">Date Format</label>
              <select className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white">
                <option>YYYY-MM-DD</option>
                <option>MM/DD/YYYY</option>
                <option>DD/MM/YYYY</option>
              </select>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Moon className="w-4 h-4 text-slate-500" />
                <div>
                  <div className="text-sm font-medium text-slate-900">Dark Mode</div>
                  <div className="text-xs text-slate-500">Switch to dark theme</div>
                </div>
              </div>
              <div
                onClick={() => setDarkMode(!darkMode)}
                className={`w-10 h-5 rounded-full cursor-pointer relative transition-colors ${darkMode ? "bg-teal-500" : "bg-slate-200"}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${darkMode ? "translate-x-5" : "translate-x-0.5"}`} />
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-xl border border-red-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
              <Trash2 className="w-4 h-4 text-red-600" />
            </div>
            <h2 className="font-semibold text-slate-900">Danger Zone</h2>
          </div>
          <div className="space-y-3">
            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="text-sm font-medium text-red-900">Deactivate Account</div>
              <div className="text-xs text-red-600 mt-0.5">Temporarily deactivate your doctor profile. Patients will not be able to book appointments.</div>
              <button className="mt-2 text-xs border border-red-300 text-red-700 px-3 py-1.5 rounded-lg font-medium hover:bg-red-100 transition-colors">Deactivate Account</button>
            </div>
            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="text-sm font-medium text-red-900">Delete Account</div>
              <div className="text-xs text-red-600 mt-0.5">Permanently delete your account and all associated data. This action cannot be undone.</div>
              <button className="mt-2 text-xs bg-red-600 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-red-700 transition-colors">Delete Account</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
