"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/Button"
import { ChevronLeft, ChevronRight, FileText, Edit } from "lucide-react"
import { cn } from "@/lib/utils"

// Mock data for demonstration
const MOCK_REPORTS = [
  { date: new Date(2025, 2, 28), type: "daily", completed: 5, total: 8 },
  { date: new Date(2025, 2, 29), type: "daily", completed: 3, total: 7 },
  { date: new Date(2025, 2, 30), type: "daily", completed: 6, total: 6 },
  { date: new Date(2025, 2, 30), type: "weekly", completed: 25, total: 35 },
  { date: new Date(2025, 3, 1), type: "daily", completed: 4, total: 9 },
]

export default function ReportCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [selectedReport, setSelectedReport] = useState<any | null>(null)

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return

    setDate(selectedDate)

    // Find reports for the selected date
    const reports = MOCK_REPORTS.filter(
      (report) =>
        report.date.getDate() === selectedDate.getDate() &&
        report.date.getMonth() === selectedDate.getMonth() &&
        report.date.getFullYear() === selectedDate.getFullYear(),
    )

    if (reports.length > 0) {
      // Prefer weekly reports if available
      const weeklyReport = reports.find((r) => r.type === "weekly")
      setSelectedReport(weeklyReport || reports[0])
    } else {
      setSelectedReport(null)
    }
  }

  // Custom day rendering for the calendar
  const renderDay = (day: Date) => {
    // Find reports for this day
    const reports = MOCK_REPORTS.filter(
      (report) =>
        report.date.getDate() === day.getDate() &&
        report.date.getMonth() === day.getMonth() &&
        report.date.getFullYear() === day.getFullYear(),
    )

    const hasWeeklyReport = reports.some((r) => r.type === "weekly")
    const hasDailyReport = reports.some((r) => r.type === "daily")

    return (
      <div className="relative w-full h-full flex items-center justify-center">
        {day.getDate()}
        <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-1 pb-1">
          {hasWeeklyReport && <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>}
          {hasDailyReport && <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>}
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">Calendar View</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center mb-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-xs text-muted-foreground">Daily Report</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  <span className="text-xs text-muted-foreground">Weekly Report</span>
                </div>
              </div>
            </div>
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              className="rounded-md border"
              components={{
                Day: ({ date, ...props }) => (
                  <Button
                    variant="ghost"
                    {...props}
                    className={cn("h-9 w-9 p-0 font-normal aria-selected:opacity-100", props.className)}
                  >
                    {renderDay(date)}
                  </Button>
                ),
              }}
            />
          </CardContent>
        </Card>
      </div>

      <div>
        <Card className="h-full">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">
              {selectedReport ? (
                <div className="flex justify-between items-center">
                  <span>{selectedReport.type === "weekly" ? "Weekly" : "Daily"} Report</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                "No Report Available"
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedReport ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">
                      {date?.toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Completed {selectedReport.completed} of {selectedReport.total} tasks
                    </p>
                  </div>
                  <Badge variant={selectedReport.type === "weekly" ? "default" : "outline"}>
                    {selectedReport.type === "weekly" ? "Weekly" : "Daily"}
                  </Badge>
                </div>

                <div className="rounded-lg border p-4 bg-muted/30">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      Summary
                    </h4>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm">
                    {selectedReport.type === "weekly"
                      ? "This week you've made significant progress on your work projects. You completed the database migration task ahead of schedule and started implementing the new user authentication system. For personal tasks, you've been consistent with your exercise routine and completed most of your errands."
                      : "Today you focused primarily on the project proposal and completed it successfully. You also made progress on your personal tasks, including grocery shopping and calling your family. There are still a few pending tasks for tomorrow."}
                  </p>
                </div>

                <div className="rounded-lg border p-4 bg-muted/30">
                  <h4 className="font-medium mb-2">Completed Tasks</h4>
                  <ul className="space-y-1">
                    {Array.from({ length: Math.min(3, selectedReport.completed) }).map((_, i) => (
                      <li key={i} className="text-sm flex items-center">
                        <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                        {["Finish project proposal", "Buy groceries", "Team meeting", "Code review"][i % 4]}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-1">No report for this date</h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Select a date with a colored indicator to view the daily or weekly report.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Import for the CheckCircle icon used in the component
import { CheckCircle } from "lucide-react"

