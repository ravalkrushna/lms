import { createFileRoute } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { useState, useMemo } from "react"


import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table"

import { Search, RefreshCw } from "lucide-react"

import { HigherupsSidebar } from "@/components/HigherupsSidebar"
import { getUsersByRole, type User } from "@/lib/higherups"

export const Route = createFileRoute("/higherups/instructors/")({
  component: AdminInstructors,
})

function AdminInstructors() {
  const [search, setSearch] = useState("")

  const { data: instructors, isLoading, refetch, isFetching } = useQuery<User[]>({
    queryKey: ["instructors"],
    queryFn: () => getUsersByRole("INSTRUCTOR"),
  })

  const filtered = useMemo(() => {
    if (!instructors) return []
    return instructors.filter((i) =>
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.email.toLowerCase().includes(search.toLowerCase())
    )
  }, [instructors, search])

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
            <h1 className="text-2xl font-bold">Instructors</h1>
            <p className="text-muted-foreground text-sm">
              All registered instructors
            </p>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw size={15} className={isFetching ? "animate-spin" : ""} />
          </Button>
        </div>

        <Card>
          <CardHeader>

            <CardTitle>Instructor List</CardTitle>
            <CardDescription>
              {isLoading ? "Loading..." : `Showing ${filtered.length} instructors`}
            </CardDescription>

            <div className="relative mt-3">
              <Search size={15} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search instructor..."
                className="pl-8 w-64 h-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

          </CardHeader>

          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Instructor</TableHead>
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
                      <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-10 ml-auto" /></TableCell>
                    </TableRow>
                  ))}

                {!isLoading &&
                  filtered.map((instructor) => (
                    <TableRow key={instructor.id}>
                      <TableCell className="pl-6">
                        <div className="flex items-center gap-3">
                          <UserAvatar name={instructor.name} />
                          <span className="font-medium">{instructor.name}</span>
                        </div>
                      </TableCell>

                      <TableCell className="text-muted-foreground">
                        {instructor.email}
                      </TableCell>

                      <TableCell className="pr-6 text-right text-xs font-mono text-muted-foreground">
                        #{instructor.id}
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
