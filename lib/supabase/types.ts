/**
 * Database types for the Supabase schema.
 *
 * Hand-written to match the migrations in `supabase/migrations/`. Once the
 * Supabase project exists you can regenerate this file with:
 *
 *   supabase gen types typescript --project-id <id> --schema public > lib/supabase/types.ts
 *
 * Keep it in sync with the migrations until then.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      newsletter_subscribers: {
        Row: {
          id: string;
          email: string;
          language: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          language?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          language?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      user_progress: {
        Row: {
          user_id: string;
          xp: number;
          streak: number;
          last_active: string | null;
          badges: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          xp?: number;
          streak?: number;
          last_active?: string | null;
          badges?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          xp?: number;
          streak?: number;
          last_active?: string | null;
          badges?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      lesson_completions: {
        Row: {
          id: string;
          user_id: string;
          module_slug: string;
          lesson_slug: string;
          correct: number;
          total: number;
          xp: number;
          completed_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          module_slug: string;
          lesson_slug: string;
          correct: number;
          total: number;
          xp: number;
          completed_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          module_slug?: string;
          lesson_slug?: string;
          correct?: number;
          total?: number;
          xp?: number;
          completed_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<never, never>;
    Functions: {
      subscribe_to_newsletter: {
        Args: { p_email: string; p_language?: string };
        Returns: undefined;
      };
    };
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
};
