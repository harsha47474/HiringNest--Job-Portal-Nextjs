import { Briefcase } from "lucide-react"

import { LoginForm } from "@/src/components/auth/login-form"

export default function RegisterPage() {
  return (
      <div className="flex w-full max-w-sm flex-col gap-4">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Briefcase className="size-4" />
          </div>
          Hiring Nest
        </a>
        <LoginForm />
      </div>
  )
}
