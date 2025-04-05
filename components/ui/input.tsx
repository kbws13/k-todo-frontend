import React from "react"
import { TextInput, TextInputProps, NativeSyntheticEvent, TextInputKeyPressEventData } from "react-native"
import { useCallback } from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends Omit<TextInputProps, "onChange" | "onKeyDown"> {
  className?: string
  value?: string
  placeholder?: string
  onChange?: (e: { target: { value: string } }) => void
  onKeyDown?: (e: { key: string }) => void
}

const Input = React.forwardRef<TextInput, InputProps>(
  ({ className, onChange, onKeyDown, value, placeholder, ...props }, ref) => {
    const handleChangeText = useCallback(
      (text: string) => {
        onChange?.({ target: { value: text } })
      },
      [onChange]
    )

    const handleKeyPress = useCallback(
      (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
        const key = e.nativeEvent.key
        if (onKeyDown) {
          onKeyDown({ key })
        }
      },
      [onKeyDown]
    )

    return (
      <TextInput
        ref={ref}
        value={value}
        placeholder={placeholder}
        onChangeText={handleChangeText}
        onKeyPress={handleKeyPress}
        placeholderTextColor="#9ca3af"
        className={cn(
          "h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base text-black placeholder:text-gray-400",
          className
        )}
        {...props}
      />
    )
  }
)

Input.displayName = "Input"

export { Input }
