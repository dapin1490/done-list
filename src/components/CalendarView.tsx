import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './CalendarView.css';
import { Done } from '../types';

interface CalendarViewProps {
  dones: Done[];
}

const CalendarView = ({ dones }: CalendarViewProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const donesByDate = dones.reduce((acc, done) => {
    const dateKey = new Date(done.createdAt).toDateString();
    acc[dateKey] = (acc[dateKey] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const changeMonth = (amount: number) => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + amount);
      return newDate;
    });
  };

  const renderHeader = () => (
    <div className="calendar-header">
      <button onClick={() => changeMonth(-1)} className="nav-button" title="이전 달">
        <ChevronLeft size={20} />
      </button>
      <h2>{currentMonth.getFullYear()}년 {currentMonth.getMonth() + 1}월</h2>
      <button onClick={() => changeMonth(1)} className="nav-button" title="다음 달">
        <ChevronRight size={20} />
      </button>
    </div>
  );

  const renderDaysOfWeek = () => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return (
      <div className="days-of-week">
        {days.map(day => <div key={day} className="day-of-week">{day}</div>)}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const startDate = new Date(monthStart);
    startDate.setDate(startDate.getDate() - monthStart.getDay());
    
    const cells = [];
    let day = startDate;

    while (day <= monthEnd || day.getDay() !== 0) {
      const dateKey = day.toDateString();
      const doneCount = donesByDate[dateKey] || 0;
      
      cells.push(
        <div
          key={day.toString()}
          className={`day-cell ${
            day.getMonth() !== currentMonth.getMonth() ? 'disabled' : ''
          } ${doneCount > 0 ? 'has-dones' : ''}`}
        >
          <span className="day-number">{day.getDate()}</span>
          {doneCount > 0 && <div className="done-indicator">{doneCount}</div>}
        </div>
      );
      day.setDate(day.getDate() + 1);
      if (day > monthEnd && day.getDay() === 0) break;
    }
    
    return <div className="calendar-grid">{cells}</div>;
  };

  return (
    <div className="calendar-view">
      {renderHeader()}
      {renderDaysOfWeek()}
      {renderCells()}
    </div>
  );
};

export default CalendarView;