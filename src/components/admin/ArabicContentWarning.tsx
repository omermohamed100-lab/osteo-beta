type ArabicContentWarningProps = {
  missingFields: string[];
  compact?: boolean;
};

export default function ArabicContentWarning({
  missingFields,
  compact = false,
}: ArabicContentWarningProps) {
  if (missingFields.length === 0) return null;

  if (compact) {
    return (
      <span className="mt-1 inline-flex rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-800">
        Arabic incomplete ({missingFields.length})
      </span>
    );
  }

  return (
    <div role="status" className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950">
      <p className="font-semibold">Arabic public content is incomplete.</p>
      <p className="mt-1 leading-5">
        Missing: {missingFields.join(', ')}. Saving remains available, but Arabic visitors will see an explicit availability notice instead of silent English fallback.
      </p>
    </div>
  );
}
