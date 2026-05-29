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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select"

import { Input } from "@/src/components/ui/input"
import React, { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { registrationAction } from "@/src/lib/actions/authActions"
import { toast } from "sonner"
import { Controller, useForm } from "react-hook-form"
import { registerSchemaWithConfirm, RegisterSchemaWithConfirmType } from "@/src/lib/validations/authValidations"
import { zodResolver } from "@hookform/resolvers/zod";

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

export function RegisterForm({ className, ...props }: React.ComponentProps<"div">) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { register, handleSubmit, formState: { errors }, control } = useForm<RegisterSchemaWithConfirmType>({
    resolver: zodResolver(registerSchemaWithConfirm),
  });

  const onSubmit = async (data: RegisterSchemaWithConfirmType) => {
    const result = await registrationAction(data);
    if (result.success) toast.success(result.message);
    else toast.error(result.message);
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create your account</CardTitle>
          <CardDescription>
            Enter your details below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              {/* Full Name */}
              <Field>
                <FieldLabel htmlFor="name">Full Name</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  required
                  {...register("name")}
                />
              </Field>
              {errors.name && (
                <FieldDescription className="text-red-500">
                  {errors.name.message}
                </FieldDescription>
              )}

              {/* Username */}
              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input
                  id="username"
                  type="text"
                  placeholder="johndoe123"
                  required
                  {...register("userName")}
                />
              </Field>
              {errors.userName && (
                <FieldDescription className="text-red-500">
                  {errors.userName.message}
                </FieldDescription>
              )}

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
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
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

                <Field>
                  <FieldLabel htmlFor="confirm-password">
                    Confirm Password
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      {...register("confirmPassword")}
                      required
                      autoComplete="new-password"
                      className="pr-9"
                    />
                    <PasswordToggle
                      label="confirm password"
                      visible={showConfirmPassword}
                      onToggle={() =>
                        setShowConfirmPassword((prev) => !prev)
                      }
                    />
                  </div>
                </Field>
                {errors.confirmPassword && (
                  <FieldDescription className="text-red-500">
                    {errors.confirmPassword.message}
                  </FieldDescription>
                )}
              </div>
              <FieldDescription>
                Must be at least 8 characters long.
              </FieldDescription>

              {/* Role Select */}
              <Field>
                <FieldLabel htmlFor="role">Role</FieldLabel>

                <Controller
                  name="role"
                  control={control}
                  defaultValue="applicant"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="role">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="applicant">Applicant</SelectItem>
                        <SelectItem value="employee">Employee</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.role && <FieldDescription className="text-red-500">{errors.role.message}</FieldDescription>}
              </Field>

              {/* Submit */}
              <Field>
                <Button type="submit">Create Account</Button>
                <FieldDescription className="text-center">
                  Already have an account? <a href="/login">Sign in</a>
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