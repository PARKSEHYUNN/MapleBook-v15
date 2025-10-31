// src/app/email-verify/[token]/page.tsx

import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faClock,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";

const supabaseService = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

async function validateToken(
  token: string,
): Promise<"success" | "expired" | "invalid"> {
  try {
    const { data: user, error: findError } = await supabaseService
      .from("users")
      .select("id, register_verify_expires_at")
      .eq("register_verify", token)
      .single();

    if (findError || !user) {
      return "invalid";
    }

    const expiresAt = new Date(user.register_verify_expires_at);
    if (new Date() > expiresAt) {
      return "expired";
    }

    const { error: updateProfileError } = await supabaseService
      .from("users")
      .update({
        register_verify: null,
        register_verify_expires_at: null,
      })
      .eq("id", user.id);

    if (updateProfileError) throw updateProfileError;

    const { error: updateAuthError } =
      await supabaseService.auth.admin.updateUserById(user.id, {
        email_confirm: true,
      });

    if (updateAuthError) throw updateAuthError;

    return "success";
  } catch (error) {
    return "invalid";
  }
}

export default async function EmailVerifyPage({
  params,
}: {
  params: { token: string };
}) {
  const { token } = params;
  const status = await validateToken(token);

  return (
    <div className="mt-3 flex w-full flex-col items-center justify-center rounded-lg bg-transparent p-5">
      <div className="w-full max-w-md rounded-2xl bg-white p-10 shadow-xl dark:bg-gray-800">
        {status === "success" && (
          <>
            <FontAwesomeIcon
              icon={faCheckCircle}
              className="mb-4 text-6xl text-green-500"
            />
            <h1 className="mb-3 text-2xl font-bold dark:text-white">
              인증 성공
            </h1>
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              {"회원가입이 완료되었습니다."}
              <br></br>
              {"이제 로그인하여 서비스를 사용하실수 있습니다."}
            </p>
          </>
        )}

        {status === "expired" && (
          <>
            <FontAwesomeIcon
              icon={faClock}
              className="mb-4 text-6xl text-yellow-500"
            />
            <h1 className="mb-3 text-2xl font-bold dark:text-white">
              인증 만료
            </h1>
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              {"인증 링크가 만료되었습니다."}
              <br></br>
              {"회원가입 페이지에서 동일한 이메일로 다시 가입을 시도하면"}
              <br></br>
              {"인증 이메일이 재발송 됩니다."}
            </p>
          </>
        )}

        {status === "invalid" && (
          <>
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              className="mb-4 text-6xl text-red-500"
            />
            <h1 className="mb-3 text-2xl font-bold dark:text-white">
              인증 실패
            </h1>
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              {"잘못되었거나 이미 사용된 인증 링크입니다."}
              <br></br>
              {"문제가 지속되면 다시 회원가입을 진행해주세요."}
            </p>
          </>
        )}

        <Link
          href={"/login"}
          className="mt-1 mb-2 text-center text-sm text-orange-600 hover:text-orange-700"
        >
          로그인 페이지로
        </Link>
      </div>
    </div>
  );
}

export const runtime = "edge";
