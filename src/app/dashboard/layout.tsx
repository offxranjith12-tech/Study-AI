import Link from 'next/link'
import { ReactNode } from 'react'
import { logout } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { 
  BrainCircuit, 
  LayoutDashboard, 
  MessageSquare, 
  FileText, 
  Target, 
  LineChart, 
  LogOut,
  User
} from 'lucide-react'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-muted/20 hidden md:block">
        <div className="h-full flex flex-col">
          <div className="h-16 flex items-center px-6 border-b">
            <Link className="flex items-center gap-2" href="/dashboard">
              <BrainCircuit className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">StudyAI</span>
            </Link>
          </div>
          
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted/50 text-sm font-medium">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
            <Link href="/dashboard/tutor" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted/50 text-sm font-medium">
              <MessageSquare className="h-4 w-4" />
              AI Tutor
            </Link>
            <Link href="/dashboard/materials" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted/50 text-sm font-medium">
              <FileText className="h-4 w-4" />
              Study Materials
            </Link>
            <Link href="/dashboard/quiz" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted/50 text-sm font-medium">
              <BrainCircuit className="h-4 w-4" />
              Quiz
            </Link>
            <Link href="/dashboard/planner" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted/50 text-sm font-medium">
              <Target className="h-4 w-4" />
              Study Planner
            </Link>
            <Link href="/dashboard/progress" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted/50 text-sm font-medium">
              <LineChart className="h-4 w-4" />
              Progress
            </Link>
          </nav>
          
          <div className="p-4 border-t">
            <Link href="/dashboard/profile" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted/50 text-sm font-medium mb-2">
              <User className="h-4 w-4" />
              Profile
            </Link>
            <form action={logout}>
              <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header (simplified for now) */}
        <header className="h-16 flex items-center px-4 border-b md:hidden bg-background">
          <Link className="flex items-center gap-2" href="/dashboard">
            <BrainCircuit className="h-6 w-6 text-primary" />
            <span className="font-bold">StudyAI</span>
          </Link>
        </header>
        
        <div className="flex-1 overflow-y-auto bg-muted/10 p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
