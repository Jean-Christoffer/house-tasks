"use client";

import { useRouter } from "next/navigation";
import { useGetAndVerifyUser } from "../lib/utils/hooks";

export default function Header() {
  const [isLoggedIn] = useGetAndVerifyUser();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };
  return (
    <header>
      <nav>
        <ul>
          <li>
            {isLoggedIn && (
              <button onClick={handleLogout} className="cursor-pointer">
                Logout
              </button>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
}
