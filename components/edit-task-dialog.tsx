"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/Button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Trash2, Calendar } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/AlertDialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"

interface TodoList {
  id: string
  name: string
}

interface TodoTask {
  id: string
  listId: string
  text: string
  completed: boolean
  description?: string
  dueDate?: Date | null
}

interface EditTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task: TodoTask | null
  lists: TodoList[]
  onUpdateTask: (task: TodoTask) => void
  onDeleteTask: (id: string) => void
}

export default function EditTaskDialog({
  open,
  onOpenChange,
  task,
  lists,
  onUpdateTask,
  onDeleteTask,
}: EditTaskDialogProps) {
  const [taskText, setTaskText] = useState("")
  const [taskDescription, setTaskDescription] = useState("")
  const [taskListId, setTaskListId] = useState("")
  const [taskCompleted, setTaskCompleted] = useState(false)
  const [taskDueDate, setTaskDueDate] = useState<Date | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (task) {
      setTaskText(task.text)
      setTaskDescription(task.description || "")
      setTaskListId(task.listId)
      setTaskCompleted(task.completed)
      setTaskDueDate(task.dueDate || null)
    }
  }, [task])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!task) return

    if (!taskText.trim()) {
      toast({
        title: "Task text required",
        description: "Please enter a description for your task.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // In a real app, this would call an API
      await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API call

      const updatedTask: TodoTask = {
        ...task,
        text: taskText,
        description: taskDescription,
        listId: taskListId,
        completed: taskCompleted,
        dueDate: taskDueDate,
      }

      onUpdateTask(updatedTask)

      toast({
        title: "Task updated",
        description: "Your task has been updated successfully.",
      })

      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Failed to update task",
        description: "There was an error updating your task. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!task) return

    try {
      // In a real app, this would call an API
      await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API call
      onDeleteTask(task.id)

      toast({
        title: "Task deleted",
        description: "Your task has been deleted successfully.",
      })

      setShowDeleteAlert(false)
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Failed to delete task",
        description: "There was an error deleting your task. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
              <DialogDescription>Update your task details.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="text" className="text-right">
                  Task
                </Label>
                <Input
                  id="text"
                  value={taskText}
                  onChange={(e) => setTaskText(e.target.value)}
                  className="col-span-3"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right pt-2">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  placeholder="Add more details about this task..."
                  className="col-span-3 min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="list" className="text-right">
                  List
                </Label>
                <Select value={taskListId} onValueChange={setTaskListId}>
                  <SelectTrigger id="list" className="col-span-3">
                    <SelectValue placeholder="Select a list" />
                  </SelectTrigger>
                  <SelectContent>
                    {lists.map((list) => (
                      <SelectItem key={list.id} value={list.id}>
                        {list.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dueDate" className="text-right">
                  Due Date
                </Label>
                <div className="col-span-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal" id="dueDate">
                        <Calendar className="mr-2 h-4 w-4" />
                        {taskDueDate ? format(taskDueDate, "PPP") : "Select a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={taskDueDate || undefined}
                        onSelect={setTaskDueDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <div className="text-right">Status</div>
                <div className="flex items-center space-x-2 col-span-3">
                  <Checkbox
                    id="completed"
                    checked={taskCompleted}
                    onCheckedChange={(checked) => setTaskCompleted(checked === true)}
                  />
                  <Label htmlFor="completed" className="cursor-pointer">
                    Mark as completed
                  </Label>
                </div>
              </div>
            </div>
            <DialogFooter className="flex justify-between items-center">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="rounded-full h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => setShowDeleteAlert(true)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the task "{task?.text}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

