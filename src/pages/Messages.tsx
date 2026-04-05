import { useState, useEffect, useRef } from 'react'
import { Sidebar } from '../components/Sidebar'
import { MessageSquare, Search, Send, Loader2 } from 'lucide-react'
import { cn } from '../utils/cn'
import { useConversations, useMessages, sendMessage } from '../hooks/useSupabase'
import { useAuth } from '../context/AuthContext'

export const Messages = () => {
  const { user } = useAuth()
  const { conversations, loading: loadingConv } = useConversations()
  const [selectedContact, setSelectedContact] = useState<any>(null)
  const { messages, loading: loadingMsg, setMessages } = useMessages(selectedContact?.id)
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !selectedContact || sending) return

    setSending(true)
    try {
      const newMsg = await sendMessage(selectedContact.id, input)
      setMessages((prev: any) => [...prev, newMsg])
      setInput('')
    } catch (err: any) {
      console.error(err)
      alert("Failed to send message")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex bg-[#F8F9F8] min-h-screen font-dm-sans">
      <Sidebar />
      
      <main className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden">
        <header className="p-8 border-b border-primary/5 bg-white flex justify-between items-center shrink-0">
           <div>
             <h1 className="text-3xl font-black tracking-tighter text-primary-dark font-manrope">Conversations</h1>
             <p className="text-[10px] text-primary-dark/40 font-bold uppercase tracking-widest">Connect with our verified community</p>
           </div>
           
           <div className="relative hidden md:block">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-dark/20" size={18} />
             <input 
               type="text" 
               placeholder="Search..."
               className="pl-12 pr-6 py-3 bg-[#F8F9F8] rounded-2xl border border-primary/5 outline-none text-sm font-dm-sans focus:border-primary/20 transition-all w-64"
             />
           </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* List */}
          <aside className="w-full md:w-96 border-r border-primary/5 bg-white flex flex-col">
            <div className="p-6 space-y-4 overflow-y-auto">
               {loadingConv ? (
                 <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary" /></div>
               ) : conversations.length === 0 ? (
                 <div className="text-center p-8">
                    <p className="text-sm text-primary-dark/40">No conversations yet.</p>
                 </div>
               ) : (
                 conversations.map((chat) => (
                   <button 
                     key={chat.id} 
                     onClick={() => setSelectedContact(chat)}
                     className={cn(
                       "w-full p-4 rounded-[2.5rem] flex items-center gap-4 transition-all text-left",
                       selectedContact?.id === chat.id ? "bg-primary border border-primary/10 shadow-xl shadow-primary/20" : "hover:bg-[#F8F9F8]"
                     )}
                   >
                     <div className={cn(
                       "w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shadow-sm border",
                       selectedContact?.id === chat.id ? "bg-white text-primary border-white/20" : "bg-primary/5 text-primary border-primary/5"
                     )}>
                       {chat.avatar_url ? <img src={chat.avatar_url} className="w-full h-full object-cover rounded-2xl" /> : chat.name[0]}
                     </div>
                     <div className="flex-1 min-w-0">
                       <div className="flex justify-between items-start">
                          <h4 className={cn("text-sm font-black truncate", selectedContact?.id === chat.id ? "text-white" : "text-primary-dark")}>
                            {chat.name}
                          </h4>
                          <span className={cn("text-[10px]", selectedContact?.id === chat.id ? "text-white/60" : "text-primary-dark/30")}>
                            {chat.time}
                          </span>
                       </div>
                       <p className={cn("text-xs truncate font-bold", selectedContact?.id === chat.id ? "text-white/80" : "text-primary-dark/40")}>
                         {chat.lastMessage}
                       </p>
                     </div>
                   </button>
                 ))
               )}
            </div>
          </aside>

          {/* Window */}
          <section className="flex-1 flex flex-col bg-white overflow-hidden">
             {selectedContact ? (
               <>
                 {/* Chat Header */}
                 <div className="p-6 border-b border-primary/5 flex items-center justify-between bg-white shrink-0">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary font-bold shadow-sm">
                         {selectedContact.name[0]}
                       </div>
                       <div>
                          <h3 className="font-manrope font-black text-primary-dark tracking-tight">{selectedContact.name}</h3>
                          <p className="text-[10px] text-[#4F7C2C] font-black uppercase tracking-widest">Online</p>
                       </div>
                    </div>
                 </div>

                 {/* Messages Scroll Area */}
                 <div 
                   ref={scrollRef}
                   className="flex-1 overflow-y-auto p-8 space-y-6 bg-[#F8F9F8]/50"
                 >
                    {loadingMsg ? (
                      <div className="flex justify-center"><Loader2 className="animate-spin text-primary" /></div>
                    ) : (
                      messages.map((msg: any) => (
                        <div key={msg.id} className={cn(
                          "flex flex-col max-w-[70%]",
                          msg.sender_id === user?.id ? "ml-auto items-end" : "mr-auto items-start"
                        )}>
                           <div className={cn(
                             "p-4 rounded-[1.5rem] shadow-sm",
                             msg.sender_id === user?.id 
                               ? "bg-primary-dark text-white rounded-tr-none" 
                               : "bg-white text-primary-dark rounded-tl-none border border-primary/5"
                           )}>
                              <p className="text-sm font-dm-sans leading-relaxed">{msg.content}</p>
                           </div>
                           <span className="text-[9px] font-bold text-primary-dark/20 uppercase tracking-widest mt-2 px-2">
                             {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                           </span>
                        </div>
                      ))
                    )}
                 </div>

                 {/* Input */}
                 <div className="p-8 bg-white border-t border-primary/5 shrink-0">
                    <form onSubmit={handleSend} className="max-w-4xl mx-auto flex items-center gap-4">
                       <div className="flex-1 relative">
                          <input 
                            type="text" 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your message..."
                            className="w-full pl-6 pr-14 py-5 rounded-[1.5rem] bg-[#F8F9F8] border border-primary/5 outline-none font-dm-sans text-sm focus:bg-white focus:border-primary/20 transition-all"
                          />
                          <button 
                            type="submit"
                            disabled={!input.trim() || sending}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-primary text-white rounded-2xl hover:bg-primary-dark active:scale-95 transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
                          >
                            {sending ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                          </button>
                       </div>
                    </form>
                 </div>
               </>
             ) : (
               <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-[#F8F9F8]/50">
                  <div className="w-24 h-24 rounded-[3.5rem] bg-white shadow-2xl flex items-center justify-center text-primary/10 mb-8 border border-primary/5">
                     <MessageSquare size={48} />
                  </div>
                  <h3 className="text-3xl font-manrope font-black text-primary-dark tracking-tighter">Select a Conversation</h3>
                  <p className="max-w-xs text-sm font-dm-sans text-primary-dark/40 mt-4 leading-relaxed">
                    Pick a contact from the list on the left to start chatting with verified landlords and providers.
                  </p>
               </div>
             )}
          </section>
        </div>
      </main>
    </div>
  )
}

export default Messages
