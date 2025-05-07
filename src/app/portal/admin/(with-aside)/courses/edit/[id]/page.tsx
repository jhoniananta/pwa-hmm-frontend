import {z} from 'zod';
import EditCourseForm from './edit-course-form';
import {getCategories} from '@/_actions/category-action';
import {updateCourseSchema} from '@/lib/schema';
import {getCourseById} from '@/_actions/courses-action';

export default async function Page({params}: { params: { id: string } }) {
    const idNum = Number(params.id);
    const course = await getCourseById(idNum);
    const categoriesAll = await getCategories();

    const defaultValues: z.infer<typeof updateCourseSchema> = {
        courseId: course.courseId,
        code: course.code,
        title: course.title,
        description: course.description,
        image: course.image,
        categories: course.categories.map((c) => c.categoryId),
    }

    return (
        <>
            <EditCourseForm
                categories={categoriesAll}
                defaultValues={defaultValues}
            />
        </>
    );
}