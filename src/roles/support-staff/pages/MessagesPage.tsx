import { useState } from 'react';
import { messages as initialMessages, type Message } from '../data/mockData';
import { StatusBadge, PriorityBadge, Avatar, Button, ConfirmDialog } from '../components/ui';

export default function MessagesPage({ showToast }: { showToast: (msg: string, type?: 'success' | 'error' | 'info' | 'warning') => void }) {
  const [data, setData] = useState<Message[]>(initialMessages);
  const [active, setActive] = useState<Message>(initialMessages[0]);
  const [replyText, setReplyText] = useState('');
  const [confirm, setConfirm] = useState<{ msg: Message; action: string } | null>(null);

  const activeConv = data.find(m => m.id === active.id) || active;

  const sendReply = () => {
    if (!replyText.trim()) return;
    const newMsg = { sender: 'staff' as const, text: replyText, time: 'Just now' };
    setData(d => d.map(m => m.id === activeConv.id
      ? { ...m, messages: [...m.messages, newMsg], lastMessage: replyText, lastMessageTime: 'Just now', status: 'Pending Reply' as const }
      : m
    ));
    showToast('Message sent.', 'success');
    setReplyText('');
  };

  const doAction = () => {
    if (!confirm) return;
    const { msg, action } = confirm;
    if (action === 'Resolve') {
      setData(d => d.map(m => m.id === msg.id ? { ...m, status: 'Resolved' } : m));
      showToast(`Conversation with ${msg.patient} marked resolved.`, 'success');
    } else if (action === 'Escalate') {
      showToast(`Conversation escalated to senior support.`, 'warning');
    } else if (action === 'Assign') {
      setData(d => d.map(m => m.id === msg.id ? { ...m, assignedStaff: 'Sara Kim' } : m));
      showToast(`Conversation assigned to Sara Kim.`, 'success');
    }
    setConfirm(null);
  };

  const unreadTotal = data.reduce((s, m) => s + m.unreadCount, 0);

  return (
    <div className="animate-fade-in">
      <div className="mb-4">
        <h1 className="text-xl font-semibold text-slate-900">Messages</h1>
        <p className="text-sm text-slate-500 mt-0.5">Patient support conversations · {unreadTotal} unread</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex" style={{ height: 'calc(100vh - 180px)', minHeight: 500 }}>
        {/* Conversation list */}
        <div className="w-80 flex-shrink-0 border-r border-slate-100 flex flex-col">
          <div className="p-3 border-b border-slate-100">
            <div className="relative">
              <input
                type="text"
                placeholder="Search conversations…"
                className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0C7BB3]/30 focus:border-[#0C7BB3]"
              />
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">🔍</span>
            </div>
          </div>
          <div className="overflow-y-auto flex-1">
            {data.map(m => (
              <button
                key={m.id}
                onClick={() => setActive(m)}
                className={`w-full text-left px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors ${active.id === m.id ? 'bg-sky-50 border-l-2 border-l-[#0C7BB3]' : ''}`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="relative flex-shrink-0 mt-0.5">
                    <Avatar name={m.patient} size="sm" />
                    {m.unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{m.unreadCount}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className={`text-xs font-semibold truncate ${m.unreadCount > 0 ? 'text-slate-900' : 'text-slate-600'}`}>{m.patient}</span>
                      <span className="text-[10px] text-slate-400 flex-shrink-0 ml-1">{m.lastMessageTime}</span>
                    </div>
                    <p className={`text-[11px] truncate ${m.unreadCount > 0 ? 'text-slate-700 font-medium' : 'text-slate-400'}`}>{m.lastMessage}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <PriorityBadge priority={m.priority} />
                      <StatusBadge status={m.status} />
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Conversation view */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Convo header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-3">
              <Avatar name={activeConv.patient} size="md" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-900">{activeConv.patient}</span>
                  <span className="font-mono text-xs text-slate-400">{activeConv.patientId}</span>
                  <StatusBadge status={activeConv.status} />
                </div>
                <div className="text-xs text-slate-500">Assigned: {activeConv.assignedStaff} · <PriorityBadge priority={activeConv.priority} /></div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setConfirm({ msg: activeConv, action: 'Assign' })}>Assign</Button>
              {activeConv.status !== 'Resolved' && (
                <Button variant="secondary" size="sm" onClick={() => setConfirm({ msg: activeConv, action: 'Resolve' })}>Mark Resolved</Button>
              )}
              <Button variant="ghost" size="sm" onClick={() => setConfirm({ msg: activeConv, action: 'Escalate' })}>Escalate</Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {activeConv.messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === 'staff' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] flex items-end gap-2 ${msg.sender === 'staff' ? 'flex-row-reverse' : ''}`}>
                  <Avatar name={msg.sender === 'staff' ? activeConv.assignedStaff : activeConv.patient} size="sm" />
                  <div className={`rounded-2xl px-4 py-2.5 text-sm ${
                    msg.sender === 'staff'
                      ? 'bg-[#0C7BB3] text-white rounded-br-md'
                      : 'bg-slate-100 text-slate-800 rounded-bl-md'
                  }`}>
                    <p className="leading-relaxed">{msg.text}</p>
                    <p className={`text-[10px] mt-1 ${msg.sender === 'staff' ? 'text-sky-200' : 'text-slate-400'}`}>{msg.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Reply box */}
          <div className="border-t border-slate-100 p-4">
            <div className="flex gap-3 items-end">
              <textarea
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                placeholder="Type a reply to the patient…"
                rows={2}
                className="flex-1 px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0C7BB3]/30 focus:border-[#0C7BB3] resize-none"
                onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) sendReply(); }}
              />
              <Button variant="primary" size="md" onClick={sendReply} disabled={!replyText.trim()}>
                Send
              </Button>
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5 ml-1">Press ⌘Enter to send</p>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={!!confirm}
        title={`${confirm?.action} Conversation`}
        message={confirm?.action === 'Resolve'
          ? `Mark this conversation with ${confirm?.msg.patient} as resolved?`
          : confirm?.action === 'Escalate'
          ? `Escalate this conversation to senior support? They will take ownership.`
          : `Assign this conversation to Sara Kim?`}
        confirmLabel={confirm?.action || 'Confirm'}
        variant={confirm?.action === 'Escalate' ? 'danger' : 'primary'}
        onConfirm={doAction}
        onCancel={() => setConfirm(null)}
      />
    </div>
  );
}
