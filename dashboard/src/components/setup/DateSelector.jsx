// src/components/setup/DateSelector.jsx
import React, { useState, useCallback, memo } from 'react';

const DateSelector = memo(({ value, onChange }) => {
  const [localDate, setLocalDate] = useState(() => {
    const defaultDate = { year: '', month: '', day: '' };
    if (!value) return defaultDate;
    
    try {
      const d = new Date(value);
      if (isNaN(d.getTime())) return defaultDate;
      
      return {
        year: d.getFullYear().toString(),
        month: (d.getMonth() + 1).toString().padStart(2, '0'),
        day: d.getDate().toString().padStart(2, '0')
      };
    } catch {
      return defaultDate;
    }
  });

  const handleChange = useCallback((field, newValue) => {
    setLocalDate(prev => {
      const updatedDate = { ...prev, [field]: newValue };
      if (updatedDate.year && updatedDate.month && updatedDate.day) {
        onChange(`${updatedDate.year}-${updatedDate.month}-${updatedDate.day}`);
      }
      return updatedDate;
    });
  }, [onChange]);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
  const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];

  const daysInMonth = localDate.year && localDate.month
  ? new Date(Number(localDate.year), Number(localDate.month), 0).getDate()
  : 31;

// Ensure valid initial state for localDate
if (!localDate.year || !localDate.month || !localDate.day) {
  return null; // or some fallback UI
}

  return (
    <div className="grid grid-cols-3 gap-4">
      <select 
        className="ios-input"
        value={localDate.year}
        onChange={(e) => handleChange('year', e.target.value)}
      >
        <option value="">Year</option>
        {years.map(year => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>

      <select 
        className="ios-input"
        value={localDate.month}
        onChange={(e) => handleChange('month', e.target.value)}
      >
        <option value="">Month</option>
        {months.map(month => (
          <option key={month.value} value={month.value}>{month.label}</option>
        ))}
      </select>

      <select 
        className="ios-input"
        value={localDate.day}
        onChange={(e) => handleChange('day', e.target.value)}
      >
        <option value="">Day</option>
        {Array.from({ length: daysInMonth }, (_, i) => 
          (i + 1).toString().padStart(2, '0')
        ).map(day => (
          <option key={day} value={day}>{day}</option>
        ))}
      </select>
    </div>
  );
});

DateSelector.displayName = 'DateSelector';

export default DateSelector;