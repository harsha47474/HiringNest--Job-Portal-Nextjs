import { Briefcase } from "lucide-react"

import { RegisterForm } from "@/src/components/auth/register-form"

export default function RegisterPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-3 md:p-3">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Briefcase className="size-4" />
          </div>
          Hiring Nest
        </a>
        <RegisterForm />
      </div>
    </div>
  )
}
