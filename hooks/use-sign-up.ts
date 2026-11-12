"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export type SignUpInput = {
  name: string;
  email: string;
  password: string;
  /** URL foto profil, opsional. */
  image?: string;
  /** Halaman tujuan setelah berhasil mendaftar. Default: "/". */
  callbackURL?: string;
};

export function useSignUp() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signUp({
    name,
    email,
    password,
    image,
    callbackURL = "/",
  }: SignUpInput) {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: signUpError } = await authClient.signUp.email({
        name,
        email,
        password,
        image,
      });

      if (signUpError) {
        setError(signUpError.message ?? "Pendaftaran gagal. Silakan coba lagi.");
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

  return { signUp, isLoading, error, resetError };
}
