"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/Input"
import { FileText, Calendar, Search, Edit, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

// Mock data for demonstration
const MOCK_REPORTS = [
  {
    id: "1",
    date: new Date(2025, 2, 30),
    type: "weekly",
    title: "Week of March 24-30",
    completed: 25,
    total: 35,
    summary:
      "This week you've made significant progress on your work projects. You completed the database migration task ahead of schedule and started implementing the new user authentication system. For personal tasks, you've been consistent with your exercise routine and completed most of your errands.",
  },
  {
    id: "2",
    date: new Date(2025, 3, 1),
    type: "daily",
    title: "April 1, 2025",
    completed: 4,
    total: 9,
    summary:
      "Today you focused primarily on the project proposal and completed it successfully. You also made progress on your personal tasks, including grocery shopping and calling your family. There are still a few pending tasks for tomorrow.",
  },
  {
    id: "3",
    date: new Date(2025, 2, 30),
    type: "daily",
    title: "March 30, 2025",
    completed: 6,
    total: 6,
    summary:
      "Great job completing all your tasks today! You finished the code review, attended the team meeting, and completed your personal errands. This perfect completion rate shows excellent time management.",
  },
  {
    id: "4",
    date: new Date(2025, 2, 29),
    type: "daily",
    title: "March 29, 2025",
    completed: 3,
    total: 7,
    summary:
      "Today you completed about half of your planned tasks. You made progress on the project proposal but didn't finish it. You also completed some personal tasks like grocery shopping.",
  },
  {
    id: "5",
    date: new Date(2025, 2, 28),
    type: "daily",
    title: "March 28, 2025",
    completed: 5,
    total: 8,
    summary:
      "You had a productive day focusing on your work tasks. You completed the database schema design and had a successful client meeting. You also made progress on your learning goals by completing a section of your online course.",
  },
  {
    id: "6",
    date: new Date(2025, 2, 23),
    type: "weekly",
    title: "Week of March 17-23",
    completed: 28,
    total: 40,
    summary:
      "This week was focused on planning and initial implementation of the new project. You set up the development environment, created the project structure, and started working on the core features. On the personal side, you maintained your exercise routine and completed most household tasks.",
  },
]

export default function ReportsList() {
  const [reportType, setReportType] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedReport, setSelectedReport] = useState<any | null>(MOCK_REPORTS[0])

  const filteredReports = MOCK_REPORTS.filter((report) => {
    // Filter by type
    if (reportType !== "all" && report.type !== reportType) {
      return false
    }

    // Filter by search query
    if (
      searchQuery &&
      !report.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !report.summary.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    return true
  })

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <Card className="h-full">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">Reports</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reports..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Tabs defaultValue="all" value={reportType} onValueChange={setReportType}>
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="daily">Daily</TabsTrigger>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
              {filteredReports.length > 0 ? (
                filteredReports.map((report) => (
                  <div
                    key={report.id}
                    className={cn(
                      "p-3 rounded-md border cursor-pointer transition-all",
                      selectedReport?.id === report.id ? "bg-primary text-primary-foreground" : "hover:bg-muted/50",
                    )}
                    onClick={() => setSelectedReport(report)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h3
                        className={cn(
                          "font-medium text-sm",
                          selectedReport?.id === report.id ? "text-primary-foreground" : "",
                        )}
                      >
                        {report.title}
                      </h3>
                      <Badge
                        variant={selectedReport?.id === report.id ? "outline" : "secondary"}
                        className={
                          selectedReport?.id === report.id ? "border-primary-foreground text-primary-foreground" : ""
                        }
                      >
                        {report.type === "weekly" ? "Weekly" : "Daily"}
                      </Badge>
                    </div>
                    <div className="flex items-center text-xs gap-2">
                      <Calendar className="h-3 w-3" />
                      <span
                        className={cn(
                          selectedReport?.id === report.id ? "text-primary-foreground" : "text-muted-foreground",
                        )}
                      >
                        {report.date.toLocaleDateString()}
                      </span>
                      <span
                        className={cn(
                          "ml-auto",
                          selectedReport?.id === report.id ? "text-primary-foreground" : "text-muted-foreground",
                        )}
                      >
                        {report.completed}/{report.total} tasks
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No reports found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-2">
        {selectedReport && (
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  {selectedReport.type === "weekly" ? "Weekly" : "Daily"} Report
                </div>
                <Button variant="outline" size="sm" className="h-8">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-1">{selectedReport.title}</h2>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-1" />
                  {selectedReport.date.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                  <Badge className="ml-3" variant={selectedReport.type === "weekly" ? "default" : "outline"}>
                    {selectedReport.type === "weekly" ? "Weekly" : "Daily"}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-md bg-muted/30 border">
                <div className="text-center">
                  <p className="text-2xl font-bold">{selectedReport.completed}</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{selectedReport.total - selectedReport.completed}</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">
                    {Math.round((selectedReport.completed / selectedReport.total) * 100)}%
                  </p>
                  <p className="text-sm text-muted-foreground">Completion</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Summary</h3>
                <div className="p-4 rounded-md border bg-card">
                  <p>{selectedReport.summary}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Completed Tasks</h3>
                <div className="space-y-2">
                  {Array.from({ length: Math.min(5, selectedReport.completed) }).map((_, i) => (
                    <div key={i} className="flex items-start gap-2 p-2 rounded-md border">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-medium">
                          {
                            [
                              "Finish project proposal",
                              "Database migration",
                              "Team meeting",
                              "Code review",
                              "Buy groceries",
                            ][i % 5]
                          }
                        </p>
                        <p className="text-sm text-muted-foreground">{["Work", "Personal", "Learning"][i % 3]} list</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

