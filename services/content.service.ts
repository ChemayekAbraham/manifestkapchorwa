import { prisma } from "@/lib/prisma";

export const DEFAULT_WEBSITE_SECTIONS = [
  {
    key: "HOME_HERO",
    title: "Welcome to Manifest Kapchorwa",
    content:
      "A vibrant, Christ-centered community worshipping and serving God in the scenic highlands of Kapchorwa, Uganda. Join us for transformative fellowship, discipleship, and prayer.",
  },
  {
    key: "ABOUT_VISION",
    title: "Our Vision",
    content:
      "To see families transformed, souls established in grace, and the light of Jesus Christ illuminating the Sebei sub-region and beyond.",
  },
  {
    key: "ABOUT_MISSION",
    title: "Our Mission",
    content:
      "Proclaiming the authentic Gospel, making devoted disciples of Jesus Christ, equipping believers for effective ministry, and compassionately serving our local community.",
  },
  {
    key: "ABOUT_STATEMENT_OF_FAITH",
    title: "Statement of Faith",
    content:
      "We believe in the Holy Scriptures as the inspired and infallible Word of God; the Trinity of Father, Son, and Holy Spirit; salvation through grace through faith in Jesus Christ; the baptism and gifts of the Holy Spirit; and the blessed hope of Christ's return.",
  },
  {
    key: "SERVICE_SCHEDULE",
    title: "Weekly Service Times",
    content: JSON.stringify([
      { name: "Sunday First Service (Celebration)", day: "Sunday", time: "8:00 AM - 10:30 AM", location: "Main Sanctuary" },
      { name: "Sunday Second Service (Main)", day: "Sunday", time: "11:00 AM - 1:30 PM", location: "Main Sanctuary" },
      { name: "Mid-Week Deliverance & Prayer", day: "Wednesday", time: "5:00 PM - 7:00 PM", location: "Prayer Hall" },
      { name: "Youth & Young Adults Fellowship", day: "Friday", time: "5:30 PM - 7:30 PM", location: "Youth Chapel" },
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
      address: "Plot 14, Main Street, Kapchorwa Municipality, Eastern Uganda",
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
