// Small shared helpers.

export function maskAadhaar(aadhaar: string): string {
  if (aadhaar.length < 4) return "XXXX XXXX XXXX";
  return `XXXX XXXX ${aadhaar.slice(-4)}`;
}

export function formatPhone(phone: string): string {
  return phone.replace(/(\d{5})(\d{5})/, "$1 $2");
}

export function timeAgo(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);
  if (seconds < 60) return "abhi-abhi";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min pehle`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ghante pehle`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} din pehle`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} mahine pehle`;
  return `${Math.floor(months / 12)} saal pehle`;
}

export function formatINR(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

/** Great-circle distance in km between two lat/lng points. */
export function distanceKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const R = 6371;
  const dLat = deg2rad(b.lat - a.lat);
  const dLng = deg2rad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(deg2rad(a.lat)) * Math.cos(deg2rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function deg2rad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function generateRegistrationId(): string {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let i = 0; i < 5; i++) {
    suffix += chars[Math.floor(Math.random() * chars.length)];
  }
  return `LC-${suffix}`;
}
