import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Header } from '@/components/Header';
import { apiClient } from '@/api/client';
import { saveUserSession } from '@/lib/auth';
import type { User } from '@/types/api';

const registerSchema = z.object({
  name: z
    .string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email inválido')
    .max(100, 'Email deve ter no máximo 100 caracteres')
    .toLowerCase(),
  password: z
    .string()
    .min(8, 'Senha deve ter no mínimo 8 caracteres')
    .max(128, 'Senha deve ter no máximo 128 caracteres')
    .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
    .regex(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
    .regex(/[0-9]/, 'Senha deve conter pelo menos um número'),
  avatar: z
    .union([z.string().url('URL do avatar inválida'), z.literal('')])
    .optional(),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        avatar: data.avatar || undefined,
      };

      const createdUser = await apiClient.post<User>('/users', payload);

      saveUserSession({
        userId: createdUser.id,
        name: createdUser.name,
        email: createdUser.email,
      });

      toast.success('Conta criada com sucesso!', {
        description: 'Bem-vindo ao TechBlog',
        duration: 3000,
      });
      navigate('/articles');
    } catch (err) {
      console.error(err);
      toast.error('Não foi possível criar a conta.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-background min-h-screen">
      <Header />
      <main className="flex flex-col items-center justify-center px-4 py-5 md:px-40">
        <div className="flex h-full flex-col items-center justify-center py-5">
          <div className="flex w-full max-w-full flex-col items-center justify-center py-5 md:min-h-[713px] md:w-[610px]">
            {/* Title */}
            <div className="flex w-full flex-col items-center px-0 pt-5 pb-2 md:px-4">
              <h1 className="text-foreground text-center text-3xl leading-tight font-semibold">
                Criar conta
              </h1>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex w-full flex-col"
            >
              {/* Field Nome */}
              <div className="flex w-full flex-col px-0 py-3 md:px-4">
                <div className="flex w-full flex-col">
                  <label
                    htmlFor="name"
                    className="text-foreground pb-2 text-base leading-normal font-medium"
                  >
                    Nome
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Seu nome"
                    {...register('name')}
                    className={`text-muted-foreground aria-invalid:border-destructive h-auto rounded-xl border-0 px-4 py-4 text-base leading-normal font-normal shadow-none placeholder:text-base placeholder:font-normal focus-visible:ring-0 focus-visible:ring-offset-0 aria-invalid:border-2 ${
                      errors.name ? 'bg-destructive/10' : 'bg-accent'
                    }`}
                    aria-invalid={!!errors.name}
                  />
                  {errors.name && (
                    <p className="text-destructive mt-1 text-sm">
                      {errors.name.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Field Email */}
              <div className="flex w-full flex-col px-0 py-3 md:px-4">
                <div className="flex w-full flex-col">
                  <label
                    htmlFor="email"
                    className="text-foreground pb-2 text-base leading-normal font-medium"
                  >
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email"
                    {...register('email')}
                    className={`text-muted-foreground aria-invalid:border-destructive h-auto rounded-xl border-0 px-4 py-4 text-base leading-normal font-normal shadow-none placeholder:text-base placeholder:font-normal focus-visible:ring-0 focus-visible:ring-offset-0 aria-invalid:border-2 ${
                      errors.email ? 'bg-destructive/10' : 'bg-accent'
                    }`}
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && (
                    <p className="text-destructive mt-1 text-sm">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Field Avatar */}
              <div className="flex w-full flex-col px-0 py-3 md:px-4">
                <div className="flex w-full flex-col">
                  <label
                    htmlFor="avatar"
                    className="text-foreground pb-2 text-base leading-normal font-medium"
                  >
                    URL do Avatar (opcional)
                  </label>
                  <Input
                    id="avatar"
                    type="url"
                    placeholder="https://exemplo.com/avatar.jpg"
                    {...register('avatar')}
                    className={`text-muted-foreground aria-invalid:border-destructive h-auto rounded-xl border-0 px-4 py-4 text-base leading-normal font-normal shadow-none placeholder:text-base placeholder:font-normal focus-visible:ring-0 focus-visible:ring-offset-0 aria-invalid:border-2 ${
                      errors.avatar ? 'bg-destructive/10' : 'bg-accent'
                    }`}
                    aria-invalid={!!errors.avatar}
                  />
                  {errors.avatar && (
                    <p className="text-destructive mt-1 text-sm">
                      {errors.avatar.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Field Senha */}
              <div className="flex w-full flex-col px-0 py-3 md:px-4">
                <div className="flex w-full flex-col">
                  <label
                    htmlFor="password"
                    className="text-foreground pb-2 text-base leading-normal font-medium"
                  >
                    Senha
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Senha"
                      {...register('password')}
                      className={`text-muted-foreground aria-invalid:border-destructive h-auto rounded-xl border-0 px-4 py-4 pr-12 text-base leading-normal font-normal shadow-none placeholder:text-base placeholder:font-normal focus-visible:ring-0 focus-visible:ring-offset-0 aria-invalid:border-2 ${
                        errors.password ? 'bg-destructive/10' : 'bg-accent'
                      }`}
                      aria-invalid={!!errors.password}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-muted-foreground hover:text-foreground absolute top-1/2 right-4 -translate-y-1/2"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-destructive mt-1 text-sm">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Button Criar Conta */}
              <div className="flex w-full px-0 py-3 md:px-4">
                <Button
                  type="submit"
                  className="bg-primary text-primary-foreground h-10 w-full rounded-xl px-4 text-sm font-semibold hover:opacity-90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Criando...' : 'Criar conta'}
                </Button>
              </div>
            </form>

            <div className="text-muted-foreground mt-4 text-sm">
              Já tem conta?{' '}
              <Link to="/login" className="text-primary font-semibold">
                Faça login
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

