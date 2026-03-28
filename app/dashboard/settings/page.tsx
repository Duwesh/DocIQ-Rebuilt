import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { 
  Settings, 
  User, 
  Shield, 
  CreditCard, 
  Bell, 
  Globe, 
  Database,
  Lock
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default async function SettingsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await currentUser();

  return (
    <div className="flex flex-col h-full space-y-8 pb-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col gap-2">
         <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-100 p-2 rounded-xl">
               <Settings className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground/90 font-heading">
               Workspace Settings
            </h1>
         </div>
         <p className="text-muted-foreground text-sm max-w-2xl leading-relaxed font-medium">
            Manage your personal account, security preferences, and integration configurations.
         </p>
      </div>

      <Separator className="bg-muted/60" />

      {/* ================= SETTINGS GRID ================= */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
         {/* SIDEBAR NAVIGATION (Internal) */}
         <div className="md:col-span-1 space-y-1">
            <nav className="flex flex-col space-y-1">
               <button className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold bg-blue-50 text-blue-700 rounded-xl border border-blue-100/50">
                  <User className="h-4 w-4" /> Account Profile
               </button>
            </nav>
            <div className="mt-6 px-4 py-3 bg-muted/30 rounded-2xl border border-dashed border-muted-foreground/20">
               <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter mb-1">Coming Soon</p>
               <p className="text-[11px] text-muted-foreground/60 leading-tight">Billing, advanced security, and cloud sync features are currently in development.</p>
            </div>
         </div>

         {/* CONTENT AREA */}
         <div className="md:col-span-3 space-y-8">
            <div className="bg-card border rounded-[2rem] shadow-sm overflow-hidden">
               <div className="px-8 py-6 border-b bg-muted/20">
                  <h3 className="text-lg font-bold text-foreground/80 flex items-center gap-2">
                     <User className="h-5 w-5 text-blue-500" /> Profile Details
                  </h3>
               </div>
               <div className="p-8">
                  <div className="space-y-6 max-w-xl">
                     <div className="flex items-center gap-6 pb-2">
                        <div className="h-20 w-20 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-lg ring-1 ring-blue-100">
                           {user?.firstName?.charAt(0) || user?.emailAddresses[0].emailAddress.charAt(0).toUpperCase()}
                        </div>
                        <div className="space-y-1 text-left">
                           <h4 className="text-xl font-bold">{user?.firstName} {user?.lastName}</h4>
                           <p className="text-sm text-muted-foreground font-medium">{user?.emailAddresses[0].emailAddress}</p>
                           <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 uppercase tracking-wider">
                              Personal Workspace Owner
                           </span>
                        </div>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-6 pt-4 border-t border-dashed">
                        <div className="space-y-1.5">
                           <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Public Username</label>
                           <p className="font-semibold">{user?.username || "Not set"}</p>
                        </div>
                        <div className="space-y-1.5 text-right">
                           <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Two-Factor Auth</label>
                           <div className="flex items-center justify-end gap-2 text-emerald-600 font-bold">
                              <Shield className="h-4 w-4" /> Active
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
