// src/next-auth.d.ts

import "next-auth";
import { DefaultSession } from "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      mainCharacterOcid: string | null;
      nexonApiKey: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    mainCharacterOcid?: string | null;
    nexonApiKey?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    mainCharacterOcid?: string | null;
    nexonApiKey?: string | null;
  }
}
