import { z } from 'zod';

// Zod Schema for validation

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

//for slots_booked validation
const slotsBookedSchema = z.record(z.string(), z.array(z.string()));

//for signup
export const doctor_signup_schema = z.object({
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

    image: imageSchema.optional(),

    speciality: z
        .string({ required_error: "speciality is required!" })
        .min(3, { message: "speciality must be of 3 characters!" })
        .max(1024, { message: "speciality must not be 1024 characters!" }),

    degree: z
        .string({ required_error: "Degree is required!" })
        .min(3, { message: "speciality must be of 3 characters!" })
        .max(1024, { message: "speciality must not be 1024 characters!" }),

    experience: z
        .string({ required_error: "experience is required!" })
        .min(1, { message: "experience must be of 1 characters!" })
        .max(1024, { message: "experience must not be 1024 characters!" }),

    about: z
        .string({ required_error: "about is required!" })
        .min(3, { message: "about must be of 3 characters!" })
        .max(1024, { message: "about must not be 1024 characters!" }),

    available: z.boolean(),

    fees: z
        .number({ required_error: "fees is required!" })
        .min(0, { message: "fees must be of 0 characters!" })
        .max(1024, { message: "fees must not be 1024 characters!" }),

    rating: z
        .number({ required_error: "rating is required!" })
        .min(0, { message: "rating must be of 0 characters!" })
        .max(1024, { message: "rating must not be 1024 characters!" }),

    address: addressSchema.required({
        required_error: "Address is required",
    }),

    slots_booked: slotsBookedSchema.default({}),

})