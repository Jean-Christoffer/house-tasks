import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";
import { verifyAndGetUserServer } from "./lib/utils/clientVerification";
import Task from "./components/Task";

export default async function Home(request: NextRequest) {
  const user = await verifyAndGetUserServer();

  if (!user) return NextResponse.redirect(new URL("/login", request.url));
  console.log(user);

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main>
        <h1 className="text-7xl">Welcome back {user.userName}</h1>
        <div className="flex align-center">
          <h2 className="mr-1 text-2xl">House hold:</h2>
          {user.household.map((house) => (
            <p key={house.id}>{house.houseName}</p>
          ))}
        </div>
        <h3 className="text-4xl">Tasks completed: {user.completedTasks}</h3>
      </main>
    </div>
  );
}
