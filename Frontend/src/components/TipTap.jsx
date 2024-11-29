import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { Bold, Italic, Underline as UnderlineIcon } from "lucide-react";
import { useEffect } from "react";

const extensions = [StarterKit.configure({hardBreak: false,}),Underline];

export default function TipTap({ onEditorReady, onSendMessage }) {
  const editor = useEditor({
  extensions,
  content: '',
  editorProps: {
  handleKeyDown: (view, event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    onSendMessage();
    return true;
  }
  return false;
  }}});

  useEffect(() => {
    if (editor && onEditorReady) {
      onEditorReady(editor);
    }
  }, [editor, onEditorReady]);

  if (!editor) return null;

  return (
    <div className="flex items-center w-full gap-4">
      <div className="flex-grow border border-base-content">
        <EditorContent editor={editor} className="w-full rounded max-h-14 overflow-hidden overflow-y-scroll" 
        placeholder="Type a message..."/>
      </div>

      <div className="flex">
        <button onClick={()=> editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`btn btn-outline ${
          editor.isActive("bold") ? "is-active btn-active btn-primary" : ""
          }`}
          >
          <Bold size={16} />
        </button>
        <button onClick={()=> editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`btn btn-outline ${
          editor.isActive("italic") ? "is-active btn-active btn-primary" : ""
          }`}
          >
          <Italic size={16} />
        </button>
        <button onClick={()=> editor.chain().focus().toggleUnderline().run()}
          disabled={!editor.can().chain().focus().toggleUnderline().run()}
          className={`btn btn-outline ${
          editor.isActive("underline") ? "is-active btn-active btn-primary" : ""
          }`}
          >
          <UnderlineIcon size={16} />
        </button>
      </div>
    </div>
  );
}