import { useState, KeyboardEvent } from 'react'
import { Trash2, Edit, Save, X, Heart } from 'lucide-react'
import { Done } from '../types'
import './DoneItem.css'

interface DoneItemProps {
  done: Done
  onDeleteDone: (id: number) => void
  onEditDone: (id: number, newText: string, newTags: string[], is_public: boolean) => void
  onToggleLike: (id: number) => void
  isTimeline?: boolean
  userId?: number
}

const DoneItem = ({ done, onDeleteDone, onEditDone, onToggleLike, isTimeline = false, userId }: DoneItemProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(done.text)
  const [editTags, setEditTags] = useState(done.tags)
  const [tagInput, setTagInput] = useState('')
  const [editIsPublic, setEditIsPublic] = useState(done.is_public)

  const handleEdit = () => {
    const newText = editText.trim()
    if (newText) {
      onEditDone(done.id, newText, editTags, editIsPublic)
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

  const onDelete = () => {
    if (window.confirm("정말로 이 항목을 삭제하시겠습니까?")) {
      onDeleteDone(done.id)
    }
  }

  const handleLike = () => {
    onToggleLike(done.id);
  };

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
          <div className="public-toggle">
            <label>
              <input
                type="checkbox"
                checked={editIsPublic}
                onChange={e => setEditIsPublic(e.target.checked)}
              />
              타임라인에 공개
            </label>
          </div>
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
        <>
          <div className="main-content">
            {isTimeline && done.owner && (
              <span className="done-owner">{done.owner.email}</span>
            )}
            <span className="done-text">{done.text}</span>
            {done.tags && done.tags.length > 0 && (
              <div className="tags-list">
                {done.tags.map(tag => (
                  <span key={tag} className="tag-item">#{tag}</span>
                ))}
              </div>
            )}
            {isTimeline && (
              <div className="item-footer">
                <button 
                  onClick={handleLike} 
                  className={`like-button ${done.is_liked ? 'liked' : ''}`}
                  title={done.is_liked ? '좋아요 취소' : '좋아요'}
                >
                  <Heart size={16} className="heart-icon" />
                </button>
                <span className="like-count">{done.likes_count}</span>
              </div>
            )}
          </div>
          <div className="actions">
            {!isTimeline && (
              <>
                <button onClick={() => setIsEditing(true)} className="action-button edit-button" title="수정">
                  <Edit size={16} />
                </button>
                <button onClick={onDelete} className="action-button delete-button" title="삭제">
                  <Trash2 size={16} />
                </button>
              </>
            )}
            {isTimeline && userId && done.owner?.id === userId && !isEditing && (
              <>
                <button onClick={() => setIsEditing(true)} className="action-button edit-button" title="수정">
                  <Edit size={16} />
                </button>
                <button onClick={onDelete} className="action-button delete-button" title="삭제">
                  <Trash2 size={16} />
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default DoneItem 