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
      const body = await req.json()
      const { superKey, action } = body

      // Super admin verification with super key
      if (superKey) {
        const SUPER_KEY = 'SOCIETY_HUB_2026'

        if (superKey !== SUPER_KEY) {
          return new Response(JSON.stringify({ error: 'Invalid super key' }), {
            status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }

        // Check if this is the designated super admin email
        if (user.email !== 'icoc7772@gmail.com') {
          return new Response(JSON.stringify({ error: 'This email is not authorized as super admin' }), {
            status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }

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
      }

      // Normal admin registration - assign admin role (requires super admin approval later)
      if (action === 'register_admin') {
        // Just check they authenticated successfully - role assignment is done by super admin
        return new Response(JSON.stringify({ success: true, message: 'Account created. Contact super admin for admin role assignment.' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
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
