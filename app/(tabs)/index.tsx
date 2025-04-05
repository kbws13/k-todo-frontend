import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import '../globals.css'
import { View, Text, ScrollView } from "react-native";
import { cn } from "@/lib/utils"
import TodoLists from "@/components/todo-lists";

// Import mock data for the progress calculation
const MOCK_TODOS = [
  { id: "1", listId: "1", text: "Finish project proposal", completed: true },
  { id: "2", listId: "1", text: "Schedule team meeting", completed: true },
  { id: "3", listId: "1", text: "Review code changes", completed: false },
  { id: "4", listId: "2", text: "Buy groceries", completed: true },
  { id: "5", listId: "2", text: "Call mom", completed: true },
  { id: "6", listId: "2", text: "Go for a run", completed: false },
  { id: "7", listId: "3", text: "Complete React Native course", completed: false },
  { id: "8", listId: "3", text: "Read NestJS documentation", completed: false },
]

const MOCK_LISTS = [
  { id: "1", name: "Work Tasks" },
  { id: "2", name: "Personal" },
  { id: "3", name: "Learning" },
]
export default function Home() {
  const { toast } = useToast();

  const handleAddList = (name: string) => {
    // In a real app, this would call an API to create a new list
    toast({
      title: "List created",
      description: `"${name}" has been created successfully.`,
    })
  }

  return (
    <ScrollView>
      <View className="container mx-auto p-4 max-w-5xl">
        <Card className="border-none" style={{
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.3,
          shadowRadius: 4.65,
          elevation: 8, // Android 阴影
        }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-3xl fibt-bold">
              <Text className="text-2xl font-semibold leading-none tracking-tight">TaskMaster</Text>
            </CardTitle>
            <CardDescription>
              <Text>Organize your tasks, get AI-powered insights</Text>
            </CardDescription>
            <View className="mt-4">
              <View className="flex-row justify-between items-center mb-1">
                <Text className="text-sm text-muted-foreground">Overall progress</Text>
                <Text className="text-sm font-medium">
                  {(() => {
                    const totalTasks = MOCK_LISTS.reduce((acc, list) => {
                      const listTasks = MOCK_TODOS.filter((todo) => todo.listId === list.id)
                      return acc + listTasks.length
                    }, 0)
                    const completedTasks = MOCK_TODOS.filter((todo) => todo.completed).length
                    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
                  })()}%
                </Text>
              </View>
              <View className="w-full bg-muted/50 rounded-full h-2">
                <View
                  className="bg-[#39d353] h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${(() => {
                      const totalTasks = MOCK_LISTS.reduce((acc, list) => {
                        const listTasks = MOCK_TODOS.filter((todo) => todo.listId === list.id)
                        return acc + listTasks.length
                      }, 0)
                      const completedTasks = MOCK_TODOS.filter((todo) => todo.completed).length
                      return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
                    })()}%`,
                  }}
                ></View>
              </View>
            </View>
          </CardHeader>
          <CardContent>
            <View
              className="ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 mt-0"
            >
              <TodoLists />
            </View>
          </CardContent>
        </Card>
      </View>
    </ScrollView>
  )
}