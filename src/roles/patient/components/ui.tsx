import type { ReactNode } from 'react';

// ── Badge ─────────────────────────────────────────────────────────────────────

const badgeVariants: Record<string, string> = {
  pending:         'bg-amber-50 text-amber-700 border border-amber-200',
  payment_pending: 'bg-orange-50 text-orange-700 border border-orange-200',
  confirmed:       'bg-teal-50 text-teal-700 border border-teal-200',
  checked_in:      'bg-violet-50 text-violet-700 border border-violet-200',
  in_progress:     'bg-indigo-50 text-indigo-700 border border-indigo-200',
  completed:       'bg-emerald-50 text-emerald-700 border border-emerald-200',
  cancelled:       'bg-red-50 text-red-600 border border-red-200',
  no_show:         'bg-gray-100 text-gray-500 border border-gray-200',
  paid:            'bg-emerald-50 text-emerald-700 border border-emerald-200',
  refunded:        'bg-purple-50 text-purple-700 border border-purple-200',
  failed:          'bg-red-50 text-red-600 border border-red-200',
  online:          'bg-teal-50 text-teal-700 border border-teal-200',
  clinic:          'bg-teal-50 text-teal-700 border border-teal-200',
  default:         'bg-gray-100 text-gray-600 border border-gray-200',
};

const badgeLabels: Record<string, string> = {
  pending: 'Pending',
  payment_pending: 'Payment Pending',
  confirmed: 'Confirmed',
  checked_in: 'Checked In',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
  no_show: 'No Show',
  paid: 'Paid',
  refunded: 'Refunded',
  failed: 'Failed',
  online: 'Online',
  clinic: 'Clinic',
};

export function Badge({ variant, label, className = '' }: { variant: string; label?: string; className?: string }) {
  const cls = badgeVariants[variant] ?? badgeVariants.default;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cls} ${className}`}>
      {label ?? badgeLabels[variant] ?? variant}
    </span>
  );
}

// ── Card ──────────────────────────────────────────────────────────────────────

export function Card({ children, className = '', onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  return (
    <div
      className={`bg-white rounded-xl border border-slate-200 shadow-sm ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

// ── Avatar ────────────────────────────────────────────────────────────────────

export function Avatar({ src, name, size = 'md', className = '' }: { src?: string; name: string; size?: 'sm' | 'md' | 'lg' | 'xl'; className?: string }) {
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-14 h-14 text-base', xl: 'w-20 h-20 text-xl' };
  const initials = name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();
  return src ? (
    <img src={src} alt={name} className={`${sizes[size]} rounded-full object-cover bg-teal-100 flex-shrink-0 ${className}`} />
  ) : (
    <div className={`${sizes[size]} rounded-full bg-teal-100 text-teal-700 font-semibold flex items-center justify-center flex-shrink-0 ${className}`}>
      {initials}
    </div>
  );
}

// ── StatCard ──────────────────────────────────────────────────────────────────

export function StatCard({ label, value, icon, color = 'sky', sub }: { label: string; value: string | number; icon: ReactNode; color?: string; sub?: string }) {
  const colors: Record<string, string> = {
    sky:     'bg-teal-50 text-teal-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber:   'bg-amber-50 text-amber-600',
    violet:  'bg-violet-50 text-violet-600',
    rose:    'bg-rose-50 text-rose-600',
  };
  return (
    <Card className="p-5 flex items-center gap-4">
      <div className={`${colors[color] ?? colors.sky} p-3 rounded-xl flex-shrink-0`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-semibold text-slate-800" style={{ fontFamily: 'DM Sans, sans-serif' }}>{value}</p>
        <p className="text-sm text-slate-500 mt-0.5">{label}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </Card>
  );
}

// ── SectionHeader ─────────────────────────────────────────────────────────────

export function SectionHeader({ title, action, actionLabel }: { title: string; action?: () => void; actionLabel?: string }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-base font-semibold text-slate-800" style={{ fontFamily: 'DM Sans, sans-serif' }}>{title}</h2>
      {action && (
        <button onClick={action} className="text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors">
          {actionLabel ?? 'View all'}
        </button>
      )}
    </div>
  );
}

// ── Button ────────────────────────────────────────────────────────────────────

export function Button({
  children, onClick, variant = 'primary', size = 'md', className = '', disabled = false, type = 'button',
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit';
}) {
  const variants = {
    primary:   'bg-teal-600 text-white hover:bg-teal-700 shadow-sm',
    secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
    ghost:     'text-slate-600 hover:bg-slate-100',
    danger:    'bg-red-500 text-white hover:bg-red-600',
    outline:   'border border-teal-600 text-teal-600 hover:bg-teal-50',
  };
  const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2 text-sm', lg: 'px-5 py-2.5 text-sm' };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
}

// ── Input ─────────────────────────────────────────────────────────────────────

export function Input({ label, id, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label htmlFor={id} className="text-sm font-medium text-slate-700">{label}</label>}
      <input
        id={id}
        className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition text-slate-800 placeholder:text-slate-400"
        {...props}
      />
    </div>
  );
}

// ── Select ────────────────────────────────────────────────────────────────────

export function Select({ label, id, options, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string; options: { value: string; label: string }[] }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label htmlFor={id} className="text-sm font-medium text-slate-700">{label}</label>}
      <select
        id={id}
        className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition text-slate-700 appearance-none"
        {...props}
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

// ── Stars ─────────────────────────────────────────────────────────────────────

export function Stars({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
  const px = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4.5 h-4.5';
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} className={`${px} ${i <= Math.round(rating) ? 'text-amber-400' : 'text-slate-200'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  );
}

// ── Empty State ───────────────────────────────────────────────────────────────

export function EmptyState({ icon, title, description, action, actionLabel }: {
  icon: ReactNode; title: string; description?: string; action?: () => void; actionLabel?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-slate-700 mb-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>{title}</h3>
      {description && <p className="text-sm text-slate-500 max-w-xs">{description}</p>}
      {action && (
        <Button onClick={action} className="mt-4">{actionLabel ?? 'Get started'}</Button>
      )}
    </div>
  );
}

// ── Toast ─────────────────────────────────────────────────────────────────────

export function Toast({ message, type = 'success', onClose }: { message: string; type?: 'success' | 'error' | 'info'; onClose: () => void }) {
  const styles = {
    success: 'bg-emerald-600',
    error:   'bg-red-600',
    info:    'bg-teal-600',
  };
  return (
    <div className={`animate-toast fixed bottom-6 right-6 z-50 ${styles[type]} text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 text-sm font-medium`}>
      {message}
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────────

export function Modal({ children, onClose, title, size = 'md' }: { children: ReactNode; onClose: () => void; title?: string; size?: 'sm' | 'md' | 'lg' | 'xl' }) {
  const widths = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />
      <div
        className={`relative bg-white rounded-2xl shadow-xl ${widths[size]} w-full max-h-[90vh] overflow-y-auto animate-fade-in`}
        onClick={e => e.stopPropagation()}
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800" style={{ fontFamily: 'DM Sans, sans-serif' }}>{title}</h3>
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
