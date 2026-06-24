/**
 * Tipos del schema `ketzal` para supabase-js.
 *
 * Escritos a mano según el DDL de las Fases 1–3 (docs/sql/phase{1,2,3}_*.sql).
 * Para regenerarlos desde la DB (requiere token Supabase):
 *   GET https://api.supabase.com/v1/projects/<ref>/types/typescript?included_schemas=ketzal
 * o con el CLI:
 *   npx supabase gen types typescript --project-id <ref> --schema ketzal
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

type Ts = string // timestamptz / ISO date string

export type Database = {
  ketzal: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string | null
          role: Database["ketzal"]["Enums"]["user_role"]
          axo_coins_earned: number
          referral_code: string | null
          supplier_id: string | null
          image: string | null
          created_at: Ts
          updated_at: Ts
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          role?: Database["ketzal"]["Enums"]["user_role"]
          axo_coins_earned?: number
          referral_code?: string | null
          supplier_id?: string | null
          image?: string | null
          created_at?: Ts
          updated_at?: Ts
        }
        Update: Partial<Database["ketzal"]["Tables"]["profiles"]["Insert"]>
        Relationships: []
      }
      suppliers: {
        Row: {
          id: string
          name: string
          contact_email: string
          phone_number: string | null
          address: string | null
          description: string | null
          img_logo: string | null
          supplier_type: string | null
          supplier_sub_type: string | null
          location: Json | null
          photos: Json | null
          extras: Json | null
          info: Json | null
          created_at: Ts
          updated_at: Ts
        }
        Insert: {
          id?: string
          name: string
          contact_email: string
          phone_number?: string | null
          address?: string | null
          description?: string | null
          img_logo?: string | null
          supplier_type?: string | null
          supplier_sub_type?: string | null
          location?: Json | null
          photos?: Json | null
          extras?: Json | null
          info?: Json | null
          created_at?: Ts
          updated_at?: Ts
        }
        Update: Partial<Database["ketzal"]["Tables"]["suppliers"]["Insert"]>
        Relationships: []
      }
      categories: {
        Row: {
          id: string
          name: string
          image: string | null
          description: string | null
          created_at: Ts
          updated_at: Ts
        }
        Insert: {
          id?: string
          name: string
          image?: string | null
          description?: string | null
          created_at?: Ts
          updated_at?: Ts
        }
        Update: Partial<Database["ketzal"]["Tables"]["categories"]["Insert"]>
        Relationships: []
      }
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          price_axo: number | null
          stock: number
          image: string | null
          images: Json | null
          category: string | null
          tags: Json | null
          specifications: Json | null
          created_at: Ts
          updated_at: Ts
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price: number
          price_axo?: number | null
          stock?: number
          image?: string | null
          images?: Json | null
          category?: string | null
          tags?: Json | null
          specifications?: Json | null
          created_at?: Ts
          updated_at?: Ts
        }
        Update: Partial<Database["ketzal"]["Tables"]["products"]["Insert"]>
        Relationships: []
      }
      services: {
        Row: {
          id: string
          supplier_id: string
          name: string
          description: string | null
          price: number
          price_axo: number | null
          location: string | null
          available_from: Ts | null
          available_to: Ts | null
          size_tour: number | null
          service_type: string | null
          service_category: string | null
          state_from: string | null
          city_from: string | null
          state_to: string | null
          city_to: string | null
          yt_link: string | null
          packs: Json | null
          images: Json | null
          includes: Json | null
          excludes: Json | null
          faqs: Json | null
          itinerary: Json | null
          dates: Json | null
          add_ons: Json | null
          seasonal_prices: Json | null
          transport_provider_id: string | null
          hotel_provider_id: string | null
          current_bookings: number
          max_capacity: number | null
          created_at: Ts
          updated_at: Ts
        }
        Insert: {
          id?: string
          supplier_id: string
          name: string
          description?: string | null
          price: number
          price_axo?: number | null
          location?: string | null
          available_from?: Ts | null
          available_to?: Ts | null
          size_tour?: number | null
          service_type?: string | null
          service_category?: string | null
          state_from?: string | null
          city_from?: string | null
          state_to?: string | null
          city_to?: string | null
          yt_link?: string | null
          packs?: Json | null
          images?: Json | null
          includes?: Json | null
          excludes?: Json | null
          faqs?: Json | null
          itinerary?: Json | null
          dates?: Json | null
          add_ons?: Json | null
          seasonal_prices?: Json | null
          transport_provider_id?: string | null
          hotel_provider_id?: string | null
          current_bookings?: number
          max_capacity?: number | null
          created_at?: Ts
          updated_at?: Ts
        }
        Update: Partial<Database["ketzal"]["Tables"]["services"]["Insert"]>
        Relationships: []
      }
      reviews: {
        Row: {
          id: string
          service_id: string
          user_id: string
          rating: number
          comment: string
          created_at: Ts
        }
        Insert: {
          id?: string
          service_id: string
          user_id: string
          rating: number
          comment: string
          created_at?: Ts
        }
        Update: Partial<Database["ketzal"]["Tables"]["reviews"]["Insert"]>
        Relationships: []
      }
      travel_planners: {
        Row: {
          id: string
          user_id: string
          name: string
          destination: string | null
          start_date: Ts | null
          end_date: Ts | null
          status: Database["ketzal"]["Enums"]["planner_status"]
          total_mxn: number
          total_axo: number
          is_public: boolean
          share_code: string | null
          created_at: Ts
          updated_at: Ts
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          destination?: string | null
          start_date?: Ts | null
          end_date?: Ts | null
          status?: Database["ketzal"]["Enums"]["planner_status"]
          total_mxn?: number
          total_axo?: number
          is_public?: boolean
          share_code?: string | null
          created_at?: Ts
          updated_at?: Ts
        }
        Update: Partial<Database["ketzal"]["Tables"]["travel_planners"]["Insert"]>
        Relationships: []
      }
      planner_items: {
        Row: {
          id: string
          planner_id: string
          service_id: string | null
          product_id: string | null
          quantity: number
          price_mxn: number
          price_axo: number | null
          selected_date: Ts | null
          notes: string | null
          created_at: Ts
        }
        Insert: {
          id?: string
          planner_id: string
          service_id?: string | null
          product_id?: string | null
          quantity?: number
          price_mxn: number
          price_axo?: number | null
          selected_date?: Ts | null
          notes?: string | null
          created_at?: Ts
        }
        Update: Partial<Database["ketzal"]["Tables"]["planner_items"]["Insert"]>
        Relationships: []
      }
      wishlists: {
        Row: {
          id: string
          user_id: string
          name: string
          is_public: boolean
          share_code: string | null
          created_at: Ts
          updated_at: Ts
        }
        Insert: {
          id?: string
          user_id: string
          name?: string
          is_public?: boolean
          share_code?: string | null
          created_at?: Ts
          updated_at?: Ts
        }
        Update: Partial<Database["ketzal"]["Tables"]["wishlists"]["Insert"]>
        Relationships: []
      }
      wishlist_items: {
        Row: {
          id: string
          wishlist_id: string
          service_id: string | null
          product_id: string | null
          price_alert: number | null
          created_at: Ts
        }
        Insert: {
          id?: string
          wishlist_id: string
          service_id?: string | null
          product_id?: string | null
          price_alert?: number | null
          created_at?: Ts
        }
        Update: Partial<Database["ketzal"]["Tables"]["wishlist_items"]["Insert"]>
        Relationships: []
      }
      wallets: {
        Row: {
          id: string
          user_id: string
          balance_mxn: number
          balance_axo: number
          created_at: Ts
          updated_at: Ts
        }
        Insert: {
          id?: string
          user_id: string
          balance_mxn?: number
          balance_axo?: number
          created_at?: Ts
          updated_at?: Ts
        }
        Update: Partial<Database["ketzal"]["Tables"]["wallets"]["Insert"]>
        Relationships: []
      }
      wallet_transactions: {
        Row: {
          id: string
          wallet_id: string
          type: Database["ketzal"]["Enums"]["wallet_txn_type"]
          amount_mxn: number | null
          amount_axo: number | null
          description: string
          reference: string | null
          created_at: Ts
        }
        Insert: {
          id?: string
          wallet_id: string
          type: Database["ketzal"]["Enums"]["wallet_txn_type"]
          amount_mxn?: number | null
          amount_axo?: number | null
          description: string
          reference?: string | null
          created_at?: Ts
        }
        Update: Partial<Database["ketzal"]["Tables"]["wallet_transactions"]["Insert"]>
        Relationships: []
      }
      payments: {
        Row: {
          id: string
          planner_id: string | null
          user_id: string
          amount_mxn: number
          amount_axo: number | null
          status: Database["ketzal"]["Enums"]["payment_status"]
          installments: number
          current_installment: number
          due_date: Ts | null
          paid_at: Ts | null
          payment_method: string | null
          transaction_id: string | null
          created_at: Ts
          updated_at: Ts
        }
        Insert: {
          id?: string
          planner_id?: string | null
          user_id: string
          amount_mxn: number
          amount_axo?: number | null
          status?: Database["ketzal"]["Enums"]["payment_status"]
          installments?: number
          current_installment?: number
          due_date?: Ts | null
          paid_at?: Ts | null
          payment_method?: string | null
          transaction_id?: string | null
          created_at?: Ts
          updated_at?: Ts
        }
        Update: Partial<Database["ketzal"]["Tables"]["payments"]["Insert"]>
        Relationships: []
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: Database["ketzal"]["Enums"]["notification_type"]
          is_read: boolean
          priority: Database["ketzal"]["Enums"]["notification_priority"]
          metadata: Json | null
          action_url: string | null
          created_at: Ts
          read_at: Ts | null
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type?: Database["ketzal"]["Enums"]["notification_type"]
          is_read?: boolean
          priority?: Database["ketzal"]["Enums"]["notification_priority"]
          metadata?: Json | null
          action_url?: string | null
          created_at?: Ts
          read_at?: Ts | null
        }
        Update: Partial<Database["ketzal"]["Tables"]["notifications"]["Insert"]>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: {
      is_superadmin: { Args: Record<string, never>; Returns: boolean }
      my_supplier_id: { Args: Record<string, never>; Returns: string | null }
    }
    Enums: {
      user_role: "user" | "admin" | "superadmin"
      payment_status: "PENDING" | "PARTIAL" | "COMPLETED" | "REFUNDED"
      planner_status:
        | "PLANNING"
        | "RESERVED"
        | "CONFIRMED"
        | "TRAVELLING"
        | "COMPLETED"
      wallet_txn_type:
        | "DEPOSIT"
        | "WITHDRAWAL"
        | "PURCHASE"
        | "REFUND"
        | "TRANSFER_SENT"
        | "TRANSFER_RECEIVED"
        | "REWARD"
      notification_type:
        | "INFO"
        | "SUCCESS"
        | "WARNING"
        | "ERROR"
        | "SUPPLIER_APPROVAL"
        | "USER_REGISTRATION"
        | "WELCOME_BONUS"
        | "WELCOME_MESSAGE"
        | "BOOKING_UPDATE"
        | "SYSTEM_UPDATE"
      notification_priority: "LOW" | "NORMAL" | "HIGH" | "URGENT"
    }
    CompositeTypes: Record<string, never>
  }
}
