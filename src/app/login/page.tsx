// src/app/login/page.tsx

"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [saveEmail, setSaveEmail] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem("savedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setSaveEmail(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError("이메일 또는 비밀번호가 올바르지 않습니다.");
      } else if (result?.ok) {
        if (saveEmail) localStorage.setItem("savedEmail", email);
        else localStorage.removeItem("savedEmail");

        router.push(callbackUrl);
      }
    } catch (err) {
      setError("로그인 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-3 flex w-full flex-col items-center justify-center rounded-lg bg-transparent p-5">
      <h1 className="mb-3 text-2xl font-bold dark:text-white">로그인</h1>

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

      <form
        className="flex w-[100%] flex-col justify-center md:w-[30%]"
        onSubmit={handleSubmit}
      >
        <div className="mb-3">
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

        <div className="mb-3 flex items-center">
          <input
            type="checkbox"
            id="saveemail"
            checked={saveEmail}
            onChange={(e) => setSaveEmail(e.target.checked)}
          />
          <label
            htmlFor="saveemail"
            className="ms-1 block text-sm font-medium text-gray-900 dark:text-white"
          >
            이메일 저장
          </label>
        </div>

        <button
          type="submit"
          className="me-2 mb-2 w-full cursor-pointer rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-orange-600 focus:ring-4 focus:ring-orange-300 focus:outline-none dark:bg-orange-600 dark:hover:bg-orange-700 dark:focus:ring-orange-800"
        >
          로그인
        </button>

        <Link
          href={"/register"}
          className="mt-1 mb-2 text-center text-sm text-orange-600 hover:text-orange-700"
        >
          회원가입
        </Link>
        <Link
          href={"/password"}
          className="mt-1 text-center text-sm text-orange-600 hover:text-orange-700"
        >
          비밀번호 찾기
        </Link>
      </form>
    </div>
  );
}
