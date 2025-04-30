import {z} from "zod";

export const addAttachmentSchema = z.object({
    courseId: z.number(),
    lessonId: z.number(),
    name: z.string(),
    description: z.string().optional(),
    file: z.string(),
})