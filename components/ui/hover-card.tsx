'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import * as HoverCardPrimitive from '@radix-ui/react-hover-card';

function HoverCard({ ...props }: React.ComponentProps<typeof HoverCardPrimitive.Root>) {
  return <HoverCardPrimitive.Root data-slot="hover-card" {...props} />;
}

function HoverCardTrigger({ ...props }: React.ComponentProps<typeof HoverCardPrimitive.Trigger>) {
  return <HoverCardPrimitive.Trigger data-slot="hover-card-trigger" {...props} />;
}

function HoverCardContent({
  className,
  align = 'center',
  sideOffset = 4,
  ...props
}: React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>) {
  return (
    <HoverCardPrimitive.Content
      data-slot="hover-card-content"
      align={align}
      sideOffset={sideOffset}
      className={cn(
        'z-50 w-64 rounded-md border border-border bg-popover p-4 text-popover-foreground shadow-md shadow-black/5 outline-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        className,
      )}
      {...props}
    />
  );
}

export { HoverCard, HoverCardContent, HoverCardTrigger };
