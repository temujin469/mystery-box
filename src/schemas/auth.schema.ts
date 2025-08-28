import { z } from "zod";

// Login schema
export const loginSchema = z.object({
  email: z.string().email("Имэйл буруу байна"),
  password: z.string().min(8, "Нууц үг дор хаяж 8 тэмдэгт байх ёстой"),
});

// Signup schema
export const signupSchema = z
  .object({
    email: z.string().email("Имэйл буруу байна"),
    username: z
      .string()
      .min(3, "Хэрэглэгчийн нэр дор хаяж 3 тэмдэгт байх ёстой")
      .max(50, "Хэрэглэгчийн нэр 50 тэмдэгтээс хэтрэхгүй байх ёстой"),
    password: z.string().min(8, "Нууц үг дор хаяж 8 тэмдэгт байх ёстой"),
    confirm: z.string(),
    agree: z.boolean().refine((val) => val === true, {
      message: "Үйлчилгээний нөхцөл зөвшөөрсөн байх ёстой",
    }),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Нууц үг таарахгүй байна",
    path: ["confirm"],
  });

// Password update schema
export const updatePasswordSchema = z
  .object({
    oldPassword: z.string().min(8, "Одоогийн нууц үг оруулна уу"),
    newPassword: z.string().min(8, "Шинэ нууц үг дор хаяж 8 тэмдэгт байх ёстой"),
    confirmPassword: z.string().min(1, "Нууц үг давтаж оруулна уу"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Шинэ нууц үг тохирохгүй байна",
    path: ["confirmPassword"],
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    message: "Шинэ нууц үг одоогийн нууц үгтэй адил байж болохгүй",
    path: ["newPassword"],
  });

// Type exports for form data
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type UpdatePasswordFormData = z.infer<typeof updatePasswordSchema>;
