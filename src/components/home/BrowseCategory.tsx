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

const TONES = [
  "bg-primary-container/20 text-primary",
  "bg-secondary-container/30 text-on-secondary-container",
  "bg-tertiary-container/30 text-tertiary",
  "bg-surface-container-high text-primary",
  "bg-primary-container/20 text-primary dark:text-primary-fixed",
  "bg-secondary-container/20 text-on-secondary-container",
  "bg-tertiary-container/20 text-tertiary",
  "bg-error-container/30 text-error",
];

function categoryIcon(category: Category): LucideIcon {
  if (!category.icon) return Grid;
  return ICON_MAP[category.icon] ?? Grid;
}

export function BrowseCategory() {
  const { data: categories } = useCategories();
  const items = (categories ?? []).slice(0, 8);

  return (
    <section
      id='categories'
      className='mx-auto w-full max-w-[1440px] scroll-mt-24 px-margin-mobile py-space-xl lg:px-margin-desktop'
    >
      <div className='mb-space-lg flex flex-col gap-4 md:flex-row md:items-end md:justify-between'>
        <div>
          <span className='font-label-caps text-label-caps tracking-wider text-primary uppercase'>
            Catalog Taxonomy
          </span>
          <h2 className='mt-1 font-headline-xl text-headline-xl font-semibold tracking-tight text-on-surface'>
            Browse High-Demand Disciplines
          </h2>
        </div>
        <Link
          to='/services'
          className='inline-flex items-center gap-2 font-body-sm text-body-sm text-primary hover:underline'
        >
          View all {(categories ?? []).length} categories
          <ArrowRight className='size-4' />
        </Link>
      </div>

      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        {items.map((category, i) => {
          const Icon = categoryIcon(category);
          return (
            <Link
              key={category.id}
              to={`/services?categoryId=${category.id}`}
              className='group flex h-44 flex-col justify-between rounded-xl bg-surface-container-low p-space-md shadow-sm transition-all hover:bg-surface-container hover:shadow-lg'
            >
              <div className='flex items-center justify-between'>
                <div
                  className={`flex size-10 items-center justify-center rounded-lg ${TONES[i % TONES.length]}`}
                >
                  <Icon className='size-6' />
                </div>
                {category.serviceCount ? (
                  <span className='rounded bg-surface-container px-2 py-0.5 font-label-numeric text-caption text-outline'>
                    {category.serviceCount.toLocaleString()}+ gigs
                  </span>
                ) : null}
              </div>
              <div>
                <h3 className='font-headline-sm text-headline-sm text-on-surface transition-colors group-hover:text-primary'>
                  {category.name}
                </h3>
                <p className='mt-1 line-clamp-1 font-caption text-caption text-on-surface-variant'>
                  {category.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}