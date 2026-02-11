import { Button } from "@/components/ui/button"
import { useCompleteLesson } from "@/lib/queries/studentLesson"

export function CompleteLessonButton({ lessonId }: { lessonId: number }) {
  const mutation = useCompleteLesson()

  return (
    <Button
      onClick={() => mutation.mutate(lessonId)}
      disabled={mutation.isPending}
    >
      {mutation.isPending ? "Completing..." : "Mark as Complete"}
    </Button>
  )
}
