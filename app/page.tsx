import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";
import { verifyAndGetUserServer } from "./lib/utils/clientVerification";
import Link from "next/link";

export default async function Home(request: NextRequest) {
  const user = await verifyAndGetUserServer();

  if (!user) return NextResponse.redirect(new URL("/login", request.url));
  console.log(user);

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <h1>Welcome back {user.userName}</h1>
      <Link href={`/dashboard/${user.userName}`}>Go to dashboard</Link>
    </div>
  );
}
