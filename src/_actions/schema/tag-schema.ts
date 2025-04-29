import {z} from "zod";

export const addTagSchema = z.object({
    title: z.string().min(3, {message: 'Title must be at least 3 characters long'}).max(32, {message: 'Title must be at most 32 characters long'}),
})

export const deleteTagSchema = z.object({
    tagId: z.number().min(1, {message: 'Tag ID is required'}),
});