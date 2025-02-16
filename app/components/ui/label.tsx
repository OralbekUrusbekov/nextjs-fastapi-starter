import { cn } from '@/src/app/lib/utils';

export function Label({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn('block text-sm font-medium text-gray-700', className)}
      {...props}
    />
  );
}
