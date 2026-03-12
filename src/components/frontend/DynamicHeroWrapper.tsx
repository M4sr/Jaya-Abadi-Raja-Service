"use client"

import * as React from "react"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import { cn } from "@/lib/utils"

interface DynamicHeroWrapperProps {
    children: React.ReactNode
    className?: string
    containerRef?: React.RefObject<HTMLElement | null>
}

export function DynamicHeroWrapper({ children, className, containerRef }: DynamicHeroWrapperProps) {
    const internalRef = React.useRef<HTMLElement>(null)
    const targetRef = containerRef || internalRef

    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end start"]
    })

    const [isMobile, setIsMobile] = React.useState(false)
    React.useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 640)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 }
    
    // Dynamic Border Radius based on scroll
    // On scroll 0: sharp. On scroll > 0.15: fully rounded (Responsive).
    const radiusValue = isMobile ? 40 : 100
    const borderRadius = useTransform(scrollYProgress, [0, 0.15], [0, radiusValue])
    const smoothedBorderRadius = useSpring(borderRadius, springConfig)

    return (
        <motion.section
            ref={targetRef}
            style={{ 
                borderBottomLeftRadius: smoothedBorderRadius,
                borderBottomRightRadius: smoothedBorderRadius
            }}
            className={cn("relative overflow-hidden", className)}
        >
            {children}
        </motion.section>
    )
}
