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
      categories: {
        Row: {
          active: boolean | null
          description: string | null
          icon: string | null
          id: string
          keywords: string[] | null
          meta_description: string | null
          meta_title: string | null
          name: string
          order: number | null
          slug: string
          type: Database["public"]["Enums"]["category_type"]
        }
        Insert: {
          active?: boolean | null
          description?: string | null
          icon?: string | null
          id?: string
          keywords?: string[] | null
          meta_description?: string | null
          meta_title?: string | null
          name: string
          order?: number | null
          slug: string
          type: Database["public"]["Enums"]["category_type"]
        }
        Update: {
          active?: boolean | null
          description?: string | null
          icon?: string | null
          id?: string
          keywords?: string[] | null
          meta_description?: string | null
          meta_title?: string | null
          name?: string
          order?: number | null
          slug?: string
          type?: Database["public"]["Enums"]["category_type"]
        }
        Relationships: []
      }
      housing: {
        Row: {
          address: string
          id: string
          name: string
        }
        Insert: {
          address: string
          id?: string
          name: string
        }
        Update: {
          address?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      housing_validations: {
        Row: {
          analyzed_at: string | null
          created_at: string | null
          document_url: string
          id: string
          message: string | null
          status: Database["public"]["Enums"]["validation_status"] | null
          user_id: string
        }
        Insert: {
          analyzed_at?: string | null
          created_at?: string | null
          document_url: string
          id?: string
          message?: string | null
          status?: Database["public"]["Enums"]["validation_status"] | null
          user_id: string
        }
        Update: {
          analyzed_at?: string | null
          created_at?: string | null
          document_url?: string
          id?: string
          message?: string | null
          status?: Database["public"]["Enums"]["validation_status"] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "housing_validations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      listings: {
        Row: {
          availability: string | null
          condition: Database["public"]["Enums"]["listing_condition"] | null
          created_at: string | null
          deleted_at: string | null
          description: string | null
          id: string
          images: Json | null
          price: number
          status: Database["public"]["Enums"]["listing_status"] | null
          subcategory_id: string | null
          title: string
          type: Database["public"]["Enums"]["listing_type"]
          updated_at: string | null
          user_id: string | null
          visualizacoes: number | null
        }
        Insert: {
          availability?: string | null
          condition?: Database["public"]["Enums"]["listing_condition"] | null
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          images?: Json | null
          price: number
          status?: Database["public"]["Enums"]["listing_status"] | null
          subcategory_id?: string | null
          title: string
          type: Database["public"]["Enums"]["listing_type"]
          updated_at?: string | null
          user_id?: string | null
          visualizacoes?: number | null
        }
        Update: {
          availability?: string | null
          condition?: Database["public"]["Enums"]["listing_condition"] | null
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          images?: Json | null
          price?: number
          status?: Database["public"]["Enums"]["listing_status"] | null
          subcategory_id?: string | null
          title?: string
          type?: Database["public"]["Enums"]["listing_type"]
          updated_at?: string | null
          user_id?: string | null
          visualizacoes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "listings_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "subcategories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      subcategories: {
        Row: {
          active: boolean | null
          category_id: string | null
          description: string | null
          id: string
          keywords: string[] | null
          meta_description: string | null
          meta_title: string | null
          name: string
          slug: string
        }
        Insert: {
          active?: boolean | null
          category_id?: string | null
          description?: string | null
          id?: string
          keywords?: string[] | null
          meta_description?: string | null
          meta_title?: string | null
          name: string
          slug: string
        }
        Update: {
          active?: boolean | null
          category_id?: string | null
          description?: string | null
          id?: string
          keywords?: string[] | null
          meta_description?: string | null
          meta_title?: string | null
          name?: string
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "subcategories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      ufmg_validations: {
        Row: {
          analyzed_at: string | null
          created_at: string | null
          document_url: string
          id: string
          message: string | null
          status: Database["public"]["Enums"]["validation_status"] | null
          user_id: string
        }
        Insert: {
          analyzed_at?: string | null
          created_at?: string | null
          document_url: string
          id?: string
          message?: string | null
          status?: Database["public"]["Enums"]["validation_status"] | null
          user_id: string
        }
        Update: {
          analyzed_at?: string | null
          created_at?: string | null
          document_url?: string
          id?: string
          message?: string | null
          status?: Database["public"]["Enums"]["validation_status"] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ufmg_validations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          bio: string | null
          birthdate: string | null
          celular: string
          commercial_name: string | null
          cpf: string | null
          created_at: string | null
          deleted_at: string | null
          email: string
          housing_id: string | null
          housing_status:
            | Database["public"]["Enums"]["validation_status"]
            | null
          id: string
          image_url: Json | null
          name: string
          type: Database["public"]["Enums"]["user_type"]
          ufmg_status: Database["public"]["Enums"]["validation_status"] | null
          updated_at: string | null
          whatsapp_msg: string | null
        }
        Insert: {
          bio?: string | null
          birthdate?: string | null
          celular: string
          commercial_name?: string | null
          cpf?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email: string
          housing_id?: string | null
          housing_status?:
            | Database["public"]["Enums"]["validation_status"]
            | null
          id?: string
          image_url?: Json | null
          name: string
          type?: Database["public"]["Enums"]["user_type"]
          ufmg_status?: Database["public"]["Enums"]["validation_status"] | null
          updated_at?: string | null
          whatsapp_msg?: string | null
        }
        Update: {
          bio?: string | null
          birthdate?: string | null
          celular?: string
          commercial_name?: string | null
          cpf?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email?: string
          housing_id?: string | null
          housing_status?:
            | Database["public"]["Enums"]["validation_status"]
            | null
          id?: string
          image_url?: Json | null
          name?: string
          type?: Database["public"]["Enums"]["user_type"]
          ufmg_status?: Database["public"]["Enums"]["validation_status"] | null
          updated_at?: string | null
          whatsapp_msg?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_housing_id_fkey"
            columns: ["housing_id"]
            isOneToOne: false
            referencedRelation: "housing"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_soft_delete_policy: {
        Args: {
          target_table: string
        }
        Returns: undefined
      }
    }
    Enums: {
      category_type: "PRODUCT" | "SERVICE"
      listing_condition: "NOVO" | "SEMINOVO" | "USADO" | "DEFEITO"
      listing_status: "ACTIVE" | "INACTIVE" | "DELETED"
      listing_type: "SALE" | "RENT" | "DONATION" | "EXCHANGE"
      user_type: "VISITOR" | "UFMG" | "RESIDENT" | "ADMIN"
      validation_status: "NONE" | "PENDING" | "ACTIVE" | "REJECTED"
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

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never