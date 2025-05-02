'use client'

import Calendar, {type EventMap} from './calendar-x';
import UpcomingSchedule from './upcomingSched';
import News from './news';
import {useEffect, useState} from "react";
import {getAllUserSchedules} from "@/_actions/schedule-action";
import Assignments from "@/app/(with-aside)/dashboard/assignments";
import {getUserAssignment} from "@/_actions/assignment-action";
import {Button} from "@/components/ui/button";
import {checkPermissionStateAndAct, notificationUnsupported, registerAndSubscribe, sendWebPush} from "@/app/Push";

export const dynamic = 'force-dynamic';

export default function Home() {
    const [unsupported, setUnsupported] = useState<boolean>(false);
    const [subscription, setSubscription] = useState<PushSubscription | null>(null);
    const [assignments, setAssignments] = useState<any>([]);
    const [calendar, setCalendar] = useState<any>(null);
    const [schedules, setSchedules] = useState<any>([]);

    useEffect(() => {
        const isUnsupported = notificationUnsupported();
        setUnsupported(isUnsupported);
        if (isUnsupported) {
            return;
        }
        checkPermissionStateAndAct(setSubscription);

        const fetchData = async () => {
            const assignmentsResponse = await getUserAssignment();
            setAssignments(assignmentsResponse);
            const schedulesResponse = await getAllUserSchedules();
            setSchedules(schedulesResponse);
        };
        fetchData()
    }, []);

    const events: EventMap[] = [
        {
            '2024-07-28': [
                {title: 'Ngaso Bareng Dosen'},
                {title: 'Kinematika dan Dinamika Permesinan'},
                {title: 'Tugas Besar - MS2200 Termodinamika'},
            ],
        },
        {
            '2024-07-25': [
                {title: 'Homework 4 - MS2101 Analisis Numerik'},
                {title: 'Hearing Machining'},
            ],
        },
        {'2024-07-31': [{title: 'Pre-Machining'}, {title: 'FRS'}]},
    ];

    return (
        <div className="flex flex-col items-stretch flex-1 h-max gap-6 relative">
            <Button
                className='bg-navy rounded-full font-semibold py-1.5 text-white hover:bg-navy/80 transition px-6 text-sm md:text-base'
                disabled={unsupported}
                onClick={() => registerAndSubscribe(setSubscription)}
            >
                {unsupported
                    ? 'Notification Unsupported'
                    : subscription
                        ? 'Notification allowed'
                        : 'Allow notification'}
            </Button>
            <Button
                className='bg-navy rounded-full font-semibold py-1.5 text-white hover:bg-navy/80 transition px-6 text-sm md:text-base'
                onClick={() => sendWebPush('Notif bro!')}
            >
                Test Push Notification
            </Button>

            <div className="flex flex-col md:flex-row gap-6">
                <UpcomingSchedule schedules={schedules as any}/>
                <Assignments assignments={assignments}/>
            </div>
            <div className="flex flex-col md:flex-row w-full gap-6 items-center">
                <Calendar events={events}/>
                <News/>
            </div>
            <div className="relative bg-white w-full rounded-xl shadow-md py-2">
                <div className="text-7xl font-bold text-abu-1 px-4">#QOTD</div>
                <p className="top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-0 absolute italic text-center w-max max-w-[90vw] text-sm md:text-base">
                    {`"Success is not final, failure is not fatal: It is the courage to
          continue that counts."`}{' '}
                    <br/> <span className="font-bold">Winston Churchill</span>
                </p>
            </div>
        </div>
    );
}
//
// export const metadata = {
//     title: 'Dashboard',
// };