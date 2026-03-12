"use client"

import React, { useRef, useState, useCallback } from "react"
import { motion } from "framer-motion"

interface MagneticButtonProps {
    children: React.ReactNode
    className?: string
    distance?: number
    strength?: number
}

export function MagneticButton({
    children,
    className = "",
    distance = 0.6,
    strength = 40
}: MagneticButtonProps) {
    const ref = useRef<HTMLDivElement>(null)
    const [position, setPosition] = useState({ x: 0, y: 0 })

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!ref.current) return

        const { clientX, clientY } = e
        const { left, top, width, height } = ref.current.getBoundingClientRect()

        const centerX = left + width / 2
        const centerY = top + height / 2

        const distanceX = clientX - centerX
        const distanceY = clientY - centerY

        if (Math.abs(distanceX) < width * distance && Math.abs(distanceY) < height * distance) {
            setPosition({
                x: distanceX * (strength / 100),
                y: distanceY * (strength / 100)
            })
        } else {
            setPosition({ x: 0, y: 0 })
        }
    }, [distance, strength])

    const handleMouseLeave = useCallback(() => {
        setPosition({ x: 0, y: 0 })
    }, [])

    return (
        <div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`relative inline-block ${className}`}
        >
            <motion.div
                animate={{ x: position.x, y: position.y }}
                transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
            >
                {children}
            </motion.div>
        </div>
    )
}
