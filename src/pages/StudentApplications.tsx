import { Sidebar } from '../components/Sidebar'
import { Navbar } from '../components/Navbar'
import { AlertCircle, Clock, Loader2, CheckCircle2, XCircle } from 'lucide-react'
import { useUserApplications } from '../hooks/useSupabase'
import { cn } from '../utils/cn'

const StudentApplications = () => {
  const { applications, loading } = useUserApplications()

  return (
    <div className="flex bg-[#F8F9F8] min-h-screen font-dm-sans">
      <div className="md:hidden">
        <Navbar />
      </div>
      <Sidebar />
      
      <main className="flex-1 md:ml-64 p-6 pt-28 md:pt-12 md:p-12 overflow-y-auto h-screen">
        <header className="mb-12">
          <h1 className="text-5xl font-black tracking-tighter text-primary-dark font-manrope leading-none mb-4">
            Applications Status
          </h1>
          <p className="text-primary-dark/40 font-bold uppercase tracking-widest text-[10px]">
            Track your property applications across Mutare
          </p>
        </header>

        {loading ? (
          <div className="flex justify-center items-center h-64">
             <Loader2 size={40} className="animate-spin text-primary" />
          </div>
        ) : applications.length > 0 ? (
          <div className="space-y-6 max-w-4xl">
            {applications.map((app) => (
              <div key={app.id} className="bg-white p-8 rounded-[2.5rem] border border-primary/5 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-center gap-8">
                 {/* Status Icon */}
                 <div className={cn(
                    "w-20 h-20 shrink-0 rounded-[1.5rem] flex items-center justify-center shadow-lg",
                    app.status === 'approved' ? "bg-primary text-white" : 
                    app.status === 'rejected' ? "bg-accent-amber text-white" : 
                    "bg-primary-dark text-accent-gold"
                 )}>
                    {app.status === 'approved' ? <CheckCircle2 size={32} /> : 
                     app.status === 'rejected' ? <XCircle size={32} /> : 
                     <Clock size={32} />}
                 </div>

                 <div className="flex-1 text-center md:text-left w-full">
                    <h3 className="text-2xl font-black font-manrope text-primary-dark tracking-tight">{app.property?.title}</h3>
                    <p className="text-[10px] font-bold text-primary-dark/40 uppercase tracking-widest mt-1">
                      Submitted on {new Date(app.created_at).toLocaleDateString()}
                    </p>
                 </div>

                 <div className="shrink-0 w-full md:w-auto text-center md:text-right">
                    <p className="text-[10px] font-bold text-primary-dark/40 uppercase tracking-widest mb-1">Status</p>
                    <div className={cn(
                       "px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest border",
                       app.status === 'approved' ? "bg-primary/5 text-primary border-primary/10" : 
                       app.status === 'rejected' ? "bg-accent-amber/5 text-accent-amber border-accent-amber/10" : 
                       "bg-primary-dark/5 text-primary-dark border-primary-dark/10"
                    )}>
                       {app.status}
                    </div>
                 </div>

                 {app.status === 'approved' && (
                    <button className="w-full md:w-auto px-8 py-3 bg-primary text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                       Proceed to Pay
                    </button>
                 )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 rounded-[3rem] text-center max-w-2xl mx-auto shadow-sm border border-primary/5 mt-12">
            <AlertCircle size={48} className="mx-auto text-primary/20 mb-6" />
            <h2 className="text-3xl font-black font-manrope text-primary-dark mb-4 tracking-tighter">No applications yet</h2>
            <p className="text-primary-dark/50 font-dm-sans">You haven't submitted any background checks or applications for properties. Browse our verified listings to secure your accommodation.</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default StudentApplications
