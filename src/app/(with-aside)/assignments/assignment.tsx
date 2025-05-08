'use client';
import React, {type BaseSyntheticEvent, useEffect, useId, useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {ChevronDownIcon, ChevronRight, ChevronUpIcon, LayoutList, Notebook} from 'lucide-react';
import {Separator} from '@/components/ui/separator';
import Button from '@/components/ui/button/button';
import {Input} from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {useInterval} from '@/hooks/useInterval';
import MotionFramer from '@/components/client/modal-framer';
import {$PersonalAssignmentAPI, AssignmentType, CourseModel,} from 'lms-types';
import MotionOverlay from '@/components/client/modal-overlay';
import {Badge} from "@/components/ui/badge";
import {useAction} from "next-safe-action/hooks";
import {createPersonalAssignment, updatePersonalAssignment} from "@/_actions/assignment-action";
import {toast} from "sonner";
import {Textarea} from "@/components/ui/textarea";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {addPersonalAssignmentSchema} from "@/lib/schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {UUC2N} from "@/lib/utils";
import Search from '@/components/client/search';
import useDebounce from '@/hooks/useDebounce';
import Pagination from '@/components/client/pagination';
import {PWAError} from "@/lib/error";

const Assignment = ({
                        assignments,
                    }: {
    assignments: $PersonalAssignmentAPI.GetAssignments.Response['data'];
    courses: CourseModel[];
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearch = useDebounce(searchQuery);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [sortBy, setSortBy] = useState<'date' | 'name' | 'status'>('date');
    const [page, setPage] = useState(1);
    const [isMobile, setIsMobile] = useState(false);
    const assignmentPerPage = isMobile ? 5 : 6;

    const data = assignments
        .map((assignment) => ({
            // @ts-ignore
            status: assignment.completionStatus,
            course: assignment.course as string,
            name: assignment.title,
            deadline: new Date(assignment.deadline),
            submission: assignment.submission,
            taskType: assignment.taskType === "PERSONAL_TASK" ? "Personal Task" : "Group Task",
            description: assignment.description,
            id: assignment.assignmentId,
            type: assignment.assignmentType,
        }))
        .filter((item) =>
            item.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            item.course.toString().toLowerCase().includes(debouncedSearch.toLowerCase())
        );
    const {executeAsync, isExecuting} = useAction(createPersonalAssignment, {
        onSuccess: (response: any) => {
            if (response?.data.error) {
                toast.error(response?.data?.error);
                return;
            }
            toast.success('Assignment created');
        },
        onError: ({error: {validationErrors}}) => {
            toast.error(validationErrors?.toString() || 'Failed to create assignment');
        },
    })

    const {
        handleSubmit,
        formState: {isSubmitting, errors, isValid},
        setValue,
        register,
        reset,
        trigger,
    } = useForm<z.infer<typeof addPersonalAssignmentSchema>>({
        resolver: zodResolver(addPersonalAssignmentSchema),
        defaultValues: {
            title: '',
            course: '',
            deadline: new Date(),
            submission: '',
            description: undefined,
            taskType: 'PERSONAL_TASK',
        },
        mode: 'onChange',
    })

    const [active, setActive] = useState<
        (typeof data)[number] | 'add' | boolean | null
    >(null);

    const onSubmit = async (data: z.infer<typeof addPersonalAssignmentSchema>, e: BaseSyntheticEvent | undefined) => {
        e?.preventDefault();
        await executeAsync(data);
        reset();
        setActive(null);
    }

    const id = useId();
    useEffect(() => {
        function onKeydown(e: KeyboardEvent) {
            if (e.key === 'Escape') setActive(null);
        }

        if (active && typeof active === 'object') {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        window.addEventListener('keydown', onKeydown);
        return () => window.removeEventListener('keydown', onKeydown);
    }, [active]);

    useInterval(() => {
        setTimeToDeadline(
            timeLeft(
                new Date(
                    active && typeof active === 'object'
                        ? active.deadline
                        : '2024-07-27T00:00:00'
                )
            )
        );
    }, 1000);

    const timeLeft = (date: Date) => {
        const now = new Date().getTime();
        const deadline = date.getTime();
        const diff = deadline - now;

        if (diff < 0) return {days: 0, hours: 0, minutes: 0, seconds: 0};

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        return {days, hours, minutes, seconds};
    };

    const [timeToDeadline, setTimeToDeadline] = useState(
        timeLeft(new Date('2024-07-27T00:00:00'))
    );

    const badges = (s: string) => {
        switch (s) {
            case 'OVER_DUE_DATE':
                return 'warning';
            case 'DONE':
                return 'success';
            case 'IN_PROGRESS':
                return 'alert';
            case 'NOT_STARTED':
                return 'default';
            default:
                return 'default';
        }
    }

    const getStatus = (status: string, deadline: Date) => {
        if (status === 'DONE') {
            return 'DONE';
        }
        const now = new Date();
        if (now > deadline) {
            return 'OVER_DUE_DATE';
        }
        return status;
    }

    const {execute: exeUPA} = useAction(updatePersonalAssignment, {
        onSuccess: (response: any) => {
            if (response?.data.error) {
                toast.error(response?.data?.error);
                return;
            }
            toast.success('Assignment updated');
        },
        onError: ({error: {serverError, validationErrors}}) => {
            toast.error(serverError || validationErrors?.toString() || 'Failed to update assignment');
        },
        onSettled: () => {
            setActive(null);
        }
    })

    function updateComp(assignment: (typeof data)[number], status: "NOT_STARTED" | "IN_PROGRESS" | "DONE") {
        if (assignment.type === AssignmentType.PERSONAL_ASSIGNMENT) {
            exeUPA({
                assignmentId: Number(assignment.id),
                completionStatus: status,
            })
        } else {
            throw new PWAError('Assignment type is not personal assignment');
        }
    }

    const sortedData = [...data].sort((a, b) => {
        switch (sortBy) {
            case 'date':
                return sortOrder === 'asc'
                    ? a.deadline.getTime() - b.deadline.getTime()
                    : b.deadline.getTime() - a.deadline.getTime();
            case 'name':
                return sortOrder === 'asc'
                    ? a.name.localeCompare(b.name)
                    : b.name.localeCompare(a.name);
            case 'status':
                return sortOrder === 'asc'
                    ? getStatus(a.status!, a.deadline).localeCompare(getStatus(b.status!, b.deadline))
                    : getStatus(b.status!, b.deadline).localeCompare(getStatus(a.status!, a.deadline));
            default:
                return 0;
        }
    });

    const totalPage = Math.ceil(sortedData.length / assignmentPerPage);

    const paginatedData = sortedData.filter((_, index) =>
        index >= (page - 1) * assignmentPerPage &&
        index < page * assignmentPerPage
    );

    // Calculate the range of items being shown
    const startItem = (page - 1) * assignmentPerPage + 1;
    const endItem = Math.min(page * assignmentPerPage, sortedData.length);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768); // 768px is the standard md breakpoint
        };

        // Initial check
        checkMobile();

        // Add event listener for window resize
        window.addEventListener('resize', checkMobile);

        // Cleanup
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <>
            <div className='flex flex-col md:flex-row md:items-center gap-4'>
                {/* Search bar - full width on mobile */}
                <Search
                    query={searchQuery}
                    setQuery={setSearchQuery}
                    className="w-full md:max-w-md"
                />

                {/* Filter and Add button container */}
                <div className="flex items-center justify-between md:justify-end w-full gap-2">
                    <div className="flex items-center gap-2">
                        <Select value={sortBy} onValueChange={(value: 'date' | 'name' | 'status') => setSortBy(value)}>
                            <SelectTrigger className="w-[140px] rounded-full border-navy">
                                <SelectValue placeholder="Sort by..."/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="date">By Date</SelectItem>
                                <SelectItem value="name">By Name</SelectItem>
                                <SelectItem value="status">By Status</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button
                            variant="outline"
                            className="w-8 h-8 p-0 rounded-full border-navy flex items-center justify-center"
                            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                            title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
                        >
                            {sortOrder === 'asc' ? (
                                <ChevronUpIcon className="h-4 w-4"/>
                            ) : (
                                <ChevronDownIcon className="h-4 w-4"/>
                            )}
                        </Button>
                    </div>
                    <motion.div layoutId={'add' + id}>
                        <Button
                            className='text-sm font-semibold px-4 py-2 md:py-2.5'
                            disabled={isExecuting}
                            onClick={() => setActive('add')}
                        >
                            <motion.p layoutId={'add-button' + id}>Add Assignment</motion.p>
                        </Button>
                    </motion.div>
                </div>
            </div>
            {/* Add Assignment Modal */}
            <AnimatePresence>
                {active === 'add' && (
                    <MotionFramer id={'add' + id}>
                        <div className='flex items-center gap-4 justify-between'>
                            <div className='flex items-center gap-4'>
                                <Notebook size={32}/>
                                <motion.p
                                    layoutId={'add-button' + id}
                                    className='font-medium text-lg'
                                >
                                    Add Assignment
                                </motion.p>
                            </div>
                            <button
                                className='text-sm font-semibold px-4 py-2.5'
                                onClick={() => setActive(null)}
                            >
                                <CloseIcon/>
                            </button>
                        </div>
                        <Separator className='my-2'/>
                        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                            <div className='flex flex-col gap-2'>
                                <label htmlFor='name' className='text-sm font-semibold'>
                                    Name*
                                </label>
                                <Input
                                    type='text'
                                    id='name'
                                    className={`Input ${errors.title ? 'border-red-500' : ''}`}
                                    {...register('title', {required: 'Title is required'})}
                                />
                                {errors.title && (
                                    <span className="text-red-500 text-sm">{errors.title.message}</span>
                                )}
                            </div>
                            <div className='flex flex-col gap-2'>
                                <label htmlFor='class' className='text-sm font-semibold'>
                                    Course*
                                </label>
                                <Input
                                    type='text'
                                    id='class'
                                    className={`Input ${errors.course ? 'border-red-500' : ''}`}
                                    {...register('course', {required: 'Course is required'})}
                                />
                                {errors.course && (
                                    <span className="text-red-500 text-sm">{errors.course.message}</span>
                                )}
                            </div>
                            <div className='flex flex-col gap-2'>
                                <label htmlFor='deadline' className='text-sm font-semibold'>
                                    Deadline*
                                </label>
                                <Input
                                    type='datetime-local'
                                    id='deadline'
                                    className='Input'
                                    {...register('deadline', {required: 'Deadline is required', valueAsDate: true})}
                                />
                                {errors.deadline && (
                                    <span className="text-red-500 text-sm">{errors.deadline.message}</span>
                                )}
                            </div>
                            <div className='flex flex-col gap-2'>
                                <label htmlFor='submission' className='text-sm font-semibold'>
                                    Submission*
                                </label>
                                <Select
                                    onValueChange={(v) => setValue('submission', v)}
                                    {...register('submission', {required: 'Submission is required'})}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder='Select Submission'/>
                                    </SelectTrigger>
                                    <SelectContent className='pointer-events-auto'>
                                        <SelectGroup>
                                            <SelectLabel>Submission</SelectLabel>
                                            <SelectItem value='ms-teams'>MS Teams</SelectItem>
                                            <SelectItem value='edunex'>Edunex</SelectItem>
                                            <SelectItem value='on-site'>On Site</SelectItem>
                                            <SelectItem value='g-drive'>G-Drive</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className='flex flex-col gap-2'>
                                <label htmlFor='submission' className='text-sm font-semibold'>
                                    Task Type*
                                </label>
                                <Select
                                    defaultValue={'PERSONAL_TASK'}
                                    {...register('taskType', {required: 'Task type is required'})}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder='Select Type'/>
                                    </SelectTrigger>
                                    <SelectContent className='pointer-events-auto'>
                                        <SelectGroup>
                                            <SelectLabel>Assignment Type</SelectLabel>
                                            <SelectItem value='PERSONAL_TASK'>Personal</SelectItem>
                                            <SelectItem value='GROUP_TASK'>Group</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className='flex flex-col gap-2'>
                                <label htmlFor='description' className='text-sm font-semibold'>
                                    Description*
                                </label>
                                <Textarea
                                    id='description'
                                    className='Input'
                                    {...register('description')}
                                />
                                {errors.description && (
                                    <span className="text-red-500 text-sm">{errors.description.message}</span>
                                )}
                            </div>
                            <Button
                                className='text-sm font-semibold px-4 py-2.5'
                                type='submit'
                                disabled={!isValid || isSubmitting}
                                onClick={() => trigger()}
                            >
                                Add
                            </Button>
                        </form>
                    </MotionFramer>
                )}
            </AnimatePresence>
            <MotionOverlay
                setActive={setActive}
                setTo={null}
                show={!!(active && (typeof active === 'object' || active === 'add'))}
            />

            {/* Assignment Modal */}
            <AnimatePresence>
                {active && typeof active === 'object' && (
                    <MotionFramer
                        id={`card-${active.name + active.course}-${id}`}
                    >
                        <div className='flex flex-col gap-3'>
                            <div className='flex items-center justify-between'>
                                <div className='flex items-center gap-4 text-navy'>
                                    <motion.div
                                        layoutId={`notebook-${active.name + active.course}-${id}`}
                                    >
                                        <Notebook size={32}/>
                                    </motion.div>
                                    <motion.h2
                                        layoutId={`name-${active.name + active.course}-${id}`}
                                        className='font-medium text-lg'
                                    >
                                        {active.name}
                                    </motion.h2>
                                </div>
                                <div>
                                    {`${timeToDeadline.days}d ${timeToDeadline.hours}h ${timeToDeadline.minutes}m ${timeToDeadline.seconds}s`}
                                </div>
                            </div>
                            <Separator className=''/>
                            <table className='space-y-4 *:*:py-2'>
                                <tr className='gap-2'>
                                    <td className='text-sm text-muted-foreground'>Course</td>
                                    <td className='text-sm'>:</td>
                                    <motion.p
                                        layoutId={`course-${active.name + active.course
                                        }-${id}`}
                                        className='text-sm'
                                    >
                                        {active.course}
                                    </motion.p>
                                </tr>
                                <tr className=''>
                                    <td className='text-sm text-muted-foreground'>Deadline</td>
                                    <td className='text-sm'>:</td>
                                    <motion.p
                                        layoutId={`deadline-${active.name + active.course
                                        }-${id}`}
                                        className='text-sm'
                                    >
                                        {active.deadline.toDateString()}
                                    </motion.p>
                                </tr>
                                <tr className=''>
                                    <td className='text-sm text-muted-foreground pr-4'>
                                        Submission
                                    </td>
                                    <td className='text-sm pr-2'>:</td>
                                    <motion.p
                                        layoutId={`submission-${active.name + active.course
                                        }-${id}`}
                                        className='text-sm'
                                    >
                                        MS-Teams
                                    </motion.p>
                                </tr>
                                <tr className=''>
                                    <td className='text-sm text-muted-foreground'>Type</td>
                                    <td className='text-sm'>:</td>
                                    <motion.p
                                        layoutId={`class-${active.name + active.course
                                        }-${id}`}
                                        className='text-sm'
                                    >
                                        Personal Task
                                    </motion.p>
                                </tr>
                                <tr className=''>
                                    <td className='text-sm text-muted-foreground'>Tracker</td>
                                    <td className='text-sm'>:</td>
                                    <td className='flex gap-6'>
                                        {getStatus(active.status!, active.deadline) === 'OVER_DUE_DATE' ? (
                                            <Badge variant="warning">Overdue</Badge>
                                        ) : (
                                            <Select defaultValue={active.status}
                                                    onValueChange={(v: "NOT_STARTED" | "IN_PROGRESS" | "DONE") => updateComp(active, v)}>
                                                <SelectTrigger className='py-0 w-fit h-min'>
                                                    <SelectValue placeholder='Select Tracker'/>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="DONE">Done</SelectItem>
                                                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                                    <SelectItem value="NOT_STARTED">Not Started</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    </td>
                                </tr>
                                <tr className=''>
                                    <td className='text-sm text-muted-foreground'>Description</td>
                                    <td className='text-sm'>:</td>
                                    <td className='text-sm text-justify'>{active.description}
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </MotionFramer>
                )}
            </AnimatePresence>
            {assignments.length === 0 && (
                <p className='font-medium text-muted-foreground w-full text-center'>No Assignments</p>
            )}

            {/* Assignment List */}
            {assignments.length > 0 && (
                <>
                    <ul className='w-full py-2 overflow-hidden rounded-2xl shadow-md bg-white'>
                        <Separator/>
                        {paginatedData.map((card, i) => (
                            <>
                                <motion.li
                                    layoutId={`card-${card.name + card.course}-${id}`}
                                    key={`${card.name}-${id + i}`}
                                    onClick={() => setActive(card)}
                                    className='py-3 px-6 md:px-8 flex w-full relative cursor-pointer justify-between items-center gap-4 hover:bg-gray-500/20 transition-[background-color] rounded-lg'
                                >
                                    <div
                                        className={`absolute w-2 h-full left-0 top-0 ${['bg-destructive', 'bg-hijau', 'bg-kuning', 'bg-navy'][i % 4]}`}
                                    ></div>
                                    <div className='flex gap-4 md:gap-6 items-center w-full'>
                                        <motion.div
                                            layoutId={`notebook-${card.name + card.course}-${id}`}
                                            className='text-navy'
                                        >
                                            <LayoutList className='w-7 h-7 md:w-10 md:h-10'/>
                                        </motion.div>
                                        <div className="flex flex-col md:flex-row items-center flex-1">
                                            <div className='md:w-1/2 overflow-hidden'>
                                                <motion.h2
                                                    layoutId={`name-${card.name + card.course}-${id}`}
                                                    title={card.name}
                                                    className='font-medium md:text-lg text-sm line-clamp-1'
                                                >
                                                    {card.name}
                                                </motion.h2>
                                                <p className='flex gap-2 items-center'>
                          <span className='text-xs md:text-sm text-muted-foreground'>
                            {`test`}
                          </span>
                                                    -
                                                    <span
                                                        className='text-xs md:text-sm text-muted-foreground line-clamp-1'>
                            {card.course}
                          </span>
                                                </p>
                                                <div
                                                    className='text-xs md:text-sm flex items-center gap-2 text-red-500'>
                                                    <p>{card.deadline.toDateString()}</p>
                                                    <div className="w-px h-4 bg-red-500"></div>
                                                    <p className='line-clamp-1'>
                                                        {`${card.deadline.getHours()}:${card.deadline.getMinutes()} @MS-Teams`}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex w-full md:w-1/2 gap-2 items-center mt-2 md:mt-0">
                                                <div className="md:w-1/2">
                                                    <Badge variant={badges(getStatus(card.status!, card.deadline))}
                                                           className='h-fit'>
                                                        {UUC2N(getStatus(card.status!, card.deadline))}
                                                    </Badge>
                                                </div>
                                                <div className="md:hidden w-px h-4 bg-border"></div>
                                                <div
                                                    className='text-muted-foreground capitalize md:w-1/2 text-sm md:text-base'>
                                                    {card.taskType}
                                                </div>
                                            </div>
                                        </div>
                                        <ChevronRight className='w-4 h-4 md:w-6 md:h-6'/>
                                    </div>
                                </motion.li>
                                <Separator/>
                            </>
                        ))}
                    </ul>
                    <div className="mt-4 flex flex-col md:flex-row items-center justify-between gap-4">
                        <Pagination
                            page={page}
                            setPage={setPage}
                            totalPage={totalPage}
                        />
                        <p className="text-sm text-muted-foreground">
                            Showing {startItem} to {endItem} of {sortedData.length} items
                        </p>
                    </div>
                </>
            )}
        </>
    );
};

export const CloseIcon = () => {
    return (
        <motion.svg
            initial={{
                opacity: 0,
            }}
            animate={{
                opacity: 1,
            }}
            exit={{
                opacity: 0,
                transition: {
                    duration: 0.05,
                },
            }}
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='h-4 w-4 text-black'
        >
            <path
                stroke='none'
                d='M0 0h24v24H0z'
                fill='none'
            />
            <path d='M18 6l-12 12'/>
            <path d='M6 6l12 12'/>
        </motion.svg>
    );
};

export default Assignment;