"use server"

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

// Types
type Todo = {
  id: string
  listId: string
  text: string
  completed: boolean
  completedAt: string | null
}

type TodoList = {
  id: string
  name: string
}

type Report = {
  id: string
  date: Date
  type: "daily" | "weekly"
  summary: string
  completedTasks: Todo[]
  totalTasks: number
}

// Server actions for todos
export async function getTodos(listId?: string) {
  const url = listId ? `/api/todos?listId=${listId}` : "/api/todos"

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error("Failed to fetch todos")
  }

  const data = await response.json()
  return data.todos
}

export async function createTodo(listId: string, text: string) {
  const response = await fetch("/api/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ listId, text }),
  })

  if (!response.ok) {
    throw new Error("Failed to create todo")
  }

  const data = await response.json()
  return data.todo
}

export async function updateTodo(id: string, updates: Partial<Todo>) {
  const response = await fetch("/api/todos", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, ...updates }),
  })

  if (!response.ok) {
    throw new Error("Failed to update todo")
  }

  const data = await response.json()
  return data.todo
}

export async function deleteTodo(id: string) {
  const response = await fetch(`/api/todos?id=${id}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    throw new Error("Failed to delete todo")
  }

  return true
}

// Server actions for lists
export async function getLists() {
  const response = await fetch("/api/lists")

  if (!response.ok) {
    throw new Error("Failed to fetch lists")
  }

  const data = await response.json()
  return data.lists
}

export async function createList(name: string) {
  const response = await fetch("/api/lists", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  })

  if (!response.ok) {
    throw new Error("Failed to create list")
  }

  const data = await response.json()
  return data.list
}

export async function updateList(id: string, name: string) {
  const response = await fetch("/api/lists", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, name }),
  })

  if (!response.ok) {
    throw new Error("Failed to update list")
  }

  const data = await response.json()
  return data.list
}

export async function deleteList(id: string) {
  const response = await fetch(`/api/lists?id=${id}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    throw new Error("Failed to delete list")
  }

  return true
}

// Server actions for reports
export async function getReport(date: Date, type: "daily" | "weekly" = "daily") {
  const formattedDate = date.toISOString().split("T")[0]
  const response = await fetch(`/api/reports?date=${formattedDate}&type=${type}`)

  if (!response.ok) {
    throw new Error("Failed to fetch report")
  }

  const data = await response.json()
  return data
}

export async function generateDailyReport(date: Date) {
  // Get completed todos for the day
  const todos = await getTodos()
  const formattedDate = date.toISOString().split("T")[0]

  // Filter todos completed on the target date
  const completedTodos = todos.filter((todo: Todo) => {
    if (!todo.completedAt) return false
    const completedDate = new Date(todo.completedAt).toISOString().split("T")[0]
    return completedDate === formattedDate
  })

  // Generate report summary using AI
  const { text: summary } = await generateText({
    model: openai("gpt-4o"),
    prompt: `Generate a concise daily summary based on these completed tasks: ${JSON.stringify(completedTodos.map((t: Todo) => t.text))}.
             The summary should highlight accomplishments and be written in second person (you).`,
    system: "You are an AI assistant that generates concise, motivational summaries of completed tasks.",
  })

  // In a real app, we would save this report to the database
  return {
    date,
    type: "daily" as const,
    completedTasks: completedTodos,
    totalTasks: todos.length,
    summary,
  }
}

export async function generateWeeklyReport(endDate: Date) {
  // Calculate start date (7 days before end date)
  const startDate = new Date(endDate)
  startDate.setDate(startDate.getDate() - 6)

  // Get all todos
  const todos = await getTodos()

  // Filter todos completed within the week
  const completedTodos = todos.filter((todo: Todo) => {
    if (!todo.completedAt) return false
    const completedDate = new Date(todo.completedAt)
    return completedDate >= startDate && completedDate <= endDate
  })

  // Generate report summary using AI
  const { text: summary } = await generateText({
    model: openai("gpt-4o"),
    prompt: `Generate a weekly summary based on these completed tasks: ${JSON.stringify(completedTodos.map((t: Todo) => t.text))}.
             The summary should highlight accomplishments, identify patterns, and be written in second person (you).`,
    system: "You are an AI assistant that generates concise, motivational summaries of completed tasks.",
  })

  // In a real app, we would save this report to the database
  return {
    date: endDate,
    type: "weekly" as const,
    completedTasks: completedTodos,
    totalTasks: todos.length,
    summary,
  }
}

