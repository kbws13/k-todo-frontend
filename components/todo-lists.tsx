"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
import { cn } from "@/lib/utils"
import EditListDialog from "./edit-list-dialog"
import EditTaskDialog from "./edit-task-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/DropdownMenu"
import { View, Text } from "react-native"
import { Button } from "./ui/Button"
import { Input } from "./ui/Input";

// Mock data for demonstration
const MOCK_LISTS = [
  {
    id: "1",
    name: "Work Tasks",
    todos: [
      {
        id: "1-1",
        text: "Finish project proposal",
        completed: true,
        description: "Complete the Q2 project proposal including budget and timeline",
        dueDate: new Date(2025, 3, 5),
      },
      {
        id: "1-2",
        text: "Schedule team meeting",
        completed: false,
        description: "Set up weekly team sync for the new project",
        dueDate: null,
      },
      {
        id: "1-3",
        text: "Review code changes",
        completed: false,
        description: "Review pull requests for the authentication feature",
        dueDate: new Date(2025, 3, 3),
      },
    ],
  },
  {
    id: "2",
    name: "Personal",
    todos: [
      {
        id: "2-1",
        text: "Buy groceries",
        completed: true,
        description: "Get milk, eggs, bread, and vegetables",
        dueDate: null,
      },
      {
        id: "2-2",
        text: "Call mom",
        completed: true,
        description: "Call mom to wish her happy birthday",
        dueDate: new Date(2025, 3, 2),
      },
      {
        id: "2-3",
        text: "Go for a run",
        completed: false,
        description: "30 minute jog in the park",
        dueDate: new Date(2025, 3, 4),
      },
    ],
  },
  {
    id: "3",
    name: "Learning",
    todos: [
      {
        id: "3-1",
        text: "Complete React Native course",
        completed: false,
        description: "Finish the React Native course on Udemy",
        dueDate: new Date(2025, 3, 15),
      },
      {
        id: "3-2",
        text: "Read NestJS documentation",
        completed: false,
        description: "Go through the NestJS official docs",
        dueDate: new Date(2025, 3, 10),
      },
    ],
  },
]

export default function TodoLists() {
  const [lists, setLists] = useState(MOCK_LISTS)
  const [activeList, setActiveList] = useState(MOCK_LISTS[0].id)
  const [newTodo, setNewTodo] = useState("")
  const [editListDialogOpen, setEditListDialogOpen] = useState(false)
  const [editTaskDialogOpen, setEditTaskDialogOpen] = useState(false)
  const [currentList, setCurrentList] = useState<any | null>(null)
  const [currentTask, setCurrentTask] = useState<any | null>(null)

  const getActiveList = () => lists.find((list) => list.id === activeList)

  const handleAddTodo = () => {
    if (!newTodo.trim()) return

    setLists(
      lists.map((list) => {
        if (list.id === activeList) {
          return {
            ...list,
            todos: [
              ...list.todos,
              {
                id: `${list.id}-${list.todos.length + 1}`,
                text: newTodo,
                completed: false,
                description: "",
                dueDate: null,
              },
            ],
          }
        }
        return list
      }),
    )

    setNewTodo("")
  }

  const toggleTodo = (todoId: string) => {
    setLists(
      lists.map((list) => {
        if (list.id === activeList) {
          return {
            ...list,
            todos: list.todos.map((todo) => (todo.id === todoId ? { ...todo, completed: !todo.completed } : todo)),
          }
        }
        return list
      }),
    )
  }

  const handleEditList = (list: any) => {
    setCurrentList(list)
    setEditListDialogOpen(true)
  }

  const handleEditTask = (task: any) => {
    setCurrentTask(task)
    setEditTaskDialogOpen(true)
  }

  const handleUpdateList = (id: string, name: string) => {
    setLists(
      lists.map((list) => {
        if (list.id === id) {
          return {
            ...list,
            name,
          }
        }
        return list
      }),
    )
  }

  const handleDeleteList = (id: string) => {
    const newLists = lists.filter((list) => list.id !== id)
    setLists(newLists)

    // If the active list was deleted, set a new active list
    if (id === activeList && newLists.length > 0) {
      setActiveList(newLists[0].id)
    }
  }

  const handleUpdateTask = (updatedTask: any) => {
    setLists(
      lists.map((list) => {
        // If the task was moved to a different list
        if (list.id === updatedTask.listId) {
          // If this is the destination list
          const taskExists = list.todos.some((todo) => todo.id === updatedTask.id)

          if (taskExists) {
            // Update the task in its current list
            return {
              ...list,
              todos: list.todos.map((todo) => (todo.id === updatedTask.id ? updatedTask : todo)),
            }
          } else {
            // Add the task to the new list
            return {
              ...list,
              todos: [...list.todos, updatedTask],
            }
          }
        } else {
          // Remove the task from its original list if it was moved
          const hadTask = list.todos.some((todo) => todo.id === updatedTask.id)

          if (hadTask) {
            return {
              ...list,
              todos: list.todos.filter((todo) => todo.id !== updatedTask.id),
            }
          }

          return list
        }
      }),
    )
  }

  const handleDeleteTask = (id: string) => {
    setLists(
      lists.map((list) => {
        return {
          ...list,
          todos: list.todos.filter((todo) => todo.id !== id),
        }
      }),
    )
  }

  return (
    <View className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <View className="md:col-span-1 mt-4">
        <View className="w-full">
          <View className="items-center justify-center text-muted-foreground flex flex-col h-auto w-full bg-muted/50 p-0 rounded-md">
            {lists.map((list) => (
              <View
                key={list.id}
                // value={list.id}
                // onClick={() => setActiveList(list.id)}
                className={cn(
                  "inline-flex items-center whitespace-nowrap text-sm font-medium  transition-all disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground w-full justify-start px-4 py-3 text-left relative border border-gray-200 rounded-lg mb-2",
                  activeList === list.id ? "bg-white text-primary-foreground" : "",
                )}
              >
                <View className="flex flex-col w-full">
                  <View className="flex-row justify-between items-center mb-1.5">
                    <Text className="mb-1.5">{list.name}</Text>
                    <Text className="ml-auto bg-muted-foreground/20 px-2 py-0.5 rounded-full text-xs">
                      {list.todos.filter((t) => !t.completed).length}
                    </Text>
                  </View>
                  <View className="w-full bg-muted/50 rounded-full h-1.5">
                    <View
                      className="bg-[#39d353] h-1.5 rounded-full"
                      style={{
                        width: `${
                          list.todos.length > 0
                            ? Math.round((list.todos.filter((t) => t.completed).length / list.todos.length) * 100)
                            : 0
                        }%`,
                      }}
                    ></View>
                  </View>
                  <View className="flex justify-end mt-1">
                    <Text className="text-xs text-muted-foreground">
                      {list.todos.filter((t) => t.completed).length}/{list.todos.length} completed
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* <View className="md:col-span-3">
        {getActiveList() && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-xl flex-row items-center justify-between">
                <Text className="text-2xl font-semibold leading-none tracking-tight">{getActiveList()?.name}</Text>
                <View className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleEditList(getActiveList())}
                  >
                    <Feather name="edit" color="black" className="h-3 w-3" />
                  </Button>
                </View>
              </CardTitle>
              <View className="mt-2">
                <View className="flex justify-between items-center mb-1">
                  <Text className="text-sm text-muted-foreground">
                    {getActiveList()?.todos.filter((t) => t.completed).length} of {getActiveList()?.todos.length} tasks
                    completed
                  </Text>
                  <Text className="text-sm font-medium">
                    {getActiveList()?.todos.length > 0
                      ? Math.round(
                          (getActiveList()?.todos.filter((t) => t.completed).length / getActiveList()?.todos.length) *
                            100,
                        )
                      : 0}
                    %
                  </Text>
                </View>
                <View className="w-full bg-muted/50 rounded-full h-2">
                  <View
                    className="bg-[#39d353] h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        getActiveList()?.todos.length > 0
                          ? Math.round(
                              (getActiveList()?.todos.filter((t) => t.completed).length /
                                getActiveList()?.todos.length) *
                                100,
                            )
                          : 0
                      }%`,
                    }}
                  ></View>
                </View>
              </View>
            </CardHeader>
            <CardContent>
              <View className="space-y-4">
                <View className="flex gap-2">
                  <Input
                    placeholder="Add a new task..."
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddTodo()}
                    className="flex-1"
                  />
                  <Button onClick={handleAddTodo}>
                    <Ionicons name="add-circle" size={24} color="black" />
                    <Text>Add</Text>
                  </Button>
                </View>

                <View className="space-y-2">
                  {getActiveList()?.todos.map((todo) => (
                    <View
                      key={todo.id}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-md transition-all",
                        todo.completed ? "bg-muted/50" : "bg-card hover:bg-muted/30",
                        "border",
                      )}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded-full p-0"
                        onClick={() => toggleTodo(todo.id)}
                      >
                        {todo.completed ? (
                          <FontAwesome6 name="check-circle" size={24} className="h-5 w-5 text-green-500" />
                        ) : (
                          <Entypo name="circle" size={24} color="black" />
                        )}
                      </Button>
                      <Text className={cn(todo.completed && "line-through text-muted-foreground")}>{todo.text}</Text>
                      <View className="ml-auto flex gap-1">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
                              <Feather name="more-horizontal" className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditTask(todo)}>
                              <Feather name="edit" color="black" className="h-4 w-4 mr-2" />
                              <Text>Edit</Text>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteTask(todo.id)}
                              className="text-destructive focus:text-destructive"
                            >
                              <AntDesign name="delete" className="h-4 w-4 mr-2" color="red" />
                              <Text>Delete</Text>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            </CardContent>
          </Card>
        )}
      </View> */}

      {/* Edit List Dialog */}
      {/* <EditListDialog
        open={editListDialogOpen}
        onOpenChange={setEditListDialogOpen}
        list={currentList}
        onUpdateList={handleUpdateList}
        onDeleteList={handleDeleteList}
      /> */}

      {/* Edit Task Dialog */}
      {/* <EditTaskDialog
        open={editTaskDialogOpen}
        onOpenChange={setEditTaskDialogOpen}
        task={currentTask}
        lists={lists}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
      /> */}
    </View>
  )
}

