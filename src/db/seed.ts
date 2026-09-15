import "dotenv/config";
import { db } from "@/db";
import { communityPosts, hireRequests, ratings, sessions, workers } from "@/db/schema";
import { hashPassword } from "@/lib/auth";
import { AREA_COORDS } from "@/lib/constants";
import { sql } from "drizzle-orm";

const areas = Object.keys(AREA_COORDS);

const seedWorkers = [
  { name: "Raju Sharma", skill: "mason", area: "Lajpat Nagar", rate: 950, exp: "10+ years", jobs: 47, rating: 4.8, count: 12, phone: "9811001234", lang: "Hindi, Bhojpuri", landmark: "Near Metro Gate 2" },
  { name: "Deepak Vishwakarma", skill: "carpenter", area: "Saket", rate: 1100, exp: "5-10 years", jobs: 38, rating: 4.7, count: 9, phone: "9811002345", lang: "Hindi, English", landmark: "PVR Anupam ke paas" },
  { name: "Anwar Khan", skill: "electrician", area: "Jamia Nagar", rate: 850, exp: "5-10 years", jobs: 52, rating: 4.9, count: 15, phone: "9811003456", lang: "Hindi, Urdu", landmark: "Batla House Chowk" },
  { name: "Ganesh Kumawat", skill: "painter", area: "Malviya Nagar", rate: 900, exp: "3-5 years", jobs: 29, rating: 4.5, count: 8, phone: "9811004567", lang: "Hindi, Rajasthani", landmark: "Main Market" },
  { name: "Santosh Lohar", skill: "welder", area: "Okhla", rate: 1050, exp: "10+ years", jobs: 61, rating: 4.6, count: 11, phone: "9811005678", lang: "Hindi", landmark: "Phase 2 Industrial Area" },
  { name: "Bablu Manjhi", skill: "helper", area: "Govindpuri", rate: 600, exp: "1-3 years", jobs: 34, rating: 4.4, count: 10, phone: "9811006789", lang: "Hindi", landmark: "Kalkaji Mandir ke paas" },
  { name: "Mukesh Ram", skill: "plumber", area: "Nehru Place", rate: 900, exp: "5-10 years", jobs: 41, rating: 4.7, count: 13, phone: "9811007890", lang: "Hindi, Punjabi", landmark: "Nehru Place Metro" },
  { name: "Vikram Thakur", skill: "ac_mechanic", area: "Dwarka", rate: 1200, exp: "5-10 years", jobs: 26, rating: 4.8, count: 7, phone: "9811008901", lang: "Hindi, English", landmark: "Sector 6 Market" },
  { name: "Kamlesh Soni", skill: "tile_fitter", area: "Green Park", rate: 1000, exp: "3-5 years", jobs: 22, rating: 4.6, count: 6, phone: "9811009012", lang: "Hindi", landmark: "Green Park Metro" },
  { name: "Mohan Yadav", skill: "mason", area: "Vasant Kunj", rate: 900, exp: "5-10 years", jobs: 33, rating: 4.5, count: 9, phone: "9811010123", lang: "Hindi", landmark: "Vasant Square Mall" },
  { name: "Suresh Paswan", skill: "helper", area: "Kirti Nagar", rate: 650, exp: "0-1 years", jobs: 15, rating: 4.2, count: 5, phone: "9811011234", lang: "Hindi", landmark: "Furniture Market" },
  { name: "Ramesh Kumar", skill: "electrician", area: "Karol Bagh", rate: 950, exp: "10+ years", jobs: 58, rating: 4.9, count: 16, phone: "9811012345", lang: "Hindi, English", landmark: "Ajmal Khan Road" },
  { name: "Suresh Yadav", skill: "carpenter", area: "Rohini", rate: 850, exp: "3-5 years", jobs: 19, rating: 4.3, count: 6, phone: "9811013456", lang: "Hindi", landmark: "Sector 7" },
  { name: "Arjun Paswan", skill: "painter", area: "Hauz Khas", rate: 800, exp: "1-3 years", jobs: 12, rating: 4.1, count: 4, phone: "9811014567", lang: "Hindi", landmark: "IIT Gate" },
  { name: "Pappu Singh", skill: "helper", area: "Noida Sector 18", rate: 600, exp: "0-1 years", jobs: 8, rating: 0, count: 0, phone: "9811015678", lang: "Hindi", landmark: "Atta Market" },
  { name: "Lallan Prasad", skill: "plumber", area: "Dwarka", rate: 880, exp: "3-5 years", jobs: 17, rating: 4.4, count: 5, phone: "9811016789", lang: "Hindi, Bhojpuri", landmark: "Sector 12" },
];

const ratingComments = [
  { by: "Mahesh Gupta", rating: 5, comment: "Bahut badhiya kaam kiya. Time par aaye aur saaf-suthra kaam." },
  { by: "Sunita Verma", rating: 5, comment: "Very professional. Ghar ki wiring poori ek din mein kar di." },
  { by: "Rohit Malhotra", rating: 4, comment: "Achha kaam karte hain, rate bhi sahi hai. Recommended!" },
  { by: "Farhan Ali", rating: 5, comment: "Contractor ki zarurat nahin padi. Direct hire kiya, paisa bacha." },
  { by: "Kavita Joshi", rating: 4, comment: "Kaam mein mahir hain. Thoda late aaye par kaam perfect tha." },
  { by: "Amit Bansal", rating: 5, comment: "Second time hire kar raha hoon. Bahut bharosemand hain." },
];

const seedPosts = [
  { name: "Raju Sharma", skill: "Mason / Rajmistri", city: "Delhi", content: "Aaj Lajpat Nagar mein naya site mila. Bhai log, registration ID hamesha saath rakho — contractor turant verify kar lete hain!" },
  { name: "Anwar Khan", skill: "Electrician", city: "Delhi", content: "Kal AC outdoor unit ki wiring ka kaam tha. 3 ghante mein ₹1200 kamaye. Seedha payment, koi cut nahin!" },
  { name: "Ganesh Kumawat", skill: "Painter", city: "Delhi", content: "Diwali se pehle painting ka kaam bahut hai. Jo bhai available hain, apna status ON rakho. Bahut calls aa rahi hain." },
  { name: "Sunita Devi", skill: "Homeowner", city: "Noida", content: "Kal yahan se plumber hire kiya. 15 minute mein call aa gaya aur shaam tak kaam ho gaya. Bahut acchi facility hai." },
  { name: "Vikram Thakur", skill: "AC Mechanic", city: "Delhi", content: "Summer season aa raha hai — AC servicing ki demand badhegi. Naye bhai log training videos dekh lo, bahut fayda hoga." },
];

const usernames = [
  "raju_sharma", "deepak_v", "anwar_khan", "ganesh_k", "santosh_l", "bablu_m",
  "mukesh_ram", "vikram_t", "kamlesh_s", "mohan_y", "suresh_p", "ramesh_k",
  "suresh_y", "arjun_p", "pappu_s", "lallan_p",
];

async function main() {
  console.log("Seeding database...");

  const [{ value }] = await db.execute<{ value: number }>(
    sql`select count(*)::int as value from workers`,
  ).then((r) => r.rows as { value: number }[]);
  if (value > 0) {
    console.log(`Workers table already has ${value} rows — skipping seed.`);
    return;
  }

  const passwordHash = hashPassword("worker123");

  for (let i = 0; i < seedWorkers.length; i++) {
    const w = seedWorkers[i];
    const coords = AREA_COORDS[w.area] ?? { lat: 28.61, lng: 77.2, city: "Delhi" };
    const jitter = () => (Math.random() - 0.5) * 0.03;

    const [row] = await db
      .insert(workers)
      .values({
        registrationId: `LC-SEED${String(i + 1).padStart(3, "0")}`,
        name: w.name,
        phone: w.phone,
        aadhaar: String(400000000000 + i * 111),
        skill: w.skill,
        experience: w.exp,
        dailyRate: w.rate,
        city: coords.city,
        area: w.area,
        landmark: w.landmark,
        languages: w.lang,
        username: usernames[i],
        passwordHash,
        available: w.count === 0 ? false : true,
        status: "approved",
        jobsCompleted: w.jobs,
        ratingAvg: w.rating,
        ratingCount: w.count,
        lat: coords.lat + jitter(),
        lng: coords.lng + jitter(),
        createdAt: new Date(Date.now() - (i + 2) * 86400000),
      })
      .returning();

    // Attach a few ratings to well-rated workers.
    const ratingTotal = Math.min(w.count, 3);
    for (let r = 0; r < ratingTotal; r++) {
      const c = ratingComments[(i + r) % ratingComments.length];
      await db.insert(ratings).values({
        workerId: row.id,
        employerName: c.by,
        rating: c.rating,
        comment: c.comment,
        createdAt: new Date(Date.now() - (r + 1) * 2 * 86400000),
      });
    }

    // A couple of past hire requests for flavour.
    if (i % 3 === 0) {
      await db.insert(hireRequests).values({
        workerId: row.id,
        employerName: "BuildWell Constructions",
        employerPhone: "9876501234",
        message: `Site par ${w.skill === "helper" ? "loading/unloading" : "finishing"} ka kaam hai, 5 din ka. Kal se shuru.`,
        createdAt: new Date(Date.now() - 86400000),
      });
    }
  }

  for (const p of seedPosts) {
    await db.insert(communityPosts).values({
      ...p,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 5) * 86400000),
    });
  }

  await db.delete(sessions); // clean slate
  console.log(`Seeded ${seedWorkers.length} workers, ratings, hire requests and ${seedPosts.length} community posts.`);
  console.log("Demo worker login: raju_sharma / worker123");
  console.log("Admin login: admin / chowk@admin (override via ADMIN_USERNAME / ADMIN_PASSWORD)");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  });
