// src/auth.ts

import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.mainCharacterOcid = user.mainCharacterOcid;
        token.nexonApiKey = user.nexonApiKey;
      }

      if (trigger === "update") {
        const { data: dbUser } = await supabase
          .from("users")
          .select("email, main_character_ocid, nexon_api_key")
          .eq("id", token.id)
          .single();

        if (dbUser) {
          token.email = dbUser.email;
          token.mainCharacterOcid = dbUser.main_character_ocid;
          token.nexonApiKey = dbUser.nexon_api_key;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.mainCharacterOcid = token.mainCharacterOcid as
          | string
          | null;
        session.user.nexonApiKey = token.nexonApiKey as string | null;
      }

      return session;
    },
  },
});
