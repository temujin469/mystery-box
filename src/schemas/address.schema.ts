import { z } from 'zod';

export const createAddressSchema = z.object({
  recipient_name: z
    .string()
    .min(1, 'Хүлээн авагчийн нэр оруулна уу')
    .max(100, 'Нэр 100 тэмдэгтээс хэтрэхгүй байх ёстой'),
  
  full_address: z
    .string()
    .min(1, 'Хаяг оруулна уу')
    .max(500, 'Хаяг 500 тэмдэгтээс хэтрэхгүй байх ёстой'),
  
  city: z
    .string()
    .min(1, 'Хот/Сум оруулна уу')
    .max(100, 'Хот/Сум 100 тэмдэгтээс хэтрэхгүй байх ёстой'),
  
  district: z
    .string()
    .min(1, 'Аймаг/Дүүрэг оруулна уу')
    .max(100, 'Аймаг/Дүүрэг 100 тэмдэгтээс хэтрэхгүй байх ёстой'),
  
  postal_code: z
    .string()
    .min(1, 'Шуудангийн код оруулна уу')
    .max(20, 'Шуудангийн код 20 тэмдэгтээс хэтрэхгүй байх ёстой')
    .regex(/^[0-9A-Za-z\s-]+$/, 'Шуудангийн код зөвхөн тоо, үсэг, зай, зураас агуулна'),
  
  phone: z
    .string()
    .min(1, 'Утасны дугаар оруулна уу')
    .max(20, 'Утасны дугаар 20 тэмдэгтээс хэтрэхгүй байх ёстой')
    .regex(/^[+]?[0-9\s()-]+$/, 'Утасны дугаар буруу форматтай байна'),
  
  title: z
    .string()
    .min(1, 'Хаягийн нэр оруулна уу')
    .max(100, 'Хаягийн нэр 100 тэмдэгтээс хэтрэхгүй байх ёстой')
    .optional(),
  
  is_default: z
    .boolean()
    .optional(),
  
  notes: z
    .string()
    .max(500, 'Тэмдэглэл 500 тэмдэгтээс хэтрэхгүй байх ёстой')
    .optional(),
});
export const updateAddressSchema = createAddressSchema.partial();

export type CreateAddressFormData = z.infer<typeof createAddressSchema>;
export type UpdateAddressFormData = z.infer<typeof updateAddressSchema>;
