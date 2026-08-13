import { useState } from 'react';
import { appointments as initialAppts, type Appointment } from '../data/mockData';
import { Card, StatusBadge, Avatar, Button, Input, Select, Pagination, Modal, ConfirmDialog } from '../components/ui';

const statusOptions = ['Scheduled', 'Confirmed', 'Pending Reschedule', 'Cancelled', 'Completed', 'No Show'];

export default function AppointmentsPage({ showToast }: { showToast: (msg: string, type?: 'success' | 'error' | 'info' | 'warning') => void }) {
  const [data] = useState<Appointment[]>(initialAppts);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterIssue, setFilterIssue] = useState('All');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Appointment | null>(null);
  const [confirm, setConfirm] = useState<{ appt: Appointment; action: string } | null>(null);

  const PER_PAGE = 8;

  const filtered = data.filter(a => {
    const q = search.toLowerCase();
    const matchSearch = !q || a.patient.toLowerCase().includes(q) || a.doctor.toLowerCase().includes(q) || a.id.toLowerCase().includes(q);
    const matchStatus = filterStatus === 'All' || a.status === filterStatus;
    const matchIssue = filterIssue === 'All' || (filterIssue === 'Issues' ? a.issueFlag : !a.issueFlag);
    return matchSearch && matchStatus && matchIssue;
  });

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const doAction = () => {
    if (!confirm) return;
    const { appt, action } = confirm;
    const msgs: Record<string, string> = {
      Reschedule: `Reschedule request initiated for ${appt.id}. Patient will be notified.`,
      Escalate: `${appt.id} escalated to admin team.`,
      'Send Reminder': `Reminder sent to ${appt.patient} for appointment ${appt.id}.`,
    };
    showToast(msgs[action] || `Action performed on ${appt.id}.`, 'success');
    setConfirm(null);
  };

  return (
    <div className="animate-fade-in space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Appointment Support</h1>
        <p className="text-sm text-slate-500 mt-0.5">View appointment details and assist with scheduling issues.</p>
      </div>

      <div className="bg-sky-50 border border-sky-200 rounded-xl px-4 py-3 text-sm text-sky-800 flex items-start gap-2">
        <span>ℹ</span>
        <span>Support staff can view appointment details and assist with rescheduling. Direct modification of consultation data and medical notes is restricted.</span>
      </div>

      <Card className="p-3">
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex-1 min-w-48">
            <Input placeholder="Search by patient, doctor, or appointment ID…" value={search} onChange={v => { setSearch(v); setPage(1); }} />
          </div>
          <Select value={filterStatus} onChange={v => { setFilterStatus(v); setPage(1); }}
            options={[{ label: 'All Statuses', value: 'All' }, ...statusOptions.map(s => ({ label: s, value: s }))]} />
          <Select value={filterIssue} onChange={v => { setFilterIssue(v); setPage(1); }}
            options={[{ label: 'All Appointments', value: 'All' }, { label: 'Has Issues', value: 'Issues' }, { label: 'No Issues', value: 'None' }]} />
        </div>
      </Card>

      <Card>
        <div className="responsive-table">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                {['ID', 'Patient', 'Doctor', 'Specialty', 'Date & Time', 'Status', 'Clinic', 'Issues', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginated.length === 0 ? (
                <tr><td colSpan={9} className="text-center py-16 text-sm text-slate-400">No appointments match your filters.</td></tr>
              ) : paginated.map(a => (
                <tr key={a.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">{a.id}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Avatar name={a.patient} size="sm" />
                      <span className="text-sm font-medium text-slate-800">{a.patient}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-700">{a.doctor}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-slate-500">{a.specialty}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-slate-600">{a.date}<br />{a.time}</td>
                  <td className="px-4 py-3 whitespace-nowrap"><StatusBadge status={a.status} /></td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-slate-500">{a.clinic}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {a.issueFlag ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-50 text-red-700 border border-red-100 text-xs font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        {a.issueType}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-300">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" onClick={() => setSelected(a)}>View</Button>
                      {a.status !== 'Completed' && a.status !== 'Cancelled' && (
                        <Button variant="ghost" size="sm" onClick={() => setConfirm({ appt: a, action: 'Reschedule' })}>Reschedule</Button>
                      )}
                      {a.issueFlag && (
                        <Button variant="ghost" size="sm" onClick={() => setConfirm({ appt: a, action: 'Escalate' })}>Escalate</Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => setConfirm({ appt: a, action: 'Send Reminder' })}>Remind</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination page={page} total={filtered.length} perPage={PER_PAGE} onChange={setPage} />
      </Card>

      {/* Detail Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected ? `Appointment ${selected.id}` : ''}>
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-slate-500 mb-1">Patient</p>
                <div className="flex items-center gap-2">
                  <Avatar name={selected.patient} size="sm" />
                  <div>
                    <p className="font-medium text-slate-800">{selected.patient}</p>
                    <p className="text-xs text-slate-400 font-mono">{selected.patientId}</p>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Doctor</p>
                <p className="font-medium text-slate-800">{selected.doctor}</p>
                <p className="text-xs text-slate-500">{selected.specialty}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Date & Time</p>
                <p className="font-medium text-slate-800">{selected.date} at {selected.time}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Clinic</p>
                <p className="text-slate-700">{selected.clinic}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Status</p>
                <StatusBadge status={selected.status} />
              </div>
              {selected.issueFlag && (
                <div>
                  <p className="text-xs text-slate-500 mb-1">Issue</p>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-50 text-red-700 border border-red-100 text-xs font-medium">⚠ {selected.issueType}</span>
                </div>
              )}
            </div>
            <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-xs text-amber-800">
              🔒 Medical consultation notes, diagnosis, and prescription information are not accessible to support staff.
            </div>
            <div className="flex gap-2">
              {selected.status !== 'Completed' && selected.status !== 'Cancelled' && (
                <Button variant="secondary" size="sm" onClick={() => { setConfirm({ appt: selected, action: 'Reschedule' }); setSelected(null); }}>Request Reschedule</Button>
              )}
              {selected.issueFlag && (
                <Button variant="danger" size="sm" onClick={() => { setConfirm({ appt: selected, action: 'Escalate' }); setSelected(null); }}>Escalate to Admin</Button>
              )}
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!confirm}
        title={`${confirm?.action} Appointment`}
        message={`Are you sure you want to ${confirm?.action?.toLowerCase()} appointment ${confirm?.appt.id} for ${confirm?.appt.patient}?`}
        confirmLabel={confirm?.action || 'Confirm'}
        variant={confirm?.action === 'Escalate' ? 'danger' : 'primary'}
        onConfirm={doAction}
        onCancel={() => setConfirm(null)}
      />
    </div>
  );
}
