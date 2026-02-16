import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"

import { InstructorSidebar } from "@/components/InstructorSidebar"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
    getSections,
    createSection,
    type Section,
} from "@/lib/instructor"

/* ---------------- ROUTE ---------------- */

export const Route = createFileRoute(
    "/instructor/courses/$courseId/sections"
)({
    component: CourseSections,
})

function CourseSections() {
    const navigate = useNavigate()

    const { courseId } = Route.useParams()
    const queryClient = useQueryClient()

    const [isCreating, setIsCreating] = useState(false)
    const [title, setTitle] = useState("")

    /* ---------------- QUERY ---------------- */

    const { data: sections, isLoading } = useQuery<Section[]>({
        queryKey: ["instructor-sections", courseId],
        queryFn: () => getSections(Number(courseId)),
    })

    /* ---------------- CREATE SECTION ---------------- */

    const createMutation = useMutation({
        mutationFn: () =>
            createSection(Number(courseId), { title }),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["instructor-sections", courseId],
            })

            setTitle("")
            setIsCreating(false)
        },
    })

    return (
        <div className="flex min-h-screen bg-white">

            <InstructorSidebar />

            <main className="flex-1 p-6 space-y-6">

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Sections Management 📚</CardTitle>

                        <Button size="sm" onClick={() => setIsCreating(true)}>
                            Add Section +
                        </Button>
                    </CardHeader>

                    <CardContent>

                        {/* ✅ CREATE SECTION */}
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

                        {/* ✅ STATES */}
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
                                                    to: "/instructor/courses/$courseId/$sectionId/lessons",
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

            </main>
        </div>
    )
}

/* ---------------- EMPTY ---------------- */

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
