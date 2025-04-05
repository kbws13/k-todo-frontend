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
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Trash2 } from "lucide-react"
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
import { View, Text } from "react-native"
import { Input } from "./ui/Input"

interface TodoList {
  id: string
  name: string
}

interface EditListDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  list: TodoList | null
  onUpdateList: (id: string, name: string) => void
  onDeleteList: (id: string) => void
}

export default function EditListDialog({ open, onOpenChange, list, onUpdateList, onDeleteList }: EditListDialogProps) {
  const [listName, setListName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (list) {
      setListName(list.name)
    }
  }, [list])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!list) return

    if (!listName.trim()) {
      toast({
        title: "List name required",
        description: "Please enter a name for your list.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // In a real app, this would call an API
      await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API call
      onUpdateList(list.id, listName)

      toast({
        title: "List updated",
        description: `"${listName}" has been updated successfully.`,
      })

      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Failed to update list",
        description: "There was an error updating your list. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!list) return

    try {
      // In a real app, this would call an API
      await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API call
      onDeleteList(list.id)

      toast({
        title: "List deleted",
        description: `"${list.name}" has been deleted successfully.`,
      })

      setShowDeleteAlert(false)
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Failed to delete list",
        description: "There was an error deleting your list. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <View>
            <DialogHeader>
              <DialogTitle>Edit List</DialogTitle>
              <DialogDescription>Update your ToDo list details.</DialogDescription>
            </DialogHeader>
            <View className="grid gap-4 py-4">
              <View className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  <Text>Name</Text>
                </Label>
                <Input
                  id="name"
                  value={listName}
                  onChange={(e) => setListName(e.target.value)}
                  className="col-span-3"
                  autoFocus
                />
              </View>
            </View>
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
              <View className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                  <Text>Cancel</Text>
                </Button>
                <Button type="submit" disabled={isSubmitting} onClick={handleSubmit}>
                  <Text>{isSubmitting ? "Saving..." : "Save Changes"}</Text>
                </Button>
              </View>
            </DialogFooter>
          </View>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the "{list?.name}" list and all of its tasks. This action cannot be undone.
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

