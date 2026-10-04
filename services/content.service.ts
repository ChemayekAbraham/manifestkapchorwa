import { prisma } from "@/lib/prisma";

export const DEFAULT_WEBSITE_SECTIONS = [
  {
    key: "HOME_HERO",
    title: "Welcome to Manifest Kapchorwa",
    content:
      "A vibrant, Christ-centered fellowship under Phaneroo Ministries International, worshipping and serving God in the scenic highlands of Kapchorwa, Uganda. Join us for transformative fellowship, deep teaching in the Word, and anointed prayer.",
  },
  {
    key: "ABOUT_VISION",
    title: "Our Vision",
    content:
      "Phaneroo is a dynamic, life-transforming, and generational-impacting ministry with a vision to transform nations and the entire world with the Word of God. The Greek word 'Phaneroo' is translated as bringing to manifestation that which existed but is not seen.",
  },
  {
    key: "ABOUT_MISSION",
    title: "Our Mission",
    content:
      "Raising a generation that does not depend on a man of God for solutions, but rather individuals who are solutions in themselves at their workplaces, in their homes, and across the nations—learned in the Word of God in depth and demonstrators of the power of God.",
  },
  {
    key: "ABOUT_STATEMENT_OF_FAITH",
    title: "Phaneroo Statement of Faith",
    content:
      "We believe in God the creator of heaven and earth, the Supreme Being and Father of us all. We believe Jesus Christ is His son who was God manifest in the flesh; He walked the earth, lived among men; died and was raised again to life. We believe that man is a created being, made in the likeness and image of God. We believe that the redemptive work of Christ on the cross provides salvation for the soul of everyone that believes and divine healing for the body. We believe that we are justified by faith, and have received of the free gift of righteousness through God’s Grace. We believe that the Word of God is the sole standard of truth and the pattern for Christian living.",
  },
  {
    key: "SERVICE_SCHEDULE",
    title: "Weekly Service Times",
    content: JSON.stringify([
      { name: "Sunday First Service", day: "Sunday", time: "9:00 AM - 10:45 AM E.A.T", location: "Phaneroo Grounds / Main Sanctuary" },
      { name: "Sunday Second Service", day: "Sunday", time: "11:00 AM - 1:30 PM E.A.T", location: "Phaneroo Grounds / Main Sanctuary" },
      { name: "Thursday Fellowship Service", day: "Thursday", time: "5:00 PM - 7:30 PM E.A.T", location: "Phaneroo Grounds / Main Sanctuary" },
      { name: "Highlands Overnight Prayer Summit", day: "Monthly", time: "9:00 PM - 5:00 AM", location: "Main Sanctuary" },
    ]),
  },
  {
    key: "GIVING_INFORMATION",
    title: "Church Giving & Tithes",
    content: JSON.stringify({
      mtnMoMo: { name: "Manifest Kapchorwa Ministry", number: "0770 123456", code: "*165*3#" },
      airtelMoney: { name: "Manifest Kapchorwa Ministry", number: "0750 123456", code: "*185*9#" },
      bank: {
        bankName: "Stanbic Bank Uganda",
        accountName: "Manifest Kapchorwa Ministry",
        accountNumber: "9030012345678",
        branch: "Kapchorwa Branch",
      },
      instructions:
        "When giving via Mobile Money or Bank transfer, please use your Full Name or Phone Number as the reference (e.g. 'Tithe - John Chemutai'). May God bless your cheerful giving!",
    }),
  },
  {
    key: "CONTACT_INFORMATION",
    title: "Contact & Location",
    content: JSON.stringify({
      address: "Joshua Cheptegei Foundation Office, Kapchorwa Town, Uganda",
      phone: "+256 770 123456 / +256 750 123456",
      email: "info@manifestkapchorwa.org",
      officeHours: "Tuesday – Saturday: 8:30 AM – 5:00 PM (EAT)",
      mapsUrl: "https://maps.google.com/?q=Kapchorwa+Uganda",
    }),
  },
];

export class ContentService {
  static async getContent(key: string): Promise<{ key: string; title: string; content: string; imageUrl?: string | null }> {
    const item = await prisma.websiteContent.findUnique({
      where: { key },
    });

    if (item) {
      return {
        key: item.key,
        title: item.title,
        content: item.content,
        imageUrl: item.imageUrl,
      };
    }

    const fallback = DEFAULT_WEBSITE_SECTIONS.find((s) => s.key === key);
    return {
      key,
      title: fallback?.title || key,
      content: fallback?.content || "",
      imageUrl: null,
    };
  }

  static async getAllContent() {
    const list = await prisma.websiteContent.findMany();
    const map = new Map(list.map((c) => [c.key, c]));

    return DEFAULT_WEBSITE_SECTIONS.map((def) => {
      const stored = map.get(def.key);
      return {
        key: def.key,
        title: stored?.title || def.title,
        content: stored?.content || def.content,
        imageUrl: stored?.imageUrl || null,
        published: stored?.published ?? true,
        updatedAt: stored?.updatedAt || new Date(),
      };
    });
  }

  static async updateContent(key: string, data: { title?: string; content?: string; imageUrl?: string | null }) {
    const fallback = DEFAULT_WEBSITE_SECTIONS.find((s) => s.key === key);
    return prisma.websiteContent.upsert({
      where: { key },
      create: {
        key,
        title: data.title || fallback?.title || key,
        content: data.content !== undefined ? data.content : fallback?.content || "",
        imageUrl: data.imageUrl,
      },
      update: {
        ...(data.title ? { title: data.title } : {}),
        ...(data.content !== undefined ? { content: data.content } : {}),
        ...(data.imageUrl !== undefined ? { imageUrl: data.imageUrl } : {}),
      },
    });
  }
}
