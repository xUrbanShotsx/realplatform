'use client'
import { useState, useEffect } from 'react'
import { createClient } from './client'

export function useCurrentOrg() {
  const [orgId, setOrgId]   = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { setLoading(false); return }
      setUserId(user.id)
      const { data } = await supabase
        .from('user_profiles')
        .select('org_id')
        .eq('user_id', user.id)
        .single()
      setOrgId(data?.org_id ?? null)
      setLoading(false)
    })
  }, [])

  return { orgId, userId, loading }
}
