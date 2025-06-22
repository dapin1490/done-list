import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './CalendarView.css';
import { Done } from '../types';

interface CalendarViewProps {
  dones: Done[];
}

const toYYYYMMDD = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const CalendarView = ({ dones }: CalendarViewProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const donesByDate = dones.reduce((acc, done) => {
    if (done.created_at) {
      const date = new Date(done.created_at);
      if (!isNaN(date.getTime())) { // Check if the date is valid
        const dateKey = toYYYYMMDD(date);
        acc[dateKey] = (acc[dateKey] || 0) + 1;
      }
    }
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

    for (let i = 0; i < 42; i++) { // Always render 6 weeks for a consistent grid
      const dateKey = toYYYYMMDD(day);
      const doneCount = donesByDate[dateKey] || 0;
      
      cells.push(
        <div
          key={day.toISOString()} // Use a more reliable key
          className={`day-cell ${
            day.getMonth() !== currentMonth.getMonth() ? 'disabled' : ''
          } ${doneCount > 0 ? 'has-dones' : ''}`}
        >
          <span className="day-number">{day.getDate()}</span>
          {doneCount > 0 && <div className="done-indicator">{doneCount}</div>}
        </div>
      );
      day.setDate(day.getDate() + 1);
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