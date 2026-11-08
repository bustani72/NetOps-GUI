"use client";

import { BrandWithText } from "@/components/common/brand";
import { Button } from "@/components/tailgrids/core/button";
import { Card } from "@/components/tailgrids/core/card";
import { FieldError } from "@/components/tailgrids/core/field";
import { Input } from "@/components/tailgrids/core/input";
import { Label } from "@/components/tailgrids/core/label";
import { TextField } from "@/components/tailgrids/core/text-field";
import { login } from "@/services/api/auth";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login(email, password);
      router.replace("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login gagal");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-full items-center justify-center bg-background-gray-secondary_alt_2 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <BrandWithText />
        </div>

        <Card className="p-6">
          <h1 className="text-xl leading-7 font-semibold text-text-primary">
            Masuk
          </h1>
          <p className="mt-1 text-sm text-text-tertiary">
            Masuk ke dashboard NetOps Portal.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <TextField
              className="w-full flex-col gap-1.5"
              value={email}
              onChange={setEmail}
              required
            >
              <Label className="text-sm font-medium text-input-label-text">
                Email
              </Label>
              <Input
                type="email"
                placeholder="admin@netops.local"
                autoComplete="email"
                className="w-full px-3 py-2.5 text-sm"
              />
              <FieldError />
            </TextField>

            <TextField
              className="w-full flex-col gap-1.5"
              value={password}
              onChange={setPassword}
              required
            >
              <Label className="text-sm font-medium text-input-label-text">
                Password
              </Label>
              <Input
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full px-3 py-2.5 text-sm"
              />
              <FieldError />
            </TextField>

            {error && <p className="text-sm text-error-500">{error}</p>}

            <Button
              type="submit"
              size="lg"
              className="w-full"
              isDisabled={isSubmitting}
            >
              {isSubmitting ? "Memproses..." : "Masuk"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
