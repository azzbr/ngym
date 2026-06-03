/**
 * Format a Bahrain phone number for display.
 * "+97338833663" -> "+973 3883 3663"
 * Falls back to the original string if it doesn't match the expected shape.
 */
export function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  // Bahrain: country code 973 + 8 national digits
  if (digits.startsWith("973") && digits.length === 11) {
    const national = digits.slice(3);
    return `+973 ${national.slice(0, 4)} ${national.slice(4)}`;
  }
  return raw;
}
