"use client"

import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, ScrollView } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import EditListDialog from "./EditListDialog"
import EditTaskDialog from "./EditTaskDialog"

// 模拟数据
const MOCK_LISTS = [
  {
    id: "1",
    name: "工作任务",
    todos: [
      {
        id: "1-1",
        text: "完成项目提案",
        completed: true,
        description: "完成Q2项目提案，包括预算和时间表",
        dueDate: new Date(2025, 3, 5),
      },
      {
        id: "1-2",
        text: "安排团队会议",
        completed: false,
        description: "为新项目设置每周团队同步",
        dueDate: null,
      },
      {
        id: "1-3",
        text: "审查代码更改",
        completed: false,
        description: "审查认证功能的拉取请求",
        dueDate: new Date(2025, 3, 3),
      },
    ],
  },
  {
    id: "2",
    name: "个人",
    todos: [
      {
        id: "2-1",
        text: "购买杂货",
        completed: true,
        description: "购买牛奶、鸡蛋、面包和蔬菜",
        dueDate: null,
      },
      {
        id: "2-2",
        text: "给妈妈打电话",
        completed: true,
        description: "给妈妈打电话祝她生日快乐",
        dueDate: new Date(2025, 3, 2),
      },
      {
        id: "2-3",
        text: "去跑步",
        completed: false,
        description: "在公园慢跑30分钟",
        dueDate: new Date(2025, 3, 4),
      },
    ],
  },
  {
    id: "3",
    name: "学习",
    todos: [
      {
        id: "3-1",
        text: "完成React Native课程",
        completed: false,
        description: "完成Udemy上的React Native课程",
        dueDate: new Date(2025, 3, 15),
      },
      {
        id: "3-2",
        text: "阅读NestJS文档",
        completed: false,
        description: "阅读NestJS官方文档",
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

    // 如果删除的是当前活动列表，则设置一个新的活动列表
    if (id === activeList && newLists.length > 0) {
      setActiveList(newLists[0].id)
    }
  }

  const handleUpdateTask = (updatedTask: any) => {
    setLists(
      lists.map((list) => {
        // 如果任务被移动到不同的列表
        if (list.id === updatedTask.listId) {
          // 如果这是目标列表
          const taskExists = list.todos.some((todo) => todo.id === updatedTask.id);

          if (taskExists) {
            // 在当前列表中更新任务
            return {
              ...list,
              todos: list.todos.map((todo) => (todo.id === updatedTask.id ? updatedTask : todo)),
            };
          } else {
            // 将任务添加到新列表
            return {
              ...list,
              todos: [...list.todos, updatedTask],
            };
          }
        } else {
          // 如果任务被移动，则从原始列表中删除  updatedTask],
            };
          }
  }
  else
  {
    // 如果任务被移动，则从原始列表中删除
    const hadTask = list.todos.some((todo) => todo.id === updatedTask.id)

    if (hadTask) {
      return {
        ...list,
        todos: list.todos.filter((todo) => todo.id !== updatedTask.id),
      }
    }

    return list
  }
}
),
    )
}

const handleDeleteTask = (id: string) => {
  setLists(\
      lists.map((list) => {
        return {
          ...list,
          todos: list.todos.filter((todo) => todo.id !== id),
        };
      }),
    )
}

const calculateCompletionPercentage = (list) => {
  if (list.todos.length === 0) return 0
  return Math.round((list.todos.filter((t) => t.completed).length / list.todos.length) * 100)
}

return (
    <View style={styles.container}>
      {/* 列表侧边栏 */}
      <View style={styles.sidebar}>
        <ScrollView>
          {lists.map((list) => (
            <TouchableOpacity
              key={list.id}
              style={[
                styles.listItem,
                activeList === list.id && styles.activeListItem
              ]}
              onPress={() => setActiveList(list.id)}
            >
              <View style={{width: '100%'}}>
                <View style={styles.listItemHeader}>
                  <Text style={[
                    styles.listItemTitle, 
                    activeList === list.id && styles.activeListItemTitle
                  ]}>
                    {list.name}
                  </Text>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {list.todos.filter((t) => !t.completed).length}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.progressBarContainer}>
                  <View 
                    style={[
                      styles.progressBar, 
                      {width: `${calculateCompletionPercentage(list)}%`}
                    ]} 
                  />
                </View>
                
                <View style={styles.listItemFooter}>
                  <Text style={styles.listItemFooterText}>
                    {list.todos.filter((t) => t.completed).length}/{list.todos.length} 已完成
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 活动列表 */}
      {getActiveList() && (
        <View style={styles.activeList}>
          <View style={styles.activeListHeader}>
            <View style={styles.activeListTitleRow}>
              <Text style={styles.activeListTitle}>{getActiveList()?.name}</Text>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEditList(getActiveList())}
              >
                <Ionicons name="pencil-outline" size={18} color="#666" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.progressSection}>
              <View style={styles.progressInfo}>
                <Text style={styles.progressText}>
                  {getActiveList()?.todos.filter((t) => t.completed).length} / {getActiveList()?.todos.length} 任务已完成
                </Text>
                <Text style={styles.progressPercentage}>
                  {calculateCompletionPercentage(getActiveList())}%
                </Text>
              </View>
              <View style={styles.progressBarContainerLarge}>
                <View 
                  style={[
                    styles.progressBarLarge, 
                    {width: `${calculateCompletionPercentage(getActiveList())}%`}
                  ]} 
                />
              </View>
            </View>
          </View>

          <View style={styles.addTodoContainer}>
            <TextInput
              style={styles.addTodoInput}
              placeholder="添加新任务..."
              placeholderTextColor="#999"
              value={newTodo}
              onChangeText={setNewTodo}
              onSubmitEditing={handleAddTodo}
            />
            <TouchableOpacity style={styles.addTodoButton} onPress={handleAddTodo}>
              <Ionicons name="add-circle-outline" size={20} color="white" />
              <Text style={styles.addTodoButtonText}>添加</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={getActiveList()?.todos}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={[
                  styles.todoItem,
                  item.completed && styles.todoItemCompleted
                ]}
                onPress={() => handleEditTask(item)}
                activeOpacity={0.7}
              >
                <TouchableOpacity
                  style={styles.todoCheckbox}
                  onPress={() => toggleTodo(item.id)}
                >
                  {item.completed ? (
                    <Ionicons name="checkmark-circle" size={24} color="#39d353" />
                  ) : (
                    <Ionicons name="ellipse-outline" size={24} color="#666" />
                  )}
                </TouchableOpacity>
                
                <Text style={[
                  styles.todoText,
                  item.completed && styles.todoTextCompleted
                ]}>
                  {item.text}
                </Text>
                
                <TouchableOpacity 
                  style={styles.todoMoreButton}
                  onPress={() => handleEditTask(item)}
                >
                  <Ionicons name="ellipsis-horizontal" size={18} color="#666" />
                </TouchableOpacity>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* 编辑列表对话框 */}
      <EditListDialog
        visible={editListDialogOpen}
        onClose={() => setEditListDialogOpen(false)}
        list={currentList}
        onUpdateList={handleUpdateList}
        onDeleteList={handleDeleteList}
      />

      {/* 编辑任务对话框 */}
      <EditTaskDialog
        visible={editTaskDialogOpen}
        onClose={() => setEditTaskDialogOpen(false)}
        task={currentTask}
        lists={lists}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },
  sidebar: {
    width: "35%",
    backgroundColor: "#f5f5f5",
    padding: 10,
  },
  listItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#eee",
  },
  activeListItem: {
    backgroundColor: "#0070f3",
  },
  listItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  listItemTitle: {
    fontWeight: "500",
    fontSize: 14,
    color: "#000",
  },
  activeListItemTitle: {
    color: "white",
  },
  badge: {
    backgroundColor: "rgba(0,0,0,0.1)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 12,
    color: "#666",
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#39d353",
  },
  listItemFooter: {
    alignItems: "flex-end",
    marginTop: 4,
  },
  listItemFooterText: {
    fontSize: 10,
    color: "#999",
  },
  activeList: {
    flex: 1,
    padding: 10,
  },
  activeListHeader: {
    marginBottom: 15,
  },
  activeListTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  activeListTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  editButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
  },
  progressSection: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 10,
  },
  progressInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressText: {
    fontSize: 12,
    color: "#666",
  },
  progressPercentage: {
    fontSize: 12,
    fontWeight: "500",
    color: "#000",
  },
  progressBarContainerLarge: {
    height: 8,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarLarge: {
    height: "100%",
    backgroundColor: "#39d353",
  },
  addTodoContainer: {
    flexDirection: "row",
    marginBottom: 15,
  },
  addTodoInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginRight: 8,
    color: "#000",
    backgroundColor: "#fff",
  },
  addTodoButton: {
    backgroundColor: "#0070f3",
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  addTodoButtonText: {
    color: "white",
    marginLeft: 4,
  },
  todoItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "white",
  },
  todoItemCompleted: {
    backgroundColor: "#f9f9f9",
  },
  todoCheckbox: {
    marginRight: 10,
  },
  todoText: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  todoTextCompleted: {
    textDecorationLine: "line-through",
    color: "#999",
  },
  todoMoreButton: {
    padding: 5,
  },
})

