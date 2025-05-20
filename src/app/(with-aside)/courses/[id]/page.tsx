import {Skeleton} from '@/components/ui/skeleton';
import YoutubeEmbed from '@/components/client/youtubeEmbed';
import React, {Suspense} from 'react';
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger,} from '@/components/ui/accordion';
import VideoList from '@/app/(with-aside)/courses/[id]/videoList';
import {ScrollArea} from '@/components/ui/scroll-area';
import Lesson from './lesson';
import {getCourseById, getUserEnrollments, getVideoData} from '@/_actions/courses-action';
import FormatSelector from './formatSelector';
import PdfList from './pdfList';
import LinkList from './linkList';
import PdfViewer from '@/components/client/PdfViewer';
import LinkViewer from '@/components/client/LinkViewer';
import Image from 'next/image';
import {getLessons, LessonResponse} from "@/_actions/lessons-action";
import {getVideos, VideoResponse} from "@/_actions/videos-action";
import {AttachmentResponse, getAttachments} from "@/_actions/attachments-action";
import EnrollmentModal from "@/app/(with-aside)/courses/[id]/enrollment-modal";
import {getPublicUrl} from "@/_actions/utils/utils";
import {EnrollmentResponse} from "@/_actions/enrollment-action";
import {ClassResponse, getClasses} from "@/_actions/class-action";


export default async function CoursesPage({
                                              searchParams,
                                              params: {id},
                                          }: {
    searchParams: Record<string, string>;
    params: { id: string };
}) {
    const course = await getCourseById(Number(id));
    const isEnrolled = true;

    const isEnroll: boolean = searchParams && searchParams['enroll'] === 'true'
    if (isEnroll) {
        const enrollments: EnrollmentResponse[] = await getUserEnrollments(Number(id))
        const classes: ClassResponse[] = await getClasses(Number(id))

        console.log(enrollments)

        return (<div className="w-full">
                <ScrollArea
                    className='w-full bg-white shadow-md rounded-xl md:relative border-t-0 md:h-[calc(100vh-4rem)]'>
                    <div className="p-6 space-y-6">
                        <div className="relative rounded-xl overflow-hidden
                          w-full md:w-[600px] lg:w-[800px]
                          h-[200px] md:h-[300px] lg:h-[400px]
                          mx-auto">
                            <Image
                                unoptimized={true}
                                src={getPublicUrl(course.image) || '/images/mesin.png'}
                                alt={course.title}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw,
                       (max-width: 1024px) 600px,
                       800px"
                            />
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-2xl font-semibold">{course.title}</h2>
                            <p className="text-gray-600">{course.description}</p>
                            <EnrollmentModal courseId={Number(id)} courseTitle={course.title}
                                             classes={classes}
                                             enrollments={enrollments}
                                             defaultValues={{
                                                 courseId: Number(id),
                                                 classes: enrollments.map((enrollment) => enrollment.classId),
                                                 classId: -1
                                             }}/>
                        </div>
                    </div>
                </ScrollArea>
            </div>
        )
    }

    const isExpanded = searchParams && searchParams['expanded'] === 'true';
    const format = searchParams && searchParams['format'] || 'video';

    let lessons: LessonResponse[] = await getLessons(id);
    let attachments: AttachmentResponse[] = []
    let videos: VideoResponse[] = []

    if (lessons.length === 0) return;
    const lessonId = searchParams['lessonId'] ?? String(lessons[0].lessonId);

    if (format === 'video') {
        videos = await getVideos(id, lessonId);
        if (videos.length === 0) {
            return (<div className='flex gap-6'>
                <FormatSelector format={format}/>
                {lessonId && <Lesson
                    lessonId={lessonId}
                    params={`?expanded=${isExpanded}`}
                    lessons={lessons}
                />}
            </div>)
        }
    }

    if (format === 'pdf') {
        attachments = await getAttachments(id, lessonId)
    }

    const fetchedVideos = await Promise.all(
        videos.map(async ({videoId, youtubeLink, title}) => {
            try {
                const {thumbnail_url, author_name} = await getVideoData(youtubeLink);
                return {
                    videoId,
                    youtubeLink,
                    title,
                    thumbnail_url: thumbnail_url as string,
                    author_name: author_name as string
                };
            } catch (exception) {
                return {
                    title,
                    videoId,
                    youtubeLink,
                    thumbnail_url: 'https://static.vecteezy.com/system/resources/thumbnails/057/181/018/small_2x/error-404-message-with-shake-noise-effect-error-404-notification-free-video.jpg',
                    author_name: 'Unknown Author'
                };
            }

        })
    );

    const defaultPdf = "DEFAULT_PDF"
    const query = searchParams['q'] || fetchedVideos[0]?.youtubeLink || defaultPdf;
    let title!: string;
    let author!: string;
    if (format === 'video') {
        title = fetchedVideos.find(({youtubeLink}) => youtubeLink === query)?.title ?? "";
        author = fetchedVideos.find(
            ({youtubeLink}) => youtubeLink === query
        )?.author_name ?? "";
    }

    const params = `?expanded=${isExpanded}`;

    const Description = () => (
        format === 'video' && (<div className='bg-slate-200 rounded-md p-1.5 h-full flex flex-col gap-3'>
            {format === 'video' && <div className='text-justify'>
                <h4 className='text-sm md:text-base'>Description:</h4>
                <p className='text-xs md:text-sm'>
                    {videos.find(({youtubeLink}) => youtubeLink === query)?.description ?? "-"}
                </p>
            </div>}
        </div>)
    );

    const linkMaterials = [
        {
            title: "MDN Web Docs",
            url: "https://developer.mozilla.org/"
        },
        {
            title: "React Official Documentation",
            url: "https://react.dev/"
        },
        {
            title: "Next.js Documentation",
            url: "https://nextjs.org/docs"
        }
    ];

    return (
        <div className='flex gap-6'>
            <FormatSelector format={format}/>
            {lessonId && <Lesson
                lessonId={lessonId}
                params={params}
                lessons={lessons}
            />}
            <ScrollArea className='w-full bg-white shadow-md rounded-xl md:relative border-t-0 md:h-[calc(100vh-4rem)]'>
                {isEnrolled ? (
                    <>
                        <Suspense
                            fallback={<Skeleton className='w-full aspect-video rounded-xl'/>}
                        >
                            {format === 'video' ? (
                                <YoutubeEmbed
                                    embedId={query}
                                    title={title || ''}
                                    className='rounded-t-xl rounded-b-sm md:rounded-xl'
                                />
                            ) : format === 'pdf' ? (
                                query === defaultPdf ? '' :
                                    (<div className="w-full aspect-video rounded-xl bg-gray-50">
                                        <PdfViewer url={query}/>
                                    </div>)
                            ) : format === 'link' ? (
                                <div className="w-full aspect-video rounded-xl bg-gray-50">
                                    <LinkViewer url={query}/>
                                </div>
                            ) : (
                                <div
                                    className="w-full aspect-video rounded-xl bg-gray-50 flex items-center justify-center">
                                    <iframe
                                        src={query}
                                        className="w-full h-full rounded-xl"
                                        title={title}
                                    />
                                </div>
                            )}
                        </Suspense>
                        <div className='px-3 pb-4 md:hidden'>
                            <Accordion
                                type='single'
                                collapsible
                            >
                                <AccordionItem value='desc'>
                                    <AccordionTrigger
                                        className='py-2 text-sm flex justify-between font-normal text-black group/ancestor'>
                                        <div className={`text-left group/parent`}>
                                            <p>{title}</p>
                                            <p className='text-muted-foreground text-3xs group-data-[state=open]/ancestor:hidden'>
                                                author: {author}{' '}
                                                <span className='ml-2 text-black'>...more</span>
                                            </p>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <Description/>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                            {format === 'video' && lessonId && (
                                <VideoList
                                    key={lessonId}
                                    videos={fetchedVideos}
                                    isExpanded={isExpanded}
                                    query={query}
                                    lessonId={lessonId}
                                />
                            )}
                            {format === 'pdf' && lessonId && (
                                <PdfList
                                    attachments={attachments}
                                    isExpanded={isExpanded}
                                    query={query}
                                    lessonId={lessonId}
                                />
                            )}
                            {format === 'link' && lessonId && (
                                <LinkList
                                    materials={linkMaterials}
                                    isExpanded={isExpanded}
                                    query={query}
                                    lessonId={lessonId}
                                />
                            )}
                        </div>
                        <div className='px-4 py-4 space-y-4 h-full hidden md:block'>
                            <h4 className='text font-semibold'>{title}</h4>
                            <Description/>
                        </div>
                    </>
                ) : (
                    <div className="p-6 space-y-6">
                        <div className="relative rounded-xl overflow-hidden
                          w-full md:w-[600px] lg:w-[800px]
                          h-[200px] md:h-[300px] lg:h-[400px]
                          mx-auto">
                            <Image unoptimized={true}
                                   src={course.image || getPublicUrl('/assets/images/mesin.png')}
                                   alt={course.title}
                                   fill
                                   className="object-cover"
                                   sizes="(max-width: 768px) 100vw,
                       (max-width: 1024px) 600px,
                       800px"
                            />
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-2xl font-semibold">{course.title}</h2>
                            <p className="text-gray-600">{course.description}</p>
                        </div>
                    </div>
                )}
            </ScrollArea>
            {isEnrolled && lessonId && (
                <ScrollArea className='hidden md:block w-[450px] relative h-[calc(100vh-4rem)]'>
                    <p className='pb-4 sticky top-0 z-[2] bg-background'>All Videos</p>
                    {format === 'video' && (
                        <VideoList
                            key={lessonId}
                            videos={fetchedVideos}
                            isExpanded={true}
                            query={query}
                            lessonId={lessonId}
                        />
                    )}
                    {format === 'pdf' && (
                        <PdfList
                            attachments={attachments}
                            isExpanded={true}
                            query={query}
                            lessonId={lessonId}
                        />
                    )}
                    {format === 'link' && (
                        <LinkList
                            materials={linkMaterials}
                            isExpanded={true}
                            query={query}
                            lessonId={lessonId}
                        />
                    )}
                </ScrollArea>
            )}
        </div>
    );
}
