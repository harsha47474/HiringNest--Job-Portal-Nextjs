"use client"

import { cn } from "@/src/lib/utils"
import { Button } from "@/src/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card"

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/src/components/ui/field"

import { Input } from "@/src/components/ui/input"
import React, { FormEvent, useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { loginAction } from "@/src/lib/actions/authActions"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { loginSchema, LoginSchemaType } from "@/src/lib/validations/authValidations"
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from 'next/navigation'

function PasswordToggle({
  visible,
  onToggle,
  label,
}: {
  visible: boolean
  onToggle: () => void
  label: string
}) {
  return (
    <button
      type="button"
      tabIndex={-1}
      aria-label={visible ? `Hide ${label}` : `Show ${label}`}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onToggle}
      className="absolute inset-y-0 right-0 z-10 flex w-9 items-center justify-center rounded-r-lg text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {visible ? (
        <EyeOff className="size-4 shrink-0" aria-hidden />
      ) : (
        <Eye className="size-4 shrink-0" aria-hidden />
      )}
    </button>
  )
}

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginSchemaType) => {
    const result = await loginAction(data);
    if (result.success) {
      if (result.role === "employee") {
        router.push("/employer/dashboard");
        toast.success(result.message);
      } else {
        router.push("/applicant/dashboard");
        toast.success(result.message);
      }
    }
    else toast.error(result.message);
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Login to your account</CardTitle>
          <CardDescription>
            Enter your credentials to log in
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              {/* Email */}
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  {...register("email")}
                />
              </Field>
              {errors.email && (
                <FieldDescription className="text-red-500">
                  {errors.email.message}
                </FieldDescription>
              )}


              {/* Password + Confirm Password */}
              <div className=" gap-4">
                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Enter your password"
                      autoComplete="new-password"
                      {...register("password")}
                      className="pr-9"
                    />
                    <PasswordToggle
                      label="password"
                      visible={showPassword}
                      onToggle={() => setShowPassword((prev) => !prev)}
                    />
                  </div>
                </Field>
                {errors.password && (
                  <FieldDescription className="text-red-500">
                    {errors.password.message}
                  </FieldDescription>
                )}
              </div>

              {/* Submit */}
              <Field>
                <Button type="submit">Login</Button>
                <FieldDescription className="text-center">
                  Don't have an account? <a href="/register">Create</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}