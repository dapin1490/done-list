import { useState, useEffect } from 'react'
import { List, Calendar } from 'lucide-react'
import DoneList from './components/DoneList'
import DoneForm from './components/DoneForm'
import CalendarView from './components/CalendarView'
import './App.css'

export interface Done {
  id: number
  text: string
  tags: string[]
  createdAt: Date
}

const STORAGE_KEY = 'done-list-app-data';

function App() {
  const [dones, setDones] = useState<Done[]>(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        // createdAt을 다시 Date 객체로 변환
        return JSON.parse(savedData).map((done: Done) => ({
          ...done,
          createdAt: new Date(done.createdAt),
        }));
      }
    } catch (error) {
      console.error("Failed to load data from local storage", error);
    }
    return [];
  });
  
  const [view, setView] = useState<'list' | 'calendar'>('list')

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dones));
    } catch (error) {
      console.error("Failed to save data to local storage", error);
    }
  }, [dones]);

  const addDone = (text: string, tags: string[]) => {
    const newDone: Done = {
      id: Date.now(),
      text,
      tags,
      createdAt: new Date()
    }
    setDones([newDone, ...dones])
  }

  const deleteDone = (id: number) => {
    setDones(dones.filter(done => done.id !== id))
  }

  const editDone = (id: number, newText: string, newTags: string[]) => {
    setDones(dones.map(done =>
      done.id === id ? { ...done, text: newText, tags: newTags } : done
    ))
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>DONE</h1>
        <p>오늘 하루, 어떤 멋진 일을 해내셨나요?</p>
      </header>
      <main className="app-main">
        <DoneForm onAddDone={addDone} />
        <div className="view-switcher">
          <button onClick={() => setView('list')} className={`view-button ${view === 'list' ? 'active' : ''}`}>
            <List size={18} />
            <span>목록</span>
          </button>
          <button onClick={() => setView('calendar')} className={`view-button ${view === 'calendar' ? 'active' : ''}`}>
            <Calendar size={18} />
            <span>캘린더</span>
          </button>
        </div>
        
        {view === 'list' ? (
          <DoneList
            dones={dones}
            onDeleteDone={deleteDone}
            onEditDone={editDone}
          />
        ) : (
          <CalendarView dones={dones} />
        )}
      </main>
    </div>
  )
}

export default App 