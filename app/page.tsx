import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";
import { verifyAndGetUserServer } from "./lib/utils/clientVerification";
import Dashboard from "./components/dashboard/Dashboard";

export default async function Home(request: NextRequest) {
  const user = await verifyAndGetUserServer();

  if (!user) return NextResponse.redirect(new URL("/login", request.url));
  console.log(user);

  return (
    <main>
      <Dashboard
        userName={user.userName}
        userId={user.id}
        completedTasks={user.completedTasks}
        tasks={user.tasks}
        household={user.household}
      />
    </main>
  );
}
