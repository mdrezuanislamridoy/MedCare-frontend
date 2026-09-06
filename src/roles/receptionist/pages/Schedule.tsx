import { useState } from "react";
import { EmptyState } from "../components/ui";

export default function ScheduleView({ showToast }: { showToast: (m: string) => void }) {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Doctor Schedules</h2>
          <button onClick={() => showToast("New appointment slot opened")} className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors">
            + Schedule Appointment
          </button>
        </div>
        <EmptyState icon="🗓" title="No schedule data" sub="Doctor schedules will appear here when configured" />
      </div>

      {/* Room availability */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-semibold text-gray-900 mb-3">Room Availability</h3>
        <EmptyState icon="🚪" title="No room data" sub="Room availability will be displayed when the system is configured" />
      </div>
    </div>
  )
}
