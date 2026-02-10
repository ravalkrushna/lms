import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

type Props = {
  title: string
  description: string
  onView: () => void
}

export default function CourseCard({
  title,
  description,
  onView,
}: Props) {
  return (
    <Card>
      <CardContent className="space-y-2 pt-6">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      </CardContent>

      <CardFooter>
        <Button size="sm" onClick={onView}>
          View Course
        </Button>
      </CardFooter>
    </Card>
  )
}
