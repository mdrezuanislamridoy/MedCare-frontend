import { useState } from 'react';
import { tickets as initialTickets, type Ticket, type TicketStatus, type TicketPriority, type TicketCategory } from '../data/mockData';
import { Card, StatusBadge, PriorityBadge, Avatar, Button, Input, Select, Pagination, Modal, ConfirmDialog } from './ui';

const categories: TicketCategory[] = ['Appointment', 'Payment', 'Account', 'Doctor', 'Technical', 'General'];
const priorities: TicketPriority[] = ['Low', 'Medium', 'High', 'Urgent'];
const statuses: TicketStatus[] = ['Open', 'In Progress', 'Waiting for User', 'Resolved', 'Closed'];
const staffList = ['Alex Chen', 'Sara Kim', 'Mark Davis', 'Unassigned'];

export default function TicketsPage({ showToast }: { showToast: (msg: string, type?: 'success' | 'error' | 'info' | 'warning') => void }) {
  const [data, setData] = useState<Ticket[]>(initialTickets);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Ticket | null>(null);
  const [confirmAction, setConfirmAction] = useState<{ ticket: Ticket; action: string } | null>(null);
  const [replyText, setReplyText] = useState('');

  const PER_PAGE = 8;

  const filtered = data.filter(t => {
    const q = search.toLowerCase();
    const matchSearch = !q || t.patient.toLowerCase().includes(q) || t.id.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q);
    const matchStatus = filterStatus === 'All' || t.status === filterStatus;
    const matchPriority = filterPriority === 'All' || t.priority === filterPriority;
    const matchCategory = filterCategory === 'All' || t.category === filterCategory;
    return matchSearch && matchStatus && matchPriority && matchCategory;
  });

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleAction = (ticket: Ticket, action: string) => {
    if (action === 'View') { setSelected(ticket); return; }
    if (action === 'Reply') { setSelected(ticket); return; }
    setConfirmAction({ ticket, action });
  };

  const doAction = () => {
    if (!confirmAction) return;
    const { ticket, action } = confirmAction;
    const statusMap: Record<string, TicketStatus> = {
      Resolve: 'Resolved', Close: 'Closed', Escalate: 'In Progress',
    };
    if (statusMap[action]) {
      setData(d => d.map(t => t.id === ticket.id ? { ...t, status: statusMap[action], updatedDate: '2026-08-13' } : t));
      showToast(`Ticket ${ticket.id} ${action.toLowerCase()}d.`, 'success');
    } else if (action === 'Assign') {
      setData(d => d.map(t => t.id === ticket.id ? { ...t, assignedStaff: 'Sara Kim', updatedDate: '2026-08-13' } : t));
      showToast(`Ticket ${ticket.id} assigned to Sara Kim.`, 'success');
    }
    setConfirmAction(null);
  };

  const sendReply = () => {
    if (!replyText.trim()) return;
    showToast(`Reply sent for ${selected?.id}.`, 'success');
    setReplyText('');
    setSelected(null);
  };

  return (
    <div className="animate-fade-in space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Support Tickets</h1>
          <p className="text-sm text-slate-500 mt-0.5">{filtered.length} tickets found</p>
        </div>
        <Button variant="primary" size="sm" onClick={() => showToast('New ticket creation requires patient lookup.', 'info')}>
          + New Ticket
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-3">
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex-1 min-w-48">
            <Input placeholder="Search tickets, patients, IDs…" value={search} onChange={v => { setSearch(v); setPage(1); }} />
          </div>
          <Select value={filterStatus} onChange={v => { setFilterStatus(v); setPage(1); }}
            options={[{ label: 'All Statuses', value: 'All' }, ...statuses.map(s => ({ label: s, value: s }))]} />
          <Select value={filterPriority} onChange={v => { setFilterPriority(v); setPage(1); }}
            options={[{ label: 'All Priorities', value: 'All' }, ...priorities.map(p => ({ label: p, value: p }))]} />
          <Select value={filterCategory} onChange={v => { setFilterCategory(v); setPage(1); }}
            options={[{ label: 'All Categories', value: 'All' }, ...categories.map(c => ({ label: c, value: c }))]} />
          {(filterStatus !== 'All' || filterPriority !== 'All' || filterCategory !== 'All' || search) && (
            <Button variant="ghost" size="sm" onClick={() => { setSearch(''); setFilterStatus('All'); setFilterPriority('All'); setFilterCategory('All'); setPage(1); }}>
              Clear filters
            </Button>
          )}
        </div>
      </Card>

      {/* Table */}
      <Card>
        <div className="responsive-table">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                {['Ticket ID', 'Patient', 'Subject', 'Category', 'Priority', 'Status', 'Assigned Staff', 'Updated', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginated.length === 0 ? (
                <tr><td colSpan={9} className="text-center py-16 text-sm text-slate-400">No tickets match your filters.</td></tr>
              ) : paginated.map(t => (
                <tr key={t.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-4 py-3 font-mono text-xs text-slate-500 whitespace-nowrap">{t.id}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Avatar name={t.patient} size="sm" />
                      <span className="text-sm font-medium text-slate-800">{t.patient}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 max-w-[220px]">
                    <p className="text-sm text-slate-700 truncate">{t.subject}</p>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{t.category}</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap"><PriorityBadge priority={t.priority} /></td>
                  <td className="px-4 py-3 whitespace-nowrap"><StatusBadge status={t.status} /></td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Avatar name={t.assignedStaff} size="sm" />
                      <span className="text-xs text-slate-600">{t.assignedStaff}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap">{t.updatedDate}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" onClick={() => handleAction(t, 'View')}>View</Button>
                      <Button variant="ghost" size="sm" onClick={() => handleAction(t, 'Reply')}>Reply</Button>
                      {t.status !== 'Resolved' && t.status !== 'Closed' && (
                        <>
                          <Button variant="ghost" size="sm" onClick={() => handleAction(t, 'Assign')}>Assign</Button>
                          <Button variant="ghost" size="sm" onClick={() => handleAction(t, 'Resolve')}>Resolve</Button>
                          <Button variant="ghost" size="sm" onClick={() => handleAction(t, 'Escalate')}>Escalate</Button>
                        </>
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

      {/* View/Reply Modal */}
      <Modal open={!!selected} onClose={() => { setSelected(null); setReplyText(''); }} title={selected ? `${selected.id} — ${selected.subject}` : ''} size="lg">
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Patient</p>
                <div className="flex items-center gap-2">
                  <Avatar name={selected.patient} size="sm" />
                  <span className="font-medium text-slate-800">{selected.patient}</span>
                  <span className="font-mono text-xs text-slate-400">{selected.patientId}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Priority</p>
                  <PriorityBadge priority={selected.priority} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Status</p>
                  <StatusBadge status={selected.status} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Category</p>
                  <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{selected.category}</span>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <p className="text-xs text-slate-500 mb-1">Description</p>
              <p className="text-sm text-slate-700">{selected.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs text-slate-500">
              <div>Assigned: <span className="text-slate-700 font-medium">{selected.assignedStaff}</span></div>
              <div>Created: <span className="text-slate-700">{selected.createdDate}</span></div>
            </div>
            <div className="border-t border-slate-100 pt-4">
              <p className="text-xs font-medium text-slate-700 mb-2">Reply to patient</p>
              <textarea
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                placeholder="Type your response to the patient…"
                className="w-full h-24 px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0C7BB3]/30 focus:border-[#0C7BB3] resize-none"
              />
              <div className="flex justify-end gap-2 mt-2">
                <Button variant="outline" size="sm" onClick={() => setSelected(null)}>Cancel</Button>
                <Button variant="primary" size="sm" onClick={sendReply} disabled={!replyText.trim()}>Send Reply</Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Confirm Action */}
      <ConfirmDialog
        open={!!confirmAction}
        title={`${confirmAction?.action} Ticket`}
        message={confirmAction?.action === 'Escalate'
          ? `Escalate ${confirmAction?.ticket.id} to admin? This will notify the admin team immediately.`
          : `Are you sure you want to ${confirmAction?.action?.toLowerCase()} ticket ${confirmAction?.ticket.id}?`}
        confirmLabel={confirmAction?.action || 'Confirm'}
        variant={confirmAction?.action === 'Escalate' ? 'danger' : 'primary'}
        onConfirm={doAction}
        onCancel={() => setConfirmAction(null)}
      />
    </div>
  );
}
