import * as React from "react"

import { cn } from "@/lib/utils"
import { View, ViewProps, Text } from "react-native"

const Card = React.forwardRef<
  View, ViewProps
>(({ className, ...props }, ref) => (
  <View
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground",
      className
    )}
    // style={{
    //   elevation: 4, // Android shadow
    //   shadowColor: '#000', // iOS shadow
    //   shadowOffset: { width: 0, height: 2 },
    //   shadowOpacity: 0.1,
    //   shadowRadius: 4,
    // }}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  View, ViewProps
>(({ className, ...props }, ref) => (
  <View
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  View, ViewProps
>(({ className, ...props}, ref) => (
  <View
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  >
  </View>
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  View, ViewProps
>(({ className, children, ...props }, ref) => (
  <Text
    className={cn("text-sm text-muted-foreground", className)}
  >
    {children}
  </Text>
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  View, ViewProps
>(({ className, ...props }, ref) => (
  <View ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  View, ViewProps
>(({ className, ...props }, ref) => (
  <View
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
