export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      conversations: {
        Row: {
          created_at: string
          id: string
          participant1_id: string
          participant2_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          participant1_id: string
          participant2_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          participant1_id?: string
          participant2_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      fundability_scores: {
        Row: {
          business_model_score: number
          created_at: string | null
          exit_potential_score: number
          feedback: Json | null
          id: string
          improvement_areas: string[] | null
          market_potential_score: number
          score: number
          startup_id: string | null
          status: string
          team_score: number
          traction_score: number
          updated_at: string | null
          value_proposition_score: number
        }
        Insert: {
          business_model_score: number
          created_at?: string | null
          exit_potential_score: number
          feedback?: Json | null
          id?: string
          improvement_areas?: string[] | null
          market_potential_score: number
          score: number
          startup_id?: string | null
          status?: string
          team_score: number
          traction_score: number
          updated_at?: string | null
          value_proposition_score: number
        }
        Update: {
          business_model_score?: number
          created_at?: string | null
          exit_potential_score?: number
          feedback?: Json | null
          id?: string
          improvement_areas?: string[] | null
          market_potential_score?: number
          score?: number
          startup_id?: string | null
          status?: string
          team_score?: number
          traction_score?: number
          updated_at?: string | null
          value_proposition_score?: number
        }
        Relationships: [
          {
            foreignKeyName: "fundability_scores_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
        ]
      }
      investor_interactions: {
        Row: {
          created_at: string
          id: string
          interaction_type: string
          investor_id: string
          startup_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          interaction_type: string
          investor_id: string
          startup_id: string
        }
        Update: {
          created_at?: string
          id?: string
          interaction_type?: string
          investor_id?: string
          startup_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "investor_interactions_investor_id_fkey"
            columns: ["investor_id"]
            isOneToOne: false
            referencedRelation: "investors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "investor_interactions_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
        ]
      }
      investor_preferences: {
        Row: {
          created_at: string | null
          exclusion_criteria: string[] | null
          id: string
          investment_thesis: string | null
          investor_id: string | null
          max_check_size: number | null
          min_check_size: number | null
          preferred_geographies: string[] | null
          preferred_sectors: string[] | null
          preferred_stages: string[] | null
          risk_appetite: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          exclusion_criteria?: string[] | null
          id?: string
          investment_thesis?: string | null
          investor_id?: string | null
          max_check_size?: number | null
          min_check_size?: number | null
          preferred_geographies?: string[] | null
          preferred_sectors?: string[] | null
          preferred_stages?: string[] | null
          risk_appetite?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          exclusion_criteria?: string[] | null
          id?: string
          investment_thesis?: string | null
          investor_id?: string | null
          max_check_size?: number | null
          min_check_size?: number | null
          preferred_geographies?: string[] | null
          preferred_sectors?: string[] | null
          preferred_stages?: string[] | null
          risk_appetite?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "investor_preferences_investor_id_fkey"
            columns: ["investor_id"]
            isOneToOne: false
            referencedRelation: "investors"
            referencedColumns: ["id"]
          },
        ]
      }
      investors: {
        Row: {
          created_at: string
          description: string | null
          id: string
          location: string | null
          logo: string | null
          name: string
          portfolio: string | null
          sectors: string[] | null
          stages: string[] | null
          ticket_size: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          location?: string | null
          logo?: string | null
          name: string
          portfolio?: string | null
          sectors?: string[] | null
          stages?: string[] | null
          ticket_size?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          location?: string | null
          logo?: string | null
          name?: string
          portfolio?: string | null
          sectors?: string[] | null
          stages?: string[] | null
          ticket_size?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      matches: {
        Row: {
          created_at: string
          id: string
          initiator_id: string
          investor_id: string | null
          startup_id: string | null
          status: string
          target_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          initiator_id: string
          investor_id?: string | null
          startup_id?: string | null
          status?: string
          target_id: string
        }
        Update: {
          created_at?: string
          id?: string
          initiator_id?: string
          investor_id?: string | null
          startup_id?: string | null
          status?: string
          target_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "matches_investor_id_fkey"
            columns: ["investor_id"]
            isOneToOne: false
            referencedRelation: "investors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          read_at: string | null
          recipient_id: string
          sender_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          read_at?: string | null
          recipient_id: string
          sender_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          read_at?: string | null
          recipient_id?: string
          sender_id?: string
        }
        Relationships: []
      }
      pitch_views: {
        Row: {
          created_at: string
          id: string
          startup_id: string
          viewer_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          startup_id: string
          viewer_id: string
        }
        Update: {
          created_at?: string
          id?: string
          startup_id?: string
          viewer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pitch_views_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pitch_views_viewer_id_fkey"
            columns: ["viewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          company: string | null
          created_at: string
          description: string | null
          email: string
          id: string
          location: string | null
          name: string
          sector: string | null
          stage: string | null
          ticket_size: string | null
          updated_at: string
          user_type: Database["public"]["Enums"]["user_type"]
        }
        Insert: {
          company?: string | null
          created_at?: string
          description?: string | null
          email: string
          id: string
          location?: string | null
          name: string
          sector?: string | null
          stage?: string | null
          ticket_size?: string | null
          updated_at?: string
          user_type: Database["public"]["Enums"]["user_type"]
        }
        Update: {
          company?: string | null
          created_at?: string
          description?: string | null
          email?: string
          id?: string
          location?: string | null
          name?: string
          sector?: string | null
          stage?: string | null
          ticket_size?: string | null
          updated_at?: string
          user_type?: Database["public"]["Enums"]["user_type"]
        }
        Relationships: []
      }
      recommendation_logs: {
        Row: {
          algorithm_version: string | null
          clicked: boolean | null
          clicked_at: string | null
          features_used: Json | null
          id: string
          interested: boolean | null
          interested_at: string | null
          investor_id: string | null
          recommendation_score: number
          shown_at: string | null
          startup_id: string | null
        }
        Insert: {
          algorithm_version?: string | null
          clicked?: boolean | null
          clicked_at?: string | null
          features_used?: Json | null
          id?: string
          interested?: boolean | null
          interested_at?: string | null
          investor_id?: string | null
          recommendation_score: number
          shown_at?: string | null
          startup_id?: string | null
        }
        Update: {
          algorithm_version?: string | null
          clicked?: boolean | null
          clicked_at?: string | null
          features_used?: Json | null
          id?: string
          interested?: boolean | null
          interested_at?: string | null
          investor_id?: string | null
          recommendation_score?: number
          shown_at?: string | null
          startup_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recommendation_logs_investor_id_fkey"
            columns: ["investor_id"]
            isOneToOne: false
            referencedRelation: "investors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recommendation_logs_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
        ]
      }
      startup_checkins: {
        Row: {
          challenges: string | null
          created_at: string | null
          funding_raised: number | null
          goals_next_quarter: string | null
          id: string
          new_partnerships: number | null
          product_updates: string | null
          quarter: string
          rescoring_needed: boolean | null
          revenue_growth: number | null
          startup_id: string | null
          team_changes: number | null
          user_growth: number | null
          year: number
        }
        Insert: {
          challenges?: string | null
          created_at?: string | null
          funding_raised?: number | null
          goals_next_quarter?: string | null
          id?: string
          new_partnerships?: number | null
          product_updates?: string | null
          quarter: string
          rescoring_needed?: boolean | null
          revenue_growth?: number | null
          startup_id?: string | null
          team_changes?: number | null
          user_growth?: number | null
          year: number
        }
        Update: {
          challenges?: string | null
          created_at?: string | null
          funding_raised?: number | null
          goals_next_quarter?: string | null
          id?: string
          new_partnerships?: number | null
          product_updates?: string | null
          quarter?: string
          rescoring_needed?: boolean | null
          revenue_growth?: number | null
          startup_id?: string | null
          team_changes?: number | null
          user_growth?: number | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "startup_checkins_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
        ]
      }
      startup_features: {
        Row: {
          competition_score: number | null
          feature_vector: Json | null
          financial_health_score: number | null
          fundability_score: number | null
          id: string
          last_updated: string | null
          market_size_score: number | null
          product_readiness_score: number | null
          startup_id: string | null
          team_experience_score: number | null
        }
        Insert: {
          competition_score?: number | null
          feature_vector?: Json | null
          financial_health_score?: number | null
          fundability_score?: number | null
          id?: string
          last_updated?: string | null
          market_size_score?: number | null
          product_readiness_score?: number | null
          startup_id?: string | null
          team_experience_score?: number | null
        }
        Update: {
          competition_score?: number | null
          feature_vector?: Json | null
          financial_health_score?: number | null
          fundability_score?: number | null
          id?: string
          last_updated?: string | null
          market_size_score?: number | null
          product_readiness_score?: number | null
          startup_id?: string | null
          team_experience_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "startup_features_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
        ]
      }
      startup_improvements: {
        Row: {
          completed_at: string | null
          created_at: string | null
          fundability_score_id: string | null
          id: string
          improvement_type: string
          notes: string | null
          resources_used: string[] | null
          startup_id: string | null
          status: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          fundability_score_id?: string | null
          id?: string
          improvement_type: string
          notes?: string | null
          resources_used?: string[] | null
          startup_id?: string | null
          status?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          fundability_score_id?: string | null
          id?: string
          improvement_type?: string
          notes?: string | null
          resources_used?: string[] | null
          startup_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "startup_improvements_fundability_score_id_fkey"
            columns: ["fundability_score_id"]
            isOneToOne: false
            referencedRelation: "fundability_scores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "startup_improvements_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
        ]
      }
      startup_views: {
        Row: {
          created_at: string
          id: string
          startup_id: string
          viewer_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          startup_id: string
          viewer_id: string
        }
        Update: {
          created_at?: string
          id?: string
          startup_id?: string
          viewer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "startup_views_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "startup_views_viewer_id_fkey"
            columns: ["viewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      startups: {
        Row: {
          created_at: string
          description: string | null
          funding_target: string | null
          id: string
          location: string | null
          logo: string | null
          name: string
          revenue: string | null
          sector: string
          stage: string
          team_size: string | null
          traction: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          funding_target?: string | null
          id?: string
          location?: string | null
          logo?: string | null
          name: string
          revenue?: string | null
          sector: string
          stage: string
          team_size?: string | null
          traction?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          funding_target?: string | null
          id?: string
          location?: string | null
          logo?: string | null
          name?: string
          revenue?: string | null
          sector?: string
          stage?: string
          team_size?: string | null
          traction?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      watchlists: {
        Row: {
          created_at: string
          id: string
          investor_id: string | null
          startup_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          investor_id?: string | null
          startup_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          investor_id?: string | null
          startup_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "watchlists_investor_id_fkey"
            columns: ["investor_id"]
            isOneToOne: false
            referencedRelation: "investors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "watchlists_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_fundability_score: {
        Args: {
          market_potential: number
          value_proposition: number
          team: number
          business_model: number
          traction: number
          exit_potential: number
        }
        Returns: number
      }
      get_investor_stats: {
        Args: { investor_user_id: string }
        Returns: Json
      }
      get_startup_recommendations: {
        Args: { p_investor_id: string; p_limit?: number }
        Returns: {
          startup_id: string
          startup_name: string
          fundability_score: number
          recommendation_score: number
          sector: string
          stage: string
          location: string
        }[]
      }
      get_startup_stats: {
        Args: { startup_user_id: string }
        Returns: Json
      }
    }
    Enums: {
      user_type: "startup" | "investor"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_type: ["startup", "investor"],
    },
  },
} as const
