import React from 'react';
import { Calendar, DateObject } from 'react-native-calendars';
import { StreakDay } from '../types';

interface Props {
  days: StreakDay[];
  onDayPress?: (day: DateObject) => void;
}

const StreakCalendar: React.FC<Props> = ({ days, onDayPress }) => {
  const markedDates = days.reduce<Record<string, any>>((acc, day) => {
    acc[day.date] = {
      marked: true,
      dotColor: day.completed ? '#C46B3B' : '#C94F4F',
      selected: day.completed,
      selectedColor: day.completed ? '#C46B3B' : '#C94F4F'
    };
    return acc;
  }, {});

  return <Calendar markedDates={markedDates} onDayPress={onDayPress} theme={{ selectedDayBackgroundColor: '#C46B3B' }} />;
};

export default StreakCalendar;
