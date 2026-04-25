interface ProseProps {
  children: React.ReactNode;
}

export function Prose({ children }: ProseProps) {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none space-y-4">
      {children}
    </div>
  );
}
