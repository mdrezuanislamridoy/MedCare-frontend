import { useState } from 'react';
import { complaints as initial, type Complaint } from '../data/mockData';
import { Card, StatusBadge, PriorityBadge, Avatar, Button, Input, Select, Pagination, Modal, ConfirmDialog } from '../components/ui';

type ComplaintStatus = Complaint['status'];

const statusOptions: ComplaintStatus[] = ['New', 'Under Investigation', 'Responded', 'Resolved', 'Escalated'];
const categoryOptions = ['Doctor Conduct', 'Billing Error', 'Appointment Error', 'Staff Conduct', 'Wait Time', 'Other'];

export default function ComplaintsPage({ showToast }: { showToast: (msg: string, type?: 'success' | 'error' | 'info' | 'warning') => void }) {
  const [data, setData] = useState<Complaint[]>(initial);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Complaint | null>(null);
  const [confirm, setConfirm] = useState<{ complaint: Complaint; action: string } | null>(null);
  const [responseText, setResponseText] = useState('');

  const PER_PAGE = 8;

  const filtered = data.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = !q || c.patient.toLowerCase().includes(q) || c.id.toLowerCase().includes(q) || c.relatedDoctor.toLowerCase().includes(q);
    const matchStatus = filterStatus === 'All' || c.status === filterStatus;
    const matchPriority = filterPriority === 'All' || c.priority === filterPriority;
    return matchSearch && matchStatus && matchPriority;
  });

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const doAction = () => {
    if (!confirm) return;
    const { complaint, action } = confirm;
    const statusMap: Record<string, ComplaintStatus> = {
      Investigate: 'Under Investigation', Respond: 'Responded', Resolve: 'Resolved', Escalate: 'Escalated',
    };
    if (statusMap[action]) {
      setData(d => d.map(c => c.id === complaint.id ? { ...c, status: statusMap[action] } : c));
      showToast(`Complaint ${complaint.id} ${action.toLowerCase()}d.`, action === 'Escalate' ? 'warning' : 'success');
    }
    setConfirm(null);
  };

  const sendResponse = () => {
    if (!responseText.trim() || !selected) return;
    setData(d => d.map(c => c.id === selected.id ? { ...c, status: 'Responded' } : c));
    showToast(`Response sent for complaint ${selected.id}.`, 'success');
    setResponseText('');
    setSelected(null);
  };

  return (
    <div className="animate-fade-in space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Complaints</h1>
        <p className="text-sm text-slate-500 mt-0.5">Manage and resolve patient complaints. Serious or sensitive cases must be escalated to Admin.</p>
      </div>

      <Card className="p-3">
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex-1 min-w-48">
            <Input placeholder="Search by patient, ID, or doctor…" value={search} onChange={v => { setSearch(v); setPage(1); }} />
          </div>
          <Select value={filterStatus} onChange={v => { setFilterStatus(v); setPage(1); }}
            options={[{ label: 'All Statuses', value: 'All' }, ...statusOptions.map(s => ({ label: s, value: s }))]} />
          <Select value={filterPriority} onChange={v => { setFilterPriority(v); setPage(1); }}
            options={[{ label: 'All Priorities', value: 'All' }, ...['Low', 'Medium', 'High', 'Urgent'].map(p => ({ label: p, value: p }))]} />
        </div>
      </Card>

      <Card>
        <div className="responsive-table">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                {['Complaint ID', 'Patient', 'Category', 'Related Doctor / Clinic', 'Priority', 'Status', 'Created', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginated.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-16 text-sm text-slate-400">No complaints match your filters.</td></tr>
              ) : paginated.map(c => (
                <tr key={c.id} className={`hover:bg-slate-50/80 transition-colors ${c.priority === 'Urgent' ? 'bg-red-50/20' : ''}`}>
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">{c.id}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Avatar name={c.patient} size="sm" />
                      <span className="text-sm font-medium text-slate-800">{c.patient}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{c.category}</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <p className="text-xs text-slate-700">{c.relatedDoctor}</p>
                    <p className="text-xs text-slate-400">{c.clinic}</p>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap"><PriorityBadge priority={c.priority} /></td>
                  <td className="px-4 py-3 whitespace-nowrap"><StatusBadge status={c.status} /></td>
                  <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap">{c.createdDate}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => setSelected(c)}>View</Button>
                      {c.status === 'New' && <Button variant="ghost" size="sm" onClick={() => setConfirm({ complaint: c, action: 'Investigate' })}>Investigate</Button>}
                      {(c.status === 'Under Investigation' || c.status === 'New') && <Button variant="ghost" size="sm" onClick={() => setSelected(c)}>Respond</Button>}
                      {c.status !== 'Resolved' && c.status !== 'Escalated' && <Button variant="ghost" size="sm" onClick={() => setConfirm({ complaint: c, action: 'Resolve' })}>Resolve</Button>}
                      {c.status !== 'Escalated' && (c.priority === 'Urgent' || c.priority === 'High') && (
                        <Button variant="ghost" size="sm" onClick={() => setConfirm({ complaint: c, action: 'Escalate' })}>Escalate</Button>
                      )}
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
      <Modal open={!!selected} onClose={() => { setSelected(null); setResponseText(''); }} title={selected ? `${selected.id} — ${selected.category}` : ''} size="lg">
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-slate-500 mb-1">Patient</p>
                <div className="flex items-center gap-2">
                  <Avatar name={selected.patient} size="sm" />
                  <span className="font-medium text-slate-800">{selected.patient}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <div><p className="text-xs text-slate-500 mb-1">Priority</p><PriorityBadge priority={selected.priority} /></div>
                <div><p className="text-xs text-slate-500 mb-1">Status</p><StatusBadge status={selected.status} /></div>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Related Doctor</p>
                <p className="text-slate-700">{selected.relatedDoctor}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Clinic</p>
                <p className="text-slate-700">{selected.clinic}</p>
              </div>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <p className="text-xs text-slate-500 mb-1">Complaint Description</p>
              <p className="text-sm text-slate-700">{selected.description}</p>
            </div>
            {(selected.priority === 'Urgent' || selected.priority === 'High') && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-xs text-red-700">
                ⚠ This complaint is marked as {selected.priority} priority. Consider escalating to Admin if it involves serious misconduct or legal risk.
              </div>
            )}
            <div>
              <p className="text-xs font-medium text-slate-700 mb-2">Respond to complaint</p>
              <textarea
                value={responseText}
                onChange={e => setResponseText(e.target.value)}
                placeholder="Type your response…"
                className="w-full h-24 px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0C7BB3]/30 focus:border-[#0C7BB3] resize-none"
              />
              <div className="flex justify-between items-center mt-2">
                <Button variant="danger" size="sm" onClick={() => { setConfirm({ complaint: selected, action: 'Escalate' }); setSelected(null); }}>Escalate to Admin</Button>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setSelected(null)}>Cancel</Button>
                  <Button variant="primary" size="sm" onClick={sendResponse} disabled={!responseText.trim()}>Send Response</Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!confirm}
        title={`${confirm?.action} Complaint`}
        message={confirm?.action === 'Escalate'
          ? `Escalate ${confirm?.complaint.id} to Admin? Admin will be notified and take ownership of this complaint.`
          : `Are you sure you want to ${confirm?.action?.toLowerCase()} complaint ${confirm?.complaint.id}?`}
        confirmLabel={confirm?.action || 'Confirm'}
        variant={confirm?.action === 'Escalate' ? 'danger' : 'primary'}
        onConfirm={doAction}
        onCancel={() => setConfirm(null)}
      />
    </div>
  );
}
