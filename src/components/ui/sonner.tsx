// import { useTheme } from '@/hooks/use-theme';
import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  // const { theme = 'system' } = useTheme();

  return (
    <Sonner
      // theme={theme as ToasterProps['theme']}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-white group-[.toaster]:text-[#141712] group-[.toaster]:border-gray-200 group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-[#758269]',
          actionButton: 'group-[.toast]:bg-[#67A22D] group-[.toast]:text-white',
          cancelButton:
            'group-[.toast]:bg-[#EDF2E8] group-[.toast]:text-[#141712]',
          success: 'group-[.toaster]:bg-white group-[.toaster]:text-[#67A22D]',
          error: 'group-[.toaster]:bg-white group-[.toaster]:text-red-500',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
