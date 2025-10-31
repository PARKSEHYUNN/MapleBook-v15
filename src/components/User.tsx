// src/components/User.tsx

"use client";

import { useState, useEffect, useRef } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

import { DefaultSession } from "next-auth";

interface UserClientProps {
  user: {
    id: string;
    mainCharacterOcid: string | null;
    nexonApiKey: string | null;
  } & DefaultSession["user"];
}

export default function User({ user }: UserClientProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      )
        setIsUserMenuOpen(false);
    };

    if (isUserMenuOpen)
      document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserMenuOpen]);

  return (
    <div ref={userMenuRef} className="items-cetner flex gap-2">
      <button
        type="button"
        id="user-button"
        className="flex h-8 w-8 overflow-hidden rounded-full bg-gray-800 text-sm focus:ring-4 focus:ring-gray-300 md:me-0 dark:focus:ring-gray-600"
        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
      >
        <span className="sr-only">Open user menu</span>
        <Image
          src={}
          alt="Character Image"
          width={32}
          height={32}
          className="translate-x-0.5 translate-y-0 scale-[3.5] rounded-full bg-white"
          unoptimized={true}
        />
      </button>
    </div>
  );
}
