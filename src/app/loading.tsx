import { Logo } from "@/components/ui/logo";

export default function GlobalLoading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <Logo size="lg" />
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
          <div className="flex gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-(--color-primary) animate-bounce [animation-delay:0ms]" />
            <span className="h-1.5 w-1.5 rounded-full bg-(--color-primary) animate-bounce [animation-delay:150ms]" />
            <span className="h-1.5 w-1.5 rounded-full bg-(--color-primary) animate-bounce [animation-delay:300ms]" />
          </div>
        </div>
      </div>
    </div>
  );
}