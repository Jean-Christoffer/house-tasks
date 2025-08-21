export default function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center rounded-xl border border-dashed bg-background py-10 text-sm text-muted-foreground">
      {label}
    </div>
  );
}
