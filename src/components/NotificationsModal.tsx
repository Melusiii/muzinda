import { motion, AnimatePresence } from 'framer-motion'
import { X, Bell, Check, AlertTriangle, Info, ChevronLeft } from 'lucide-react'
import { useNotifications } from '../hooks/useSupabase'
import type { Notification } from '../hooks/useSupabase'
import { cn } from '../utils/cn'
import { formatDistanceToNow } from 'date-fns'
import { createPortal } from 'react-dom'

interface NotificationsModalProps {
  isOpen: boolean
  onClose: () => void
}

export const NotificationsModal = ({ isOpen, onClose }: NotificationsModalProps) => {
  const { notifications, loading, markAsRead, markAllAsRead, unreadCount } = useNotifications()

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
      case 'approved':
        return <Check size={18} className="text-primary" />
      case 'warning':
      case 'rejected':
        return <AlertTriangle size={18} className="text-red-500" />
      case 'info':
        return <Info size={18} className="text-blue-500" />
      default:
        return <Bell size={18} className="text-primary" />
    }
  }

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center md:justify-end overflow-hidden">
          {/* Responsive Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-primary-dark/60 backdrop-blur-xl cursor-pointer"
          />

          {/* Responsive Drawer Content */}
          <motion.div
            initial={{ y: '100%', x: 0 }}
            animate={{ y: 0, x: 0 }}
            exit={{ y: '100%', x: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 200 }}
            className={cn(
              "relative bg-white shadow-2xl flex flex-col overflow-hidden",
              "h-[90vh] mt-auto w-full rounded-t-[2rem]",
              "md:h-screen md:mt-0 md:max-w-md md:rounded-none"
            )}
          >
            {/* Mobile Handle */}
            <div className="md:hidden flex justify-center py-4 shrink-0">
               <div className="w-10 h-1 bg-primary-dark/5 rounded-full" />
            </div>

            {/* Header */}
            <div className="px-6 pb-6 md:p-8 border-b border-primary/5 shrink-0 bg-white">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                   <button 
                    onClick={onClose}
                    className="md:hidden p-2 -ml-2 text-primary hover:bg-primary/5 rounded-xl flex items-center gap-1 transition-all"
                   >
                     <ChevronLeft size={20} />
                     <span className="text-xs font-extrabold font-manrope uppercase tracking-tight text-primary-dark">Back</span>
                   </button>
                   <div className="hidden md:flex w-10 h-10 bg-primary/5 rounded-xl items-center justify-center text-primary relative shadow-inner">
                      <Bell size={20} />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 min-w-[1.2rem] h-[1.2rem] px-1 bg-primary text-white text-[9px] font-extrabold rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                          {unreadCount}
                        </span>
                      )}
                   </div>
                   <div>
                      <h2 className="text-lg md:text-xl font-manrope font-extrabold text-primary-dark tracking-tight">Activity <span className="text-primary italic">Feed</span></h2>
                      <p className="hidden md:block text-[9px] font-extrabold text-primary-dark/30 uppercase tracking-[0.2em]">Institutional Hub</p>
                   </div>
                </div>
                <button
                  onClick={onClose}
                  className="hidden md:flex p-2 hover:bg-primary/5 rounded-xl transition-all"
                >
                  <X size={18} className="text-primary-dark/40" />
                </button>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={markAllAsRead}
                  disabled={!unreadCount || unreadCount === 0}
                  className="flex-1 py-2.5 bg-primary/5 hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed text-primary rounded-lg text-[9px] font-extrabold uppercase tracking-widest transition-all flex items-center justify-center gap-2 border border-primary/10"
                >
                   Mark all as read
                </button>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-surface-bright">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-64 space-y-4 animate-pulse">
                   <motion.div 
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary/10"
                   >
                     <Bell size={24} />
                   </motion.div>
                   <p className="text-[10px] font-extrabold text-primary/10 uppercase tracking-[0.3em]">Syncing Feed</p>
                </div>
              ) : (notifications && (notifications as any[]).length > 0) ? (
                (notifications as any[]).map((n: Notification) => {
                  if (!n) return null;
                  let dateObj;
                  try {
                    dateObj = n.created_at ? new Date(n.created_at) : new Date();
                    if (isNaN(dateObj.getTime())) dateObj = new Date();
                  } catch {
                    dateObj = new Date();
                  }

                  return (
                    <motion.div
                      key={n?.id || Math.random()}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      onClick={() => !n.read && markAsRead(n.id)}
                      className={cn(
                        "p-5 rounded-2xl border transition-all cursor-pointer group relative overflow-hidden",
                        n.read 
                          ? "bg-white/60 border-primary/5 opacity-80" 
                          : "bg-white border-primary/10 shadow-sm border-l-4 border-l-primary"
                      )}
                    >
                      {!n.read && (
                        <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-primary rounded-full m-4 shadow-lg animate-pulse" />
                      )}
                      <div className="flex gap-4 relative z-10">
                        <div className={cn(
                          "w-9 h-9 rounded-lg flex items-center justify-center shrink-0 shadow-inner",
                          n.read ? "bg-gray-50" : "bg-primary/5"
                        )}>
                          {getIcon(n.type || 'info')}
                        </div>
                        <div className="space-y-1 pr-6 flex-1">
                          <h4 className={cn(
                             "font-manrope font-extrabold text-sm tracking-tight leading-tight",
                             n.read ? "text-primary-dark/60" : "text-primary-dark"
                          )}>{n.title || 'Notification'}</h4>
                          <p className="text-xs text-primary-dark/40 font-medium leading-relaxed">{n.message || 'No message content'}</p>
                          <p className="text-[9px] text-primary/40 font-extrabold uppercase tracking-widest pt-2">
                             {formatDistanceToNow(dateObj, { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )
                })
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                   <div className="w-20 h-20 bg-primary/5 rounded-[2rem] flex items-center justify-center text-primary/10">
                      <Bell size={32} />
                   </div>
                   <div className="space-y-1">
                      <h3 className="text-lg font-manrope font-extrabold text-primary-dark">No updates yet</h3>
                      <p className="text-[10px] text-primary-dark/30 font-bold max-w-[180px] mx-auto uppercase tracking-wider">Your activity feed is clear</p>
                   </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 md:p-8 border-t border-primary/5 bg-white shrink-0">
               <div className="bg-primary-dark p-5 rounded-2xl text-white space-y-2 relative overflow-hidden shadow-2xl shadow-primary-dark/20">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full -mr-12 -mt-12 blur-2xl" />
                  <h5 className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-primary italic">Pro Tip</h5>
                  <p className="text-[11px] font-bold text-white/50 leading-relaxed">Notifications are real-time. Keep an eye out for updates!</p>
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )

  return createPortal(modalContent, document.body)
}

export default NotificationsModal
