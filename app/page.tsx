import { userInfo } from "./lib/actions/user";
import Link from "next/link";

import Dashboard from "./components/dashboard/Dashboard";

export default async function Home() {
  const user = await userInfo();

  if (!user)
    return (
      <main className="flex justify-center items-center">
        <Link href="/signin">Login for å se dasbordet ditt</Link>
      </main>
    );

  console.log(user);

  const tasks = user.household?.tasks;
  const household = user?.household;

  return (
    <main>
      <Dashboard
        userName={user.userName}
        userId={user.id}
        completedTasks={user.completedTasks}
        tasks={tasks}
        household={household}
      />
    </main>
  );
}
