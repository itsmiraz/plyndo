"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { EnhancedTaskItem } from "./enhanced-task-item"
import { 
  DndContext, 
  type DragEndEvent, 
  DragOverlay, 
  type DragStartEvent,
  type DragOverEvent,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { DroppableColumn } from "./droppable-column"
import { AlertCircle, Clock, CheckCircle } from 'lucide-react'
import type { Task } from "./smart-task-manager"

interface EnhancedKanbanBoardProps {
  tasks: Task[]
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void
  onEditTask: (task: Task) => void
  onDeleteTask: (taskId: string) => void
}

const COLUMNS = [
  { id: "todo", title: "To Do", icon: AlertCircle, color: "slate" },
  { id: "in-progress", title: "In Progress", icon: Clock, color: "yellow" },
  { id: "completed", title: "Completed", icon: CheckCircle, color: "green" },
] as const

export function EnhancedKanbanBoard({ tasks, onUpdateTask, onEditTask, onDeleteTask }: EnhancedKanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [overId, setOverId] = useState<string | null>(null)

  // Configure sensors for better touch and mouse support
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px of movement before drag starts
      },
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id)
    setActiveTask(task || null)
  }

  const handleDragOver = (event: DragOverEvent) => {
    setOverId(event.over?.id as string || null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) {
      setActiveTask(null)
      setOverId(null)
      return
    }

    const taskId = active.id as string
    const newStatus = over.id as Task["status"]

    if (newStatus !== activeTask?.status) {
      onUpdateTask(taskId, { status: newStatus })
    }

    setActiveTask(null)
    setOverId(null)
  }

  const handleDragCancel = () => {
    setActiveTask(null)
    setOverId(null)
  }

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart} 
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {COLUMNS.map((column) => {
          const columnTasks = tasks.filter((task) => task.status === column.id)
          const Icon = column.icon
          const isOver = overId === column.id

          return (
            <DroppableColumn key={column.id} id={column.id}>
              <Card 
                className={`bg-card/50 backdrop-blur-sm border-border/50 transition-all duration-300 ${
                  isOver 
                    ? "ring-2 ring-primary/50 bg-primary/5 scale-[1.02] shadow-xl" 
                    : ""
                }`}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg transition-all duration-300 ${
                        column.color === "slate"
                          ? "bg-muted"
                          : column.color === "yellow"
                            ? "bg-yellow-100 dark:bg-yellow-900/30"
                            : "bg-green-100 dark:bg-green-900/30"
                      } ${isOver ? "bg-primary/20 scale-110" : ""}`}
                    >
                      <Icon
                        className={`w-4 h-4 transition-all duration-300 ${
                          isOver 
                            ? "text-primary scale-110" 
                            : column.color === "slate"
                              ? "text-muted-foreground"
                              : column.color === "yellow"
                                ? "text-yellow-600 dark:text-yellow-400"
                                : "text-green-600 dark:text-green-400"
                        }`}
                      />
                    </div>
                    <div>
                      <h3 className={`font-semibold transition-colors duration-300 ${
                        isOver ? "text-primary" : "text-foreground"
                      }`}>
                        {column.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{columnTasks.length} tasks</p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <SortableContext items={columnTasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                    <div className={`space-y-3 min-h-[300px] p-3 rounded-lg transition-all duration-300 ${
                      isOver ? "bg-gradient-to-b from-primary/10 to-primary/5" : ""
                    }`}>
                      {columnTasks.map((task) => (
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

                      {columnTasks.length === 0 && (
                        <div className={`flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-lg transition-all duration-300 ${
                          isOver 
                            ? "border-primary/50 bg-primary/10 text-primary scale-105" 
                            : "border-border/50 text-muted-foreground/50"
                        }`}>
                          <Icon className={`w-8 h-8 mb-2 transition-all duration-300 ${
                            isOver ? "text-primary animate-bounce" : "text-muted-foreground/30"
                          }`} />
                          <p className={`text-sm font-medium transition-all duration-300 ${
                            isOver ? "text-primary" : "text-muted-foreground/50"
                          }`}>
                            {isOver ? "Drop task here!" : "No tasks"}
                          </p>
                          {isOver && (
                            <div className="mt-2 w-8 h-1 bg-primary/50 rounded-full animate-pulse" />
                          )}
                        </div>
                      )}
                    </div>
                  </SortableContext>
                </CardContent>
              </Card>
            </DroppableColumn>
          )
        })}
      </div>

      <DragOverlay>
        {activeTask && (
          <div className="rotate-3 opacity-95 transform scale-105">
            <Card className="bg-card shadow-2xl ring-2 ring-primary/50 border-primary/20">
              <CardContent className="p-3">
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm mb-1 text-foreground">
                      {activeTask.title}
                    </h4>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        activeTask.priority === "high" 
                          ? "bg-red-100 text-red-700" 
                          : activeTask.priority === "medium"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                      }`}>
                        {activeTask.priority}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
