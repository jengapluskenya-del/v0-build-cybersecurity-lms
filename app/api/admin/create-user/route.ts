import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()

  // Verify the requester is an admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || !['admin', 'super_admin'].includes(profile.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Only super_admin can create admins
  const body = await request.json()
  const { email, password, fullName, role } = body

  if ((role === 'admin' || role === 'super_admin') && profile.role !== 'super_admin') {
    return NextResponse.json({ error: 'Only super admins can create admin accounts' }, { status: 403 })
  }

  // Use Supabase auth admin to create the user - we sign up via client
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${new URL(request.url).origin}/auth/login`,
      data: {
        full_name: fullName,
        role: role || 'student',
      },
    },
  })

  if (signUpError) {
    return NextResponse.json({ error: signUpError.message }, { status: 400 })
  }

  return NextResponse.json({ success: true, userId: signUpData.user?.id })
}
