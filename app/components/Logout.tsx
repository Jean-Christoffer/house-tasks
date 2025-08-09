"use client";

import { useRouter } from "next/navigation";
import { useGetAndVerifyUser } from "../lib/utils/hooks";

export default function Logout() {
  const [isLoggedIn] = useGetAndVerifyUser();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };
  if (!isLoggedIn) return null;
  return (
    <button onClick={handleLogout} className="cursor-pointer font-bold my-2">
      Logout
    </button>
  );
}
