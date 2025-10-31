// src/auth.config.ts

import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
);

export const authConfig = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials.email || !credentials.password) return null;

        const email = credentials.email as string;
        const password = credentials.password as string;

        console.log(email, password);

        const { data: authData, error: authError } =
          await supabase.auth.signInWithPassword({
            email: email,
            password: password,
          });

        if (authError) {
          return null;
        }

        const supabaseService = createClient(
          process.env.SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!,
        );

        const { data: user, error: profileError } = await supabaseService
          .from("users")
          .select("*")
          .eq("id", authData.user.id)
          .single();

        if (profileError || !user) {
          return null;
        }

        if (user.register_verify !== null) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          mainCharacterOcid: user.main_character_ocid,
          nexonApiKey: user.nexon_api_key,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
} satisfies NextAuthConfig;
