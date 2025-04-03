'use client';

import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {addAssignmentSchema} from '@/lib/schema';
import {$CourseAPI, $CourseClassAPI} from 'lms-types';
import {SubmitHandler, useForm} from 'react-hook-form';
import {z} from 'zod';
import {useAction} from 'next-safe-action/hooks';
import {createAssignment} from '@/_actions/assignment-action';
import {toast} from 'sonner';
import ErrorText from '@/app/portal/admin/error-text';
import {Button} from '@/components/ui/button';
import {zodResolver} from '@hookform/resolvers/zod';
import {Textarea} from '@/components/ui/textarea';

function AddForm({
                     courses,
                     classes,
                 }: {
    courses: $CourseAPI.GetCourses.Response['data'];
    classes: ($CourseClassAPI.GetClasses.Response['data'][number] & {
        courseId: number;
    })[];
}) {
    const {execute, isExecuting} = useAction(createAssignment, {
        onSuccess: () => {
            toast.success('Assignment created successfully');
        },
        onError: (err) => {
            toast.error(
                err.error.validationErrors?.toString() ||
                err.error.serverError ||
                'Failed to create assignment'
            );
        },
    });
    const {
        register,
        handleSubmit,
        formState: {errors},
        setValue,
        watch,
    } = useForm<z.infer<typeof addAssignmentSchema>>({
        defaultValues: {
            title: '',
            deadline: new Date().toISOString(),
            submission: undefined,
            description: '',
            classId: undefined,
            courseId: undefined,
        },
        mode: 'onChange',
        resolver: zodResolver(addAssignmentSchema),
    });

    const onSubmit: SubmitHandler<z.infer<typeof addAssignmentSchema>> = (
        data,
        e
    ) => {
        e?.preventDefault();
        const formData = {
            ...data,
            deadline: new Date(data.deadline).toISOString()
        };
        execute(formData);
    };

    return (
        <form onSubmit={(e) => handleSubmit(onSubmit)(e)} className='flex flex-col gap-4'>
            <div>
                <Label>Title</Label>
                <Input {...register('title')} placeholder="Enter assignment title"/>
                {errors.title && <ErrorText>{errors.title.message}</ErrorText>}
            </div>

            <div>
                <Label>Submissions</Label>
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
                {errors.submission && <ErrorText>{errors.submission.message}</ErrorText>}
            </div>

            <div>
                <Label>Deadline</Label>
                <Input
                    type='datetime-local'
                    step="0.001"
                    {...register('deadline', {
                        validate: (val) => new Date(val) > new Date() || 'Deadline must be in the future',
                    })}
                />
                {errors.deadline && <ErrorText>{errors.deadline.message}</ErrorText>}
            </div>

            <div>
                <Label>Course</Label>
                <Select onValueChange={(e) => setValue('courseId', Number(e))}>
                    <SelectTrigger className='border border-navy bg-transparent'>
                        <SelectValue placeholder='Select course'></SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        {courses.map((course) => (
                            <SelectItem
                                value={String(course.courseId)}
                                key={course.courseId}
                                className='capitalize'
                            >
                                {course.title}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.courseId && <ErrorText>{errors.courseId.message}</ErrorText>}
            </div>

            {watch('courseId') && (
                <div>
                    <Label>Class</Label>
                    <Select onValueChange={(e) => setValue('classId', Number(e))}>
                        <SelectTrigger className='border border-navy bg-transparent'>
                            <SelectValue placeholder='Select class'></SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            {classes
                                .filter((c) => c.courseId === watch('courseId'))
                                .map((c) => (
                                    <SelectItem
                                        value={String(c.classId)}
                                        key={c.classId}
                                        className='capitalize'
                                    >
                                        {c.title}
                                    </SelectItem>
                                ))}
                        </SelectContent>
                    </Select>
                    {errors.classId && <ErrorText>{errors.classId.message}</ErrorText>}
                </div>
            )}
            <div className='flex flex-col gap-2'>
                <label htmlFor='description' className='text-sm font-semibold'>
                    Description
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
                type='submit'
                onClick={(e) => handleSubmit(onSubmit)(e)}
                className="bg-navy w-min"
                disabled={isExecuting}
            >
                {isExecuting ? 'Creating...' : 'Create Assignment'}
            </Button>
        </form>
    );
}

export default AddForm;
