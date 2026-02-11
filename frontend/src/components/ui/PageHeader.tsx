import { ChevronRight } from "lucide-react"

type Props = {
  title: string
  breadcrumbs?: string[]
}

export function PageHeader({ title, breadcrumbs }: Props) {
  return (
    <div className="space-y-2 mb-6">

      {/* Breadcrumbs */}
      {breadcrumbs && (
        <div className="flex items-center text-xs text-muted-foreground">

          {breadcrumbs.map((crumb, index) => (
            <div key={crumb} className="flex items-center">

              {index !== 0 && (
                <ChevronRight size={14} className="mx-1" />
              )}

              <span>{crumb}</span>
            </div>
          ))}
        </div>
      )}

      {/* Title */}
      <h1 className="text-3xl font-semibold tracking-tight">
        {title}
      </h1>
    </div>
  )
}
