"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Edit, Trash2, Clock } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { format } from "date-fns"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import type { Task } from "./weekly-todo-manager"

interface TaskItemProps {
  task: Task
  onEdit: () => void
  onUpdate: (updates: Partial<Task>) => void
  onDelete: () => void
  isDraggable?: boolean
}

const PRIORITY_COLORS = {
  low: "bg-green-100 text-green-700 border-green-200",
  medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
  high: "bg-red-100 text-red-700 border-red-200",
}

const STATUS_COLORS = {
  todo: "bg-slate-100 text-slate-700",
  "in-progress": "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
}

export function TaskItem({ task, onEdit, onUpdate, onDelete, isDraggable = false }: TaskItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    disabled: !isDraggable,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const toggleComplete = () => {
    const newStatus = task.status === "completed" ? "todo" : "completed"
    onUpdate({ status: newStatus })
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...(isDraggable ? listeners : {})}
      className={`bg-white border-0 shadow-sm hover:shadow-md transition-all cursor-pointer ${
        isDraggable ? "hover:scale-105" : ""
      } ${task.status === "completed" ? "opacity-75" : ""}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Checkbox checked={task.status === "completed"} onCheckedChange={toggleComplete} className="mt-1" />

          <div className="flex-1 min-w-0">
            <h4
              className={`font-medium text-sm mb-1 ${
                task.status === "completed" ? "line-through text-slate-500" : "text-slate-900"
              }`}
            >
              {task.title}
            </h4>

            {task.description && <p className="text-xs text-slate-600 mb-2 line-clamp-2">{task.description}</p>}

            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className={`text-xs ${PRIORITY_COLORS[task.priority]}`}>
                {task.priority}
              </Badge>

              <Badge variant="outline" className={`text-xs ${STATUS_COLORS[task.status]}`}>
                {task.status.replace("-", " ")}
              </Badge>

              {task.deadline && (
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <Clock className="w-3 h-3" />
                  {format(task.deadline, "MMM d, h:mm a")}
                </div>
              )}
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-red-600">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  )
}
