"use client"

import { useState, useEffect } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"

interface TodoList {
  id: string
  name: string
}

interface EditListDialogProps {
  visible: boolean
  onClose: () => void
  list: TodoList | null
  onUpdateList: (id: string, name: string) => void
  onDeleteList: (id: string) => void
}

export default function EditListDialog({ visible, onClose, list, onUpdateList, onDeleteList }: EditListDialogProps) {
  const [listName, setListName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (list) {
      setListName(list.name)
    }
  }, [list])

  const handleSubmit = async () => {
    if (!list) return

    if (!listName.trim()) {
      // 在实际应用中，这里应该显示一个错误提示
      return
    }

    setIsSubmitting(true)

    try {
      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 500))
      onUpdateList(list.id, listName)
      onClose()
    } catch (error) {
      // 处理错误
    } finally {
      setIsSubmitting(false)
    }
  }

  const confirmDelete = () => {
    if (!list) return

    Alert.alert("确认删除", `这将永久删除"${list.name}"列表及其所有任务。此操作无法撤销。`, [
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
    if (!list) return

    try {
      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 500))
      onDeleteList(list.id)
      onClose()
    } catch (error) {
      // 处理错误
    }
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>编辑列表</Text>
            <Text style={styles.description}>更新您的待办事项列表详情。</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>名称</Text>
            <TextInput
              style={styles.input}
              value={listName}
              onChangeText={setListName}
              placeholderTextColor="#999"
              autoFocus
            />
          </View>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.deleteButton} onPress={confirmDelete}>
              <Ionicons name="trash-outline" size={18} color="#ff4d4f" />
            </TouchableOpacity>

            <View style={styles.actionButtons}>
              <TouchableOpacity style={[styles.button, styles.buttonCancel]} onPress={onClose} disabled={isSubmitting}>
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
    width: "85%",
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
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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

