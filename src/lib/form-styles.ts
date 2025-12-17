export const inputBaseClasses =
  'h-12 rounded-xl border-0 text-base shadow-none focus-visible:ring-0 focus-visible:ring-offset-0';

export const textareaBaseClasses =
  'min-h-[300px] resize-none rounded-xl border-0 text-base leading-relaxed shadow-none focus-visible:ring-0 focus-visible:ring-offset-0';

export const labelClasses = 'text-foreground text-sm font-semibold';

export const errorMessageClasses = 'text-destructive text-sm font-medium';

export const helperTextClasses = 'text-muted-foreground text-xs';

export function getInputClasses(hasError: boolean): string {
  return `${inputBaseClasses} ${
    hasError ? 'bg-destructive/10 text-foreground' : 'bg-accent text-foreground'
  }`;
}

export function getTextareaClasses(hasError: boolean): string {
  return `${textareaBaseClasses} ${
    hasError ? 'bg-destructive/10 text-foreground' : 'bg-accent text-foreground'
  }`;
}
