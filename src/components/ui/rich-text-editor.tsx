"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import LinkExtension from '@tiptap/extension-link'
import { useState, useRef, useEffect } from 'react'
import {
    Bold, Italic, Strikethrough, List, ListOrdered,
    Heading2, Heading3, Quote, Undo, Redo,
    ImageIcon, Link as LinkIcon, Upload, X, Loader2
} from 'lucide-react'
import { Button } from './button'
import { Input } from './input'
import { toast } from 'sonner'

interface RichTextEditorProps {
    content: string
    onChange: (content: string) => void
}

/* ── Inline image upload dialog ─────────────────────────────── */
interface ImageDialogProps {
    onInsert: (url: string, credit: string) => void
    onClose: () => void
}

function ImageUploadDialog({ onInsert, onClose }: ImageDialogProps) {
    const [file, setFile] = useState<File | null>(null)
    const [preview, setPreview] = useState("")
    const [creditPlatform, setCreditPlatform] = useState("")
    const [creditHandle, setCreditHandle] = useState("")
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    function handleFile(f: File) {
        if (!f.type.startsWith("image/")) { toast.error("Hanya file gambar"); return }
        if (f.size > 5 * 1024 * 1024) { toast.error("Maks. 5MB"); return }
        setFile(f)
        setPreview(URL.createObjectURL(f))
    }

    async function handleInsert() {
        if (!file) return
        setIsUploading(true)
        try {
            const formData = new FormData()
            formData.append("file", file)
            const res = await fetch("/api/upload-image", { method: "POST", body: formData })
            if (!res.ok) throw new Error("Gagal upload")
            const { url } = await res.json()
            const fullCredit = creditPlatform && creditHandle ? `${creditPlatform}: ${creditHandle}` : ""
            onInsert(url, fullCredit)
        } catch {
            toast.error("Gagal mengupload gambar")
        } finally {
            setIsUploading(false)
        }
    }

    return (
        /* backdrop */
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                {/* header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                    <h3 className="font-bold text-slate-800">Sisipkan Gambar</h3>
                    <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full">
                        <X className="w-4 h-4 text-slate-500" />
                    </button>
                </div>

                <div className="p-5 space-y-4">
                    {/* Drop zone / preview */}
                    {preview ? (
                        <div className="relative rounded-xl overflow-hidden border border-slate-200">
                            <img src={preview} alt="preview" className="w-full max-h-52 object-cover" />
                            <button
                                onClick={() => { setFile(null); setPreview("") }}
                                className="absolute top-2 right-2 bg-white/90 rounded-full p-1 shadow"
                            >
                                <X className="w-4 h-4 text-slate-600" />
                            </button>
                        </div>
                    ) : (
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
                            onDragOver={(e) => e.preventDefault()}
                            className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center gap-2 text-center cursor-pointer hover:bg-slate-50 hover:border-primary-blue/40 transition-colors group"
                        >
                            <div className="p-3 bg-slate-100 rounded-full group-hover:scale-110 transition-transform">
                                <Upload className="w-5 h-5 text-primary-blue" />
                            </div>
                            <p className="text-sm font-semibold text-slate-700">Klik atau drag gambar ke sini</p>
                            <p className="text-xs text-slate-400">JPG, PNG, WEBP — Maks. 5MB</p>
                        </div>
                    )}
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
                        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />

                    {/* Credit / source */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                            Kredit / Sumber Gambar
                            <span className="text-xs font-normal text-slate-400">(opsional)</span>
                        </label>
                        <div className="flex gap-2">
                            {/* Platform dropdown */}
                            <select
                                value={creditPlatform}
                                onChange={(e) => setCreditPlatform(e.target.value)}
                                className="h-10 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700 px-2 focus:outline-none focus:ring-2 focus:ring-primary-blue-light shrink-0"
                            >
                                <option value="">— Pilih —</option>
                                <option value="📸 Foto oleh">Fotografer</option>
                                <option value="🟣 Instagram">Instagram</option>
                                <option value="🎵 TikTok">TikTok</option>
                                <option value="📘 Facebook">Facebook</option>
                                <option value="▶️ YouTube">YouTube</option>
                                <option value="𝕏 Twitter/X">Twitter / X</option>
                                <option value="💬 WhatsApp">WhatsApp</option>
                                <option value="🌐 Sumber">Website/Lainnya</option>
                            </select>
                            {/* Handle / name input */}
                            <Input
                                value={creditHandle}
                                onChange={(e) => setCreditHandle(e.target.value)}
                                placeholder={creditPlatform.includes("Instagram") || creditPlatform.includes("TikTok") || creditPlatform.includes("Twitter") ? "@username" : "Nama / URL"}
                                className="rounded-xl bg-slate-50 flex-1"
                                disabled={!creditPlatform}
                            />
                        </div>
                        {creditPlatform && creditHandle && (
                            <p className="text-xs text-slate-400">
                                Preview kredit: <span className="font-medium text-slate-600">{creditPlatform}: {creditHandle}</span>
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-2 px-5 py-4 bg-slate-50 border-t border-slate-100">
                    <Button type="button" variant="outline" onClick={onClose} className="rounded-xl">Batal</Button>
                    <Button
                        type="button"
                        onClick={handleInsert}
                        disabled={!file || isUploading}
                        className="bg-primary-blue hover:bg-primary-blue-medium text-white rounded-xl"
                    >
                        {isUploading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Sisipkan Gambar
                    </Button>
                </div>
            </div>
        </div>
    )
}

/* ── MenuBar ─────────────────────────────────────────────────── */
const MenuBar = ({ editor }: { editor: any }) => {
    const [showImageDialog, setShowImageDialog] = useState(false)
    if (!editor) return null

    function handleImageInsert(url: string, credit: string) {
        // Insert the image
        editor.chain().focus().setImage({ src: url, alt: credit || undefined }).run()
        // If credit provided, insert as italic paragraph below
        if (credit.trim()) {
            editor.chain().focus()
                .insertContentAt(editor.state.selection.to + 1, {
                    type: 'paragraph',
                    content: [{ type: 'text', marks: [{ type: 'italic' }], text: `📷 ${credit}` }]
                })
                .run()
        }
        setShowImageDialog(false)
    }

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href
        const url = window.prompt('URL Tautan:', previousUrl)
        if (url === null) return
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run()
            return
        }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }

    return (
        <>
            {showImageDialog && (
                <ImageUploadDialog
                    onInsert={handleImageInsert}
                    onClose={() => setShowImageDialog(false)}
                />
            )}
            <div className="flex flex-wrap items-center gap-1 p-2 border-b border-slate-200 bg-slate-50 rounded-t-xl">
                <Button type="button" variant="ghost" size="icon"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    disabled={!editor.can().chain().focus().toggleBold().run()}
                    className={`h-8 w-8 ${editor.isActive('bold') ? 'bg-slate-200 text-slate-900' : 'text-slate-600'}`}>
                    <Bold className="w-4 h-4" />
                </Button>
                <Button type="button" variant="ghost" size="icon"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    disabled={!editor.can().chain().focus().toggleItalic().run()}
                    className={`h-8 w-8 ${editor.isActive('italic') ? 'bg-slate-200 text-slate-900' : 'text-slate-600'}`}>
                    <Italic className="w-4 h-4" />
                </Button>
                <Button type="button" variant="ghost" size="icon"
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    disabled={!editor.can().chain().focus().toggleStrike().run()}
                    className={`h-8 w-8 ${editor.isActive('strike') ? 'bg-slate-200 text-slate-900' : 'text-slate-600'}`}>
                    <Strikethrough className="w-4 h-4" />
                </Button>

                <div className="w-px h-6 bg-slate-300 mx-1" />

                <Button type="button" variant="ghost" size="icon"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`h-8 w-8 ${editor.isActive('heading', { level: 2 }) ? 'bg-slate-200 text-slate-900' : 'text-slate-600'}`}>
                    <Heading2 className="w-4 h-4" />
                </Button>
                <Button type="button" variant="ghost" size="icon"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={`h-8 w-8 ${editor.isActive('heading', { level: 3 }) ? 'bg-slate-200 text-slate-900' : 'text-slate-600'}`}>
                    <Heading3 className="w-4 h-4" />
                </Button>
                <Button type="button" variant="ghost" size="icon"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`h-8 w-8 ${editor.isActive('bulletList') ? 'bg-slate-200 text-slate-900' : 'text-slate-600'}`}>
                    <List className="w-4 h-4" />
                </Button>
                <Button type="button" variant="ghost" size="icon"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`h-8 w-8 ${editor.isActive('orderedList') ? 'bg-slate-200 text-slate-900' : 'text-slate-600'}`}>
                    <ListOrdered className="w-4 h-4" />
                </Button>
                <Button type="button" variant="ghost" size="icon"
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={`h-8 w-8 ${editor.isActive('blockquote') ? 'bg-slate-200 text-slate-900' : 'text-slate-600'}`}>
                    <Quote className="w-4 h-4" />
                </Button>

                <div className="w-px h-6 bg-slate-300 mx-1" />

                <Button type="button" variant="ghost" size="icon" onClick={setLink}
                    className={`h-8 w-8 ${editor.isActive('link') ? 'bg-slate-200 text-slate-900' : 'text-slate-600'}`}>
                    <LinkIcon className="w-4 h-4" />
                </Button>
                <Button type="button" variant="ghost" size="icon"
                    onClick={() => setShowImageDialog(true)}
                    className="h-8 w-8 text-slate-600 hover:text-primary-blue"
                    title="Sisipkan gambar">
                    <ImageIcon className="w-4 h-4" />
                </Button>

                <div className="flex-1" />

                <Button type="button" variant="ghost" size="icon"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().chain().focus().undo().run()}
                    className="h-8 w-8 text-slate-600">
                    <Undo className="w-4 h-4" />
                </Button>
                <Button type="button" variant="ghost" size="icon"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().chain().focus().redo().run()}
                    className="h-8 w-8 text-slate-600">
                    <Redo className="w-4 h-4" />
                </Button>
            </div>
        </>
    )
}

/* ── Main Export ─────────────────────────────────────────────── */
export function RichTextEditor({ content, onChange }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Image.configure({ HTMLAttributes: { class: 'rounded-xl max-w-full' } }),
            LinkExtension.configure({ openOnClick: false }),
        ],
        content,
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[300px] p-4 bg-white [&_img]:max-h-64 [&_img]:max-w-[50%] [&_img]:w-auto [&_img]:rounded-xl [&_img]:my-2',
            },
        },
        onUpdate: ({ editor }) => {
            const html = editor.getHTML()
            if (html !== content) {
                onChange(html)
            }
        },
        immediatelyRender: false,
    })

    // Sync content from outside (e.g. initial load or AI generation)
    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content)
        }
    }, [content, editor])

    return (
        <div className="bg-white border text-sm border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary-blue-light focus-within:border-transparent transition-shadow">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    )
}
