"use client"

import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from "react-native"

interface AddListDialogProps {
  visible: boolean
  onClose: () => void
  onAddList: (name: string) => void
}

export default function AddListDialog({ visible, onClose, onAddList }: AddListDialogProps) {
  const [listName, setListName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!listName.trim()) {
      // 在实际应用中，这里应该显示一个错误提示
      return
    }

    setIsSubmitting(true)

    try {
      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 500))
      onAddList(listName)
      setListName("")
      onClose()
    } catch (error) {
      // 处理错误
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>创建新列表</Text>
            <Text style={styles.description}>创建一个新的待办事项列表来组织你的任务。</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>名称</Text>
            <TextInput
              style={styles.input}
              value={listName}
              onChangeText={setListName}
              placeholder="例如：工作、个人、购物"
              placeholderTextColor="#999"
              autoFocus
            />
          </View>

          <View style={styles.footer}>
            <TouchableOpacity style={[styles.button, styles.buttonCancel]} onPress={onClose} disabled={isSubmitting}>
              <Text style={styles.buttonCancelText}>取消</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonPrimary, isSubmitting && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <Text style={styles.buttonPrimaryText}>{isSubmitting ? "创建中..." : "创建列表"}</Text>
            </TouchableOpacity>
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
    justifyContent: "flex-end",
    gap: 10,
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

