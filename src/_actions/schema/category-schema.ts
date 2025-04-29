import {z} from "zod";

export const addCategorySchema = z.object({
    title: z.string().min(3, {message: 'Title must be at least 3 characters long'}).max(32, {message: 'Title must be at most 32 characters long'}),
})

export const updateCategorySchema = z.object({
    categoryId: z.number().min(1, {message: 'Category ID is required'}),
    title: z
        .string()
        .min(3, {message: 'Title must be at least 3 characters'})
        .max(32, {message: 'Title must be at most 32 characters'})
});

export const deleteCategorySchema = z.object({
    categoryId: z.number().min(1, {message: 'Category ID is required'}),
});

