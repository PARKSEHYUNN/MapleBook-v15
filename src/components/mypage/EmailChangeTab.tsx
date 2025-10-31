// src/components/mypage/EmailChangeTab.tsx

"use client";

import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { DefaultSession } from "next-auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faSpinner } from "@fortawesome/free-solid-svg-icons";

import { changeEmail } from "@/actions/user-actions";

type User = {
  id: string;
  mainCharacterOcid: string | null;
  nexonApiKey: string | null;
} & DefaultSession["user"];

interface EmailChangeTabProps {
  user: User;
  updateSession: () => void;
}

const initialState = {
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="me-2 mt-3 mb-2 w-full cursor-pointer rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-orange-600 focus:ring-4 focus:ring-orange-300 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-orange-500 dark:bg-orange-600 dark:hover:bg-orange-700 dark:focus:ring-orange-800 dark:disabled:hover:bg-orange-600"
    >
      <FontAwesomeIcon
        icon={pending ? faSpinner : faCheckCircle}
        spin={pending}
        className="mr-2"
      />
      {pending ? "변경 요청 중..." : "이메일 변경"}
    </button>
  );
}

export default function EmailChangeTab({
  user,
  updateSession,
}: EmailChangeTabProps) {
  const [formState, formAction] = useFormState(changeEmail, initialState);

  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (formState.success) {
      setNewEmail("");
      setPassword("");
    }
  }, [formState.success]);

  const getMessage = (state: typeof formState) => {
    if (state.error) {
      switch (state.error) {
        case "MISSING_REQUIRED_FIELDS":
          return { type: "error", text: "모든 필드를 입력해주세요." };
        case "INVALID_PASSWORD":
          return { type: "error", text: "현재 비밀번호가 올바르지 않습니다." };
        case "EMAIL_UNCHANGED":
          return {
            type: "error",
            text: "새 이메일이 현재 이메일과 동일합니다.",
          };
        case "AUTH_EMAIL_CHANGE_FAILED":
          return {
            type: "error",
            text: "이미 사용 중인 이메일일 수 있습니다.",
          };
        default:
          return { type: "error", text: "서버 오류가 발생했습니다." };
      }
    }
    if (state.success && state.message) {
      const newEmailAddr = state.message.split(":")[1];
      return {
        type: "success",
        text: `${newEmailAddr} 주소로 확인 이메일을 보냈습니다. 링크를 클릭하여 변경을 완료하세요.`,
      };
    }
    return null;
  };
}
