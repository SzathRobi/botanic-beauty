"use client";

import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { ChangeEvent } from "react";

export default function LanguageChanger() {
  const router = useRouter();
  const currentPathname = usePathname();

  return <div>helloka</div>;
}
