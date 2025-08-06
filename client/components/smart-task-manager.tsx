"use client"

import { useState, useEffect } from "react"
import { ViewSwitcher } from "./view-switcher"
import { TimeNavigation } from "./time-navigation"
import { DayView } from "./day-view"
import { WeekView } from "./week-view"
import { MonthView } from "./month-view"
import { TaskForm } from "./enhanced-task-form"
import { ProgressIndicator } from "./progress-indicator"
import { ThemeToggle } from "./theme-toggle"
import { UserProfileDropdown } from "./user-profile-dropdown"
import { Button } from "@/components/ui/button"
import { Plus, Settings } from 'lucide-react'
import { format, startOfWeek, startOfMonth, startOfDay, addDays, addWeeks, addMonths, subDays, subWeeks, subMonths } from "date-fns"

export type ViewMode = "day" | "week" | "month"

export interface Task {
  id: string
  title: string
  description?: string
  date: Date
  priority: "low" | "medium" | "high"
  status: "todo" | "in-progress" | "completed"
  tags: string[]
  createdAt: Date
  completedAt?: Date
}

export function SmartTaskManager() {
  const [viewMode, setViewMode] = useState<ViewMode>("week")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [tasks, setTasks] = useState<Task[]>([])
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  // Load data from localStorage on mount
  useEffect(() => {
    const savedViewMode = localStorage.getItem("smart-task-manager-view")
    const savedTasks = localStorage.getItem("smart-task-manager-tasks")
    
    if (savedViewMode && ["day", "week", "month"].includes(savedViewMode)) {
      setViewMode(savedViewMode as ViewMode)
    }
    
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks).map((task: any) => ({
        ...task,
        date: new Date(task.date),
        createdAt: new Date(task.createdAt),
        completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
      }))
      setTasks(parsedTasks)
    }
  }, [])

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem("smart-task-manager-view", viewMode)
  }, [viewMode])

  useEffect(() => {
    localStorage.setItem("smart-task-manager-tasks", JSON.stringify(tasks))
  }, [tasks])

  const addTask = (taskData: Omit<Task, "id" | "createdAt">) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    }
    setTasks((prev) => [...prev, newTask])
  }

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          const updatedTask = { ...task, ...updates }
          if (updates.status === "completed" && task.status !== "completed") {
            updatedTask.completedAt = new Date()
          } else if (updates.status !== "completed") {
            updatedTask.completedAt = undefined
          }
          return updatedTask
        }
        return task
      })
    )
  }

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId))
  }

  const navigateTime = (direction: "prev" | "next") => {
    if (viewMode === "day") {
      setCurrentDate(direction === "next" ? addDays(currentDate, 1) : subDays(currentDate, 1))
    } else if (viewMode === "week") {
      setCurrentDate(direction === "next" ? addWeeks(currentDate, 1) : subWeeks(currentDate, 1))
    } else {
      setCurrentDate(direction === "next" ? addMonths(currentDate, 1) : subMonths(currentDate, 1))
    }
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const openTaskForm = (date?: Date) => {
    setSelectedDate(date || null)
    setEditingTask(null)
    setIsTaskFormOpen(true)
  }

  const openEditForm = (task: Task) => {
    setEditingTask(task)
    setSelectedDate(null)
    setIsTaskFormOpen(true)
  }

  const closeTaskForm = () => {
    setIsTaskFormOpen(false)
    setEditingTask(null)
    setSelectedDate(null)
  }

  const rolloverTasks = () => {
    const incompleteTasks = tasks.filter((task) => 
      task.status !== "completed" && 
      task.date < startOfDay(new Date())
    )

    const rolledTasks = incompleteTasks.map((task) => ({
      ...task,
      id: crypto.randomUUID(),
      date: new Date(),
      createdAt: new Date(),
    }))

    setTasks((prev) => [...prev, ...rolledTasks])
  }

  const getViewTitle = () => {
    switch (viewMode) {
      case "day":
        return format(currentDate, "EEEE, MMMM d, yyyy")
      case "week":
        const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
        const weekEnd = addDays(weekStart, 6)
        return `${format(weekStart, "MMM d")} - ${format(weekEnd, "MMM d, yyyy")}`
      case "month":
        return format(currentDate, "MMMM yyyy")
      default:
        return ""
    }
  }

  const getCurrentPeriodTasks = () => {
    switch (viewMode) {
      case "day":
        return tasks.filter((task) => 
          format(task.date, "yyyy-MM-dd") === format(currentDate, "yyyy-MM-dd")
        )
      case "week":
        const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
        const weekEnd = addDays(weekStart, 6)
        return tasks.filter((task) => 
          task.date >= weekStart && task.date <= weekEnd
        )
      case "month":
        const monthStart = startOfMonth(currentDate)
        const monthEnd = addDays(addMonths(monthStart, 1), -1)
        return tasks.filter((task) => 
          task.date >= monthStart && task.date <= monthEnd
        )
      default:
        return []
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 dark:from-background dark:to-muted/10">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Smart Task Manager</h1>
            <p className="text-muted-foreground">{getViewTitle()}</p>
          </div>
          
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <UserProfileDropdown />
            <Button onClick={() => openTaskForm()} className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
            <Button
              onClick={rolloverTasks}
              variant="outline"
              disabled={tasks.filter(t => t.status !== "completed" && t.date < startOfDay(new Date())).length === 0}
            >
              Rollover Tasks
            </Button>
          </div>
        </div>

        {/* View Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <ViewSwitcher currentView={viewMode} onViewChange={setViewMode} />
          <TimeNavigation
            viewMode={viewMode}
            onNavigate={navigateTime}
            onGoToToday={goToToday}
          />
        </div>

        {/* Progress Indicator */}
        <ProgressIndicator tasks={getCurrentPeriodTasks()} viewMode={viewMode} />

        {/* Main Content */}
        <div className="mt-8">
          {viewMode === "day" && (
            <DayView
              date={currentDate}
              tasks={getCurrentPeriodTasks()}
              onAddTask={() => openTaskForm(currentDate)}
              onEditTask={openEditForm}
              onUpdateTask={updateTask}
              onDeleteTask={deleteTask}
            />
          )}

          {viewMode === "week" && (
            <WeekView
              weekStart={startOfWeek(currentDate, { weekStartsOn: 1 })}
              tasks={getCurrentPeriodTasks()}
              onAddTask={openTaskForm}
              onEditTask={openEditForm}
              onUpdateTask={updateTask}
              onDeleteTask={deleteTask}
            />
          )}

          {viewMode === "month" && (
            <MonthView
              month={currentDate}
              tasks={getCurrentPeriodTasks()}
              onAddTask={openTaskForm}
              onEditTask={openEditForm}
              onDateSelect={setCurrentDate}
            />
          )}
        </div>

        {/* Task Form Modal */}
        {isTaskFormOpen && (
          <TaskForm
            task={editingTask}
            selectedDate={selectedDate}
            onSave={(taskData) => {
              if (editingTask) {
                updateTask(editingTask.id, taskData)
              } else {
                addTask(taskData)
              }
              closeTaskForm()
            }}
            onCancel={closeTaskForm}
          />
        )}
      </div>
    </div>
  )
}
