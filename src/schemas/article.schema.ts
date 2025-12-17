import { z } from 'zod';

export const articleSchema = z.object({
  title: z
    .string()
    .min(3, 'O título deve ter no mínimo 3 caracteres')
    .max(100, 'O título deve ter no máximo 100 caracteres'),
  categoryId: z
    .number()
    .int('Categoria inválida')
    .positive('Selecione uma categoria'),
  banner: z
    .union([
      z.string().url('Insira uma URL válida para o banner'),
      z.literal(''),
    ])
    .optional(),
  content: z
    .string()
    .min(50, 'O conteúdo deve ter no mínimo 50 caracteres')
    .max(5000, 'O conteúdo deve ter no máximo 5000 caracteres'),
});

export type ArticleFormData = z.infer<typeof articleSchema>;
