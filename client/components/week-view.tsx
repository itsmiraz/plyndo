"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { EnhancedTaskItem } from "./enhanced-task-item"
import { Plus } from 'lucide-react'
import { format, addDays, isToday, isSameDay } from "date-fns"
import { 
  DndContext, 
  type DragEndEvent,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core"
import type { Task } from "./smart-task-manager"

interface WeekViewProps {
  weekStart: Date
  tasks: Task[]
  onAddTask: (date: Date) => void
  onEditTask: (task: Task) => void
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void
  onDeleteTask: (taskId: string) => void
}

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

export function WeekView({ weekStart, tasks, onAddTask, onEditTask, onUpdateTask, onDeleteTask }: WeekViewProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return

    const taskId = active.id as string
    const overId = over.id as string
    
    // Check if dropped on a status column or day column
    if (["todo", "in-progress", "completed"].includes(overId)) {
      onUpdateTask(taskId, { status: overId as Task["status"] })
    } else if (overId.startsWith("day-")) {
      const dayIndex = parseInt(overId.split("-")[1])
      const newDate = addDays(weekStart, dayIndex)
      onUpdateTask(taskId, { date: newDate })
    }
  }

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
        {DAYS_OF_WEEK.map((day, index) => {
          const dayDate = addDays(weekStart, index)
          const dayTasks = tasks.filter((task) => isSameDay(task.date, dayDate))
          
          const sortedTasks = [...dayTasks].sort((a, b) => {
            const priorityOrder = { high: 3, medium: 2, low: 1 }
            if (a.status !== b.status) {
              const statusOrder = { todo: 3, "in-progress": 2, completed: 1 }
              return statusOrder[b.status] - statusOrder[a.status]
            }
            return priorityOrder[b.priority] - priorityOrder[a.priority]
          })

          return (
            <Card
              key={day}
              className={`bg-card/50 backdrop-blur-sm border-border/50 transition-all hover:shadow-lg ${
                isToday(dayDate) ? "ring-2 ring-primary/20 bg-primary/5" : ""
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`font-semibold ${isToday(dayDate) ? "text-primary" : "text-foreground"}`}>
                      {day}
                    </h3>
                    <p className="text-sm text-muted-foreground">{format(dayDate, "MMM d")}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onAddTask(dayDate)}
                    className="h-8 w-8 p-0 hover:bg-primary/10"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div
                  id={`day-${index}`}
                  className="space-y-2 min-h-[300px]"
                >
                  {sortedTasks.map((task) => (
                    <EnhancedTaskItem
                      key={task.id}
                      task={task}
                      onEdit={() => onEditTask(task)}
                      onUpdate={(updates) => onUpdateTask(task.id, updates)}
                      onDelete={() => onDeleteTask(task.id)}
                      isDraggable
                      compact
                    />
                  ))}

                  {dayTasks.length === 0 && (
                    <div className="flex items-center justify-center h-32 text-muted-foreground/50 border-2 border-dashed border-border/50 rounded-lg">
                      <p className="text-sm">No tasks</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </DndContext>
  )
}
