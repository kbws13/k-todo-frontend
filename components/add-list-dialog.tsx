"use client"

import type React from "react"

import { useState } from "react"
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
import { useToast } from "@/hooks/use-toast"

interface AddListDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddList: (name: string) => void
}

export default function AddListDialog({ open, onOpenChange, onAddList }: AddListDialogProps) {
  const [listName, setListName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

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
      onAddList(listName)

      toast({
        title: "List created",
        description: `"${listName}" has been created successfully.`,
      })

      setListName("")
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Failed to create list",
        description: "There was an error creating your list. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New List</DialogTitle>
            <DialogDescription>Create a new ToDo list to organize your tasks.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={listName}
                onChange={(e) => setListName(e.target.value)}
                placeholder="e.g., Work, Personal, Shopping"
                className="col-span-3"
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create List"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

