import { useState, KeyboardEvent } from 'react'
import { Plus, X } from 'lucide-react'
import './DoneForm.css'

interface DoneFormProps {
  onAddDone: (text: string, tags: string[], is_public: boolean) => void
}

const DoneForm = ({ onAddDone }: DoneFormProps) => {
  const [text, setText] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [isPublic, setIsPublic] = useState(false)

  const handleTagInput = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const newTag = tagInput.trim()
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag])
      }
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (text.trim()) {
      onAddDone(text.trim(), tags, isPublic)
      setText('')
      setTags([])
      setIsPublic(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="done-form">
      <div className="input-group text-input-group">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="오늘 해낸 일을 기록해보세요!"
          className="done-input"
        />
        <button type="submit" className="add-button">
          <Plus size={20} />
          <span>기록</span>
        </button>
      </div>
      <div className="public-toggle">
        <label>
          <input
            type="checkbox"
            checked={isPublic}
            onChange={e => setIsPublic(e.target.checked)}
          />
          타임라인에 공개
        </label>
      </div>
      <div className="tag-editor">
        <div className="tags-list">
            {tags.map(tag => (
            <div key={tag} className="tag-item">
                {tag}
                <button type="button" onClick={() => removeTag(tag)} className="remove-tag-button">
                <X size={14} />
                </button>
            </div>
            ))}
        </div>
        <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagInput}
            placeholder="태그 입력 (Enter 또는 ,)"
            className="tag-input"
        />
      </div>
    </form>
  )
}

export default DoneForm 