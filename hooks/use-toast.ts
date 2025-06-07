import { toast as sonnerToast, type ToastT } from "sonner"

type ToastProps = {
  title?: string
  titleT?: string // For backward compatibility
  description?: string
  variant?: "default" | "destructive" | "success" | "info" | "warning"
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

export const useToast = () => {
  const toast = ({
    title,
    titleT, // For backward compatibility
    description,
    variant = "default",
    duration = 5000,
    action
  }: ToastProps) => {
    // Use titleT as fallback for backward compatibility
    const displayTitle = title || titleT || ""
    
    switch (variant) {
      case "success":
        return sonnerToast.success(displayTitle, { 
          description, 
          duration,
          action: action ? {
            label: action.label,
            onClick: action.onClick
          } : undefined
        })
      case "info":
        return sonnerToast.info(displayTitle, { 
          description, 
          duration,
          action: action ? {
            label: action.label,
            onClick: action.onClick
          } : undefined
        })
      case "warning":
        return sonnerToast.warning(displayTitle, { 
          description, 
          duration,
          action: action ? {
            label: action.label,
            onClick: action.onClick
          } : undefined
        })
      case "destructive":
        return sonnerToast.error(displayTitle, { 
          description, 
          duration,
          action: action ? {
            label: action.label,
            onClick: action.onClick
          } : undefined
        })
      default:
        return sonnerToast(displayTitle, { 
          description, 
          duration,
          action: action ? {
            label: action.label,
            onClick: action.onClick
          } : undefined
        })
    }
  }

  return {
    toast
  }
}
