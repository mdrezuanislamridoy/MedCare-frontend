import { type ReactNode, useState, useEffect } from 'react';

// ── Badge ─────────────────────────────────────────────────────────────────────
const statusColors: Record<string, string> = {
  'Open': 'bg-blue-50 text-blue-700 border-blue-200',
  'In Progress': 'bg-violet-50 text-violet-700 border-violet-200',
  'Waiting for User': 'bg-amber-50 text-amber-700 border-amber-200',
  'Resolved': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Closed': 'bg-slate-100 text-slate-500 border-slate-200',
  'New': 'bg-blue-50 text-blue-700 border-blue-200',
  'Under Investigation': 'bg-violet-50 text-violet-700 border-violet-200',
  'Responded': 'bg-sky-50 text-sky-700 border-sky-200',
  'Escalated': 'bg-red-50 text-red-700 border-red-200',
  'Scheduled': 'bg-blue-50 text-blue-700 border-blue-200',
  'Confirmed': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Pending Reschedule': 'bg-amber-50 text-amber-700 border-amber-200',
  'Cancelled': 'bg-red-50 text-red-700 border-red-200',
  'Completed': 'bg-slate-100 text-slate-500 border-slate-200',
  'No Show': 'bg-rose-50 text-rose-700 border-rose-200',
  'Active': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Inactive': 'bg-slate-100 text-slate-500 border-slate-200',
  'Suspended': 'bg-red-50 text-red-700 border-red-200',
  'Pending Reply': 'bg-amber-50 text-amber-700 border-amber-200',
};

const priorityColors: Record<string, string> = {
  'Low': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Medium': 'bg-amber-50 text-amber-700 border-amber-200',
  'High': 'bg-orange-50 text-orange-700 border-orange-200',
  'Urgent': 'bg-red-50 text-red-700 border-red-200',
};

const priorityDots: Record<string, string> = {
  'Low': 'bg-emerald-500',
  'Medium': 'bg-amber-500',
  'High': 'bg-orange-500',
  'Urgent': 'bg-red-500',
};

export function StatusBadge({ status }: { status: string }) {
  const cls = statusColors[status] || 'bg-gray-100 text-gray-600 border-gray-200';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${cls}`}>
      {status}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: string }) {
  const cls = priorityColors[priority] || 'bg-gray-100 text-gray-600 border-gray-200';
  const dot = priorityDots[priority] || 'bg-gray-400';
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium border ${cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {priority}
    </span>
  );
}

// ── Card ──────────────────────────────────────────────────────────────────────
export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

// ── Button ────────────────────────────────────────────────────────────────────
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';

export function Button({
  children, variant = 'primary', size = 'md', onClick, disabled, className = '', type = 'button',
}: {
  children: ReactNode; variant?: ButtonVariant; size?: 'sm' | 'md'; onClick?: () => void;
  disabled?: boolean; className?: string; type?: 'button' | 'submit';
}) {
  const base = 'inline-flex items-center gap-1.5 font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1';
  const sizes = { sm: 'px-2.5 py-1 text-xs', md: 'px-3.5 py-1.5 text-sm' };
  const variants: Record<ButtonVariant, string> = {
    primary: 'bg-[#0C7BB3] text-white hover:bg-[#0a6a9a] focus:ring-[#0C7BB3]',
    secondary: 'bg-sky-50 text-[#0C7BB3] hover:bg-sky-100 border border-sky-200 focus:ring-sky-300',
    ghost: 'text-slate-600 hover:bg-slate-100 focus:ring-slate-300',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-400',
    outline: 'border border-slate-200 text-slate-700 hover:bg-slate-50 focus:ring-slate-300',
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${sizes[size]} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
}

// ── Input ─────────────────────────────────────────────────────────────────────
export function Input({ placeholder, value, onChange, className = '', type = 'text' }: {
  placeholder?: string; value: string; onChange: (v: string) => void;
  className?: string; type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0C7BB3]/30 focus:border-[#0C7BB3] transition-colors ${className}`}
    />
  );
}

// ── Select ────────────────────────────────────────────────────────────────────
export function Select({ value, onChange, options, className = '' }: {
  value: string; onChange: (v: string) => void;
  options: { label: string; value: string }[]; className?: string;
}) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className={`px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0C7BB3]/30 focus:border-[#0C7BB3] transition-colors ${className}`}
    >
      {options.map(o => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

// ── Toast ─────────────────────────────────────────────────────────────────────
export interface ToastMsg { id: string; message: string; type: 'success' | 'error' | 'info' | 'warning' }

export function ToastContainer({ toasts, onDismiss }: { toasts: ToastMsg[]; onDismiss: (id: string) => void }) {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`animate-toast flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium border max-w-sm ${
            t.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
            t.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
            t.type === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-800' :
            'bg-sky-50 border-sky-200 text-sky-800'
          }`}
        >
          <span>{t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : t.type === 'warning' ? '⚠' : 'ℹ'}</span>
          <span className="flex-1">{t.message}</span>
          <button onClick={() => onDismiss(t.id)} className="ml-2 opacity-60 hover:opacity-100 text-lg leading-none">×</button>
        </div>
      ))}
    </div>
  );
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastMsg[]>([]);
  const show = (message: string, type: ToastMsg['type'] = 'success') => {
    const id = Math.random().toString(36).slice(2);
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  };
  const dismiss = (id: string) => setToasts(t => t.filter(x => x.id !== id));
  return { toasts, show, dismiss };
}

// ── Confirm Dialog ─────────────────────────────────────────────────────────────
export function ConfirmDialog({
  open, title, message, confirmLabel = 'Confirm', variant = 'primary', onConfirm, onCancel,
}: {
  open: boolean; title: string; message: string;
  confirmLabel?: string; variant?: ButtonVariant;
  onConfirm: () => void; onCancel: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onCancel}>
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md animate-fade-in" onClick={e => e.stopPropagation()}>
        <h3 className="text-base font-semibold text-slate-900 mb-2">{title}</h3>
        <p className="text-sm text-slate-600 mb-5">{message}</p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button variant={variant} onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </div>
    </div>
  );
}

// ── Empty State ────────────────────────────────────────────────────────────────
export function EmptyState({ icon, title, description }: { icon?: string; title: string; description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon && <div className="text-4xl mb-3 opacity-40">{icon}</div>}
      <p className="text-sm font-medium text-slate-500">{title}</p>
      {description && <p className="text-xs text-slate-400 mt-1 max-w-xs">{description}</p>}
    </div>
  );
}

// ── Pagination ─────────────────────────────────────────────────────────────────
export function Pagination({ page, total, perPage, onChange }: {
  page: number; total: number; perPage: number; onChange: (p: number) => void;
}) {
  const pages = Math.ceil(total / perPage);
  if (pages <= 1) return null;
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
      <span className="text-xs text-slate-500">
        Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, total)} of {total}
      </span>
      <div className="flex gap-1">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ←
        </button>
        {Array.from({ length: Math.min(pages, 5) }, (_, i) => i + 1).map(p => (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`px-2.5 py-1 text-xs rounded-lg border transition-colors ${
              p === page ? 'bg-[#0C7BB3] text-white border-[#0C7BB3]' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => onChange(page + 1)}
          disabled={page === pages}
          className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          →
        </button>
      </div>
    </div>
  );
}

// ── Avatar ─────────────────────────────────────────────────────────────────────
const avatarColors = [
  'bg-blue-100 text-blue-700', 'bg-violet-100 text-violet-700',
  'bg-emerald-100 text-emerald-700', 'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700', 'bg-cyan-100 text-cyan-700',
];

export function Avatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' | 'lg' }) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const color = avatarColors[name.charCodeAt(0) % avatarColors.length];
  const sz = { sm: 'w-6 h-6 text-xs', md: 'w-8 h-8 text-sm', lg: 'w-10 h-10 text-base' }[size];
  return (
    <div className={`${sz} ${color} rounded-full flex items-center justify-center font-semibold flex-shrink-0`}>
      {initials}
    </div>
  );
}

// ── Modal ──────────────────────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children, size = 'md' }: {
  open: boolean; onClose: () => void; title: string;
  children: ReactNode; size?: 'sm' | 'md' | 'lg';
}) {
  useEffect(() => {
    const handle = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (open) document.addEventListener('keydown', handle);
    return () => document.removeEventListener('keydown', handle);
  }, [open, onClose]);

  if (!open) return null;
  const widths = { sm: 'max-w-md', md: 'max-w-xl', lg: 'max-w-2xl' };
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className={`bg-white rounded-2xl shadow-2xl w-full ${widths[size]} animate-fade-in max-h-[90vh] overflow-y-auto`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-900">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl leading-none w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors">×</button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
