import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Search, RefreshCw } from "lucide-react"

import { HigherupsSidebar } from "@/components/HigherupsSidebar"
import { getUsersByRole, type User } from "@/lib/higherups"

export const Route = createFileRoute("/higherups/students/")({
  validateSearch: (search) => ({
    q: typeof search.q === "string" ? search.q : "",
  }),
  component: AdminStudents,
})

function AdminStudents() {
  const navigate = useNavigate()
  const search = Route.useSearch()

  const q = typeof search.q === "string" ? search.q : ""

  const { data: students, isLoading, refetch, isFetching } = useQuery<User[]>({
    queryKey: ["students"],
    queryFn: () => getUsersByRole("STUDENT"),
  })

  const filtered = useMemo(() => {
    if (!students) return []

    return students.filter((s) =>
      s.name.toLowerCase().includes(q.toLowerCase()) ||
      s.email.toLowerCase().includes(q.toLowerCase())
    )
  }, [students, q])

  function updateSearch(value: string) {
  navigate({
    to: "/higherups/students",
    search: (prev) => ({
      ...prev,
      q: value,
    }),
    replace: true,
  })
}

  function UserAvatar({ name }: { name: string }) {
    const initials = name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase()

    return (
      <Avatar className="h-8 w-8">
        <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
          {initials}
        </AvatarFallback>
      </Avatar>
    )
  }

  return (
    <div className="flex min-h-screen">
      <HigherupsSidebar />

      <main className="flex-1 p-6 bg-muted/30 space-y-6">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Students</h1>
            <p className="text-muted-foreground text-sm">
              All registered students
            </p>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw
              size={15}
              className={isFetching ? "animate-spin" : ""}
            />
          </Button>
        </div>

        <Card>
          <CardHeader>

            <CardTitle>Student List</CardTitle>
            <CardDescription>
              {isLoading ? "Loading..." : `Showing ${filtered.length} students`}
            </CardDescription>

            <div className="relative mt-3">
              <Search
                size={15}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                placeholder="Search student..."
                className="pl-8 w-64 h-9"
                value={q}
                onChange={(e) => updateSearch(e.target.value)}
              />
            </div>

          </CardHeader>

          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Student</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="pr-6 text-right">ID</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading &&
                  [...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell className="pl-6">
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-48" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-10 ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))}

                {!isLoading &&
                  filtered.map((student) => (
                    <TableRow
                      key={student.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() =>
                        navigate({
                          to: "/higherups/students/$studentId",
                          params: { studentId: String(student.id) },
                        })
                      }
                    >
                      <TableCell className="pl-6">
                        <div className="flex items-center gap-3">
                          <UserAvatar name={student.name} />
                          <span className="font-medium">{student.name}</span>
                        </div>
                      </TableCell>

                      <TableCell className="text-muted-foreground">
                        {student.email}
                      </TableCell>

                      <TableCell className="pr-6 text-right text-xs font-mono text-muted-foreground">
                        #{student.id}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

      </main>
    </div>
  )
}