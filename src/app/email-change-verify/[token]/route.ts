// src/app/email-change-verify/[token]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { signOut } from "@/auth";

const supabaseService = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

async function validateChangeToken(
  token: string,
): Promise<"success" | "expired" | "invalid"> {
  try {
    const { data: user, error: findError } = await supabaseService
      .from("users")
      .select("id, new_email, email_change_expires_at")
      .eq("email_change_token", token)
      .single();

    if (findError || !user) return "invalid";
    const expiresAt = new Date(user.email_change_expires_at);
    if (new Date() > expiresAt) return "expired";

    await supabaseService.auth.admin.updateUserById(user.id, {
      email: user.new_email,
    });
    await supabaseService
      .from("users")
      .update({
        email: user.new_email,
        new_email: null,
        email_change_token: null,
        email_change_expires_at: null,
      })
      .eq("id", user.id);

    return "success";
  } catch (error) {
    return "invalid";
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { token: string } },
) {
  const { token } = params;
  const status = await validateChangeToken(token);

  const redirectUrl = new URL("/login", req.url);

  if (status === "success") {
    await signOut({ redirect: false });
    redirectUrl.searchParams.set("message", "email_changed_success");
  } else if (status === "expired") {
    redirectUrl.searchParams.set("message", "email_changed_expired");
  } else {
    redirectUrl.searchParams.set("message", "email_changed_invalid");
  }

  return NextResponse.redirect(redirectUrl);
}

export const runtime = "edge";
