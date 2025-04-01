'use client';
import { ScrollArea } from '@/components/ui/scroll-area';
import { type CourseScheduleModel } from 'lms-types';

const UpSchedCard = ({
  time,
  description,
  title,
}: {
  title?: string;
  description?: string;
  time?: string;
}) => {
  return (
    <div className='relative flex justify-between items-center border-y border-y-abu-1 px-4 py-3'>
      <div className='text-left'>
        <p className='text-xs'>{title}</p>
        <p className='text-2xs font-normal'>{description}</p>
      </div>
      <div className='font-normal text-2xs flex items-center'>{time}</div>
    </div>
  );
};

const UpcomingSchedule = ({ 
  schedules 
}: { 
  schedules: (CourseScheduleModel & { courseName: string })[]
}) => {
  // Helper function to check if date is today or tomorrow
  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isTomorrow = (date: Date) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return date.toDateString() === tomorrow.toDateString();
  };

  // Filter and sort schedules
  const todaySchedules = schedules
    .filter(schedule => isToday(new Date(schedule.date)))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const tomorrowSchedules = schedules
    .filter(schedule => isTomorrow(new Date(schedule.date)))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className='md:w-1/2 bg-white rounded-lg shadow-md py-6 flex flex-col'>
      <h3 className='font-bold px-6 mb-2 text-center'>Upcoming Schedule</h3>
      <ScrollArea className='h-64'>
        <div className='flex flex-col text-center font-medium'>
          <h5 className='font-semibold my-2'>Today</h5>
          {todaySchedules.map((schedule) => (
            <UpSchedCard
              key={schedule.id}
              title={schedule.title}
              description={`${schedule.courseName}${schedule.description ? ` - ${schedule.description}` : ''}`}
              time={new Date(schedule.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            />
          ))}
          {todaySchedules.length === 0 && (
            <p className="text-xs text-muted-foreground border-y border-y-abu-1 py-3">No schedules today</p>
          )}

          <h5 className='font-semibold my-2'>Tomorrow</h5>
          {tomorrowSchedules.map((schedule) => (
            <UpSchedCard
              key={schedule.id}
              title={schedule.title}
              description={`${schedule.courseName}${schedule.description ? ` - ${schedule.description}` : ''}`}
              time={new Date(schedule.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            />
          ))}
          {tomorrowSchedules.length === 0 && (
            <p className="text-xs text-muted-foreground border-y border-y-abu-1 py-3">No schedules tomorrow</p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default UpcomingSchedule;