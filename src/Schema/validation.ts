import {z} from 'zod';

const passwordSchema = (password : string) => {
    const result = z.string().min(8).max(20).regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[@$!%*?&]/, 'Password must contain at least one special character')
        .safeParse(password);

    if (result.success) {
        return true;
    } else {
        return result.error.errors[0].message;
    }
}

const emailSchema = (email : string) => {
    const result = z.string().email().safeParse(email);

    if (result.success) {
        return true;
    } else {
        return result.error.errors[0].message;
    }
}

export {
    passwordSchema,
    emailSchema
}