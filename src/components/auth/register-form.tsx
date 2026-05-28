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
import React, { FormEvent, useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { registrationAction } from "@/src/lib/actions/authActions"
import { toast } from "sonner"


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

interface FormDetails {
  name: string
  username: string
  email: string
  password: string
  confirmPasswordd: string
  role: "applicant" | "employee"
}

export function RegisterForm({ className, ...props }: React.ComponentProps<"div">) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [formDetails, setFormDetails] = useState<FormDetails>({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPasswordd: "",
    role: "applicant",
  })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const registrationData = {
      name: formDetails.name.trim(),
      userName: formDetails.username.trim(),
      email: formDetails.email.toLowerCase().trim(),
      password: formDetails.password,
      role: formDetails.role,
    }

    if(formDetails.password !== formDetails.confirmPasswordd) {
      toast.error("Passwords do not match");
      return
    }

    const result = await registrationAction(registrationData);
    if(result.success) toast.success(result.message);
    else toast.error(result.message);
  }

  const handleInputChange = (name: keyof FormDetails, value: string) => {
    setFormDetails((prev) => ({ ...prev, [name]: value }))
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
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              {/* Full Name */}
              <Field>
                <FieldLabel htmlFor="name">Full Name</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  name="name"
                  required
                  value={formDetails.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
              </Field>

              {/* Username */}
              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input
                  id="username"
                  type="text"
                  placeholder="johndoe123"
                  name="username"
                  required
                  value={formDetails.username}
                  onChange={(e) => handleInputChange("username", e.target.value)}
                />
              </Field>

              {/* Email */}
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  name="email"
                  value={formDetails.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              </Field>

              {/* Password + Confirm Password */}
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      required
                      autoComplete="new-password"
                      value={formDetails.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      className="pr-9"
                    />
                    <PasswordToggle
                      label="password"
                      visible={showPassword}
                      onToggle={() => setShowPassword((prev) => !prev)}
                    />
                  </div>
                </Field>

                <Field>
                  <FieldLabel htmlFor="confirm-password">
                    Confirm Password
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPasswordd"
                      required
                      autoComplete="new-password"
                      value={formDetails.confirmPasswordd}
                      onChange={(e) =>
                        handleInputChange("confirmPasswordd", e.target.value)
                      }
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
              </div>
              <FieldDescription>
                Must be at least 8 characters long.
              </FieldDescription>

              {/* Role Select */}
              <Field>
                <FieldLabel htmlFor="role">Role</FieldLabel>
                <Select
                  value={formDetails.role}
                  name="role"
                  onValueChange={(value: "applicant" | "employee") =>
                    handleInputChange("role", value)
                  }
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="applicant">Applicant</SelectItem>
                    <SelectItem value="employee">Employee</SelectItem>
                  </SelectContent>
                </Select>
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