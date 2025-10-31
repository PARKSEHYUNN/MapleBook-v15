// src/app/mypage/page.tsx

"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

import AccountInfoTab from "@/components/mypage/AccountInfoTab";
import EmailChangeTab from "@/components/mypage/EmailChangeTab";

export default function MyPagePage() {
  const [activeTab, setActiveTab] = useState("account");

  const { data: session, status, update: updateSession } = useSession();

  const activeTabClasses =
    "inline-block border-b-2 border-orange-600 p-4 text-orange-600 dark:text-orange-500 rounded-t-lg";
  const inactiveTabClasses =
    "inline-block p-4 border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 rounded-t-lg";

  if (status === "loading") {
    return (
      <div className="mt-3 flex w-full justify-center p-5">
        <h1 className="text-2xl font-bold dark:text-white">
          <FontAwesomeIcon icon={faSpinner} spin />
          로딩 중...
        </h1>
      </div>
    );
  }

  if (status === "unauthenticated" || !session) {
    return (
      <div className="mt-3 flex w-full justify-center p-5">
        <h1 className="text-2xl font-bold dark:text-white">
          접근 권한이 없습니다.
        </h1>
      </div>
    );
  }

  return (
    <div className="mt-3 flex w-full flex-col items-center justify-center rounded-lg bg-transparent p-5">
      <h1 className="mb-3 text-2xl font-bold dark:text-white">내 정보</h1>

      <div className="mb-4 w-full border-b border-gray-200 md:w-[60%] dark:border-gray-700">
        <ul className="-mb-px flex flex-wrap justify-center text-center text-sm font-medium text-gray-500 dark:text-gray-400">
          <li className="me-2">
            <button
              type="button"
              className={
                activeTab === "account" ? activeTabClasses : inactiveTabClasses
              }
              onClick={() => setActiveTab("account")}
            >
              계정 정보
            </button>
          </li>
          <li className="me-2">
            <button
              type="button"
              className={
                activeTab === "email" ? activeTabClasses : inactiveTabClasses
              }
              onClick={() => setActiveTab("email")}
            >
              이메일 변경
            </button>
          </li>
          <li className="me-2">
            <button
              type="button"
              className={
                activeTab === "password" ? activeTabClasses : inactiveTabClasses
              }
              onClick={() => setActiveTab("password")}
            >
              비밀번호 변경
            </button>
          </li>
          <li className="me-2">
            <button
              type="button"
              className={
                activeTab === "nexon" ? activeTabClasses : inactiveTabClasses
              }
              onClick={() => setActiveTab("nexon")}
            >
              넥슨 연동 정보
            </button>
          </li>
        </ul>
      </div>

      <div className="w-full p-4 md:w-[60%]">
        {activeTab === "account" && (
          <AccountInfoTab
            user={session.user}
            setActiveTab={setActiveTab}
            updateSession={updateSession}
          />
        )}

        {activeTab === "email" && (
          <EmailChangeTab user={session.user} updateSession={updateSession} />
        )}
      </div>
    </div>
  );
}
