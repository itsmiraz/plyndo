"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { TaskItem } from "./task-item"
import { DndContext, type DragEndEvent, DragOverlay, type DragStartEvent } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { DroppableColumn } from "./droppable-column"
import { AlertCircle, Clock, CheckCircle } from "lucide-react"
import type { Task } from "./weekly-todo-manager"

interface KanbanBoardProps {
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

export function KanbanBoard({ tasks, onUpdateTask, onEditTask, onDeleteTask }: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id)
    setActiveTask(task || null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) return

    const taskId = active.id as string
    const newStatus = over.id as Task["status"]

    if (newStatus !== activeTask?.status) {
      onUpdateTask(taskId, { status: newStatus })
    }

    setActiveTask(null)
  }

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {COLUMNS.map((column) => {
          const columnTasks = tasks.filter((task) => task.status === column.id)
          const Icon = column.icon

          return (
            <DroppableColumn key={column.id} id={column.id}>
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg h-fit">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        column.color === "slate"
                          ? "bg-slate-100"
                          : column.color === "yellow"
                            ? "bg-yellow-100"
                            : "bg-green-100"
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 ${
                          column.color === "slate"
                            ? "text-slate-600"
                            : column.color === "yellow"
                              ? "text-yellow-600"
                              : "text-green-600"
                        }`}
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{column.title}</h3>
                      <p className="text-sm text-slate-600">{columnTasks.length} tasks</p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <SortableContext items={columnTasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-3 min-h-[300px]">
                      {columnTasks.map((task) => (
                        <TaskItem
                          key={task.id}
                          task={task}
                          onEdit={() => onEditTask(task)}
                          onUpdate={(updates) => onUpdateTask(task.id, updates)}
                          onDelete={() => onDeleteTask(task.id)}
                          isDraggable
                        />
                      ))}

                      {columnTasks.length === 0 && (
                        <div className="flex items-center justify-center h-32 text-slate-400 border-2 border-dashed border-slate-200 rounded-lg">
                          <p className="text-sm">Drop tasks here</p>
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
          <div className="rotate-3 opacity-90">
            <TaskItem task={activeTask} onEdit={() => {}} onUpdate={() => {}} onDelete={() => {}} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
