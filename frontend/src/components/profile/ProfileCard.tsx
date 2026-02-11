import { Card, CardContent } from "@/components/ui/card"

export type Props = {
  title: string
  subtitle?: string
  extra?: string
}

export default function ProfileCard({ title, subtitle, extra }: Props) {
  return (
    <Card>
      <CardContent className="p-4 space-y-1">

        <div className="text-sm text-muted-foreground">
          Profile
        </div>

        <div className="text-lg font-semibold">
          {title}
        </div>

        {subtitle && (
          <div className="text-sm">
            {subtitle}
          </div>
        )}

        {extra && (
          <div className="text-xs text-muted-foreground">
            {extra}
          </div>
        )}

      </CardContent>
    </Card>
  )
}
