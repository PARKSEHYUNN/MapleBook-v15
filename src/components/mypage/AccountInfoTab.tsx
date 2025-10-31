// src/components/mypage/AcccountInfoTab.tsx

"use client";

import { useFormState } from "react-dom";
import { DefaultSession } from "next-auth";
import Link from "next/link";

type User = {
  id: string;
  mainCharacterOcid: string | null;
  nexonApiKey: string | null;
} & DefaultSession["user"];

interface AccountInfoTabProps {
  user: User;
  setActiveTab: (activeTab: string) => void;
  updateSession: () => void;
}

export default function AccountInfoTab({
  user,
  setActiveTab,
  updateSession,
}: AccountInfoTabProps) {
  return (
    <div>
      <h2 className="mb-4 text-xl font-bold dark:text-white">계정 정보</h2>
      <div className="mb-4">
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
          value={user.email as string}
          className="block w-full rounded-lg border border-gray-300 bg-gray-200 p-2.5 text-sm text-gray-900 focus:border-orange-500 focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-orange-500 dark:focus:ring-orange-500"
          placeholder="example@example.com"
          disabled
        ></input>
        <button
          type="button"
          className="me-2 mt-3 mb-2 w-full cursor-pointer rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-orange-600 focus:ring-4 focus:ring-orange-300 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-orange-500 dark:bg-orange-600 dark:hover:bg-orange-700 dark:focus:ring-orange-800 dark:disabled:hover:bg-orange-600"
          onClick={() => setActiveTab("email")}
        >
          이메일 변경
        </button>
      </div>

      <div className="mb-4">
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
          value={(user.name as string) || ""}
          className="block w-full rounded-lg border border-gray-300 bg-gray-200 p-2.5 text-sm text-gray-900 focus:border-orange-500 focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-orange-500 dark:focus:ring-orange-500"
          placeholder="이름"
          disabled
        ></input>
      </div>

      <div className="mb-4">
        <label className="mb-2 block text-start text-sm font-medium text-gray-900 dark:text-white">
          비밀번호
        </label>
        <button
          type="button"
          className="me-2 mb-2 w-full cursor-pointer rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-orange-600 focus:ring-4 focus:ring-orange-300 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-orange-500 dark:bg-orange-600 dark:hover:bg-orange-700 dark:focus:ring-orange-800 dark:disabled:hover:bg-orange-600"
          onClick={() => setActiveTab("password")}
        >
          비밀번호 변경
        </button>
      </div>

      <div className="mb-4">
        <label
          htmlFor="usermaincharacter"
          className="mb-2 block text-start text-sm font-medium text-gray-900 dark:text-white"
        >
          대표 캐릭터
        </label>
        <input
          type="text"
          name="maincharacter"
          id="usermaincharacter"
          value={
            (user.mainCharacterOcid as string) || "대표 캐릭터를 설정해주세요."
          }
          className="block w-full rounded-lg border border-gray-300 bg-gray-200 p-2.5 text-sm text-gray-900 focus:border-orange-500 focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-orange-500 dark:focus:ring-orange-500"
          placeholder="대표 캐릭터"
          disabled
        ></input>
        <button
          type="button"
          className="me-2 mt-3 mb-2 w-full cursor-pointer rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-orange-600 focus:ring-4 focus:ring-orange-300 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-orange-500 dark:bg-orange-600 dark:hover:bg-orange-700 dark:focus:ring-orange-800 dark:disabled:hover:bg-orange-600"
          onClick={() => setActiveTab("nexon")}
        >
          넥슨 연동 정보
        </button>
      </div>
    </div>
  );
}
