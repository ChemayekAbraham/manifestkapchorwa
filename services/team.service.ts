import { prisma } from "@/lib/prisma";

export const INITIAL_TEAM_MEMBERS = [
  {
    id: "zipporah-njeri",
    name: "Zipporah Njeri",
    role: "Team Leader",
    phone: "+256752262410",
    imageUrl: "/images/team/zipporah-njeri.jpg",
    bio: "Guiding and coordinating the Manifest Kapchorwa fellowship team, overseeing weekly services, community outreach missions, pastoral care, and discipleship across the Sebei highlands.",
    location: "Kapchorwa Town, Uganda",
    order: 1,
    active: true,
  },
  {
    id: "caleb-prince",
    name: "Caleb Prince",
    role: "Administrator",
    phone: "+256778112567",
    imageUrl: "/images/team/caleb-prince.jpg",
    bio: "Overseeing ministry administration, service planning, operations logistics, communications, and member coordination for Manifest Kapchorwa.",
    location: "Kapchorwa Town, Uganda",
    order: 2,
    active: true,
  },
  {
    id: "rhema-sarah",
    name: "Rhema Sarah",
    role: "Finance",
    phone: "+256775097338",
    imageUrl: "/images/team/rhema-sarah.jpg",
    bio: "Overseeing ministry financial stewardship, tithes and partnership records, financial accountability, and resource budgeting for Manifest Kapchorwa.",
    location: "Kapchorwa Town, Uganda",
    order: 3,
    active: true,
  },
  {
    id: "kiplangat-louis",
    name: "Kiplangat Louis",
    role: "Assistant Admin",
    phone: "+256766026044",
    imageUrl: "/images/team/kiplangat-louis.jpg",
    bio: "Assisting in ministry administration, service operations, media coordination, event execution, and member support for Manifest Kapchorwa.",
    location: "Kapchorwa Town, Uganda",
    order: 4,
    active: true,
  },
  {
    id: "kipsang-shedrack",
    name: "Kipsang Shedrack",
    role: "Media",
    phone: "+256788284200",
    imageUrl: "/images/team/kipsang-shedrack.jpg",
    bio: "Directing ministry media, photography, livestreaming, sound engineering, visual projections, and digital communications for Manifest Kapchorwa services and missions.",
    location: "Kapchorwa Town, Uganda",
    order: 5,
    active: true,
  },
];

export interface CreateTeamMemberInput {
  name: string;
  role: string;
  phone: string;
  imageUrl?: string | null;
  bio?: string | null;
  location?: string | null;
  order?: number;
  active?: boolean;
}

export interface UpdateTeamMemberInput {
  name?: string;
  role?: string;
  phone?: string;
  imageUrl?: string | null;
  bio?: string | null;
  location?: string | null;
  order?: number;
  active?: boolean;
}

export class TeamService {
  /**
   * Automatically seed initial 5 members if table is empty
   */
  static async ensureInitialized() {
    try {
      const count = await prisma.teamMember.count();
      if (count === 0) {
        for (const member of INITIAL_TEAM_MEMBERS) {
          await prisma.teamMember.create({
            data: member,
          });
        }
      }
    } catch (error) {
      console.error("Failed to initialize default team members:", error);
    }
  }

  /**
   * Get all team members for admin management
   */
  static async getAll(includeInactive = true) {
    try {
      if ((prisma as any).teamMember?.findMany) {
        await this.ensureInitialized();
        return await prisma.teamMember.findMany({
          where: includeInactive ? {} : { active: true },
          orderBy: [{ order: "asc" }, { createdAt: "asc" }],
        });
      }
    } catch (error) {
      console.warn("Prisma teamMember query fallback:", error);
    }
    return INITIAL_TEAM_MEMBERS;
  }

  /**
   * Get public active team members
   */
  static async getPublicMembers() {
    try {
      if ((prisma as any).teamMember?.findMany) {
        await this.ensureInitialized();
        const records = await prisma.teamMember.findMany({
          where: { active: true },
          orderBy: [{ order: "asc" }, { createdAt: "asc" }],
        });
        if (records && records.length > 0) return records;
      }
    } catch (error) {
      console.warn("Prisma public teamMember query fallback:", error);
    }
    return INITIAL_TEAM_MEMBERS;
  }

  /**
   * Get a single member by ID
   */
  static async getById(id: string) {
    return prisma.teamMember.findUnique({
      where: { id },
    });
  }

  /**
   * Create a new team member
   */
  static async create(data: CreateTeamMemberInput) {
    let order = data.order;
    if (order === undefined || order === null) {
      const maxOrder = await prisma.teamMember.aggregate({
        _max: { order: true },
      });
      order = (maxOrder._max.order ?? 0) + 1;
    }

    return prisma.teamMember.create({
      data: {
        name: data.name.trim(),
        role: data.role.trim(),
        phone: data.phone.trim(),
        imageUrl: data.imageUrl?.trim() || null,
        bio: data.bio?.trim() || null,
        location: data.location?.trim() || "Kapchorwa Town, Uganda",
        order: Number(order),
        active: data.active ?? true,
      },
    });
  }

  /**
   * Update / Rename / Edit a team member
   */
  static async update(id: string, data: UpdateTeamMemberInput) {
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name.trim();
    if (data.role !== undefined) updateData.role = data.role.trim();
    if (data.phone !== undefined) updateData.phone = data.phone.trim();
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl?.trim() || null;
    if (data.bio !== undefined) updateData.bio = data.bio?.trim() || null;
    if (data.location !== undefined) updateData.location = data.location?.trim() || "Kapchorwa Town, Uganda";
    if (data.order !== undefined) updateData.order = Number(data.order);
    if (data.active !== undefined) updateData.active = Boolean(data.active);

    return prisma.teamMember.update({
      where: { id },
      data: updateData,
    });
  }

  /**
   * Delete / Remove a team member
   */
  static async delete(id: string) {
    return prisma.teamMember.delete({
      where: { id },
    });
  }

  /**
   * Reorder team members
   */
  static async reorder(items: { id: string; order: number }[]) {
    return prisma.$transaction(
      items.map((item) =>
        prisma.teamMember.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    );
  }
}
