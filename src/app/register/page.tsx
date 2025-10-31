// src/app/register/page.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { checkPasswordStrength } from "@/utils/passwordStrength";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTriangleExclamation,
  faCheckCircle,
  faSpinner,
  faAddressCard,
} from "@fortawesome/free-solid-svg-icons";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRetype, setPasswordRetype] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const strength = checkPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    setPasswordError(false);

    if (password !== passwordRetype) {
      setError("비밀번호가 일치하지 않습니다.");
      setPasswordError(true);
      setLoading(false);
      return;
    }

    if (strength.level === "Low") {
      setError("비밀번호가 너무 약합니다. '보통' 이상으로 설정해주세요.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        switch (data.error) {
          case "MISSING_REQUIRED_FIELDS":
            setError("이름, 이메일, 비밀번호는 필수입니다.");
            break;
          case "EMAIL_ALREADY_IN_USE":
            setError("이미 사용 중인 이메일입니다.");
            break;
          case "AUTH_SIGNUP_FAILED":
            setError("회원가입 처리 중 오류가 발생했습니다.");
            break;
          case "PROFILE_CREATION_FAILED":
            setError("프로필 저장 중 오류가 발생했습니다.");
            break;
          case "INTERNAL_SERVER_ERROR":
          default:
            setError("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
            break;
        }
      } else {
        setSuccess(
          "회원가입 요청이 성공했습니다. 이메일을 확인하여 인증을 완료해주세요.",
        );

        setEmail("");
        setName("");
        setPassword("");
        setPasswordRetype("");
      }
    } catch (err) {
      setError("네트워크 연결을 확인해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-3 flex w-full flex-col items-center justify-center rounded-lg bg-transparent p-5">
      <h1 className="mb-3 text-2xl font-bold dark:text-white">회원가입</h1>
      {error && (
        <span className="mb-3 flex items-center rounded-lg bg-red-600 ps-5 pe-5 pt-2.5 pb-2.5 text-sm text-white">
          <FontAwesomeIcon
            icon={faTriangleExclamation}
            size="sm"
            className="me-1"
          />
          {error}
        </span>
      )}

      {success && (
        <span className="mb-3 flex items-center rounded-lg bg-green-600 ps-5 pe-5 pt-2.5 pb-2.5 text-sm text-white">
          <FontAwesomeIcon icon={faCheckCircle} size="sm" className="me-1" />
          {success}
        </span>
      )}
      <form
        className="flex w-[100%] flex-col justify-center md:w-[30%]"
        onSubmit={handleSubmit}
      >
        <div className="mb-5">
          <label
            htmlFor="useremail"
            className="mb-2 block text-start text-sm font-medium text-gray-900 dark:text-white"
          >
            이메일
          </label>
          <input
            type="text"
            name="email"
            id="useremail"
            value={email}
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-orange-500 focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-orange-500 dark:focus:ring-orange-500"
            placeholder="example@example.com"
            onChange={(e) => setEmail(e.target.value)}
            required
          ></input>
        </div>

        <div className="mb-3">
          <label
            htmlFor="username"
            className="mb-2 block text-start text-sm font-medium text-gray-900 dark:text-white"
          >
            이름
          </label>
          <input
            type="text"
            name="name"
            id="username"
            value={name}
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-orange-500 focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-orange-500 dark:focus:ring-orange-500"
            placeholder="이름"
            onChange={(e) => setName(e.target.value)}
            required
          ></input>
        </div>

        <div className="mb-5">
          <label
            htmlFor="userpassword"
            className="mb-2 block text-start text-sm font-medium text-gray-900 dark:text-white"
          >
            비밀번호
          </label>
          <input
            type="password"
            name="passowrd"
            id="userpassword"
            value={password}
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-orange-500 focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-orange-500 dark:focus:ring-orange-500"
            placeholder="비밀번호"
            onChange={(e) => setPassword(e.target.value)}
            required
          ></input>
        </div>

        <div className="mb-5 flex flex-col">
          <div className="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className={`${
                strength.level === "Low"
                  ? "bg-red-500"
                  : strength.level === "Medium"
                    ? "bg-orange-500"
                    : "bg-green-500"
              } flex h-2.5 rounded-full`}
              style={{
                width: `${strength.score}%`,
              }}
            ></div>
          </div>

          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            비밀번호 보안:{" "}
            <span
              className={`${
                strength.level === "Low"
                  ? "text-red-500"
                  : strength.level === "Medium"
                    ? "text-orange-500"
                    : "text-green-500"
              }`}
            >
              {`${
                strength.level === "Low"
                  ? "낮음"
                  : strength.level === "Medium"
                    ? "보통"
                    : "강함"
              }`}
            </span>
          </span>
          <span className="text-start text-sm text-gray-900 dark:text-white">
            · 보안 <span className="text-orange-500">보통</span> 이상
          </span>
          <span className="text-start text-sm text-gray-900 dark:text-white">
            · 길이 8자리 이상, 64자리 이하
          </span>
        </div>

        <div className="mb-2">
          <label
            htmlFor="userpasswordretype"
            className="mb-2 block text-start text-sm font-medium text-gray-900 dark:text-white"
          >
            비밀번호 재입력
          </label>
          <input
            type="password"
            name="passowrd-retype"
            id="userpasswordretype"
            value={passwordRetype}
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-orange-500 focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-orange-500 dark:focus:ring-orange-500"
            placeholder="비밀번호 재입력"
            onChange={(e) => setPasswordRetype(e.target.value)}
            onBlur={() => {
              if (password !== passwordRetype) {
                setPasswordError(true);
              } else {
                setPasswordError(false);
              }
            }}
            required
          ></input>
        </div>

        <div className="mb-5">
          <span
            className={`text-sm font-semibold text-red-500 ${
              !passwordError && "hidden"
            }`}
          >
            비밀번호가 일치하지 않습니다.
          </span>
        </div>

        <button
          type="submit"
          disabled={loading || !!success}
          className="me-2 mb-2 w-full cursor-pointer rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-orange-600 focus:ring-4 focus:ring-orange-300 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-orange-500 dark:bg-orange-600 dark:hover:bg-orange-700 dark:focus:ring-orange-800 dark:disabled:hover:bg-orange-600"
        >
          <FontAwesomeIcon
            icon={loading ? faSpinner : faAddressCard}
            spin={loading}
            className="me-1"
          />
          {loading ? "로딩 중" : "회원가입"}
        </button>
        <Link
          href={"/login"}
          className="mt-1 mb-2 text-center text-sm text-orange-600 hover:text-orange-700"
        >
          돌아가기
        </Link>
      </form>
    </div>
  );
}
