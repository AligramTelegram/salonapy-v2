'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import {
  Bold, Italic, UnderlineIcon, Heading2, Heading3,
  List, ListOrdered, Link2, Image as ImageIcon,
  Code, Quote, Undo, Redo
} from 'lucide-react'
import { useEffect } from 'react'
import { cn } from '@/lib/utils'

interface RichTextEditorProps {
  value: string
  onChange: (html: string) => void
  className?: string
}

export function RichTextEditor({ value, onChange, className }: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      Image.configure({ inline: false, allowBase64: true }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-purple-600 underline' } }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[300px] px-4 py-3',
      },
    },
  })

  // Sync external value changes (e.g., form reset)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, { emitUpdate: false })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  if (!editor) return null

  function addLink() {
    const url = window.prompt('Link URL girin:')
    if (url) editor?.chain().focus().setLink({ href: url }).run()
  }

  function addImage() {
    const url = window.prompt('Görsel URL girin:')
    if (url) editor?.chain().focus().setImage({ src: url }).run()
  }

  const tools = [
    { icon: Bold, action: () => editor.chain().focus().toggleBold().run(), active: () => editor.isActive('bold'), title: 'Kalın' },
    { icon: Italic, action: () => editor.chain().focus().toggleItalic().run(), active: () => editor.isActive('italic'), title: 'İtalik' },
    { icon: UnderlineIcon, action: () => editor.chain().focus().toggleUnderline().run(), active: () => editor.isActive('underline'), title: 'Alt Çizgi' },
    null,
    { icon: Heading2, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: () => editor.isActive('heading', { level: 2 }), title: 'Başlık 2' },
    { icon: Heading3, action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: () => editor.isActive('heading', { level: 3 }), title: 'Başlık 3' },
    null,
    { icon: List, action: () => editor.chain().focus().toggleBulletList().run(), active: () => editor.isActive('bulletList'), title: 'Madde Listesi' },
    { icon: ListOrdered, action: () => editor.chain().focus().toggleOrderedList().run(), active: () => editor.isActive('orderedList'), title: 'Numaralı Liste' },
    null,
    { icon: Quote, action: () => editor.chain().focus().toggleBlockquote().run(), active: () => editor.isActive('blockquote'), title: 'Alıntı' },
    { icon: Code, action: () => editor.chain().focus().toggleCodeBlock().run(), active: () => editor.isActive('codeBlock'), title: 'Kod Bloğu' },
    null,
    { icon: Link2, action: addLink, active: () => editor.isActive('link'), title: 'Link' },
    { icon: ImageIcon, action: addImage, active: () => false, title: 'Görsel' },
    null,
    { icon: Undo, action: () => editor.chain().focus().undo().run(), active: () => false, title: 'Geri Al' },
    { icon: Redo, action: () => editor.chain().focus().redo().run(), active: () => false, title: 'İleri Al' },
  ]

  return (
    <div className={cn('rounded-xl border border-gray-200 bg-white overflow-hidden', className)}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-gray-200 bg-gray-50 px-2 py-1.5">
        {tools.map((tool, i) =>
          tool === null ? (
            <div key={i} className="mx-1 h-5 w-px bg-gray-300" />
          ) : (
            <button
              key={i}
              type="button"
              onClick={tool.action}
              title={tool.title}
              className={cn(
                'rounded p-1.5 text-gray-600 hover:bg-gray-200 transition-colors',
                tool.active() && 'bg-purple-100 text-purple-700'
              )}
            >
              <tool.icon className="h-3.5 w-3.5" />
            </button>
          )
        )}
      </div>
      {/* Editor area */}
      <EditorContent editor={editor} />
    </div>
  )
}
