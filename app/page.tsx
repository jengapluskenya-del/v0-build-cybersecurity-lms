import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Shield, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role === 'super_admin' || profile?.role === 'admin') {
      redirect('/admin')
    } else {
      redirect('/student')
    }
  }

  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-background p-6">
      <div className="flex flex-col items-center gap-8 text-center max-w-lg">
        <div className="flex items-center gap-3">
          <Shield className="h-12 w-12 text-primary" />
          <h1 className="text-4xl font-bold tracking-tight text-foreground font-sans">TrioVault LMS</h1>
        </div>
        <p className="text-muted-foreground text-lg leading-relaxed text-balance">
          Cybersecurity Training Academy - Learn, practice, and master cybersecurity skills with expert-led courses.
        </p>
        <Link href="/auth/login">
          <Button size="lg" className="gap-2">
            Sign In to Get Started <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </main>
  )
}
