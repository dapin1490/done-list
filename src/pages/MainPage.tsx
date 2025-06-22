import { useState, useEffect } from 'react';
import { List, Calendar } from 'lucide-react';
import DoneList from '../components/DoneList';
import DoneForm from '../components/DoneForm';
import CalendarView from '../components/CalendarView';
import { Done } from '../types';
import api from '../services/api';
import '../App.css';

const MainPage = () => {
  const [dones, setDones] = useState<Done[]>([]);
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDones = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await api.get<Done[]>('/dones/');
        setDones(response.data);
      } catch (error) {
        console.error("Failed to fetch dones", error);
        setError("데이터를 불러오는 데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDones();
  }, []);

  const addDone = async (text: string, tags: string[]) => {
    try {
      const response = await api.post<Done>('/dones/', { text, tags });
      setDones([response.data, ...dones]);
    } catch (error) {
      console.error("Failed to add done", error);
      setError("항목을 추가하는 데 실패했습니다.");
    }
  };

  const deleteDone = async (id: number) => {
    try {
      await api.delete(`/dones/${id}`);
      setDones(dones.filter(done => done.id !== id));
    } catch (error) {
      console.error("Failed to delete done", error);
      setError("항목을 삭제하는 데 실패했습니다.");
    }
  };

  const editDone = async (id: number, newText: string, newTags: string[]) => {
    try {
      const response = await api.put<Done>(`/dones/${id}`, { text: newText, tags: newTags });
      setDones(dones.map(done => (done.id === id ? response.data : done)));
    } catch (error) {
      console.error("Failed to edit done", error);
      setError("항목을 수정하는 데 실패했습니다.");
    }
  };

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
        
        {isLoading && <p>로딩 중...</p>}
        {error && <p className="error-message">{error}</p>}
        {!isLoading && !error && (
          view === 'list' ? (
            <DoneList
              dones={dones}
              onDeleteDone={deleteDone}
              onEditDone={editDone}
            />
          ) : (
            <CalendarView dones={dones} />
          )
        )}
      </main>
    </div>
  );
};

export default MainPage; 