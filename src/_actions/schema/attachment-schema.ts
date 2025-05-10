import {z} from "zod";

export const addAttachmentSchema = z.object({
    courseId: z.number(),
    lessonId: z.number(),
    name: z.string().min(3, {message: 'Name must be at least 3 characters long!'}),
    description: z.string().optional(),
    file: z.string(),
    pdfFile: z.any()
})