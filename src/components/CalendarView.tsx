import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Done } from '../App';
import './CalendarView.css';

interface CalendarViewProps {
  dones: Done[];
}

const CalendarView = ({ dones }: CalendarViewProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const changeMonth = (amount: number) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + amount);
      return newDate;
    });
  };

  const renderHeader = () => {
    return (
      <div className="calendar-header">
        <button onClick={() => changeMonth(-1)} className="nav-button" title="이전 달">
          <ChevronLeft size={20} />
        </button>
        <h2>{currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월</h2>
        <button onClick={() => changeMonth(1)} className="nav-button" title="다음 달">
          <ChevronRight size={20} />
        </button>
      </div>
    );
  };

  const renderDaysOfWeek = () => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return (
      <div className="days-of-week">
        {days.map(day => <div key={day} className="day-of-week">{day}</div>)}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = new Date(monthStart);
    startDate.setDate(startDate.getDate() - monthStart.getDay());
    const endDate = new Date(monthEnd);
    endDate.setDate(endDate.getDate() + (6 - monthEnd.getDay()));

    const donesByDate: { [key: string]: number } = dones.reduce((acc, done) => {
        const dateKey = new Date(done.createdAt).toDateString();
        acc[dateKey] = (acc[dateKey] || 0) + 1;
        return acc;
    }, {} as { [key: string]: number });

    const cells = [];
    let day = new Date(startDate);

    while (day <= endDate) {
      const dateKey = day.toDateString();
      const doneCount = donesByDate[dateKey] || 0;
      
      cells.push(
        <div
          key={day.toString()}
          className={`day-cell ${
            day.getMonth() !== currentDate.getMonth() ? 'disabled' : ''
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