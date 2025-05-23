import {Button} from "@/components/ui/button";
import ReportCard from "@/app/(with-aside)/myhmm/report-card";
import GradientText from "@/components/ui/gradient-text";
import WhatsNext from "@/app/(with-aside)/myhmm/whats-next";

const MyHMMPage = () => {
    const grade = 3.4;
    const participation = 10;
    const totalParticipation = 12;
    const participationPercentage = Math.round(participation / totalParticipation * 10000) / 100;
    const myHMMPoint = 100;
    const events: { title: string, date: Date }[] = [{
        title: 'Webinar: "How to be a good student"',
        date: new Date(Date.parse('8/10/2024')),
    }, {
        title: 'Seminar: "How to be a good student"',
        date: new Date(Date.parse('9/11/2024')),
    }, {
        title: 'Workshop: "How to be a good student"',
        date: new Date(Date.parse('12/12/2024')),
    }, {
        title: 'Hackathon: "How to be a good student"',
        date: new Date(Date.parse('1/1/2025')),
    }, {
        title: 'Competition: "How to be a good student"',
        date: new Date(Date.parse('2/2/2025')),
    }];
    return (
        <>
            <div className="bg-white rounded-xl p-6 space-y-6 md:space-y-8">
                <div className="flex justify-between items-center">
                    <h3 className="md:text-xl text-sm font-bold">Report</h3>
                    <Button
                        className='py-1.5 h-fit md:py-2.5 min-w-32 bg-navy text-white font-semibold text-xs md:text-lg'>Download</Button>
                </div>
                <div className="grid grid-rows-1 grid-cols-3 gap-x-4 sm:gap-x-12 md:gap-x-16">
                    <ReportCard title={"Performance Grade"}>
                        <div className='relative rounded-full aspect-square h-full flex items-center justify-center'
                             style={{
                                 background: `conic-gradient(#FFD700 0% ${grade / 4 * 100}%, #FFF ${grade / 4 * 100}% 100%)`
                             }}>
                            <div
                                className='absolute text-sm md:text-2xl font-medium h-[85%] bg-navy rounded-full aspect-square grid place-items-center text-white'>{grade}/4
                            </div>
                        </div>
                    </ReportCard>
                    <ReportCard title={"Participation"}>
                        <div
                            className='relative rounded-full aspect-square h-full flex items-center justify-center'
                            style={{
                                background: `conic-gradient(#FFD700 0% ${participationPercentage}%, #FFF ${participationPercentage}% 100%)`
                            }}>
                            <div
                                className='absolute text-sm md:text-2xl font-medium h-[85%] bg-navy rounded-full aspect-square grid place-items-center text-white'>{participationPercentage}%
                            </div>
                        </div>
                    </ReportCard>
                    <ReportCard title={"MyHMM Point"}>
                        <GradientText
                            className='text-2xl md:text-7xl w-full text-center bg-gradient-to-br'>{myHMMPoint}</GradientText>
                    </ReportCard>
                </div>
            </div>
            <WhatsNext events={events}/>
            <div className="bg-white rounded-xl p-6 space-y-4 md:space-y-6">
                <h3 className="md:text-xl text-sm font-bold">Hotline HMM</h3>
                <div className="space-y-6">
                    <div className="bg-white rounded-xl p-0.5 space-y-4">
                        {/* First Div Content */}
                    </div>
                </div>
                {/*<p className='text-xs md:text-sm text-justify'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas aliquet pellentesque tellus, vitae varius*/}
                {/*  sem consequat id. Sed velit lorem, pharetra non fringilla eu, convallis id enim. In bibendum dolor quam, sed*/}
                {/*  consectetur nisi aliquet suscipit. Pellentesque velit dolor, vehicula id cursus et, tincidunt nec leo. Nunc id*/}
                {/*  augue semper, elementum purus id, vulputate nibh. Donec interdum sed nibh eu vehicula. Maecenas porta interdum*/}
                {/*  sem, a tempus nulla egestas eget. Cras sollicitudin posuere leo eu ullamcorper. Praesent molestie risus ut*/}
                {/*  venenatis suscipit. Fusce non condimentum eros, eu suscipit massa. Phasellus scelerisque ex ut justo porta*/}
                {/*  efficitur. Sed sed venenatis lectus. Etiam mattis neque ligula, et suscipit elit accumsan nec.</p>*/}
                <a
                    href="https://wa.me/6285388857374"  // <-- Add your desired URL here
                    className='py-1 px-3 h-fit bg-navy text-white hover:bg-kuning hover:text-navy transition rounded-full text-xs md:text-sm font-medium'
                >
                    Kesehatan Mental
                </a>
            </div>
        </>
    );
};

export const metadata = {
    title: 'MyHMM',
};

export default MyHMMPage;
