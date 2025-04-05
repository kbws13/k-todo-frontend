"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Switch,
  Alert,
  ScrollView,
  Platform,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import DateTimePicker from "@react-native-community/datetimepicker"

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
  visible: boolean
  onClose: () => void
  task: TodoTask | null
  lists: TodoList[]
  onUpdateTask: (task: TodoTask) => void
  onDeleteTask: (id: string) => void
}

export default function EditTaskDialog({
  visible,
  onClose,
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
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showListPicker, setShowListPicker] = useState(false)

  useEffect(() => {
    if (task) {
      setTaskText(task.text)
      setTaskDescription(task.description || "")
      setTaskListId(task.listId)
      setTaskCompleted(task.completed)
      setTaskDueDate(task.dueDate || null)
    }
  }, [task])

  const handleSubmit = async () => {
    if (!task) return

    if (!taskText.trim()) {
      // 在实际应用中，这里应该显示一个错误提示
      return
    }

    setIsSubmitting(true)

    try {
      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 500))

      const updatedTask: TodoTask = {
        ...task,
        text: taskText,
        description: taskDescription,
        listId: taskListId,
        completed: taskCompleted,
        dueDate: taskDueDate,
      }

      onUpdateTask(updatedTask)
      onClose()
    } catch (error) {
      // 处理错误
    } finally {
      setIsSubmitting(false)
    }
  }

  const confirmDelete = () => {
    if (!task) return

    Alert.alert("确认删除", `这将永久删除任务"${task.text}"。此操作无法撤销。`, [
      {
        text: "取消",
        style: "cancel",
      },
      {
        text: "删除",
        onPress: handleDelete,
        style: "destructive",
      },
    ])
  }

  const handleDelete = async () => {
    if (!task) return

    try {
      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 500))
      onDeleteTask(task.id)
      onClose()
    } catch (error) {
      // 处理错误
    }
  }

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios")
    if (selectedDate) {
      setTaskDueDate(selectedDate)
    }
  }

  const getListName = () => {
    const list = lists.find((l) => l.id === taskListId)
    return list ? list.name : "选择一个列表"
  }

  const showListPickerModal = () => {
    Alert.alert(
      "选择列表",
      "",
      lists
        .map((list) => ({
          text: list.name,
          onPress: () => setTaskListId(list.id),
        }))
        .concat([
          {
            text: "取消",
            style: "cancel",
          },
        ]),
    )
  }

  const showDatePickerModal = () => {
    if (Platform.OS === "android") {
      setShowDatePicker(true)
    } else {
      // iOS日期选择器已经是模态的
      setShowDatePicker(true)
    }
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <Text style={styles.title}>编辑任务</Text>
              <Text style={styles.description}>更新您的任务详情。</Text>
            </View>

            <View style={styles.form}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>任务</Text>
                <TextInput
                  style={styles.input}
                  value={taskText}
                  onChangeText={setTaskText}
                  placeholderTextColor="#999"
                  autoFocus
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>描述</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={taskDescription}
                  onChangeText={setTaskDescription}
                  multiline
                  numberOfLines={4}
                  placeholder="添加关于此任务的更多详情..."
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>列表</Text>
                <TouchableOpacity style={styles.selectButton} onPress={showListPickerModal}>
                  <Text style={styles.selectButtonText}>{getListName()}</Text>
                  <Ionicons name="chevron-down" size={16} color="#666" />
                </TouchableOpacity>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>截止日期</Text>
                <TouchableOpacity style={styles.selectButton} onPress={showDatePickerModal}>
                  <View style={styles.dateButtonContent}>
                    <Ionicons name="calendar-outline" size={16} color="#666" style={{ marginRight: 8 }} />
                    <Text style={styles.selectButtonText}>
                      {taskDueDate ? taskDueDate.toLocaleDateString() : "选择日期"}
                    </Text>
                  </View>
                </TouchableOpacity>

                {showDatePicker && (
                  <DateTimePicker
                    value={taskDueDate || new Date()}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={handleDateChange}
                  />
                )}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>状态</Text>
                <View style={styles.switchContainer}>
                  <Switch
                    value={taskCompleted}
                    onValueChange={setTaskCompleted}
                    trackColor={{ false: "#ddd", true: "#bae6fd" }}
                    thumbColor={taskCompleted ? "#0070f3" : "#f4f3f4"}
                  />
                  <Text style={styles.switchLabel}>标记为已完成</Text>
                </View>
              </View>
            </View>

            <View style={styles.footer}>
              <TouchableOpacity style={styles.deleteButton} onPress={confirmDelete}>
                <Ionicons name="trash-outline" size={18} color="#ff4d4f" />
              </TouchableOpacity>

              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[styles.button, styles.buttonCancel]}
                  onPress={onClose}
                  disabled={isSubmitting}
                >
                  <Text style={styles.buttonCancelText}>取消</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.buttonPrimary, isSubmitting && styles.buttonDisabled]}
                  onPress={handleSubmit}
                  disabled={isSubmitting}
                >
                  <Text style={styles.buttonPrimaryText}>{isSubmitting ? "保存中..." : "保存更改"}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#000",
  },
  description: {
    fontSize: 14,
    color: "#666",
  },
  form: {
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: "500",
    color: "#000",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: "#000",
    backgroundColor: "#fff",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  selectButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
  },
  selectButtonText: {
    fontSize: 16,
    color: "#000",
  },
  dateButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  switchLabel: {
    marginLeft: 10,
    fontSize: 16,
    color: "#000",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ffccc7",
    backgroundColor: "#fff1f0",
  },
  actionButtons: {
    flexDirection: "row",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  buttonCancel: {
    backgroundColor: "#f1f1f1",
  },
  buttonCancelText: {
    color: "#333",
  },
  buttonPrimary: {
    backgroundColor: "#0070f3",
  },
  buttonPrimaryText: {
    color: "white",
    fontWeight: "500",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
})

