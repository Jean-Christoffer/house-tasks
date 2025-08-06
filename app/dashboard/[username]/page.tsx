import { verifyAndGetUserServer } from "@/app/lib/utils/clientVerification";

export default async function Dashboard({
  params,
}: {
  params: { username: string };
}) {
  const { username } = params;
  const user = await verifyAndGetUserServer();

  if (!user) return <div>No user found</div>;

  return (
    <main className="">
      <h1>{user.userName}</h1>
      <p>completed tasks: {user.completedTasks}</p>
      <p>Your househould: </p>
    </main>
  );
}
