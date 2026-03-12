"use client"

import React, { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Loader2, MapPin } from "lucide-react"

interface LocationAutocompleteProps {
    value: string
    onChange: (value: string) => void
    onSelect: (value: string) => void
    placeholder?: string
    className?: string
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

export default function LocationAutocomplete({
    value,
    onChange,
    onSelect,
    placeholder = "Cari kecamatan, kota...",
    className,
    onKeyDown
}: LocationAutocompleteProps) {
    const [suggestions, setSuggestions] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [showDropdown, setShowDropdown] = useState(false)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)
    const wrapperRef = useRef<HTMLDivElement>(null)

    // Close dropdown when typing outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowDropdown(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    const fetchSuggestions = async (query: string) => {
        if (!query || query.length < 3) {
            setSuggestions([])
            setShowDropdown(false)
            return
        }

        setIsLoading(true)
        try {
            // Menggunakan API gratis OpenStreetMap Nominatim
            // Limit 5, language ID, country Indonesia
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&accept-language=id&countrycodes=id`)
            const data = await res.json()
            setSuggestions(data)
            setShowDropdown(true)
        } catch (error) {
            console.error("Nominatim fetch error:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        onChange(val)

        // Debounce to avoid spamming the free API
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }
        timeoutRef.current = setTimeout(() => {
            fetchSuggestions(val)
        }, 600) // 600ms delay for Nominatim fair-use policy
    }

    const handleSelect = (suggestion: any) => {
        // Ambil nama tempat utamanya. Nominatim mengembalikan display_name lengkap (misal: "Ciputat, Tangerang Selatan")
        const placeNameParts = suggestion.display_name.split(",")
        // Ambil maksimal 3 bagian pertama agar tidak terlalu panjang, tapi pastikan informatif
        const limitParts = placeNameParts.length > 3 ? placeNameParts.slice(0, 3) : placeNameParts
        const placeName = limitParts.join(",").trim()

        onSelect(placeName)
        setShowDropdown(false)
        setSuggestions([])
    }

    return (
        <div className="relative w-full" ref={wrapperRef}>
            <div className="relative">
                <Input
                    type="text"
                    value={value}
                    onChange={handleInputChange}
                    onKeyDown={onKeyDown}
                    placeholder={placeholder}
                    className={className}
                    onFocus={() => {
                        if (suggestions.length > 0) setShowDropdown(true)
                    }}
                />
                {isLoading && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                        <Loader2 className="w-4 h-4 animate-spin" />
                    </div>
                )}
            </div>

            {showDropdown && suggestions.length > 0 && (
                <div className="absolute z-[100] mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden py-1 max-h-[250px] overflow-y-auto">
                    {suggestions.map((s: any, idx) => (
                        <div
                            key={idx}
                            onClick={() => handleSelect(s)}
                            className="px-4 py-2.5 hover:bg-slate-50 cursor-pointer flex items-start gap-3 border-b border-slate-50 last:border-0"
                        >
                            <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold text-slate-700">{s.name || s.display_name.split(",")[0]}</span>
                                <span className="text-xs text-slate-500 line-clamp-1">{s.display_name}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
