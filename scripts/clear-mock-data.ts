import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function clearMockData() {
  console.log("🧹 Clearing mock data from Manifest Kapchorwa database...");

  // 1. Clear EventAttendance
  const attendanceDeleted = await prisma.eventAttendance.deleteMany({});
  console.log(`- Deleted ${attendanceDeleted.count} attendance records`);

  // 2. Clear Events
  const eventsDeleted = await prisma.event.deleteMany({});
  console.log(`- Deleted ${eventsDeleted.count} events`);

  // 3. Clear Person (Members, Converts, Visitors)
  const peopleDeleted = await prisma.person.deleteMany({});
  console.log(`- Deleted ${peopleDeleted.count} people/members`);

  // 4. Clear Prayer Requests
  const prayersDeleted = await prisma.prayerRequest.deleteMany({});
  console.log(`- Deleted ${prayersDeleted.count} prayer requests`);

  // 5. Clear Testimonies
  const testimoniesDeleted = await prisma.testimony.deleteMany({});
  console.log(`- Deleted ${testimoniesDeleted.count} testimonies`);

  // 6. Clear Audit Logs
  const auditDeleted = await prisma.auditLog.deleteMany({});
  console.log(`- Deleted ${auditDeleted.count} audit logs`);

  // 7. Delete demo/test accounts, preserving luisekiplangat@gmail.com
  const usersDeleted = await prisma.user.deleteMany({
    where: {
      email: {
        not: "luisekiplangat@gmail.com",
      },
    },
  });
  console.log(`- Deleted ${usersDeleted.count} mock users (kept luisekiplangat@gmail.com)`);

  const devotionsCount = await prisma.devotion.count();
  const superAdmins = await prisma.user.findMany({
    select: { email: true, name: true, role: true },
  });

  console.log("\n🎉 Database cleanup complete!");
  console.log("Active Super Admin Users:", superAdmins);
  console.log("Preserved Devotions:", devotionsCount);
}

clearMockData()
  .catch((err) => {
    console.error("Cleanup error:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
