import { z } from 'zod';


// Zod Schema for validation


//for signup
export const user_register_schema = z.object({
    name: z
        .string({ required_error: "Name is required!" })
        .trim()
        .min(3, { message: "Name must be atleast 3 characters." }).
        max(255, { message: "Name must not be of 255 characters." }),

    email: z
        .string({ required_error: "Email is required!" })
        .trim()
        .email({ message: "Invalid Email Address" })
        .min(13, "Email must be atleast 13 characters")
        .max(255, { message: "Email must not be of atleast 255 created!" }),

    password: z
        .string({ required_error: "password is required!" })
        .min(6, { message: "Password must be of 6 characters!" })
        .max(1024, { message: "Password must not be 1024 characters!" }),

})

//for signup
export const user_login_schema = z.object({

    email: z
        .string({ required_error: "Email is required!" })
        .trim()
        .email({ message: "Invalid Email Address" })
        .min(13, "Email must be atleast 13 characters")
        .max(255, { message: "Email must not be of atleast 255 created!" }),

    password: z
        .string({ required_error: "password is required!" })
        .min(6, { message: "Password must be of 6 characters!" })
        .max(1024, { message: "Password must not be 1024 characters!" }),

})

//for image validation
const imageSchema = z
    .object({
        mimetype: z.string().refine((val) => val.startsWith('image/'), {
            message: 'Only image files are allowed',
        }),
        size: z.number().max(5 * 1024 * 1024, {
            message: 'Image size must be under 5MB',
        }),
        path: z.string({
            required_error: 'File path is required',
        }),
        filename: z.string(),
    });

//for address validation
const addressSchema = z.object({
    line1: z.string({
        required_error: "Address line1 is required",
    }),
    line2: z.string().optional(), // line2 is allowed but not required
});


//for signup
export const user_update_schema = z.object({
    name: z
        .string({ required_error: "Name is required!" })
        .trim()
        .min(3, { message: "Name must be atleast 3 characters." }).
        max(255, { message: "Name must not be of 255 characters." }),

    phone: z
        .string({ required_error: "phone is required!" })
        .trim()
        .min(3, { message: "phone must be atleast 3 characters." }).
        max(255, { message: "phone must not be of 255 characters." }),

    dob: z
        .string({ required_error: "phone is required!" })
        .trim()
        .min(3, { message: "phone must be atleast 3 characters." }).
        max(255, { message: "phone must not be of 255 characters." }),

    gender: z
        .string({ required_error: "phone is required!" })
        .trim()
        .min(3, { message: "phone must be atleast 3 characters." }).
        max(255, { message: "phone must not be of 255 characters." }),

    image: imageSchema.optional(),

    address: addressSchema.required({
        required_error: "Address is required",
    }),

})