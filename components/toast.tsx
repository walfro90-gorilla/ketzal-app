import * as React from "react"
import { cn } from "@/lib/utils"

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  action?: React.ReactNode
}

export const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, title, description, action, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "fixed bottom-4 right-4 z-50 rounded-md bg-white p-4 shadow-lg",
          className
        )}
        {...props}
      >
        {title && <div className="font-semibold">{title}</div>}
        {description && <div className="mt-1 text-sm">{description}</div>}
        {action && <div className="mt-2">{action}</div>}
      </div>
    )
  }
)
Toast.displayName = "Toast"

export const ToastAction = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background hover:bg-secondary text-secondary-foreground hover:text-secondary-foreground h-10 py-2 px-4 mt-2",
      className
    )}
    {...props}
  />
))
ToastAction.displayName = "ToastAction"

