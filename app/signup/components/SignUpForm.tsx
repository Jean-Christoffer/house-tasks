"use client";

import { useState, useEffect } from "react";

import { useActionState } from "react";
import { signupAction } from "@/app/lib/actions/signup";
import { useRouter } from "next/navigation";

export default function SignUpForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const [state, formAction, pending] = useActionState(signupAction, {});

  useEffect(() => {
    if (state.ok) {
      router.push("/login");
    }
  }, [state, router]);

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <input
        type="text"
        placeholder="Username"
        id="username"
        name="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      {state.errors?.username && (
        <p className="text-sm text-red-500">{state.errors.username}</p>
      )}
      <input
        type="password"
        placeholder="Password"
        id="password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {state.errors?.password && (
        <p className="text-sm text-red-500">{state.errors.password}</p>
      )}
      {state.errors?.message && (
        <p className="text-sm text-red-500">{state.errors.message}</p>
      )}
      <button type="submit" disabled={pending}>
        Register
      </button>
    </form>
  );
}
