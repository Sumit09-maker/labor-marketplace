// Shared domain constants for the platform.

export const SKILLS = [
  { value: "mason", label: "Mason / Rajmistri", icon: "BrickWall" },
  { value: "carpenter", label: "Carpenter", icon: "Hammer" },
  { value: "electrician", label: "Electrician", icon: "Zap" },
  { value: "plumber", label: "Plumber", icon: "Wrench" },
  { value: "painter", label: "Painter", icon: "Paintbrush" },
  { value: "welder", label: "Welder", icon: "Flame" },
  { value: "helper", label: "Helper / Labour", icon: "Hand" },
  { value: "ac_mechanic", label: "AC Mechanic", icon: "AirVent" },
  { value: "tile_fitter", label: "Tile Fitter", icon: "LayoutGrid" },
] as const;

export type SkillValue = (typeof SKILLS)[number]["value"];

export function skillLabel(value: string): string {
  return SKILLS.find((s) => s.value === value)?.label ?? value;
}

export const EXPERIENCE_OPTIONS = [
  "0-1 years",
  "1-3 years",
  "3-5 years",
  "5-10 years",
  "10+ years",
] as const;

// Well-known areas with lat/lng so registered workers land on the map.
export const AREA_COORDS: Record<string, { lat: number; lng: number; city: string }> = {
  "Lajpat Nagar": { lat: 28.5677, lng: 77.2434, city: "Delhi" },
  Saket: { lat: 28.5245, lng: 77.2066, city: "Delhi" },
  "Hauz Khas": { lat: 28.5494, lng: 77.2001, city: "Delhi" },
  Govindpuri: { lat: 28.5444, lng: 77.264, city: "Delhi" },
  "Green Park": { lat: 28.5584, lng: 77.2028, city: "Delhi" },
  "Malviya Nagar": { lat: 28.5362, lng: 77.2101, city: "Delhi" },
  "Nehru Place": { lat: 28.5488, lng: 77.2513, city: "Delhi" },
  Okhla: { lat: 28.5355, lng: 77.2733, city: "Delhi" },
  "Jamia Nagar": { lat: 28.5617, lng: 77.2862, city: "Delhi" },
  "Kirti Nagar": { lat: 28.6554, lng: 77.1428, city: "Delhi" },
  Dwarka: { lat: 28.5921, lng: 77.046, city: "Delhi" },
  "Vasant Kunj": { lat: 28.52, lng: 77.15, city: "Delhi" },
  "Karol Bagh": { lat: 28.6519, lng: 77.1907, city: "Delhi" },
  Rohini: { lat: 28.7041, lng: 77.1125, city: "Delhi" },
  "Noida Sector 18": { lat: 28.5708, lng: 77.326, city: "Noida" },
  "Andheri West": { lat: 19.1364, lng: 72.8296, city: "Mumbai" },
  "Thane West": { lat: 19.2183, lng: 72.9781, city: "Mumbai" },
  "Electronic City": { lat: 12.8452, lng: 77.6602, city: "Bangalore" },
  Whitefield: { lat: 12.9698, lng: 77.75, city: "Bangalore" },
};

export const DELHI_CENTER = { lat: 28.58, lng: 77.21 };

export const AVATAR_GRADIENTS = [
  "from-orange-500 to-amber-500",
  "from-blue-500 to-indigo-500",
  "from-green-500 to-emerald-500",
  "from-purple-500 to-fuchsia-500",
  "from-rose-500 to-pink-500",
  "from-cyan-500 to-sky-500",
] as const;

export function avatarGradient(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return AVATAR_GRADIENTS[hash % AVATAR_GRADIENTS.length];
}

export function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}
