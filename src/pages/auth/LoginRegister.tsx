import { useState, type ReactNode } from "react"
import { Link } from "react-router-dom"
import { Home, Mail, Lock, Eye, EyeOff, Users, ShieldCheck, MessageCircle } from "lucide-react"

type Tab = "login" | "register"

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
  children: ReactNode
}

interface SocialButtonProps {
  label: string
  icon: ReactNode
  full?: boolean
}

export function LoginRegister({ initialTab = "login" }: LoginRegisterProps) {
  const [tab, setTab] = useState<Tab>(initialTab)
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)

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
                onClick={() => setTab("login")}
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
                onClick={() => setTab("register")}
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
              onSubmit={(e) => e.preventDefault()}
            >
              {tab === "register" && (
                <Field label="Full name">
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  />
                </Field>
              )}

              <Field
                label="Email address"
                icon={<Mail className="h-4 w-4 text-muted-foreground" />}
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
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
              >
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
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

              <button
                type="submit"
                className="mt-1 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(99,60,220,0.35)] transition-colors hover:from-blue-500 hover:to-purple-500"
              >
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
              <SocialButton label="Google" icon={<GoogleIcon />} />
              <SocialButton label="Facebook" icon={<FacebookIcon />} />
            </div>
            <div className="mt-3">
              <SocialButton label="Apple" icon={<AppleIcon />} full />
            </div>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              {tab === "login" ? (
                <>
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setTab("register")}
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
                    onClick={() => setTab("login")}
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

function Field({ label, icon, trailing, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div className="flex items-center gap-2.5 rounded-lg border border-border bg-muted/50 px-3.5 py-3 transition-colors focus-within:border-purple-400/60">
        {icon}
        {children}
        {trailing}
      </div>
    </div>
  )
}

function SocialButton({ label, icon, full }: SocialButtonProps) {
  return (
    <button
      type="button"
      className={`flex items-center justify-center gap-2 rounded-lg border border-border bg-muted/40 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted ${
        full ? "w-full" : ""
      }`}
    >
      {icon}
      {label}
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

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4">
      <circle cx="12" cy="12" r="12" fill="#1877F2" />
      <path
        fill="#fff"
        d="M15.1 12.9h-2v7h-2.9v-7H8.6v-2.5h1.6V8.7c0-1.6.9-3 3.4-3h2.1v2.4h-1.4c-.6 0-.8.3-.8.8v1.5h2.2l-.3 2.5z"
      />
    </svg>
  )
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M16.4 1.2c.1 1-.3 2-1 2.8-.7.8-1.8 1.4-2.8 1.3-.1-1 .4-2.1 1-2.8.7-.8 1.9-1.4 2.8-1.3zM19.9 17c-.4 1-.8 1.9-1.5 2.7-.9 1.1-1.7 1.9-2.6 1.9-.9 0-1.2-.6-2.3-.6-1.1 0-1.5.6-2.3.6-.9 0-1.6-.9-2.5-2-1.5-1.8-2.6-5.1-1.1-7.4.7-1.1 2-1.9 3.3-1.9 1 0 1.7.6 2.3.6.6 0 1.5-.7 2.7-.6.5 0 2 .2 2.9 1.6-.1.1-1.7 1-1.7 3 0 2.4 2 3.2 2 3.2z" />
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
