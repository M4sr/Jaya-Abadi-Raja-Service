"use client"

import React, { useEffect, useRef } from 'react'

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    alpha: number;
    life: number;
    color: string;
}

export function SnowCursorEffect() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const particles = useRef<Particle[]>([])
    const mouse = useRef({ x: 0, y: 0, active: false })

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let animationFrameId: number

        const updateCanvasSize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }

        const createParticle = (x: number, y: number, isBurst = false) => {
            const count = isBurst ? 25 : 1
            for (let i = 0; i < count; i++) {
                const angle = isBurst ? Math.random() * Math.PI * 2 : Math.PI / 2 + (Math.random() - 0.5)
                const speed = isBurst ? Math.random() * 4 + 2 : Math.random() * 1 + 0.5
                
                particles.current.push({
                    x,
                    y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    size: Math.random() * 3 + (isBurst ? 2 : 1),
                    alpha: 1,
                    life: isBurst ? 0.02 : 0.01,
                    color: i % 2 === 0 ? '#E0F2FE' : '#ffffff' // Light blue and white
                })
            }
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            particles.current.forEach((p, index) => {
                p.x += p.vx
                p.y += p.vy
                p.alpha -= p.life
                p.vy += 0.01 // Minimal gravity

                if (p.alpha <= 0) {
                    particles.current.splice(index, 1)
                } else {
                    ctx.beginPath()
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
                    ctx.fillStyle = `rgba(${p.color === '#ffffff' ? '255, 255, 255' : '224, 242, 254'}, ${p.alpha})`
                    ctx.fill()
                    
                    // Add a tiny glow
                    ctx.shadowBlur = 4
                    ctx.shadowColor = 'rgba(186, 230, 253, 0.5)'
                }
            })

            animationFrameId = requestAnimationFrame(animate)
        }

        const handleMouseMove = (e: MouseEvent) => {
            mouse.current.x = e.clientX
            mouse.current.y = e.clientY
            mouse.current.active = true
            
            // Create a small trail
            if (Math.random() > 0.5) {
                createParticle(e.clientX, e.clientY)
            }
        }

        const handleMouseDown = (e: MouseEvent) => {
            createParticle(e.clientX, e.clientY, true)
        }

        updateCanvasSize()
        window.addEventListener('resize', updateCanvasSize)
        window.addEventListener('mousemove', handleMouseMove)
        window.addEventListener('mousedown', handleMouseDown)
        
        animate()

        return () => {
            window.removeEventListener('resize', updateCanvasSize)
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mousedown', handleMouseDown)
            cancelAnimationFrame(animationFrameId)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-[10000] opacity-80"
            style={{ mixBlendMode: 'screen' }}
        />
    )
}
