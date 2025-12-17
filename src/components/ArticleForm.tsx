import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CategoryBadges } from '@/components/CategoryBadges';
import { articleSchema, type ArticleFormData } from '@/schemas/article.schema';
import {
  getInputClasses,
  getTextareaClasses,
  labelClasses,
  errorMessageClasses,
  helperTextClasses,
} from '@/lib/form-styles';
import type { Category } from '@/types/api';

interface ArticleFormProps {
  categories: Category[];
  defaultValues?: Partial<ArticleFormData>;
  onSubmit: (data: ArticleFormData) => void;
  onCancel: () => void;
  submitButtonText?: string;
  isSubmitting?: boolean;
}

export function ArticleForm({
  categories,
  defaultValues,
  onSubmit,
  onCancel,
  submitButtonText = 'Publicar Artigo',
  isSubmitting = false,
}: ArticleFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: '',
      content: '',
      categoryId: defaultValues?.categoryId,
      banner: '',
      ...defaultValues,
    },
  });

  const watchBanner = watch('banner');
  const watchContent = watch('content');
  const watchCategoryId = watch('categoryId');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Title Field */}
      <div className="space-y-2">
        <Label htmlFor="title" className={labelClasses}>
          Título do Artigo
        </Label>
        <Input
          id="title"
          placeholder="Digite o título do artigo"
          {...register('title')}
          aria-invalid={errors.title ? 'true' : 'false'}
          className={getInputClasses(!!errors.title)}
          disabled={isSubmitting}
        />
        {errors.title && (
          <p className={errorMessageClasses}>{errors.title.message}</p>
        )}
      </div>

      {/* Category Select */}
      <div className="space-y-2">
        <Label className={labelClasses}>Categoria</Label>
        <input
          type="hidden"
          {...register('categoryId', { valueAsNumber: true })}
        />
        <CategoryBadges
          categories={categories}
          selectedCategoryId={watchCategoryId ?? null}
          onCategoryChange={(categoryId) =>
            setValue('categoryId', categoryId ?? undefined, {
              shouldValidate: true,
            })
          }
          allowDeselect={false}
        />
        {errors.categoryId && (
          <p className={errorMessageClasses}>{errors.categoryId.message}</p>
        )}
        {!watchCategoryId && !errors.categoryId && (
          <p className={helperTextClasses}>
            Selecione uma categoria para o artigo
          </p>
        )}
      </div>

      {/* Banner URL Field */}
      <div className="space-y-2">
        <Label htmlFor="banner" className={labelClasses}>
          URL do Banner
        </Label>
        <Input
          id="banner"
          placeholder="https://exemplo.com/imagem.jpg"
          {...register('banner')}
          aria-invalid={errors.banner ? 'true' : 'false'}
          className={getInputClasses(!!errors.banner)}
          disabled={isSubmitting}
        />
        {errors.banner && (
          <p className={errorMessageClasses}>{errors.banner.message}</p>
        )}
      </div>

      {/* Banner Preview */}
      {watchBanner && (
        <div className="space-y-2">
          <Label className={labelClasses}>Preview do Banner</Label>
          <div className="overflow-hidden rounded-2xl">
            <img
              src={watchBanner}
              alt="Preview"
              className="h-64 w-full object-cover"
              onError={(e) => {
                e.currentTarget.src =
                  'https://via.placeholder.com/800x400?text=Imagem+Inválida';
              }}
            />
          </div>
        </div>
      )}

      {/* Content Field */}
      <div className="space-y-2">
        <Label htmlFor="content" className={labelClasses}>
          Conteúdo
        </Label>
        <Textarea
          id="content"
          placeholder="Escreva o conteúdo do artigo..."
          {...register('content')}
          aria-invalid={errors.content ? 'true' : 'false'}
          className={getTextareaClasses(!!errors.content)}
          disabled={isSubmitting}
        />
        {errors.content && (
          <p className={errorMessageClasses}>{errors.content.message}</p>
        )}
        <p className={helperTextClasses}>
          {watchContent?.length || 0} caracteres
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 pt-4 md:flex-row md:justify-end">
        <Button
          type="button"
          variant="ghost"
          className="bg-accent text-foreground h-12 rounded-xl px-6 text-base font-semibold hover:bg-transparent"
          onClick={onCancel}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className="bg-primary text-primary-foreground h-12 rounded-xl px-6 text-base font-semibold hover:opacity-90"
          disabled={isSubmitting}
        >
          {submitButtonText}
        </Button>
      </div>
    </form>
  );
}
