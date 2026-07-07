import { cn } from '../../utils/cn';

export function Badge({ className, ...props }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-smooth',
        className
      )}
      {...props}
    />
  );
}
