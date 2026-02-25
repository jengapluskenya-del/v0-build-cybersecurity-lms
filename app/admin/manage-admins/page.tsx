import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AdminsManager } from '@/components/admin/admins-manager'

export default async function ManageAdminsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'super_admin') redirect('/admin')

  const { data: admins } = await supabase
    .from('profiles')
    .select('*')
    .in('role', ['admin', 'super_admin'])
    .order('created_at', { ascending: false })

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Manage Admins</h1>
        <p className="text-muted-foreground mt-1">Add and manage admin accounts (Super Admin only)</p>
      </div>
      <AdminsManager initialAdmins={admins || []} currentUserId={user.id} />
    </div>
  )
}
