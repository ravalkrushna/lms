import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getLesson, completeLesson } from "@/api/studentLesson"

export function useLesson(courseId: number, lessonId: number) {
  return useQuery({
    queryKey: ["lesson", lessonId],
    queryFn: () => getLesson(courseId, lessonId),
  })
}

export function useCompleteLesson() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: completeLesson,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course-detail"] })
      queryClient.invalidateQueries({ queryKey: ["lesson"] })
    },
  })
}
