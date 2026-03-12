"use client"

import React, { useState, useEffect, useRef } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Loader2, MapPin } from "lucide-react"
import { toast } from "sonner"

// Fix for default marker icon in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
})

export interface AreaCoordinate {
    label: string
    lat: number
    lng: number
}

interface LocationMapClientProps {
    onSelectArea: (area: AreaCoordinate) => void
}

function MapEvents({ onMapClick }: { onMapClick: (latlng: L.LatLng) => void }) {
    useMapEvents({
        click(e) {
            onMapClick(e.latlng)
        },
    })
    return null
}

function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
    const map = useMap()
    map.setView(center, zoom)
    return null
}

export default function LocationMapClient({ onSelectArea }: LocationMapClientProps) {
    // Default to Jakarta
    const [center, setCenter] = useState<[number, number]>([-6.2088, 106.8456])
    const [zoom, setZoom] = useState(11)
    const [searchQuery, setSearchQuery] = useState("")
    const [isSearching, setIsSearching] = useState(false)
    const [currentMarker, setCurrentMarker] = useState<AreaCoordinate | null>(null)
    const [suggestions, setSuggestions] = useState<any[]>([])
    const [showDropdown, setShowDropdown] = useState(false)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)
    const wrapperRef = useRef<HTMLDivElement>(null)

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

        setIsSearching(true)
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=id`)
            const data = await res.json()
            setSuggestions(data)
            setShowDropdown(true)
        } catch (error) {
            console.error(error)
        } finally {
            setIsSearching(false)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        setSearchQuery(val)

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }
        timeoutRef.current = setTimeout(() => {
            fetchSuggestions(val)
        }, 600)
    }

    const handleSelectSuggestion = (suggestion: any) => {
        setShowDropdown(false)
        setSuggestions([])

        const newLat = parseFloat(suggestion.lat)
        const newLng = parseFloat(suggestion.lon)

        let label = suggestion.display_name || suggestion.name || ""

        setSearchQuery(label)
        setCenter([newLat, newLng])
        setZoom(15)
        setCurrentMarker({
            label: label,
            lat: newLat,
            lng: newLng
        })
    }

    const handleSearch = async () => {
        if (!searchQuery.trim()) return
        setIsSearching(true)
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1&countrycodes=id`)
            const data = await res.json()
            if (data && data.length > 0) {
                const result = data[0]
                const newLat = parseFloat(result.lat)
                const newLng = parseFloat(result.lon)

                let label = result.display_name || result.name || ""

                setCenter([newLat, newLng])
                setZoom(15)
                setCurrentMarker({
                    label: label,
                    lat: newLat,
                    lng: newLng
                })
            } else {
                toast.error("Lokasi tidak ditemukan")
            }
        } catch (error) {
            toast.error("Gagal mencari lokasi")
        } finally {
            setIsSearching(false)
        }
    }

    const handleMapClick = async (latlng: L.LatLng) => {
        // Drop pin immediately with loading text
        const newMarker: AreaCoordinate = {
            label: "Memuat nama lokasi...",
            lat: latlng.lat,
            lng: latlng.lng
        }
        setCurrentMarker(newMarker)

        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}&zoom=14`)
            const data = await res.json()

            if (data && data.display_name) {
                const bestName = data.display_name
                setCurrentMarker({
                    label: bestName,
                    lat: latlng.lat,
                    lng: latlng.lng
                })
            } else {
                setCurrentMarker({
                    label: "Lokasi Pin Point",
                    lat: latlng.lat,
                    lng: latlng.lng
                })
            }
        } catch {
            setCurrentMarker({
                label: "Lokasi Pin Point",
                lat: latlng.lat,
                lng: latlng.lng
            })
        }
    }

    const handleAddPin = () => {
        if (currentMarker) {
            onSelectArea(currentMarker)
            setCurrentMarker(null)
            setSearchQuery("")
            toast.success("Area berhasil ditambahkan!")
        }
    }

    return (
        <div className="space-y-3 pt-2">
            <div className="relative flex items-center gap-2" ref={wrapperRef}>
                <div className="relative flex-1 block w-full">
                    <Input
                        placeholder="Cari kecamatan, kota lalu pasang pin di peta..."
                        value={searchQuery}
                        onChange={handleInputChange}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault()
                                handleSearch()
                            }
                        }}
                        onFocus={() => {
                            if (suggestions.length > 0) setShowDropdown(true)
                        }}
                        className="rounded-xl w-full text-sm bg-white pr-9"
                    />
                    {isSearching && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                            <Loader2 className="w-4 h-4 animate-spin" />
                        </div>
                    )}
                </div>
                <Button type="button" variant="secondary" onClick={handleSearch} disabled={isSearching} className="rounded-xl shrink-0">
                    <Search className="w-4 h-4" />
                </Button>

                {showDropdown && suggestions.length > 0 && (
                    <div className="absolute z-[100] top-full left-0 right-[56px] mt-1 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden py-1 max-h-[200px] overflow-y-auto">
                        {suggestions.map((s: any, idx) => (
                            <div
                                key={idx}
                                onClick={() => handleSelectSuggestion(s)}
                                className="px-3 py-2 hover:bg-slate-50 cursor-pointer flex items-start gap-2.5 border-b border-slate-50 last:border-0"
                            >
                                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-slate-700">{s.name || s.display_name.split(",")[0]}</span>
                                    <span className="text-[10px] text-slate-500 line-clamp-1 leading-tight">{s.display_name}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="h-[300px] w-full rounded-xl overflow-hidden border border-slate-200 relative z-0">
                <MapContainer center={center} zoom={zoom} scrollWheelZoom={true} style={{ height: "100%", width: "100%", zIndex: 1 }}>
                    <ChangeView center={center} zoom={zoom} />
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapEvents onMapClick={handleMapClick} />

                    {currentMarker && (
                        <Marker position={[currentMarker.lat, currentMarker.lng]}>
                            <Popup>
                                <div className="text-sm font-semibold text-slate-700 min-w-[150px]">{currentMarker.label}</div>
                                <div className="text-xs text-slate-500 mb-2">{currentMarker.lat.toFixed(5)}, {currentMarker.lng.toFixed(5)}</div>
                                <Button type="button" size="sm" onClick={handleAddPin} className="w-full h-8 text-xs bg-primary-blue hover:bg-primary-blue-medium text-white shadow-md">
                                    Tambah Area Ini
                                </Button>
                            </Popup>
                        </Marker>
                    )}
                </MapContainer>
            </div>
            <p className="text-[10px] text-slate-500 leading-tight">
                * Cari kota di pencarian, lalu ketuk/klik langsung di peta untuk memasang pin merah. Klik tulisan <strong>Tambah Area Ini</strong> di atas pin untuk menyimpannya.
            </p>
        </div>
    )
}
