import { cn } from '@/app/lib/utils';

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'block w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm focus:border-purple-500 focus:ring-purple-500',
        className
      )}
      {...props}
    />
  );
}
