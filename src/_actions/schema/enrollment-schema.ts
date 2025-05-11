import {z} from "zod";

export const getUserEnrollmentsSchema = z.object({
    courseId: z.number(),
});

