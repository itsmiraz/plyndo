"use client"

import type React from "react"

import { useDroppable } from "@dnd-kit/core"

interface DroppableColumnProps {
  id: string
  children: React.ReactNode
}

export function DroppableColumn({ id, children }: DroppableColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id })

  return (
    <div ref={setNodeRef} className={`transition-all ${isOver ? "scale-105" : ""}`}>
      {children}
    </div>
  )
}
