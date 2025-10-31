// src/components/NavbarClient.tsx

"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import User from "./User";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import type { Session } from "next-auth";
import { faBars } from "@fortawesome/free-solid-svg-icons";

interface NavbarClientProps {
  session: Session | null;
}

export default function NavbarClient({ session }: NavbarClientProps) {
  const status = session ? "authenticated" : "unauthenticated";
  const user = session?.user;

  console.log(user);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const mainMenuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const pathname = usePathname();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mainMenuRef.current &&
        !mainMenuRef.current.contains(event.target as Node) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target as Node)
      )
        setIsMenuOpen(false);
    };

    if (isMenuOpen) document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const activeLinkClasses =
    "block rounded-sm bg-orange-500 px-3 py-2 text-white md:bg-transparent md:p-0 md:text-orange-600 md:dark:text-orange-500";
  const inactiveLinkClasses =
    "block rounded-sm px-3 py-2 text-gray-900 hover:bg-gray-100 md:p-0 md:hover:bg-transparent md:hover:text-orange-600 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent md:dark:hover:text-blue-500";

  return (
    <nav className="dark:gray-900 border-gray-200 bg-white">
      <div className="relative mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">
        <div className="flex">
          <Link href={"/"} className="me-5 flex items-center space-x-3">
            <Image
              src={"/logo.svg"}
              alt="MapleBook Logo"
              width={32}
              height={32}
            />
            <span className="self-center text-xl font-semibold whitespace-nowrap text-gray-900 dark:text-white">
              MapleBook
            </span>
          </Link>

          <div
            className={`absolute top-full left-0 w-full items-center justify-between md:static md:top-auto md:left-auto md:order-1 md:flex md:w-auto ${!isMenuOpen && "hidden"}`}
            ref={mainMenuRef}
          >
            <ul className="flex flex-col rounded-lg border border-gray-100 bg-gray-50 p-4 font-medium md:mt-0 md:flex-row md:space-x-4 md:border-0 md:bg-white md:p-0 dark:border-gray-700 dark:bg-gray-800 md:dark:bg-gray-900">
              <li>
                <Link
                  href={"/character"}
                  className={
                    pathname.startsWith("/character")
                      ? activeLinkClasses
                      : inactiveLinkClasses
                  }
                >
                  캐릭터 검색
                </Link>
              </li>
              <li>
                <Link
                  href={"/guild"}
                  className={
                    pathname.startsWith("/guild")
                      ? activeLinkClasses
                      : inactiveLinkClasses
                  }
                >
                  길드 검색
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="relative flex items-center space-x-3 md:order-2 md:space-x-0">
          {status === "unauthenticated" && (
            <Link href={"/login"}>
              <button
                type="button"
                className="cursor-pointer rounded-lg bg-orange-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-orange-700 focus:ring-4 focus:ring-orange-300 focus:outline-none dark:bg-orange-500 dark:hover:bg-orange-600 dark:focus:ring-orange-800"
              >
                로그인
              </button>
            </Link>
          )}
          {status === "authenticated" && user && (
            <>
              <Link href={"/mypage"}>
                <button
                  type="button"
                  className="me-1 cursor-pointer rounded-lg bg-orange-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-orange-700 focus:ring-4 focus:ring-orange-300 focus:outline-none dark:bg-orange-500 dark:hover:bg-orange-600 dark:focus:ring-orange-800"
                >
                  내 정보
                </button>
              </Link>

              <button
                type="button"
                className="cursor-pointer rounded-lg bg-orange-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-orange-700 focus:ring-4 focus:ring-orange-300 focus:outline-none dark:bg-orange-500 dark:hover:bg-orange-600 dark:focus:ring-orange-800"
                onClick={() => signOut()}
              >
                로그아웃
              </button>
              {/* <User user={user} /> */}
            </>
          )}

          <button
            type="button"
            className="foucs:outline-none foucs:ring-2 inline-flex h-10 w-10 items-center justify-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:ring-gray-200 md:hidden dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            ref={menuButtonRef}
          >
            <span className="sr-only">Open Main Menu</span>
            <FontAwesomeIcon icon={faBars} size="xl" />
          </button>
        </div>
      </div>
    </nav>
  );
}
