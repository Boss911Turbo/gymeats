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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      batch_drops: {
        Row: {
          created_at: string
          id: string
          order_count: number
          product_id: string
          target: number
          week_start: string
        }
        Insert: {
          created_at?: string
          id?: string
          order_count?: number
          product_id: string
          target?: number
          week_start?: string
        }
        Update: {
          created_at?: string
          id?: string
          order_count?: number
          product_id?: string
          target?: number
          week_start?: string
        }
        Relationships: []
      }
      contact_requests: {
        Row: {
          admin_reply: string | null
          bulk_request: string | null
          created_at: string
          email: string
          id: string
          message: string
          name: string
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          admin_reply?: string | null
          bulk_request?: string | null
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          admin_reply?: string | null
          bulk_request?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      experience_surveys: {
        Row: {
          created_at: string
          delivery_rating: string | null
          id: string
          improvement_suggestions: string | null
          overall_rating: string | null
          packaging_rating: string | null
          quality_rating: string | null
          updated_at: string
          user_id: string
          value_rating: string | null
          would_recommend: string | null
        }
        Insert: {
          created_at?: string
          delivery_rating?: string | null
          id?: string
          improvement_suggestions?: string | null
          overall_rating?: string | null
          packaging_rating?: string | null
          quality_rating?: string | null
          updated_at?: string
          user_id: string
          value_rating?: string | null
          would_recommend?: string | null
        }
        Update: {
          created_at?: string
          delivery_rating?: string | null
          id?: string
          improvement_suggestions?: string | null
          overall_rating?: string | null
          packaging_rating?: string | null
          quality_rating?: string | null
          updated_at?: string
          user_id?: string
          value_rating?: string | null
          would_recommend?: string | null
        }
        Relationships: []
      }
      feedback: {
        Row: {
          created_at: string
          id: string
          message: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          user_id?: string
        }
        Relationships: []
      }
      order_action_tokens: {
        Row: {
          action: string
          created_at: string
          expires_at: string
          id: string
          order_id: string
          token_hash: string
          used_at: string | null
          used_by: string | null
        }
        Insert: {
          action: string
          created_at?: string
          expires_at: string
          id?: string
          order_id: string
          token_hash: string
          used_at?: string | null
          used_by?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          expires_at?: string
          id?: string
          order_id?: string
          token_hash?: string
          used_at?: string | null
          used_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_action_tokens_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_status_logs: {
        Row: {
          changed_at: string
          changed_by: string | null
          id: string
          new_status: string
          old_status: string | null
          order_id: string
          source: string | null
        }
        Insert: {
          changed_at?: string
          changed_by?: string | null
          id?: string
          new_status: string
          old_status?: string | null
          order_id: string
          source?: string | null
        }
        Update: {
          changed_at?: string
          changed_by?: string | null
          id?: string
          new_status?: string
          old_status?: string | null
          order_id?: string
          source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_status_logs_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          address: string | null
          admin_notes: string | null
          created_at: string
          customer_name: string
          customer_phone: string
          delivery_fee: number
          delivery_method: string
          id: string
          items: Json
          notes: string | null
          postcode: string | null
          preferred_date: string | null
          preferred_time: string | null
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          subtotal: number
          total: number
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          admin_notes?: string | null
          created_at?: string
          customer_name: string
          customer_phone: string
          delivery_fee?: number
          delivery_method?: string
          id?: string
          items?: Json
          notes?: string | null
          postcode?: string | null
          preferred_date?: string | null
          preferred_time?: string | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          subtotal?: number
          total?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          admin_notes?: string | null
          created_at?: string
          customer_name?: string
          customer_phone?: string
          delivery_fee?: number
          delivery_method?: string
          id?: string
          items?: Json
          notes?: string | null
          postcode?: string | null
          preferred_date?: string | null
          preferred_time?: string | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          subtotal?: number
          total?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string
          created_at: string
          email: string
          email_opt_in: boolean
          experience_survey_completed: boolean
          full_name: string
          id: string
          is_blocked: boolean
          phone: string
          preferred_language: string
          preferred_unit: string
          referral_code: string
          referral_credit: number
          referred_by: string | null
          survey_completed: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string
          created_at?: string
          email?: string
          email_opt_in?: boolean
          experience_survey_completed?: boolean
          full_name?: string
          id?: string
          is_blocked?: boolean
          phone?: string
          preferred_language?: string
          preferred_unit?: string
          referral_code?: string
          referral_credit?: number
          referred_by?: string | null
          survey_completed?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string
          created_at?: string
          email?: string
          email_opt_in?: boolean
          experience_survey_completed?: boolean
          full_name?: string
          id?: string
          is_blocked?: boolean
          phone?: string
          preferred_language?: string
          preferred_unit?: string
          referral_code?: string
          referral_credit?: number
          referred_by?: string | null
          survey_completed?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          created_at: string
          id: string
          referred_spent: number
          referred_user_id: string
          referrer_user_id: string
          reward_claimed_referred: boolean
          reward_claimed_referrer: boolean
          reward_unlocked: boolean
        }
        Insert: {
          created_at?: string
          id?: string
          referred_spent?: number
          referred_user_id: string
          referrer_user_id: string
          reward_claimed_referred?: boolean
          reward_claimed_referrer?: boolean
          reward_unlocked?: boolean
        }
        Update: {
          created_at?: string
          id?: string
          referred_spent?: number
          referred_user_id?: string
          referrer_user_id?: string
          reward_claimed_referred?: boolean
          reward_claimed_referrer?: boolean
          reward_unlocked?: boolean
        }
        Relationships: []
      }
      survey_responses: {
        Row: {
          created_at: string
          fitness_description: string | null
          freezer_space: string | null
          gym_frequency: string | null
          how_found_us: string | null
          id: string
          meat_frequency: string | null
          meat_ranking: Json | null
          order_frequency: string | null
          people_fed: string | null
          referral_likelihood: string | null
          subscription_interest: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          fitness_description?: string | null
          freezer_space?: string | null
          gym_frequency?: string | null
          how_found_us?: string | null
          id?: string
          meat_frequency?: string | null
          meat_ranking?: Json | null
          order_frequency?: string | null
          people_fed?: string | null
          referral_likelihood?: string | null
          subscription_interest?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          fitness_description?: string | null
          freezer_space?: string | null
          gym_frequency?: string | null
          how_found_us?: string | null
          id?: string
          meat_frequency?: string | null
          meat_ranking?: Json | null
          order_frequency?: string | null
          people_fed?: string | null
          referral_likelihood?: string | null
          subscription_interest?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_batch_order: {
        Args: { p_product_id: string }
        Returns: undefined
      }
      process_referral: {
        Args: { referral_code_input: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
