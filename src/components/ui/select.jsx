import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const SelectContext = React.createContext({
  value: null,
  onValueChange: () => {},
  isOpen: false,
  setIsOpen: () => {},
  selectedLabel: null,
  setSelectedLabel: () => {}
})

const Select = ({ value, onValueChange, children, ...props }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [selectedLabel, setSelectedLabel] = React.useState(null)
  const selectRef = React.useRef(null)

  // Atualiza o label quando o value muda
  React.useEffect(() => {
    if (value && React.Children.toArray(children).length > 0) {
      // Procura o SelectItem correspondente ao value
      const findLabel = (children) => {
        return React.Children.toArray(children).find(child => {
          if (React.isValidElement(child)) {
            if (child.type === SelectItem && child.props.value === value) {
              return child.props.children
            }
            if (child.props?.children) {
              const found = findLabel(child.props.children)
              if (found) return found
            }
          }
          return null
        })
      }
      const label = findLabel(children)
      if (label) setSelectedLabel(label)
    } else {
      setSelectedLabel(null)
    }
  }, [value, children])

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <SelectContext.Provider value={{ value, onValueChange, isOpen, setIsOpen, selectedLabel, setSelectedLabel }}>
      <div ref={selectRef} className="relative" {...props}>
        {children}
      </div>
    </SelectContext.Provider>
  )
}

const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => {
  const { isOpen, setIsOpen, selectedLabel } = React.useContext(SelectContext)
  
  return (
    <button
      ref={ref}
      type="button"
      onClick={() => setIsOpen(!isOpen)}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <span>{selectedLabel || children}</span>
      <ChevronDown className={cn("h-4 w-4 opacity-50 transition-transform", isOpen && "rotate-180")} />
    </button>
  )
})
SelectTrigger.displayName = "SelectTrigger"

const SelectValue = ({ placeholder, children }) => {
  const { selectedLabel, value } = React.useContext(SelectContext)
  // Se children for fornecido, usa ele (permite override)
  if (children) return <span>{children}</span>
  return <span>{selectedLabel || placeholder}</span>
}
SelectValue.displayName = "SelectValue"

const SelectContent = React.forwardRef(({ className, children, ...props }, ref) => {
  const { isOpen } = React.useContext(SelectContext)
  
  if (!isOpen) return null
  
  return (
    <div
      ref={ref}
      className={cn(
        "absolute z-50 mt-1 max-h-96 min-w-full overflow-auto rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-lg",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})
SelectContent.displayName = "SelectContent"

const SelectItem = React.forwardRef(({ className, children, value: itemValue, ...props }, ref) => {
  const { value, onValueChange, setIsOpen, setSelectedLabel } = React.useContext(SelectContext)
  const isSelected = value === itemValue
  
  return (
    <div
      ref={ref}
      onClick={() => {
        onValueChange?.(itemValue)
        setSelectedLabel?.(children)
        setIsOpen(false)
      }}
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700",
        isSelected && "bg-gray-100 dark:bg-gray-700",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})
SelectItem.displayName = "SelectItem"

export {
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
}



