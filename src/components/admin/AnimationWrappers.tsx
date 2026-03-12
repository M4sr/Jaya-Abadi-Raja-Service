"use client"

import { motion } from "framer-motion"

export const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
}

export const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring" as const,
            stiffness: 300,
            damping: 24
        }
    }
}

export const PageWrapper = ({ children, className = "space-y-6" }: { children: React.ReactNode, className?: string }) => (
    <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className={className}
    >
        {children}
    </motion.div>
)

export const AnimationItem = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <motion.div variants={itemVariants} className={className}>
        {children}
    </motion.div>
)
