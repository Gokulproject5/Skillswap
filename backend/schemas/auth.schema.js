import z, { email } from "zod";


export const registerSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.email("invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters")
});

export const loginSchema = z.object({
    email: z.email("invalid email address"),
    password: z.string().min(8, "password must be least 8 characters"),
})