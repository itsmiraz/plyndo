"use client"

import { useState, useEffect } from "react"
import { WeekSelector } from "./week-selector"
import { KanbanBoard } from "./kanban-board"
import { DailyTaskList } from "./daily-task-list"
import { ProgressTracker } from "./progress-tracker"
import { TaskForm } from "./task-form"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Calendar, Columns3 } from "lucide-react"
import { format, startOfWeek, addDays, isSameWeek } from "date-fns"

export interface Task {
  id: string
  title: string
  description?: string
  priority: "low" | "medium" | "high"
  status: "todo" | "in-progress" | "completed"
  deadline?: Date
  dayOfWeek: number // 0 = Monday, 6 = Sunday
  weekStart: Date
  createdAt: Date
}

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

export function WeeklyTodoManager() {
  const [currentWeek, setCurrentWeek] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }))
  const [tasks, setTasks] = useState<Task[]>([])
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState("daily")

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem("weekly-todo-tasks")
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks).map((task: any) => ({
        ...task,
        deadline: task.deadline ? new Date(task.deadline) : undefined,
        weekStart: new Date(task.weekStart),
        createdAt: new Date(task.createdAt),
      }))
      setTasks(parsedTasks)
    }
  }, [])

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem("weekly-todo-tasks", JSON.stringify(tasks))
  }, [tasks])

  const currentWeekTasks = tasks.filter((task) => isSameWeek(task.weekStart, currentWeek, { weekStartsOn: 1 }))

  const addTask = (taskData: Omit<Task, "id" | "createdAt">) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    }
    setTasks((prev) => [...prev, newTask])
  }

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, ...updates } : task)))
  }

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId))
  }

  const rollForwardTasks = () => {
    const incompleteTasks = currentWeekTasks.filter((task) => task.status !== "completed")
    const nextWeek = addDays(currentWeek, 7)

    const rolledTasks = incompleteTasks.map((task) => ({
      ...task,
      id: crypto.randomUUID(),
      weekStart: nextWeek,
      status: "todo" as const,
      createdAt: new Date(),
    }))

    setTasks((prev) => [...prev, ...rolledTasks])
    setCurrentWeek(nextWeek)
  }

  const openTaskForm = (day?: number) => {
    setSelectedDay(day ?? null)
    setEditingTask(null)
    setIsTaskFormOpen(true)
  }

  const openEditForm = (task: Task) => {
    setEditingTask(task)
    setSelectedDay(null)
    setIsTaskFormOpen(true)
  }

  const closeTaskForm = () => {
    setIsTaskFormOpen(false)
    setEditingTask(null)
    setSelectedDay(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Weekly Planner</h1>
            <p className="text-slate-600">
              Week of {format(currentWeek, "MMM d")} - {format(addDays(currentWeek, 6), "MMM d, yyyy")}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={() => openTaskForm()} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
            <Button
              onClick={rollForwardTasks}
              variant="outline"
              disabled={currentWeekTasks.filter((t) => t.status !== "completed").length === 0}
            >
              Roll Forward
            </Button>
          </div>
        </div>

        {/* Week Selector */}
        <WeekSelector currentWeek={currentWeek} onWeekChange={setCurrentWeek} />

        {/* Progress Tracker */}
        <ProgressTracker tasks={currentWeekTasks} />

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
          <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:grid-cols-2">
            <TabsTrigger value="daily" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Daily View
            </TabsTrigger>
            <TabsTrigger value="kanban" className="flex items-center gap-2">
              <Columns3 className="w-4 h-4" />
              Kanban Board
            </TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {DAYS_OF_WEEK.map((day, index) => {
                const dayTasks = currentWeekTasks.filter((task) => task.dayOfWeek === index)
                const dayDate = addDays(currentWeek, index)

                return (
                  <DailyTaskList
                    key={day}
                    day={day}
                    dayIndex={index}
                    date={dayDate}
                    tasks={dayTasks}
                    onAddTask={() => openTaskForm(index)}
                    onEditTask={openEditForm}
                    onUpdateTask={updateTask}
                    onDeleteTask={deleteTask}
                  />
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="kanban" className="mt-6">
            <KanbanBoard
              tasks={currentWeekTasks}
              onUpdateTask={updateTask}
              onEditTask={openEditForm}
              onDeleteTask={deleteTask}
            />
          </TabsContent>
        </Tabs>

        {/* Task Form Modal */}
        {isTaskFormOpen && (
          <TaskForm
            task={editingTask}
            selectedDay={selectedDay}
            currentWeek={currentWeek}
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
