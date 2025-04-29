import {Skeleton} from '@/components/ui/skeleton';
import YoutubeEmbed from '@/components/client/youtubeEmbed';
import Link from 'next/link';
import {Suspense} from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import VideoList from '@/app/(with-aside)/courses/[id]/videoList';
import {ScrollArea} from '@/components/ui/scroll-area';
import Lesson from './lesson';
import {getLessons, getVideoData, getVideos, getCourseById} from '@/_actions/courses-action';
import FormatSelector from './formatSelector';
import PdfList from './pdfList';
import LinkList from './linkList';
import PdfViewer from '@/components/client/PdfViewer';
import LinkViewer from '@/components/client/LinkViewer';
import Image from 'next/image';
import EnrollmentModal from './enrollment-modal';

export default async function CoursesPage({
                                              searchParams,
                                              params: {id},
                                          }: {
    searchParams: Record<string, string>;
    params: { id: string };
}) {
    const course = await getCourseById(id);

    const isEnrolled = true;

    // return (
    //     <div className="w-full">
    //         <ScrollArea
    //             className='w-full bg-white shadow-md rounded-xl md:relative border-t-0 md:h-[calc(100vh-4rem)]'>
    //             <div className="p-6 space-y-6">
    //                 <div className="relative rounded-xl overflow-hidden
    //                       w-full md:w-[600px] lg:w-[800px]
    //                       h-[200px] md:h-[300px] lg:h-[400px]
    //                       mx-auto">
    //                     <Image
    //                         src={course.image || '/images/mesin.png'}
    //                         alt={course.title}
    //                         fill
    //                         className="object-cover"
    //                         sizes="(max-width: 768px) 100vw,
    //                    (max-width: 1024px) 600px,
    //                    800px"
    //                     />
    //                 </div>
    //                 <div className="space-y-4">
    //                     <h2 className="text-2xl font-semibold">{course.title}</h2>
    //                     <p className="text-gray-600">{course.description}</p>
    //                     <EnrollmentModal courseId={Number(id)} courseTitle={course.title}/>
    //                 </div>
    //             </div>
    //         </ScrollArea>
    //     </div>
    // );


    const isExpanded = searchParams['expanded'] === 'true';
    const format = searchParams['format'] || 'video';

    const lessons = await getLessons(id);
    if (lessons.length === 0) return;

    const lessonId = searchParams['lessonId'] ?? String(lessons[0].lessonId);
    const videos = lessonId ? await getVideos(id, lessonId) : [];
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

    const materials = await Promise.all(
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

    const query = searchParams['q'] || materials[0].youtubeLink;
    const title = materials.find(({youtubeLink}) => youtubeLink === query)?.title;
    const author = materials.find(
        ({youtubeLink}) => youtubeLink === query
    )?.author_name;
    const params = `?expanded=${isExpanded}`;

    const Description = () => (
        <div className='bg-slate-200 rounded-md p-1.5 h-full flex flex-col gap-3'>
            <div className=''>
                <h4 className='text-sm md:text-base'>Ebook Link:</h4>
                <Link
                    href='https://www.google.com'
                    target='_blank'
                    className='text-xs md:text-sm text-blue-500 underline hover:text-blue-700'
                >
                    {"Click here to download the ebook"}
                </Link>
            </div>
            <div className='text-justify'>
                <h4 className='text-sm md:text-base'>Summary:</h4>
                <p className='text-xs md:text-sm'>
                    {videos.find(({youtubeLink}) => youtubeLink === query)?.description}
                </p>
            </div>
        </div>
    );

    const pdfMaterials = [
        {
            title: "JavaScript Basics Guide",
            url: "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf"
        },
        {
            title: "Web Development Fundamentals",
            url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
        },
        {
            title: "React Documentation",
            url: "https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf"
        }
    ];

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
                                <div className="w-full aspect-video rounded-xl bg-gray-50">
                                    <PdfViewer url={query}/>
                                </div>
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
                                    materials={materials}
                                    isExpanded={isExpanded}
                                    query={query}
                                    lessonId={lessonId}
                                />
                            )}
                            {format === 'pdf' && lessonId && (
                                <PdfList
                                    materials={pdfMaterials}
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
                            <Image
                                src={course.image || '/images/mesin.png'}
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
                            materials={materials}
                            isExpanded={true}
                            query={query}
                            lessonId={lessonId}
                        />
                    )}
                    {format === 'pdf' && (
                        <PdfList
                            materials={pdfMaterials}
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
