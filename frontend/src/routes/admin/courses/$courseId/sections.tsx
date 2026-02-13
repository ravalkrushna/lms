import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
    getCourseSections,
    createSection,
    type Section,
} from "@/lib/admin"

export const Route = createFileRoute(
    "/admin/courses/$courseId/sections"
)({
    component: CourseSections,
})

function CourseSections() {

    const navigate = useNavigate();

    const { courseId } = Route.useParams()
    const queryClient = useQueryClient()

    const [isCreating, setIsCreating] = useState(false)
    const [title, setTitle] = useState("")

    const { data: sections, isLoading } = useQuery<Section[]>({
        queryKey: ["course-sections", courseId],
        queryFn: () => getCourseSections(Number(courseId)),
        refetchOnWindowFocus: false,
    })

    const createMutation = useMutation({
        mutationFn: () =>
            createSection(Number(courseId), title),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["course-sections", courseId],
            })

            setTitle("")
            setIsCreating(false)
        },
    })

    return (
        <div className="space-y-6">

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Sections Management 📚</CardTitle>

                    <Button size="sm" onClick={() => setIsCreating(true)}>
                        Add Section +
                    </Button>
                </CardHeader>

                <CardContent>

                    {/* ✅ CREATE SECTION FORM */}
                    {isCreating && (
                        <div className="p-4 border rounded-md bg-muted/40 space-y-3 mb-4">

                            <Input
                                placeholder="Section title..."
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />

                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    onClick={() => createMutation.mutate()}
                                    disabled={!title.trim()}
                                >
                                    Save Section
                                </Button>

                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setIsCreating(false)}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    )}

                    {isLoading && (
                        <p className="text-sm text-muted-foreground">
                            Loading sections...
                        </p>
                    )}

                    {!isLoading && (!sections || sections.length === 0) && (
                        <EmptyState />
                    )}

                    {!isLoading && sections && (
                        <div className="space-y-3">

                            {sections.map((section) => (
                                <div
                                    key={section.id}
                                    className="p-3 border rounded-md flex justify-between items-center"
                                >
                                    <span className="text-sm font-medium">
                                        {section.title}
                                    </span>

                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() =>
                                            navigate({
                                                to: "/admin/courses/$courseId/$sectionId/lessons",
                                                params: {
                                                    courseId,
                                                    sectionId: String(section.id),
                                                },
                                            })
                                        }
                                    >
                                        Lessons →
                                    </Button>

                                </div>
                            ))}

                        </div>
                    )}

                </CardContent>
            </Card>

        </div>
    )
}

function EmptyState() {
    return (
        <div className="text-center py-10 text-muted-foreground">
            <div>No sections yet</div>
            <div className="text-sm">
                Add your first section 🚀
            </div>
        </div>
    )
}
