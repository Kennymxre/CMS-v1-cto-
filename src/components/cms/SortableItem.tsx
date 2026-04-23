"use client"

import React from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

interface SortableItemProps {
  id: string
  children: (props: {
    attributes: any
    listeners: any
    setNodeRef: (node: HTMLElement | null) => void
    style: React.CSSProperties
    isDragging: boolean
  }) => React.ReactNode
}

export function SortableItem({ id, children }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return <>{children({ attributes, listeners, setNodeRef, style, isDragging })}</>
}
