import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getUserProfile,
  createUserProfile,
  getInstructorProfile,
  createInstructorProfile,
} from "@/api/profile"

export const useUserProfile = () =>
  useQuery({
    queryKey: ["user-profile"],
    queryFn: getUserProfile,
  })

export const useCreateUserProfile = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: createUserProfile,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["user-profile"] }),
  })
}

// --------------------------------------------------

export const useInstructorProfile = () =>
  useQuery({
    queryKey: ["instructor-profile"],
    queryFn: getInstructorProfile,
  })

export const useCreateInstructorProfile = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: createInstructorProfile,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["instructor-profile"] }),
  })
}
