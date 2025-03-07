'use client';
import { colors } from './assignments';
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  getDaysInMonth,
} from 'date-fns';
import { useState } from 'react';
export type Event = {
  id?: number;
  title: string;
  color?: string;
};

export type EventMap = {
  [key: string]: Event[];
};

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const YEARS = ['2021', '2022', '2023', '2024', '2025'];
const getMonth = MONTHS[new Date().getMonth()];
const getYear = new Date().getFullYear().toString();

const compareDate = (date1: Date, date2: Date) => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

const SelectMonth = ({
  month,
  setMonth,
  year,
  setYear,
}: {
  month: string;
  setMonth: (value: string) => void;
  year: string;
  setYear: (value: string) => void;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
    >
      <PopoverTrigger asChild>
        <button className='text-sm gap-2 flex items-center w-36 justify-end'>
          {`${MONTHS.find(
            (m) => m.toLowerCase() === month.toLowerCase()
          )} ${year}`}
          <CaretSortIcon className='h-4 w-4 shrink-0 opacity-50' />
        </button>
      </PopoverTrigger>
      <PopoverContent className='w-40 p-0 border border-navy'>
        <Tabs
          defaultValue='m'
          className=''
        >
          <TabsList className='bg-transparent w-full flex *:flex-1 *:border-none border border-navy/50'>
            <TabsTrigger value='m'>Months</TabsTrigger>
            <TabsTrigger value='y'>Years</TabsTrigger>
          </TabsList>
          <TabsContent value='m'>
            <Command>
              <CommandInput placeholder='Select month..' />
              <ScrollArea className='h-40'>
                <CommandGroup>
                  {MONTHS.map((m) => (
                    <CommandItem
                      key={m}
                      onSelect={(currentValue) => {
                        setMonth(currentValue === m ? '' : currentValue);
                        setOpen(false);
                      }}
                      value={m}
                    >
                      {m}
                      <CheckIcon
                        className={cn(
                          'ml-auto h-4 w-4',
                          month === m.toLowerCase()
                            ? 'opacity-100'
                            : 'opacity-0'
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </ScrollArea>
            </Command>
          </TabsContent>
          <TabsContent value='y'>
            <Command>
              <CommandInput placeholder='Select year..' />
              <ScrollArea className='h-40'>
                <CommandGroup>
                  {YEARS.map((y) => (
                    <CommandItem
                      key={y}
                      onSelect={(currentValue) => {
                        setYear(currentValue);
                        setOpen(false);
                      }}
                      value={y}
                    >
                      {y}
                      <CheckIcon
                        className={cn(
                          'ml-auto h-4 w-4',
                          year === y ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </ScrollArea>
            </Command>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
};

export default function Calendar({ events }: {events?: EventMap[]}) {
  const [month, setMonth] = useState(getMonth);
  const [year, setYear] = useState(getYear);
  const today = new Date();
  const date = new Date(`${month} 1, ${year}`);
  const dateBefore = new Date(`${month} 1, ${year}`).setMonth(
    date.getMonth() - 1
  );
  const dateAfter = new Date(`${month} 1, ${year}`).setMonth(
    date.getMonth() + 1
  );
  const days = eachDayOfInterval({
    start: startOfMonth(date),
    end: endOfMonth(date),
  });
  const daysBefore = eachDayOfInterval({
    start: startOfMonth(dateBefore),
    end: endOfMonth(dateBefore),
  });
  const daysAfter = eachDayOfInterval({
    start: startOfMonth(dateAfter),
    end: endOfMonth(dateAfter),
  });
  const id = getDay(date);
  const daysInMonth = getDaysInMonth(date);

  return (
    <div className='min-w-fit flex-1 bg-white rounded-2xl w-full md:w-auto shadow-md gap-4 p-6 flex flex-col md:min-h-[50vh] min-h-[30vh]'>
      <div className='flex justify-between px-2'>
        <h3 className=''>Calendar</h3>
        <SelectMonth
          month={month}
          setMonth={setMonth}
          year={year}
          setYear={setYear}
        />
      </div>
      <div className='grid grid-cols-7 text-sm'>
        {DAYS.map((day) => (
          <div
            key={day}
            className='text-center text-abu-3'
          >
            {day}
          </div>
        ))}
      </div>
      <div className='grid grid-cols-7 text-sm border border-abu-1 flex-1'>
        {daysBefore
          .filter((_, index) => index >= daysBefore.length - id)
          .map((day) => (
            <div
              key={day.getTime()}
              className='text-center text-abu-3 flex items-center justify-center min-w-10 min-h-6 md:min-w-15 md:min-h-11 border border-abu-1'
            >
              {format(day, 'd')}
            </div>
          ))}
        {days.map((day) => (
          <Popover key={day.getTime()}>
            <PopoverTrigger asChild>
              <button
                className={cn(
                  ' flex items-center group relative hover:bg-gray-500/20 justify-center aspect-square md:aspect-auto min-w-10 min-h-6 md:min-w-15 md:min-h-11 border border-abu-1'
                )}
              >
                <div
                  className={cn(
                    'text-center rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center group-data-[state=open]:bg-gray-700/50 group-data-[state=open]:text-white',
                    compareDate(day, today) && 'bg-navy/90 text-white'
                  )}
                >
                  {format(day, 'd')}
                </div>
                <div className='absolute top-0 right-0 w-2'>
                  {events
                    ?.find(
                      (e) => Object.keys(e)[0] === format(day, 'yyyy-MM-dd')
                    )
                    ?.[format(day, 'yyyy-MM-dd')].map((e, index) => (
                      <div
                        key={index}
                        className={cn(
                          'w-1 h-1.5',
                          e.color || colors[index % 4]
                        )}
                      />
                    ))}
                </div>
              </button>
            </PopoverTrigger>
            <PopoverContent className='px-0 rounded-xl shadow-md text-xs py-2 border border-navy divide-y-[1px]'>
              {events
                ?.find((e) => Object.keys(e)[0] === format(day, 'yyyy-MM-dd'))
                ?.[format(day, 'yyyy-MM-dd')].map((e, index) => (
                  <div
                    key={index}
                    className={cn(
                      'flex items-center h-8 px-4 bg-white relative text-black'
                    )}
                  >
                    {e.title}
                    <div
                      className={`h-full ${
                        colors[index % 4]
                      } w-1.5 rounded-[1px] left-0 top-0 absolute`}
                    ></div>
                  </div>
                )) || (
                <div className='p-1.5 bg-white text-black'>No events</div>
              )}
            </PopoverContent>
          </Popover>
        ))}
        {daysAfter
          .filter(
            (_, index) =>
              index < 7 * Math.ceil((daysInMonth + id) / 7) - (daysInMonth + id)
          )
          .map((day) => (
            <div
              key={day.getTime()}
              className='text-center text-abu-3 flex items-center justify-center min-w-10 min-h-6 md:min-w-15 md:min-h-11 border border-abu-1'
            >
              {format(day, 'd')}
            </div>
          ))}
      </div>
    </div>
  );
};