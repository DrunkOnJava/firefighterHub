export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      activity_log: {
        Row: {
          action_type: string
          created_at: string
          description: string
          details: string | null
          firefighter_id: string | null
          firefighter_name: string | null
          id: string
          performed_by: string | null
          shift: string | null
        }
        Insert: {
          action_type: string
          created_at?: string
          description: string
          details?: string | null
          firefighter_id?: string | null
          firefighter_name?: string | null
          id?: string
          performed_by?: string | null
          shift?: string | null
        }
        Update: {
          action_type?: string
          created_at?: string
          description?: string
          details?: string | null
          firefighter_id?: string | null
          firefighter_name?: string | null
          id?: string
          performed_by?: string | null
          shift?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_log_firefighter_id_fkey"
            columns: ["firefighter_id"]
            isOneToOne: false
            referencedRelation: "firefighters"
            referencedColumns: ["id"]
          },
        ]
      }
      firefighters: {
        Row: {
          apparatus_ambulance: boolean | null
          apparatus_boat: boolean | null
          apparatus_brush_truck: boolean | null
          apparatus_engine: boolean | null
          apparatus_rescue_squad: boolean | null
          apparatus_tanker: boolean | null
          apparatus_truck: boolean | null
          apparatus_utv: boolean | null
          certification_level: string | null
          created_at: string
          fire_station: string | null
          id: string
          is_active: boolean
          is_als: boolean | null
          is_available: boolean
          is_bls: boolean | null
          is_fto: boolean | null
          last_hold_date: string | null
          name: string
          order_position: number
          shift: string
          updated_at: string
        }
        Insert: {
          apparatus_ambulance?: boolean | null
          apparatus_boat?: boolean | null
          apparatus_brush_truck?: boolean | null
          apparatus_engine?: boolean | null
          apparatus_rescue_squad?: boolean | null
          apparatus_tanker?: boolean | null
          apparatus_truck?: boolean | null
          apparatus_utv?: boolean | null
          certification_level?: string | null
          created_at?: string
          fire_station?: string | null
          id?: string
          is_active?: boolean
          is_als?: boolean | null
          is_available?: boolean
          is_bls?: boolean | null
          is_fto?: boolean | null
          last_hold_date?: string | null
          name: string
          order_position?: number
          shift: string
          updated_at?: string
        }
        Update: {
          apparatus_ambulance?: boolean | null
          apparatus_boat?: boolean | null
          apparatus_brush_truck?: boolean | null
          apparatus_engine?: boolean | null
          apparatus_rescue_squad?: boolean | null
          apparatus_tanker?: boolean | null
          apparatus_truck?: boolean | null
          apparatus_utv?: boolean | null
          certification_level?: string | null
          created_at?: string
          fire_station?: string | null
          id?: string
          is_active?: boolean
          is_als?: boolean | null
          is_available?: boolean
          is_bls?: boolean | null
          is_fto?: boolean | null
          last_hold_date?: string | null
          name?: string
          order_position?: number
          shift?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          id: string
          is_admin: boolean
          org_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id: string
          is_admin?: boolean
          org_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          is_admin?: boolean
          org_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      scheduled_holds: {
        Row: {
          completed_at: string | null
          created_at: string
          duration: string
          fire_station: string | null
          firefighter_id: string
          firefighter_name: string | null
          hold_date: string | null
          id: string
          is_completed: boolean
          lent_to_shift: string | null
          notes: string | null
          scheduled_date: string
          shift: string | null
          start_time: string
          status: string | null
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          duration?: string
          fire_station?: string | null
          firefighter_id: string
          firefighter_name?: string | null
          hold_date?: string | null
          id?: string
          is_completed?: boolean
          lent_to_shift?: string | null
          notes?: string | null
          scheduled_date: string
          shift?: string | null
          start_time?: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          duration?: string
          fire_station?: string | null
          firefighter_id?: string
          firefighter_name?: string | null
          hold_date?: string | null
          id?: string
          is_completed?: boolean
          lent_to_shift?: string | null
          notes?: string | null
          scheduled_date?: string
          shift?: string | null
          start_time?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_holds_firefighter_id_fkey"
            columns: ["firefighter_id"]
            isOneToOne: false
            referencedRelation: "firefighters"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      schedule_hold_secure: {
        Args: {
          p_duration?: string
          p_fire_station: string
          p_firefighter_id: string
          p_firefighter_name: string
          p_hold_date: string
          p_shift: string
          p_start_time?: string
        }
        Returns: {
          completed_at: string
          created_at: string
          duration: string
          fire_station: string
          firefighter_id: string
          firefighter_name: string
          hold_date: string
          id: string
          lent_to_shift: string
          notes: string
          shift: string
          start_time: string
          status: string
          updated_at: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
