"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export type SignInInput = {
  email: string;
  password: string;
  /** Biarkan sesi tetap aktif setelah browser ditutup. Default: true. */
  rememberMe?: boolean;
  /** Halaman tujuan setelah berhasil masuk. Default: "/". */
  callbackURL?: string;
};

export function useSignIn() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signIn({
    email,
    password,
    rememberMe = true,
    callbackURL = "/",
  }: SignInInput) {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: signInError } = await authClient.signIn.email({
        email,
        password,
        rememberMe,
      });

      if (signInError) {
        setError(signInError.message ?? "Email atau password salah.");
        return null;
      }

      router.push(callbackURL);
      router.refresh();

      return data;
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
      return null;
    } finally {
      setIsLoading(false);
    }
  }

  function resetError() {
    setError(null);
  }

  return { signIn, isLoading, error, resetError };
}
