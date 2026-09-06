import { useState, useEffect } from 'react';
import type { Patient } from '../data/mockData';
import { Card, StatusBadge, Avatar, Button, Input, Modal, EmptyState } from '../components/ui';
import { supportStaffApi } from '../services/support-staff.api';

export default function PatientsPage({ showToast }: { showToast: (msg: string, type?: 'success' | 'error' | 'info' | 'warning') => void }) {
  const [patientList, setPatientList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<any | null>(null);

  useEffect(() => {
    async function loadPatients() {
      try {
        const res: any = await supportStaffApi.getPatients();
        const items = Array.isArray(res) ? res : (res?.data || res?.items || []);
        setPatientList(items);
      } catch (err) {
        console.warn('Could not load patients:', err);
        setPatientList([]);
      } finally {
        setLoading(false);
      }
    }
    loadPatients();
  }, []);

  const filtered = patientList.filter(p => {
    const q = search.toLowerCase();
    const name = p.name || p.user?.name || '';
    const email = p.email || p.user?.email || '';
    const phone = p.phone || p.user?.phoneNumber || '';
    const id = p.id || p._id || '';
    return !q || name.toLowerCase().includes(q) || email.toLowerCase().includes(q)
      || phone.includes(q) || id.toLowerCase().includes(q);
  });

  const handleResend = (type: string) => {
    showToast(`${type} notification resent to ${selected?.name}.`, 'success');
  };

  return (
    <div className="animate-fade-in space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Patient Support</h1>
        <p className="text-sm text-slate-500 mt-0.5">Search and assist patients with support-related requests.</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800 flex items-start gap-2">
        <span className="text-base mt-0.5">⚠</span>
        <span>Support staff can view limited account information only. Medical records, prescriptions, and payment details are not accessible from this view.</span>
      </div>

      <Card className="p-4">
        <div className="flex gap-3 items-center">
          <div className="flex-1">
            <Input
              placeholder="Search by name, email, phone, or Patient ID…"
              value={search}
              onChange={setSearch}
            />
          </div>
          <Button variant="outline" size="sm" onClick={() => setSearch('')} disabled={!search}>Clear</Button>
        </div>
      </Card>

      {search && filtered.length === 0 ? (
        <Card><EmptyState icon="🔍" title="No patients found" description="Try a different name, email, phone number, or Patient ID." /></Card>
      ) : !search ? (
        <Card>
          <EmptyState icon="👤" title="Search for a patient" description="Enter a name, email, phone number, or Patient ID to look up a patient's support information." />
        </Card>
      ) : (
        <Card>
          <div className="divide-y divide-slate-50">
            {filtered.map(p => {
              const name = p.name || p.user?.name || 'Patient';
              const email = p.email || p.user?.email || '—';
              const phone = p.phone || p.user?.phoneNumber || '—';
              const id = p.id || p._id || 'PT-';
              return (
                <div key={id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors">
                  <Avatar name={name} size="lg" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-slate-900 text-sm">{name}</span>
                      <StatusBadge status={p.accountStatus || 'Active'} />
                    </div>
                    <div className="text-xs text-slate-500 space-y-0.5">
                      <div className="flex items-center gap-3">
                        <span className="font-mono">{id}</span>
                        <span>{email}</span>
                        <span>{phone}</span>
                      </div>
                      <div>Last active: {p.lastActivity || 'Recent'} · Member since: {p.registeredDate || '2026'}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">{p.supportHistory?.length || 0} ticket(s)</span>
                    <Button variant="secondary" size="sm" onClick={() => setSelected(p)}>View Details</Button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected ? `${selected.name} — ${selected.id}` : ''} size="lg">
        {selected && (
          <div className="space-y-5">
            {/* Contact Info */}
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Contact Information</p>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Email</p>
                  <p className="text-slate-800">{selected.email}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Phone</p>
                  <p className="text-slate-800">{selected.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Account Status</p>
                  <StatusBadge status={selected.accountStatus} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Member Since</p>
                  <p className="text-slate-800">{selected.registeredDate}</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Quick Actions</p>
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" size="sm" onClick={() => handleResend('Appointment confirmation')}>Resend Appt. Confirmation</Button>
                <Button variant="secondary" size="sm" onClick={() => handleResend('Password reset')}>Resend Password Reset</Button>
                <Button variant="secondary" size="sm" onClick={() => handleResend('Account activation')}>Resend Activation Email</Button>
                <Button variant="outline" size="sm" onClick={() => showToast('Appointment rescheduling initiated.', 'info')}>Help with Rescheduling</Button>
              </div>
            </div>

            {/* Recent Appointments */}
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Recent Appointments</p>
              <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
                {(!selected.recentAppointments || selected.recentAppointments.length === 0) ? (
                  <p className="text-xs text-slate-400 p-4 italic">No recent appointments on record.</p>
                ) : (
                  selected.recentAppointments.map((a: any, i: number) => (
                    <div key={i} className="flex items-center justify-between px-4 py-3 text-sm bg-white">
                      <div>
                        <span className="font-medium text-slate-800">{a.doctor || a.doctorName || 'Doctor'}</span>
                        <span className="text-slate-400 ml-2 text-xs">{a.date}</span>
                      </div>
                      <StatusBadge status={a.status || 'Scheduled'} />
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Support History */}
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Support History</p>
              {(!selected.supportHistory || selected.supportHistory.length === 0) ? (
                <p className="text-sm text-slate-400 italic">No previous support tickets.</p>
              ) : (
                <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
                  {selected.supportHistory.map((h: any) => (
                    <div key={h.ticketId || h.id} className="flex items-center justify-between px-4 py-3 text-sm bg-white">
                      <div>
                        <span className="font-mono text-xs text-slate-400 mr-2">{h.ticketId || h.id}</span>
                        <span className="text-slate-700">{h.subject}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">{h.date}</span>
                        <StatusBadge status={h.status || 'Open'} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-500">
              🔒 Medical records, diagnoses, prescriptions, and payment details are not available to support staff.
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
