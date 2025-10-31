// src/app/api/auth/register/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { v4 as uuidv4 } from "uuid";
import VerifyEmail from "@/emails/VerifyEmail";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
);

const resend = new Resend(process.env.RESEND_API_KEY);
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export async function POST(req: NextRequest) {
  console.log(`SERVICE_KEY LOADED: "${process.env.SUPABASE_SERVICE_ROLE_KEY}"`);

  try {
    const { name, email, password } = await req.json();

    // 입력값 확인
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "MISSING_REQUIRED_FIELDS" },
        { status: 400 },
      );
    }

    const supabaseService = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    // 중복된 이메일 확인
    const { data: existingUser } = await supabaseService
      .from("users")
      .select("id, register_verify")
      .eq("email", email)
      .single();

    if (existingUser) {
      if (existingUser.register_verify === null) {
        return NextResponse.json(
          { error: "EMAIL_ALREADY_IN_USE" },
          { status: 409 },
        );
      }

      // 이메일 인증이 안된 계정일 경우 계정 덮어쓰기
      const verificationToken = uuidv4();
      const expiresAt = new Date(
        Date.now() + 24 * 60 * 60 * 1000,
      ).toISOString();
      await supabaseService.auth.admin.updateUserById(existingUser.id, {
        password,
      });

      await supabaseService
        .from("users")
        .update({
          name: name,
          register_verify: verificationToken,
          register_verify_expires_at: expiresAt,
        })
        .eq("id", existingUser.id);

      // 회원가입 이메일 인증 URL 생성 및 이메일 전송
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
    }

    // 비밀번호 해싱 및 인증 UUID 생성
    const verificationToken = uuidv4();

    // Supabase Auth 계정 등록
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

    // public.users 정보 등록
    const { error: profileError } = await supabaseService.from("users").insert({
      id: authData.user.id,
      name: name,
      email: email,
      register_verify: verificationToken,
      register_verify_expires_at: new Date(
        Date.now() + 24 * 60 * 60 * 1000,
      ).toISOString(),
    });

    if (profileError) {
      console.log(profileError);
      return NextResponse.json(
        { error: "PROFILE_CREATION_FAILED" },
        { status: 500 },
      );
    }

    // 회원가입 이메일 인증 URL 생성 및 이메일 전송
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
