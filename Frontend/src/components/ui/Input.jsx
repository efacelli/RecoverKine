import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

export const Input = forwardRef(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      'flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm transition-smooth placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50',
      className
    )}
    {...props}
  />
));
Input.displayName = 'Input';

export const Textarea = forwardRef(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      'flex min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm transition-smooth placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50',
      className
    )}
    {...props}
  />
));
Textarea.displayName = 'Textarea';

export const Label = forwardRef(({ className, ...props }, ref) => (
  <label ref={ref} className={cn('text-sm font-medium leading-none', className)} {...props} />
));
Label.displayName = 'Label';
