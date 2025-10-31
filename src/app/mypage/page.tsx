// src/app/mypage/page.tsx

"use client";

import { useState } from "react";

export default function MyPagePage() {
  const [activeTab, setActiveTab] = useState("account");
  const [email, setEamil] = useState("");

  const activeTabClasses =
    "inline-block rounded-t-lg border-b border-orange-600 p-4 text-orange-600 dark:text-blue-500 box-border";
  const inactiveTabClasses =
    "inline-block rounded-t-lg p-4 hover:bg-gray-50 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300 box-border";

  return (
    <div className="mt-3 flex w-full flex-col items-center justify-center rounded-lg bg-transparent p-5">
      <h1 className="mb-3 text-2xl font-bold dark:text-white">내 정보</h1>
      <ul className="flex flex-wrap border-b border-gray-200 text-center text-sm font-medium text-gray-500 dark:border-gray-700 dark:text-gray-400">
        <li className="me-2">
          <a
            href="#"
            className={
              activeTab === "account" ? activeTabClasses : inactiveTabClasses
            }
            onClick={() => setActiveTab("account")}
          >
            계정 정보
          </a>
        </li>
        <li className="me-2">
          <a
            href="#"
            className={
              activeTab === "password" ? activeTabClasses : inactiveTabClasses
            }
            onClick={() => setActiveTab("password")}
          >
            비밀번호 변경
          </a>
        </li>
        <li className="me-2">
          <a
            href="#"
            className={
              activeTab === "nexon" ? activeTabClasses : inactiveTabClasses
            }
            onClick={() => setActiveTab("nexon")}
          >
            넥슨 연동 정보
          </a>
        </li>
      </ul>
    </div>
  );
}
