'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Bold, Italic, List, ListOrdered, Heading2 } from 'lucide-react'

interface TiptapEditorProps {
    value: string
    onChange: (richText: string) => void
}

const TiptapEditor = ({ value, onChange }: TiptapEditorProps) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [2, 3],
                },
            }),
        ],
        content: value,
        editorProps: {
            attributes: {
                class: 'min-h-[150px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 prose max-w-none',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
    })

    if (!editor) {
        return null
    }

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-2 rounded-md border border-gray-200 bg-gray-50 p-1">
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    disabled={!editor.can().chain().focus().toggleBold().run()}
                    className={`rounded p-1 ${editor.isActive('bold') ? 'bg-gray-200 text-gray-900' : 'text-gray-500 hover:bg-gray-200 hover:text-gray-900'}`}
                >
                    <Bold size={16} />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    disabled={!editor.can().chain().focus().toggleItalic().run()}
                    className={`rounded p-1 ${editor.isActive('italic') ? 'bg-gray-200 text-gray-900' : 'text-gray-500 hover:bg-gray-200 hover:text-gray-900'}`}
                >
                    <Italic size={16} />
                </button>
                <div className="w-px h-6 bg-gray-300 mx-1" />
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`rounded p-1 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 text-gray-900' : 'text-gray-500 hover:bg-gray-200 hover:text-gray-900'}`}
                >
                    <Heading2 size={16} />
                </button>
                <div className="w-px h-6 bg-gray-300 mx-1" />
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`rounded p-1 ${editor.isActive('bulletList') ? 'bg-gray-200 text-gray-900' : 'text-gray-500 hover:bg-gray-200 hover:text-gray-900'}`}
                >
                    <List size={16} />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`rounded p-1 ${editor.isActive('orderedList') ? 'bg-gray-200 text-gray-900' : 'text-gray-500 hover:bg-gray-200 hover:text-gray-900'}`}
                >
                    <ListOrdered size={16} />
                </button>
            </div>
            <EditorContent editor={editor} />
        </div>
    )
}

export default TiptapEditor
