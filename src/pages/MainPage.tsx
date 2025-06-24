import { useState, useEffect } from 'react';
import { List, Calendar, LogOut, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import DoneList from '../components/DoneList';
import DoneForm from '../components/DoneForm';
import CalendarView from '../components/CalendarView';
import { Done } from '../types';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import '../App.css';

const MainPage = () => {
  const [dones, setDones] = useState<Done[]>([]);
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { logout, user } = useAuth();

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

  const addDone = async (text: string, tags: string[], is_public: boolean) => {
    try {
      const response = await api.post<Done>('/dones/', { text, tags, is_public });
      setDones([response.data, ...dones]);
    } catch (error) {
      console.error("Failed to add done", error);
      setError("항목을 추가하는 데 실패했습니다.");
    }
  };

  const deleteDone = async (id: number) => {
    const originalDones = [...dones];
    // Optimistic UI update
    setDones(dones.filter(done => done.id !== id));
    try {
      await api.delete(`/dones/${id}`);
    } catch (error) {
      console.error("Failed to delete done", error);
      setError("항목을 삭제하는 데 실패했습니다.");
      // Revert on error
      setDones(originalDones);
    }
  };

  const editDone = async (id: number, newText: string, newTags: string[], is_public: boolean) => {
    const originalDones = [...dones];
    // Optimistic UI update: First, create a temporary updated state
    const updatedDones = originalDones.map(d => 
      d.id === id ? { ...d, text: newText, tags: newTags, is_public } : d
    );
    setDones(updatedDones);

    try {
      // Send the update to the backend
      const response = await api.put<Done>(`/dones/${id}`, { text: newText, tags: newTags, is_public });
      // On success, update the state with the final data from the server
      setDones(originalDones.map(d => (d.id === id ? response.data : d)));
    } catch (error) {
      console.error("Failed to edit done", error);
      setError("항목을 수정하는 데 실패했습니다.");
      // Revert on error
      setDones(originalDones);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <h1>DONE</h1>
          <p>오늘 하루, 어떤 멋진 일을 해내셨나요?</p>
        </div>
        <div className="header-right">
          {user && <span className="user-email">{user.email}</span>}
          <button onClick={logout} className="logout-button" title="로그아웃">
            <LogOut size={20} />
          </button>
        </div>
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
          <Link to="/timeline" className="view-button">
            <Users size={18} />
            <span>타임라인</span>
          </Link>
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