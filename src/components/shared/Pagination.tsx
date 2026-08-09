import {
  Pagination as PaginationNav,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import type { PaginationMeta } from "@/types/api.types"
import { cn } from "@/lib/utils"

interface PaginationProps {
  meta: PaginationMeta
  onPageChange: (page: number) => void
  className?: string
}

function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const pages: (number | "...")[] = [1]

  if (current > 3) {
    pages.push("...")
  }

  for (
    let page = Math.max(2, current - 1);
    page <= Math.min(total - 1, current + 1);
    page++
  ) {
    pages.push(page)
  }

  if (current < total - 2) {
    pages.push("...")
  }

  pages.push(total)
  return pages
}

export function Pagination({
  meta,
  onPageChange,
  className,
}: PaginationProps) {
  const total = Math.max(1, Math.ceil(meta.total / meta.limit))
  const current = meta.page
  const pages = getPageNumbers(current, total)

  return (
    <PaginationNav className={cn("justify-start", className)}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            aria-disabled={current <= 1}
            className={
              current <= 1 ? "pointer-events-none opacity-50" : undefined
            }
            href="#"
            onClick={(event) => {
              event.preventDefault()
              if (current > 1) onPageChange(current - 1)
            }}
          />
        </PaginationItem>

        {pages.map((page, index) =>
          page === "..." ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <PaginationLink
                isActive={page === current}
                href="#"
                onClick={(event) => {
                  event.preventDefault()
                  if (page !== current) onPageChange(page)
                }}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        <PaginationItem>
          <PaginationNext
            aria-disabled={current >= total}
            className={
              current >= total ? "pointer-events-none opacity-50" : undefined
            }
            href="#"
            onClick={(event) => {
              event.preventDefault()
              if (current < total) onPageChange(current + 1)
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </PaginationNav>
  )
}
