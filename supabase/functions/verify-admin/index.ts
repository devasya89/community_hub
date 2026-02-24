import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const serviceClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    if (req.method === 'POST') {
      const { superKey } = await req.json()
      const SUPER_KEY = 'SOCIETYHUB_SUPER_2024'

      if (superKey === SUPER_KEY) {
        const { data: existingRole } = await serviceClient
          .from('user_roles')
          .select('id')
          .eq('user_id', user.id)
          .eq('role', 'super_admin')
          .maybeSingle()

        if (!existingRole) {
          await serviceClient.from('user_roles').insert({
            user_id: user.id,
            role: 'super_admin'
          })
        }

        return new Response(JSON.stringify({ role: 'super_admin', society: null }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      } else {
        return new Response(JSON.stringify({ error: 'Invalid super key' }), {
          status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
    }

    // GET - return role info
    const { data: roles } = await serviceClient
      .from('user_roles')
      .select('role, society_id')
      .eq('user_id', user.id)

    const superAdmin = roles?.find((r: any) => r.role === 'super_admin')
    if (superAdmin) {
      return new Response(JSON.stringify({ role: 'super_admin', society: null }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const adminRole = roles?.find((r: any) => r.role === 'admin')
    if (adminRole && adminRole.society_id) {
      const { data: society } = await serviceClient
        .from('societies')
        .select('*')
        .eq('id', adminRole.society_id)
        .single()

      return new Response(JSON.stringify({ role: 'admin', society }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({ role: null, society: null }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
