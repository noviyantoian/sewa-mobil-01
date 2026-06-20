"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LockSimple } from "@phosphor-icons/react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Input";
import { Logo } from "@/components/layout/Logo";
import { useT } from "@/lib/i18n/I18nProvider";

function LoginForm() {
  const t = useT();
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (authError) {
      setError(t("admin.loginError"));
      setLoading(false);
      return;
    }
    router.replace(params.get("redirect") ?? "/admin");
    router.refresh();
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-surface-dark)] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo dark />
        </div>
        <form
          onSubmit={submit}
          className="flex flex-col gap-5 rounded-[16px] bg-[var(--color-canvas)] p-7 shadow-xl"
        >
          <div className="flex flex-col gap-1">
            <h1 className="text-[22px] font-bold tracking-[-0.02em] text-[var(--color-ink)]">
              {t("admin.loginTitle")}
            </h1>
            <p className="text-[14px] text-[var(--color-body-mid)]">{t("admin.loginSubtitle")}</p>
          </div>

          <Field label={t("admin.loginEmail")} htmlFor="email">
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              placeholder="admin@folkadrive.local"
            />
          </Field>

          <Field label={t("admin.loginPassword")} htmlFor="password">
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </Field>

          {error && (
            <p className="rounded-[10px] bg-[var(--color-error-soft)] px-3 py-2 text-[13px] font-semibold text-[var(--color-error)]">
              {error}
            </p>
          )}

          <Button type="submit" variant="primary" size="lg" className="w-full" loading={loading}>
            <LockSimple size={17} weight="bold" />
            {t("admin.loginButton")}
          </Button>
        </form>
      </div>
    </main>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--color-surface-dark)]" />}>
      <LoginForm />
    </Suspense>
  );
}
