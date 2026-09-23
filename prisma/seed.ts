import { PrismaClient, Role, MemberCategory, MemberStatus, Gender, TestimonyStatus, AttendanceStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Manifest Kapchorwa database seed...");

  // 1. Seed SUPER_ADMIN
  const adminEmail = (process.env.SEED_ADMIN_EMAIL || "admin@manifestkapchorwa.org").toLowerCase().trim();
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "KapchorwaAdmin2026!Secure";
  const adminName = process.env.SEED_ADMIN_NAME || "Senior Administrator";

  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const superAdmin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      role: Role.SUPER_ADMIN,
      active: true,
      name: adminName,
    },
    create: {
      email: adminEmail,
      name: adminName,
      passwordHash,
      role: Role.SUPER_ADMIN,
      active: true,
    },
  });

  console.log(`✅ Super Admin configured: ${superAdmin.email}`);

  // Create standard admin and viewer accounts for testing
  const staffHash = await bcrypt.hash("ChurchStaff2026!", 10);
  await prisma.user.upsert({
    where: { email: "staff@manifestkapchorwa.org" },
    update: {},
    create: {
      email: "staff@manifestkapchorwa.org",
      name: "Pastoral Secretary",
      passwordHash: staffHash,
      role: Role.ADMIN,
      active: true,
    },
  });

  await prisma.user.upsert({
    where: { email: "viewer@manifestkapchorwa.org" },
    update: {},
    create: {
      email: "viewer@manifestkapchorwa.org",
      name: "Guest Auditor",
      passwordHash: staffHash,
      role: Role.VIEWER,
      active: true,
    },
  });

  // 2. Seed Sample Members & People
  const samplePeople = [
    {
      fullName: "Joshua Chemutai",
      phone: "+256770111222",
      email: "joshua.chemutai@gmail.com",
      gender: Gender.MALE,
      village: "Cheptuya",
      parish: "Kapchesombe",
      subCounty: "Kapchorwa Town Council",
      district: "Kapchorwa",
      category: MemberCategory.WORKER,
      status: MemberStatus.ACTIVE,
      notes: "Deacon and Choir Leader",
      dateJoined: new Date("2024-01-15"),
    },
    {
      fullName: "Faith Chebet",
      phone: "+256772333444",
      email: "faith.chebet@yahoo.com",
      gender: Gender.FEMALE,
      village: "Kawowo",
      parish: "Tegeres",
      subCounty: "Tegeres Sub-County",
      district: "Kapchorwa",
      category: MemberCategory.MEMBER,
      status: MemberStatus.ACTIVE,
      notes: "Women's Ministry Member",
      dateJoined: new Date("2024-03-20"),
    },
    {
      fullName: "Emmanuel Kwemoi",
      phone: "+256750555666",
      email: "kwemoi.e@gmail.com",
      gender: Gender.MALE,
      village: "Sipi Upper",
      parish: "Sipi",
      subCounty: "Sipi",
      district: "Kapchorwa",
      category: MemberCategory.NEW_CONVERT,
      status: MemberStatus.ACTIVE,
      notes: "Gave life to Christ during the Easter Outreach",
      dateJoined: new Date("2025-04-01"),
    },
    {
      fullName: "Grace Cherotich",
      phone: "+256780777888",
      email: "grace.cherotich@gmail.com",
      gender: Gender.FEMALE,
      village: "Chebonet",
      parish: "Chebonet",
      subCounty: "Kaptanya",
      district: "Kapchorwa",
      category: MemberCategory.YOUTH,
      status: MemberStatus.ACTIVE,
      notes: "Youth Fellowship Usher",
      dateJoined: new Date("2024-06-10"),
    },
    {
      fullName: "Moses Kiprop",
      phone: "+256774999000",
      email: "kiprop.m@gmail.com",
      gender: Gender.MALE,
      village: "Cheptuya",
      parish: "Kapchesombe",
      subCounty: "Kapchorwa Town Council",
      district: "Kapchorwa",
      category: MemberCategory.VISITOR,
      status: MemberStatus.ACTIVE,
      notes: "Visiting from Mbale for work assignment",
      dateJoined: new Date("2026-02-14"),
    },
    {
      fullName: "Rebecca Arao",
      phone: "+256771222333",
      email: "rebecca.arao@gmail.com",
      gender: Gender.FEMALE,
      village: "London Bridge Cell",
      parish: "Central Parish",
      subCounty: "Kapchorwa Municipality",
      district: "Kapchorwa",
      category: MemberCategory.MEMBER,
      status: MemberStatus.INACTIVE,
      notes: "Relocated temporarily for studies",
      dateJoined: new Date("2023-08-01"),
    },
  ];

  const createdPeople = [];
  for (const person of samplePeople) {
    const p = await prisma.person.upsert({
      where: { id: person.fullName.toLowerCase().replace(/\s+/g, "-") },
      update: {},
      create: {
        id: person.fullName.toLowerCase().replace(/\s+/g, "-"),
        ...person,
      },
    });
    createdPeople.push(p);
  }
  console.log(`✅ Seeded ${createdPeople.length} sample people.`);

  // 3. Seed Events & Attendance
  const event1 = await prisma.event.upsert({
    where: { id: "sunday-celebration-service" },
    update: {},
    create: {
      id: "sunday-celebration-service",
      name: "Sunday Celebration Service",
      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3), // 3 days from now
      location: "Main Sanctuary, Manifest Kapchorwa",
      description: "Join us for powerful praise, worship, and the preaching of the Word.",
      published: true,
    },
  });

  const event2 = await prisma.event.upsert({
    where: { id: "highlands-prayer-summit" },
    update: {},
    create: {
      id: "highlands-prayer-summit",
      name: "Highlands Overnight Prayer Summit",
      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10),
      location: "Main Sanctuary, Manifest Kapchorwa",
      description: "An intensive night of intercession and breakthrough for families and the nation.",
      published: true,
    },
  });

  // Mark attendance for event1
  for (const p of createdPeople.slice(0, 4)) {
    await prisma.eventAttendance.upsert({
      where: {
        eventId_personId: {
          eventId: event1.id,
          personId: p.id,
        },
      },
      update: {},
      create: {
        eventId: event1.id,
        personId: p.id,
        status: AttendanceStatus.PRESENT,
      },
    });
  }

  // 4. Seed Devotions
  await prisma.devotion.upsert({
    where: { slug: "standing-firm-on-the-rock" },
    update: {},
    create: {
      title: "Standing Firm on the Rock of Ages",
      slug: "standing-firm-on-the-rock",
      excerpt: "In every storm and season of trial, our foundation in Christ remains unshakable.",
      content: `### Scripture Reading: Matthew 7:24-27\n\n> "Therefore everyone who hears these words of mine and puts them into practice is like a wise man who built his house on the rock."\n\nLiving in the scenic mountains of Kapchorwa, we often witness mighty rains, cascading waterfalls, and powerful winds. A house built on loose soil cannot withstand the highland rains. In the same manner, our spiritual life requires the unyielding rock of Christ Jesus.\n\nWhen we build our daily choices, our families, and our work on God's eternal Word, no mountain storm can tear us down. Walk today with confidence knowing your anchor holds within the veil!\n\n**Prayer:** Heavenly Father, establish my steps upon Your Word. Keep my heart steadfast in faith throughout this week. In Jesus' Name, Amen.`,
      author: "Senior Pastor",
      published: true,
      publishedAt: new Date(),
    },
  });

  await prisma.devotion.upsert({
    where: { slug: "the-power-of-steadfast-prayer" },
    update: {},
    create: {
      title: "The Power of Steadfast Prayer in the Highlands",
      slug: "the-power-of-steadfast-prayer",
      excerpt: "When the church unites in fervent intercession, the heavens open and breakthroughs occur.",
      content: `### Scripture Reading: James 5:16\n\n> "The effective, fervent prayer of a righteous man avails much."\n\nNever underestimate the quiet hours you spend before God. Prayer is not merely asking for needs; it is aligning our heart with Heaven's will for our community and children.\n\nLet us continue to lift up Kapchorwa, Uganda, and the nations in prayer daily.`,
      author: "Pastoral Team",
      published: true,
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    },
  });

  // 5. Seed Prayer Requests
  await prisma.prayerRequest.createMany({
    data: [
      {
        name: "Sister Mary",
        contact: "+256770987654",
        request: "Please pray for complete healing in my lungs and strength for my family.",
        isReviewed: true,
        isArchived: false,
      },
      {
        name: "Brother David",
        contact: "+256750112233",
        request: "Intercede for our youth ministry exam candidates preparing for national UNEB finals.",
        isReviewed: false,
        isArchived: false,
      },
    ],
    skipDuplicates: true,
  });

  // 6. Seed Testimonies
  await prisma.testimony.createMany({
    data: [
      {
        name: "Chemutai Brenda",
        contact: "+256778123456",
        content:
          "God miraculously provided tuition fees for my children when all doors seemed closed. I give Him all the glory!",
        status: TestimonyStatus.APPROVED,
        reviewedBy: "Admin",
        approvedAt: new Date(),
      },
      {
        name: "Kiplangat Peter",
        contact: "+256772998877",
        content:
          "I was healed of severe chronic back pain after the pastoral team laid hands and prayed for me at the Sunday service.",
        status: TestimonyStatus.APPROVED,
        reviewedBy: "Admin",
        approvedAt: new Date(),
      },
    ],
    skipDuplicates: true,
  });

  console.log("✨ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
