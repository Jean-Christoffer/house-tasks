import { userInfo } from "./lib/actions/user";
import Link from "next/link";

import Dashboard from "./components/dashboard/Dashboard";

export default async function Home() {
  const user = await userInfo();

  if (!user)
    return (
      <main className="flex justify-center items-center text-6xl">
        <Link href="/signin">Login for å se dasbordet ditt</Link>
      </main>
    );

  const household = user?.household;

  const tasks = household?.tasks ?? [];

  console.log(user);

  return (
    <main>
      <Dashboard
        userName={user.userName}
        avatar={user.avatar}
        userId={user.id}
        completedTasks={user.completedTasks}
        tasks={tasks}
        household={household}
      />
    </main>
  );
}
