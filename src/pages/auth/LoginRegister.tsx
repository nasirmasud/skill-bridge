import { useState, type ReactNode } from "react"
import { Link, Navigate, useNavigate } from "react-router-dom"
import { useForm, useWatch, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { AxiosError } from "axios"
import { toast } from "sonner"
import {
  Eye,
  EyeOff,
  Home,
  Laptop,
  Loader2,
  Lock,
  Mail,
  MessageCircle,
  ShieldCheck,
  TriangleAlert,
  User,
  Users,
} from "lucide-react"
import { authApi } from "@/api/auth.api"
import { useAuth } from "@/hooks/useAuth"
import { getDashboardPath, getErrorMessage } from "@/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { ErrorResponse } from "@/types/api.types"
import type { Role } from "@/types/user.types"

type Tab = "login" | "register"
type SignupRole = "CLIENT" | "FREELANCER"

const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["CLIENT", "FREELANCER"]),
})

interface FormValues {
  name: string
  email: string
  password: string
  role: SignupRole
}

const DEMO_ACCOUNTS: { role: Role; email: string }[] = [
  { role: "ADMIN", email: "admin@skillbridge.com" },
  { role: "CLIENT", email: "nusrat@example.com" },
  { role: "FREELANCER", email: "rakib@example.com" },
]

const DEMO_PASSWORD = "Password123!"

interface LoginRegisterProps {
  initialTab?: Tab
}

interface FeatureProps {
  icon: ReactNode
  title: string
  description: string
}

interface FieldProps {
  label: string
  icon?: ReactNode
  trailing?: ReactNode
  error?: string
  children: ReactNode
}

interface SocialButtonProps {
  label: string
  icon: ReactNode
  onClick: () => void
}

interface RoleOptionProps {
  selected: boolean
  onClick: () => void
  icon: ReactNode
  label: string
}

interface DemoButtonProps {
  icon: ReactNode
  role: Role
  label: string
  loading: boolean
  disabled: boolean
  onClick: () => void
}

export function LoginRegister({ initialTab = "login" }: LoginRegisterProps) {
  const [tab, setTab] = useState<Tab>(initialTab)
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [generalError, setGeneralError] = useState("")
  const [demoLoading, setDemoLoading] = useState<Role | null>(null)

  const { login, isAuthenticated, user } = useAuth()
  const navigate = useNavigate()

  const resolver: Resolver<FormValues> =
    tab === "register"
      ? (zodResolver(registerSchema) as unknown as Resolver<FormValues>)
      : (zodResolver(loginSchema) as unknown as Resolver<FormValues>)

  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver,
    defaultValues: { name: "", email: "", password: "", role: "CLIENT" },
  })

  const selectedRole = useWatch({ control, name: "role" })
  const busy = isSubmitting || demoLoading !== null

  const switchTab = (next: Tab) => {
    setTab(next)
    clearErrors()
    setGeneralError("")
  }

  const onSubmit = handleSubmit(async (values) => {
    clearErrors()
    setGeneralError("")
    try {
      const result =
        tab === "register"
          ? await authApi.register({
              name: values.name,
              email: values.email,
              password: values.password,
              role: values.role,
            })
          : await authApi.login({
              email: values.email,
              password: values.password,
            })

      login(result)
      toast.success(
        tab === "register" ? "Account created successfully" : "Welcome back!"
      )
      navigate(getDashboardPath(result.user.role), { replace: true })
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>
      const sources = axiosError.response?.data?.errorSources
      if (sources && sources.length > 0) {
        sources.forEach((source) => {
          setError(source.path as keyof FormValues, {
            message: source.message,
          })
        })
      }
      setGeneralError(getErrorMessage(error))
    }
  })

  const handleDemoLogin = async (role: Role) => {
    setDemoLoading(role)
    setGeneralError("")
    const account = DEMO_ACCOUNTS.find((entry) => entry.role === role)
    if (!account) {
      setDemoLoading(null)
      return
    }
    try {
      const result = await authApi.login({
        email: account.email,
        password: DEMO_PASSWORD,
      })
      login(result)
      toast.success(`Logged in as ${result.user.name}`)
      navigate(getDashboardPath(result.user.role), { replace: true })
    } catch (error) {
      const message = getErrorMessage(error)
      setGeneralError(message)
      toast.error(message)
    } finally {
      setDemoLoading(null)
    }
  }

  const handleSocial = (provider: "google" | "github") => {
    const role = selectedRole;
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/${provider}?role=${role}`;
  }

  if (isAuthenticated && user) {
    return <Navigate to={getDashboardPath(user.role)} replace />
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background px-4 py-12 font-sans sm:px-6">
      {/* Heading */}
      <div className="mb-8 max-w-lg text-center">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <Home className="h-4 w-4" />
          Back to home
        </Link>
        <h1 className="text-3xl font-extrabold leading-tight text-foreground sm:text-4xl">
          Welcome to{" "}
          <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            SkillBridge
          </span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          {tab === "login"
            ? "Login or create an account to get started"
            : "Create an account to get started"}
        </p>
      </div>

      {/* Card */}
      <div className="w-full max-w-4xl overflow-hidden rounded-2xl border border-purple-500/30 bg-card shadow-[0_0_60px_rgba(124,58,237,0.15)]">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left panel */}
          <div className="relative flex flex-col border-b border-border p-8 sm:p-10 md:border-b-0 md:border-r">
            <h2 className="text-2xl font-bold leading-snug text-foreground">
              Join our growing
              <br />
              freelance community
            </h2>

            <ul className="mt-8 space-y-6">
              <Feature
                icon={<Users className="h-5 w-5 text-primary" />}
                title="Find Top Talent"
                description="Connect with skilled freelancers for your project needs."
              />
              <Feature
                icon={<ShieldCheck className="h-5 w-5 text-primary" />}
                title="Secure Payments"
                description="Your payments are protected with our secure escrow system."
              />
              <Feature
                icon={<MessageCircle className="h-5 w-5 text-primary" />}
                title="24/7 Support"
                description="We're here to help you at every step of the way."
              />
            </ul>

            {/* Decorative moon / horizon */}
            <div className="relative mt-10 min-h-[160px] flex-1">
              <MoonScene className="absolute bottom-0 left-1/2 h-auto w-56 -translate-x-1/2 opacity-90" />
            </div>
          </div>

          {/* Right panel */}
          <div className="flex flex-col p-8 sm:p-10">
            {/* Tabs */}
            <div className="mb-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => switchTab("login")}
                className={`rounded-lg border py-2.5 text-sm font-semibold transition-colors ${
                  tab === "login"
                    ? "border-purple-400 bg-purple-600/20 text-foreground"
                    : "border-border bg-muted/40 text-muted-foreground hover:text-foreground"
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => switchTab("register")}
                className={`rounded-lg border py-2.5 text-sm font-semibold transition-colors ${
                  tab === "register"
                    ? "border-purple-400 bg-purple-600/20 text-foreground"
                    : "border-border bg-muted/40 text-muted-foreground hover:text-foreground"
                }`}
              >
                Register
              </button>
            </div>

            <form
              className="flex flex-col gap-5"
              onSubmit={onSubmit}
              noValidate
            >
              {/* Role selector */}
              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-foreground">
                  I want to join as
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <RoleOption
                    selected={selectedRole === "CLIENT"}
                    onClick={() =>
                      setValue("role", "CLIENT", {
                        shouldValidate: tab === "register",
                      })
                    }
                    icon={<User className="h-4 w-4" />}
                    label="Client"
                  />
                  <RoleOption
                    selected={selectedRole === "FREELANCER"}
                    onClick={() =>
                      setValue("role", "FREELANCER", {
                        shouldValidate: tab === "register",
                      })
                    }
                    icon={<Laptop className="h-4 w-4" />}
                    label="Freelancer"
                  />
                </div>
                {errors.role?.message && (
                  <p className="text-xs font-medium text-destructive">
                    {errors.role.message}
                  </p>
                )}
              </div>

              {tab === "register" && (
                <Field label="Full name" error={errors.name?.message}>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                    aria-invalid={Boolean(errors.name)}
                    {...register("name")}
                  />
                </Field>
              )}

              <Field
                label="Email address"
                icon={<Mail className="h-4 w-4 text-muted-foreground" />}
                error={errors.email?.message}
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  autoComplete="email"
                  className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  aria-invalid={Boolean(errors.email)}
                  {...register("email")}
                />
              </Field>

              <Field
                label="Password"
                icon={<Lock className="h-4 w-4 text-muted-foreground" />}
                trailing={
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                }
                error={errors.password?.message}
              >
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete={
                    tab === "register" ? "new-password" : "current-password"
                  }
                  className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  aria-invalid={Boolean(errors.password)}
                  {...register("password")}
                />
              </Field>

              {tab === "login" ? (
                <div className="-mt-1 flex items-center justify-between">
                  <label className="flex cursor-pointer select-none items-center gap-2 text-sm text-muted-foreground">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="h-4 w-4 rounded border-border bg-transparent accent-purple-500"
                    />
                    Remember me
                  </label>
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="text-sm font-medium text-primary hover:text-primary/80"
                  >
                    Forgot password?
                  </a>
                </div>
              ) : (
                <label className="-mt-1 flex cursor-pointer select-none items-start gap-2 text-sm text-muted-foreground">
                  <input
                    type="checkbox"
                    className="mt-0.5 h-4 w-4 rounded border-border bg-transparent accent-purple-500"
                  />
                  I agree to the{" "}
                  <a href="#" className="text-primary hover:text-primary/80">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-primary hover:text-primary/80">
                    Privacy Policy
                  </a>
                </label>
              )}

              {generalError && (
                <Alert variant="destructive">
                  <TriangleAlert className="text-destructive" />
                  <AlertTitle>Something went wrong</AlertTitle>
                  <AlertDescription>{generalError}</AlertDescription>
                </Alert>
              )}

              <button
                type="submit"
                disabled={busy}
                className="mt-1 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(99,60,220,0.35)] transition-colors hover:from-blue-500 hover:to-purple-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                {tab === "login" ? "Login" : "Create account"}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="whitespace-nowrap text-xs text-muted-foreground">
                or continue with
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>

            {/* Social buttons */}
            <div className="grid grid-cols-2 gap-3">
              <SocialButton
                label="Google"
                icon={<GoogleIcon />}
                onClick={() => handleSocial("google")}
              />
              <SocialButton
                label="GitHub"
                icon={<GitHubIcon />}
                onClick={() => handleSocial("github")}
              />
            </div>

            {/* Demo login */}
            <div className="mt-6">
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <span className="whitespace-nowrap text-xs text-muted-foreground">
                  Demo Login
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                <DemoButton
                  icon={<ShieldCheck className="h-4 w-4 text-primary" />}
                  role="ADMIN"
                  label="Admin"
                  loading={demoLoading === "ADMIN"}
                  disabled={busy}
                  onClick={() => handleDemoLogin("ADMIN")}
                />
                <DemoButton
                  icon={<User className="h-4 w-4 text-primary" />}
                  role="CLIENT"
                  label="Client"
                  loading={demoLoading === "CLIENT"}
                  disabled={busy}
                  onClick={() => handleDemoLogin("CLIENT")}
                />
                <DemoButton
                  icon={<Laptop className="h-4 w-4 text-primary" />}
                  role="FREELANCER"
                  label="Freelancer"
                  loading={demoLoading === "FREELANCER"}
                  disabled={busy}
                  onClick={() => handleDemoLogin("FREELANCER")}
                />
              </div>
            </div>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              {tab === "login" ? (
                <>
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => switchTab("register")}
                    className="font-medium text-primary hover:text-primary/80"
                  >
                    Register
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => switchTab("login")}
                    className="font-medium text-primary hover:text-primary/80"
                  >
                    Login
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function Feature({ icon, title, description }: FeatureProps) {
  return (
    <li className="flex items-start gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-purple-400/20 bg-purple-500/10">
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </li>
  )
}

function Field({ label, icon, trailing, error, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div
        className={`flex items-center gap-2.5 rounded-lg border bg-muted/50 px-3.5 py-3 transition-colors ${
          error
            ? "border-destructive/60"
            : "border-border focus-within:border-purple-400/60"
        }`}
      >
        {icon}
        {children}
        {trailing}
      </div>
      {error && (
        <p className="text-xs font-medium text-destructive">{error}</p>
      )}
    </div>
  )
}

function RoleOption({ selected, onClick, icon, label }: RoleOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-center gap-2 rounded-lg border py-2.5 text-sm font-semibold transition-colors ${
        selected
          ? "border-purple-400 bg-purple-600/20 text-foreground"
          : "border-border bg-muted/40 text-muted-foreground hover:text-foreground"
      }`}
    >
      {icon}
      {label}
    </button>
  )
}

function SocialButton({ label, icon, onClick }: SocialButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center gap-2 rounded-lg border border-border bg-muted/40 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
    >
      {icon}
      {label}
    </button>
  )
}

function DemoButton({
  icon,
  role,
  label,
  loading,
  disabled,
  onClick,
}: DemoButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex flex-col items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-3 transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
      aria-label={`Demo login as ${role}`}
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-purple-400/20 bg-purple-500/10">
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
        ) : (
          icon
        )}
      </span>
      <span className="text-xs font-semibold text-foreground">{label}</span>
    </button>
  )
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-4 w-4">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6 29.6 4 24 4c-7.7 0-14.4 4.4-17.7 10.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.5 0 10.4-1.9 14.2-5.1l-6.6-5.4C29.6 35.4 26.9 36 24 36c-5.2 0-9.6-3.3-11.2-8l-6.6 5.1C9.5 39.5 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.5l6.6 5.4C41.4 36 44 30.5 44 24c0-1.3-.1-2.7-.4-3.5z"
      />
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z" />
    </svg>
  )
}

function MoonScene({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 200" className={className} fill="none">
      <circle
        cx="120"
        cy="110"
        r="80"
        stroke="url(#moonRing)"
        strokeWidth="1.5"
        opacity="0.8"
      />
      <path
        d="M0 165 Q40 145 70 160 T140 150 T200 165 T240 155 V200 H0 Z"
        fill="#0c0a18"
      />
      <path
        d="M0 165 Q40 145 70 160 T140 150 T200 165 T240 155"
        stroke="#3b2a5c"
        strokeWidth="1"
        opacity="0.6"
      />
      <line
        x1="30"
        y1="185"
        x2="210"
        y2="185"
        stroke="#7c3aed"
        strokeWidth="1"
        opacity="0.4"
      />
      <circle cx="30" cy="60" r="1.5" fill="#e9d5ff" opacity="0.8" />
      <circle cx="200" cy="40" r="1.5" fill="#e9d5ff" opacity="0.7" />
      <circle cx="60" cy="30" r="1" fill="#e9d5ff" opacity="0.6" />
      <circle cx="180" cy="90" r="1" fill="#e9d5ff" opacity="0.5" />
      <defs>
        <linearGradient id="moonRing" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#c4b5fd" />
          <stop offset="100%" stopColor="#4c1d95" />
        </linearGradient>
      </defs>
    </svg>
  )
}
