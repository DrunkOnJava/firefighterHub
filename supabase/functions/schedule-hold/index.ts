import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

interface ScheduleHoldRequest {
  firefighter_id: string;
  firefighter_name: string;
  hold_date: string;
  fire_station: string | null;
  shift: "A" | "B" | "C";
  duration: "12h" | "24h";
  start_time: string;
  is_voluntary?: boolean;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client with service role (bypasses RLS)
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Verify user is authenticated
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      // TEMPORARY: Allow anon key during transition period
      // Remove this after authentication is fully implemented
      console.warn("No authenticated user, allowing anon access (temporary)");
    } else {
      // Enforce admin check for authenticated users
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("is_admin, org_id")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error("Profile lookup error:", profileError);
        // If profile doesn't exist, reject (user should have a profile)
        return new Response(
          JSON.stringify({ error: "User profile not found" }),
          {
            status: 403,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      if (!profile?.is_admin) {
        return new Response(
          JSON.stringify({ error: "Forbidden - Admin privileges required" }),
          {
            status: 403,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // TODO: Add org_id validation when multi-tenant is implemented
      // Ensure the firefighter and station belong to the user's organization
    }

    const payload: ScheduleHoldRequest = await req.json();

    // Validate required fields
    if (
      !payload.firefighter_id ||
      !payload.firefighter_name ||
      !payload.hold_date ||
      !payload.shift
    ) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Check for existing hold on same date/shift/station
    const { data: existingHold } = await supabase
      .from("scheduled_holds")
      .select("id")
      .eq("hold_date", payload.hold_date)
      .eq("shift", payload.shift)
      .eq("fire_station", payload.fire_station)
      .eq("status", "scheduled")
      .maybeSingle();

    if (existingHold) {
      return new Response(
        JSON.stringify({
          error: "Hold already exists for this date/shift/station",
        }),
        {
          status: 409,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Insert the scheduled hold
    const { data: newHold, error: insertError } = await supabase
      .from("scheduled_holds")
      .insert({
        firefighter_id: payload.firefighter_id,
        firefighter_name: payload.firefighter_name,
        hold_date: payload.hold_date,
        fire_station: payload.fire_station,
        status: "scheduled",
        shift: payload.shift,
        duration: payload.duration,
        start_time: payload.start_time,
        is_voluntary: payload.is_voluntary || false,
        scheduled_date: payload.hold_date,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      return new Response(JSON.stringify({ error: insertError.message }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Log the activity
    await supabase.from("activity_log").insert({
      firefighter_id: payload.firefighter_id,
      firefighter_name: payload.firefighter_name,
      action_type: payload.is_voluntary ? "hold_volunteered" : "hold_scheduled",
      details: `${payload.is_voluntary ? 'Volunteered for' : 'Scheduled'} hold for ${payload.hold_date}${payload.fire_station ? ` at station ${payload.fire_station}` : ''}`,
      shift: payload.shift,
    });

    return new Response(JSON.stringify(newHold), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
