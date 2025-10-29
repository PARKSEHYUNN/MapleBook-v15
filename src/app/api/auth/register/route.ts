// src/app/api/auth/register/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import bcryptjs from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import VerifyEmail from "@/emails/VerifyEmail";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const resend = new Resend(process.env.RESEND_API_KEY);
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "MISSING_REQUIRED_FIELDS" },
        { status: 400 },
      );
    }

    const { data: existingUser, error: existingError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: "EMAIL_ALREADY_IN_USE" },
        { status: 409 },
      );
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const verificationToken = uuidv4();

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (authError || !authData.user) {
      return NextResponse.json(
        { error: "AUTH_SIGNUP_FAILED" },
        { status: 500 },
      );
    }

    const { error: profileError } = await supabase.from("users").insert({
      id: authData.user.id,
      name: name,
      email: email,
      password: hashedPassword,
      register_verify: verificationToken,
    });

    if (profileError) {
      return NextResponse.json(
        { error: "PROFILE_CREATION_FAILED" },
        { status: 500 },
      );
    }

    const validationLink = `${baseUrl}/email-verify/${verificationToken}`;

    await resend.emails.send({
      from: "noreply@maplebook.site",
      to: email,
      subject: "MapleBook 회원가입을 완료해주세요.",
      react: VerifyEmail({ name, validationLink }),
    });

    return NextResponse.json(
      { message: "REGISTRATION_SUCCESS" },
      { status: 201 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "INTERNAL_SERVER_ERROR" },
      { status: 500 },
    );
  }
}

// export const runtime = "edge";
