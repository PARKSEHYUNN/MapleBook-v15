// src/actions/user-actions.ts

"use server";

import { createClient } from "@supabase/supabase-js";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import { v4 as uuidv4 } from "uuid";
import ChangeEmail from "@/emails/ChangeEmail";

const supabaseService = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
);

const resend = new Resend(process.env.RESEND_API_KEY);
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

interface ActionResult {
  success: boolean;
  error?: string;
  message?: string;
}

export async function changeEmail(
  prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const newEmail = formData.get("newEmail") as string;
  const password = formData.get("password") as string;

  const session = await auth();
  if (!session?.user?.id || !session.user.email)
    return { success: false, error: "NOT_AUTHENTICATED" };

  const userId = session.user.id;
  const oldEmail = session.user.email;

  console.log(newEmail, password);

  if (!newEmail || !password)
    return { success: false, error: "MISSING_REQUIRED_FIELDS" };

  if (newEmail === oldEmail)
    return { success: false, error: "EMAIL_UNCHANGED" };

  try {
    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString();

    await supabaseService
      .from("users")
      .update({
        new_email: newEmail,
        email_change_token: token,
        email_change_expires_at: expiresAt,
      })
      .eq("id", userId);

    const validationLink = `${baseUrl}/email-change-verify/${token}`;

    await resend.emails.send({
      from: "noreply@maplebook.site",
      to: newEmail,
      subject: "MapleBook 이메일 주소 변경 인증",
      react: ChangeEmail({
        name: session.user.name || "사용자",
        validationLink,
      }),
    });

    return {
      success: true,
      message: `CONFIRMATION_SENT:${newEmail}`,
    };

    // const { error: signInError } = await supabase.auth.signInWithPassword({
    //   email: oldEmail,
    //   password: password,
    // });

    // if (signInError) return { success: false, error: "INVALID_PASSWORD" };

    // const { error: updateAuthError } =
    //   await supabaseService.auth.admin.updateUserById(userId, {
    //     email: newEmail,
    //   });

    // if (updateAuthError)
    //   return { success: false, error: "AUTH_EMAIL_CHANGE_FAILED" };

    // await supabaseService
    //   .from("users")
    //   .update({ email: newEmail })
    //   .eq("id", userId);

    // return {
    //   success: true,
    //   message: `CONFIRMATION_SENT:${newEmail}`,
    // };
  } catch (error) {
    return { success: false, error: "INTERNAL_SERVER_ERROR" };
  }
}
