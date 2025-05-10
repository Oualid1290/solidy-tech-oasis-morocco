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
          icon_url: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          icon_url?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          icon_url?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      chats: {
        Row: {
          buyer_id: string | null
          created_at: string | null
          id: string
          last_message_at: string | null
          listing_id: string | null
          seller_id: string | null
        }
        Insert: {
          buyer_id?: string | null
          created_at?: string | null
          id?: string
          last_message_at?: string | null
          listing_id?: string | null
          seller_id?: string | null
        }
        Update: {
          buyer_id?: string | null
          created_at?: string | null
          id?: string
          last_message_at?: string | null
          listing_id?: string | null
          seller_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chats_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chats_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chats_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      device_fingerprints: {
        Row: {
          created_at: string | null
          fingerprint_hash: string
          id: string
          ip_address: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          fingerprint_hash: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          fingerprint_hash?: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "device_fingerprints_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      listing_images: {
        Row: {
          id: string
          image_url: string
          listing_id: string | null
          uploaded_at: string | null
        }
        Insert: {
          id?: string
          image_url: string
          listing_id?: string | null
          uploaded_at?: string | null
        }
        Update: {
          id?: string
          image_url?: string
          listing_id?: string | null
          uploaded_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "listing_images_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      listings: {
        Row: {
          category_id: string | null
          city: string
          condition: Database["public"]["Enums"]["listing_condition"]
          created_at: string | null
          description: string
          id: string
          is_negotiable: boolean | null
          price: number
          status: Database["public"]["Enums"]["listing_status"] | null
          thumbnail_url: string | null
          title: string
          user_id: string | null
        }
        Insert: {
          category_id?: string | null
          city: string
          condition: Database["public"]["Enums"]["listing_condition"]
          created_at?: string | null
          description: string
          id?: string
          is_negotiable?: boolean | null
          price: number
          status?: Database["public"]["Enums"]["listing_status"] | null
          thumbnail_url?: string | null
          title: string
          user_id?: string | null
        }
        Update: {
          category_id?: string | null
          city?: string
          condition?: Database["public"]["Enums"]["listing_condition"]
          created_at?: string | null
          description?: string
          id?: string
          is_negotiable?: boolean | null
          price?: number
          status?: Database["public"]["Enums"]["listing_status"] | null
          thumbnail_url?: string | null
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "listings_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
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
      messages: {
        Row: {
          chat_id: string | null
          id: string
          message_text: string | null
          message_type: Database["public"]["Enums"]["message_type"] | null
          read_at: string | null
          sender_id: string | null
          sent_at: string | null
        }
        Insert: {
          chat_id?: string | null
          id?: string
          message_text?: string | null
          message_type?: Database["public"]["Enums"]["message_type"] | null
          read_at?: string | null
          sender_id?: string | null
          sent_at?: string | null
        }
        Update: {
          chat_id?: string | null
          id?: string
          message_text?: string | null
          message_type?: Database["public"]["Enums"]["message_type"] | null
          read_at?: string | null
          sender_id?: string | null
          sent_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          payload: Json | null
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          payload?: Json | null
          type: Database["public"]["Enums"]["notification_type"]
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          payload?: Json | null
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          id: string
          listing_id: string | null
          rating: number | null
          reviewed_user_id: string | null
          reviewer_id: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: string
          listing_id?: string | null
          rating?: number | null
          reviewed_user_id?: string | null
          reviewer_id?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: string
          listing_id?: string | null
          rating?: number | null
          reviewed_user_id?: string | null
          reviewer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewed_user_id_fkey"
            columns: ["reviewed_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          bio: string | null
          city: string | null
          country: string | null
          created_at: string | null
          device_fingerprint_hash: string | null
          email: string | null
          full_name: string | null
          id: string
          is_verified: boolean | null
          last_seen: string | null
          phone_number: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          username: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          device_fingerprint_hash?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          is_verified?: boolean | null
          last_seen?: string | null
          phone_number?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          username: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          device_fingerprint_hash?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          is_verified?: boolean | null
          last_seen?: string | null
          phone_number?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          username?: string
        }
        Relationships: []
      }
      views: {
        Row: {
          fingerprint_hash: string | null
          id: string
          listing_id: string | null
          viewed_at: string | null
          viewer_id: string | null
        }
        Insert: {
          fingerprint_hash?: string | null
          id?: string
          listing_id?: string | null
          viewed_at?: string | null
          viewer_id?: string | null
        }
        Update: {
          fingerprint_hash?: string | null
          id?: string
          listing_id?: string | null
          viewed_at?: string | null
          viewer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "views_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "views_viewer_id_fkey"
            columns: ["viewer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      listing_condition: "new" | "used"
      listing_status: "active" | "sold" | "archived"
      message_type: "text" | "image"
      notification_type:
        | "new_message"
        | "listing_viewed"
        | "offer_made"
        | "listing_favorited"
      user_role: "buyer" | "seller" | "admin"
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
      listing_condition: ["new", "used"],
      listing_status: ["active", "sold", "archived"],
      message_type: ["text", "image"],
      notification_type: [
        "new_message",
        "listing_viewed",
        "offer_made",
        "listing_favorited",
      ],
      user_role: ["buyer", "seller", "admin"],
    },
  },
} as const
