import { useState, useEffect } from 'react';
import { Done } from '../types';
import api from '../services/api';
import DoneItem from '../components/DoneItem';
import '../components/DoneList.css';

const TimelinePage = () => {
  const [dones, setDones] = useState<Done[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPublicDones = async () => {
      try {
        setIsLoading(true);
        // 백엔드에 /dones/public 엔드포인트 구현 완료
        const response = await api.get<Done[]>('/dones/public/');
        // 백엔드에서 owner 정보도 함께 보내준다고 가정
        setDones(response.data);
      } catch (err) {
        setError('데이터를 불러오는 데 실패했습니다.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublicDones();
  }, []);

  const handleToggleLike = async (doneId: number) => {
    const originalDones = [...dones];
    
    // Optimistic UI Update
    setDones(dones.map(d => {
      if (d.id === doneId) {
        const isLiked = !d.is_liked;
        const likesCount = isLiked ? d.likes_count + 1 : d.likes_count - 1;
        return { ...d, is_liked: isLiked, likes_count: likesCount };
      }
      return d;
    }));

    try {
      // TODO: 백엔드 좋아요 API 구현 후 활성화
      // await api.post(`/dones/${doneId}/like`);
    } catch (err) {
      setError('좋아요 처리에 실패했습니다. 잠시 후 다시 시도해 주세요.');
      // Revert on error
      setDones(originalDones);
      console.error(err);
    }
  };

  // DoneItem이 onDeleteDone, onEditDone을 필수로 요구하므로 임시 함수를 전달합니다.
  // 타임라인에서는 수정/삭제 기능을 제공하지 않을 예정이므로, 추후 DoneItem을 분리하거나 props를 선택적으로 변경해야 합니다.
  const placeholderFunc = () => {};

  return (
    <div className="app">
      <header className="app-header">
        <h1>타임라인</h1>
        <p>다른 사람들은 어떤 멋진 일들을 해냈을까요?</p>
      </header>
      <main className="app-main">
        {isLoading && <p>로딩 중...</p>}
        {error && <p className="error-message">{error}</p>}
        <div className="done-list">
          {!isLoading && !error && dones.map(done => (
            <DoneItem 
              key={done.id} 
              done={done} 
              onDeleteDone={placeholderFunc} 
              onEditDone={placeholderFunc}
              onToggleLike={handleToggleLike}
              isTimeline={true}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default TimelinePage; 