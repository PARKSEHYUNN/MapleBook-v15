// src/actions/user-actions.ts

"use server";

import { createClient } from "@supabase/supabase-js";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

const supabaseService = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
);

interface ActionResult {
  success: boolean;
  error?: string;
  message?: string;
}

export async function changeEmail(
  prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const newEmail = formData.get("newEamil") as string;
  const password = formData.get("password") as string;

  const session = await auth();
  if (!session?.user?.id || !session.user.email)
    return { success: false, error: "NOT_AUTHENTICATED" };

  const userId = session.user.id;
  const oldEmail = session.user.email;

  if (!newEmail || !password)
    return { success: false, error: "MISSING_REQUIRED_FIELDS" };

  if (newEmail === oldEmail)
    return { success: false, error: "EMAIL_UNCHANGED" };

  try {
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: oldEmail,
      password: password,
    });

    if (signInError) return { success: false, error: "INVALID_PASSWORD" };

    const { error: updateAuthError } =
      await supabaseService.auth.admin.updateUserById(userId, {
        email: newEmail,
      });

    if (updateAuthError)
      return { success: false, error: "AUTH_EMAIL_CHANGE_FAILED" };

    await supabaseService
      .from("users")
      .update({ email: newEmail })
      .eq("id", userId);

    return {
      success: true,
      message: `CONFIRMATION_SENT:${newEmail}`,
    };
  } catch (error) {
    return { success: false, error: "INTERNAL_SERVER_ERROR" };
  }
}
