import { useCategories } from "@/hooks/useCategories";
import type { Category } from "@/types/service.types";
import {
  ArrowRight,
  Briefcase,
  Code2,
  Grid,
  Palette,
  PenTool,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Video,
  type LucideIcon,
} from "lucide-react";
import { Link } from "react-router-dom";

const ICON_MAP: Record<string, LucideIcon> = {
  Code2,
  Palette,
  PenTool,
  TrendingUp,
  Video,
  Briefcase,
  ShieldCheck,
  Sparkles,
  Grid,
};

function categoryIcon(category: Category): LucideIcon {
  if (!category.icon) return Grid;
  return ICON_MAP[category.icon] ?? Grid;
}

export function BrowseCategory() {
  const { data: categories } = useCategories();

  return (
    <section
      id='categories'
      className='w-full scroll-mt-20 bg-background px-6 py-10 pt-60 pb-28'
    >
      <div className='mx-auto w-full rounded-2xl border border-border bg-card/50 p-6 sm:p-8'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <h2 className='text-lg font-semibold text-foreground sm:text-xl'>
            Browse by{" "}
            <span className='bg-gradient-to-r from-indigo-400 to-fuchsia-500 bg-clip-text text-transparent'>
              category
            </span>
          </h2>
          <Link
            to='/services'
            className='flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground'
          >
            View all categories
            <ArrowRight className='h-4 w-4' />
          </Link>
        </div>

        {/* Category grid */}
        <div className='mt-6 grid grid-cols-4 gap-3 sm:grid-cols-8 sm:gap-4'>
          {(categories ?? []).slice(0, 8).map((category) => {
            const Icon = categoryIcon(category);
            return (
              <Link
                key={category.id}
                to={`/services?categoryId=${category.id}`}
                className='group flex flex-col items-center gap-2.5 rounded-xl border border-transparent p-2 text-center transition-colors hover:border-border hover:bg-muted/50 sm:gap-3 sm:p-3'
              >
                <span className='flex h-11 w-11 items-center justify-center rounded-xl border border-indigo-500/40 bg-indigo-500/5 shadow-[0_0_20px_-6px_rgba(99,102,241,0.6)] transition-transform group-hover:scale-105 sm:h-14 sm:w-14'>
                  <Icon
                    className='h-5 w-5 text-indigo-600 dark:text-indigo-400 sm:h-6 sm:w-6'
                    strokeWidth={1.75}
                  />
                </span>
                <span className='text-[11px] leading-tight text-foreground sm:text-xs'>
                  {category.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
