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
      change_log_tracker: {
        Row: {
          id: number
          last_updated: string | null
          latest_change_log_id: number | null
        }
        Insert: {
          id?: number
          last_updated?: string | null
          latest_change_log_id?: number | null
        }
        Update: {
          id?: number
          last_updated?: string | null
          latest_change_log_id?: number | null
        }
        Relationships: []
      }
      recipe: {
        Row: {
          created: string
          creator: string
          description: string | null
          id: string
          keywords: string[] | null
          name: string
          processor: string
          publish_state: string
          queries: Json
          resolver: string
          revokable: boolean
          schema: string
          search_vector: unknown | null
        }
        Insert: {
          created: string
          creator: string
          description?: string | null
          id: string
          keywords?: string[] | null
          name: string
          processor: string
          publish_state: string
          queries: Json
          resolver: string
          revokable: boolean
          schema: string
          search_vector?: unknown | null
        }
        Update: {
          created?: string
          creator?: string
          description?: string | null
          id?: string
          keywords?: string[] | null
          name?: string
          processor?: string
          publish_state?: string
          queries?: Json
          resolver?: string
          revokable?: boolean
          schema?: string
          search_vector?: unknown | null
        }
        Relationships: []
      }
      run: {
        Row: {
          attestation_transaction_hash: string | null
          attestation_uid: string | null
          base_fee_per_gas: string | null
          chain_id: number
          created: string
          creator: string
          error: string | null
          gas: string | null
          id: string
          is_cancelled: boolean
          max_priority_fee_per_gas: string | null
          payment_block_number: string | null
          payment_log_index: string | null
          payment_transaction_hash: string | null
          recipe_id: string
          user_fee: string | null
        }
        Insert: {
          attestation_transaction_hash?: string | null
          attestation_uid?: string | null
          base_fee_per_gas?: string | null
          chain_id: number
          created: string
          creator: string
          error?: string | null
          gas?: string | null
          id: string
          is_cancelled: boolean
          max_priority_fee_per_gas?: string | null
          payment_block_number?: string | null
          payment_log_index?: string | null
          payment_transaction_hash?: string | null
          recipe_id: string
          user_fee?: string | null
        }
        Update: {
          attestation_transaction_hash?: string | null
          attestation_uid?: string | null
          base_fee_per_gas?: string | null
          chain_id?: number
          created?: string
          creator?: string
          error?: string | null
          gas?: string | null
          id?: string
          is_cancelled?: boolean
          max_priority_fee_per_gas?: string | null
          payment_block_number?: string | null
          payment_log_index?: string | null
          payment_transaction_hash?: string | null
          recipe_id?: string
          user_fee?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_recipe"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipe"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      list_popular_recipes: {
        Args: {
          page: number
          pagesize: number
        }
        Returns: {
          id: string
          name: string
          description: string
          creator: string
          created: string
          keywords: string[]
          publish_state: string
          nr_of_runs: number
        }[]
      }
      search_recipes: {
        Args: {
          search_query: string
        }
        Returns: {
          id: string
          name: string
          description: string
          creator: string
          created: string
          keywords: string[]
          publish_state: string
          rank: number
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
