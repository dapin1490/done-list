import { Done } from '../types'
import DoneItem from './DoneItem'
import './DoneList.css'

interface DoneListProps {
  dones: Done[]
  onDeleteDone: (id: number) => void
  onEditDone: (id: number, text: string, tags: string[]) => void
}

const DoneList = ({ dones, onDeleteDone, onEditDone }: DoneListProps) => {
  if (dones.length === 0) {
    return (
      <div className="empty-state">
        <p>아직 기록된 일이 없어요.</p>
        <p>오늘의 첫 성취를 기록해보세요!</p>
      </div>
    )
  }

  return (
    <div className="done-list">
      {dones.map(done => (
        <DoneItem
          key={done.id}
          done={done}
          onDeleteDone={onDeleteDone}
          onEditDone={onEditDone}
        />
      ))}
    </div>
  )
}

export default DoneList 