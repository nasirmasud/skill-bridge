import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePageTitle } from "@/hooks/usePageTitle"

function Number404() {
  return (
    <span className="bg-clip-text text-[12rem] font-extrabold leading-[0.8] tracking-tight text-transparent sm:text-[16rem] lg:text-[20rem] [-webkit-text-stroke:2px_rgba(167,139,250,0.6)] [background-image:linear-gradient(180deg,rgba(139,92,246,0.25),rgba(30,10,50,0.08))] dark:[background-image:linear-gradient(180deg,rgba(88,28,135,0.35),rgba(30,10,50,0.15))]">
      4
    </span>
  )
}

export default function NotFound() {
  usePageTitle("Page Not Found")
  return (
    <main className="relative flex min-h-[80vh] w-full flex-col items-center justify-center overflow-hidden bg-background px-6 py-16">
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[120px]" />

      <div className="relative z-10 flex w-full max-w-5xl flex-col items-center space-y-10 text-center">
        <div className="relative flex w-full select-none items-center justify-center leading-none">
          <Number404 />

          <div className="relative -mx-6">
            <span className="block bg-clip-text text-[12rem] font-extrabold leading-[0.8] tracking-tight text-transparent sm:text-[16rem] lg:text-[20rem] [-webkit-text-stroke:2px_rgba(167,139,250,0.6)] [background-image:linear-gradient(180deg,rgba(139,92,246,0.25),rgba(30,10,50,0.08))] dark:[background-image:linear-gradient(180deg,rgba(88,28,135,0.35),rgba(30,10,50,0.15))]">
              0
            </span>
          </div>

          <Number404 />
        </div>

        <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
          Oops! Page not found
        </h1>
        <p className="max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
          The page you're looking for doesn't exist or has been moved. Let's get
          you back on track.
        </p>

        <Button asChild className="rounded-lg px-6">
          <Link to="/">
            <ArrowLeft className="size-4" />
            Back to Home
          </Link>
        </Button>
      </div>
    </main>
  )
}
