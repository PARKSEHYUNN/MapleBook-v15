// src/components/WorldIcon.tsx

import Image from "next/image";
import { getWorldIconPath } from "@/utils/getIconPath";

interface WorldIconProps {
  worldName: string;
}

export default function WorldIcon({ worldName }: WorldIconProps) {
  const iconPath = getWorldIconPath(worldName);

  return (
    <Image
      src={iconPath}
      alt="Server Icon"
      width={14}
      height={14}
      unoptimized={true}
    />
  );
}
