"use client";

import { useState, useEffect } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Eye, EyeOff, Loader2, UserPlus } from "lucide-react";

import { signupAction } from "@/app/lib/actions/signup";

export default function SignUpForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const [state, formAction, pending] = useActionState(signupAction, {});

  useEffect(() => {
    if (state?.ok) router.push("/login");
  }, [state, router]);

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-background via-muted/60 to-background">
      <div className="container mx-auto grid min-h-[100dvh] place-items-center px-4">
        <Card className="w-full max-w-md rounded-3xl border shadow-sm">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl font-bold">Opprett konto</CardTitle>
            <CardDescription>Lag en konto for å komme i gang.</CardDescription>
          </CardHeader>

          <CardContent>
            <form action={formAction} className="space-y-6" noValidate>
              <div className="grid gap-2">
                <Label htmlFor="username">Brukernavn</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  placeholder="Ditt brukernavn"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={pending}
                  aria-invalid={!!state?.errors?.username}
                  aria-describedby={
                    state?.errors?.username ? "username-error" : undefined
                  }
                />
                {state?.errors?.username && (
                  <p id="username-error" className="text-sm text-destructive">
                    {state.errors.username}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Passord</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={pending}
                    aria-invalid={!!state?.errors?.password}
                    aria-describedby={
                      state?.errors?.password ? "password-error" : undefined
                    }
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute inset-y-0 right-2 inline-flex items-center justify-center rounded-md px-2 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    aria-label={showPassword ? "Skjul passord" : "Vis passord"}
                    tabIndex={0}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {state?.errors?.password && (
                  <p id="password-error" className="text-sm text-destructive">
                    {state.errors.password}
                  </p>
                )}
              </div>

              {state?.errors?.message && (
                <div
                  id="signup-error"
                  role="alert"
                  className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                >
                  {state.errors.message}
                </div>
              )}

              <Button
                type="submit"
                className="w-full rounded-xl"
                disabled={pending}
              >
                {pending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Oppretter…
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Opprett konto
                  </>
                )}
              </Button>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Har du allerede en konto?</span>
                <Link
                  href="/login"
                  className="underline-offset-4 hover:underline"
                >
                  Logg inn
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
