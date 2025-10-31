// src/actions/user-actions.ts

"use server";

import { createClient } from "@supabase/supabase-js";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

const supabaseService = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);
