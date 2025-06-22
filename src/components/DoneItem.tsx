import { useState, KeyboardEvent } from 'react'
import { Trash2, Edit, Save, X } from 'lucide-react'
import { Done } from '../types'
import './DoneItem.css'

interface DoneItemProps {
  done: Done
  onDeleteDone: (id: number) => void
  onEditDone: (id: number, newText: string, newTags: string[]) => void
}

const DoneItem = ({ done, onDeleteDone, onEditDone }: DoneItemProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(done.text)
  const [editTags, setEditTags] = useState(done.tags)
  const [tagInput, setTagInput] = useState('')

  const handleEdit = () => {
    const newText = editText.trim()
    if (newText) {
      onEditDone(done.id, newText, editTags)
    }
    setIsEditing(false)
  }
  
  const handleCancel = () => {
    setEditText(done.text)
    setEditTags(done.tags)
    setIsEditing(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleEdit()
    else if (e.key === 'Escape') handleCancel()
  }

  const handleTagInput = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const newTag = tagInput.trim()
      if (newTag && !editTags.includes(newTag)) {
        setEditTags([...editTags, newTag])
      }
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setEditTags(editTags.filter(tag => tag !== tagToRemove))
  }

  const onDelete = (id: number) => {
    if (window.confirm("정말로 이 항목을 삭제하시겠습니까?")) {
      onDeleteDone(id)
    }
  }

  return (
    <div className="done-item">
      {isEditing ? (
        <div className="edit-view">
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyPress}
            className="edit-input"
          />
          <div className="tag-editor item-tag-editor">
            <div className="tags-list">
              {editTags.map(tag => (
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
              placeholder="태그 추가..."
              className="tag-input"
            />
          </div>
          <div className="actions">
            <button onClick={handleEdit} className="action-button save-button" title="저장">
              <Save size={16} />
            </button>
            <button onClick={handleCancel} className="action-button cancel-button" title="취소">
              <X size={16} />
            </button>
          </div>
        </div>
      ) : (
        <div className="display-view">
          <div className="done-item-header">
            <span className="done-item-date">
              {done.createdAt && new Date(done.createdAt).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
            <div className="done-item-actions">
              <button onClick={() => setIsEditing(true)} className="action-button edit-button">
                <Edit size={16} />
              </button>
              <button onClick={() => onDelete(done.id)} className="action-button delete-button">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
          <div className={`main-content ${!done.tags || done.tags.length === 0 ? 'center-text' : ''}`}>
            <span className="done-text">{done.text}</span>
            <div className="tags-list">
              {done.tags && done.tags.map(tag => (
                <div key={tag} className="tag-item static-tag">#{tag}</div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DoneItem 