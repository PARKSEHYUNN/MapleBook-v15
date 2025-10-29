// src/auth.config.ts

import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { createClient } from "@supabase/supabase-js";
import bcryptjs from "bcryptjs";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
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

        const { data: user, error } = await supabase
          .from("users")
          .select("*")
          .eq("email", email)
          .single();

        if (error || !user) {
          throw new Error("INVALID_CREDENTIALS");
        }

        if (user.register_verify !== null) {
          throw new Error("EMAIL_NOT_VERIFIED");
        }

        const isPasswordValid = await bcryptjs.compare(password, user.password);

        if (!isPasswordValid) throw new Error("INVALID_CREDENTIALS");

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
