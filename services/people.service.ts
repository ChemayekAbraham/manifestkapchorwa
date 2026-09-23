import { prisma } from "@/lib/prisma";
import { normalizeUgandanPhone } from "@/lib/phone";
import { PersonFilterInput, PersonInput } from "@/validators/person";
import { Prisma } from "@prisma/client";

export class PeopleService {
  /**
   * Check for duplicate person by phone or email
   */
  static async findDuplicate(phone?: string | null, email?: string | null, excludeId?: string) {
    const normalizedPhone = normalizeUgandanPhone(phone);
    const normalizedEmail = email?.trim().toLowerCase() || null;

    if (!normalizedPhone && !normalizedEmail) {
      return null;
    }

    const orConditions: Prisma.PersonWhereInput[] = [];

    if (normalizedPhone) {
      orConditions.push({ phone: normalizedPhone });
    }
    if (normalizedEmail) {
      orConditions.push({ email: normalizedEmail });
    }

    const where: Prisma.PersonWhereInput = {
      OR: orConditions,
    };

    if (excludeId) {
      where.id = { not: excludeId };
    }

    return prisma.person.findFirst({
      where,
    });
  }

  /**
   * Create a new person with duplicate prevention and phone normalization
   */
  static async create(data: PersonInput) {
    const normalizedPhone = normalizeUgandanPhone(data.phone);
    const normalizedEmail = data.email ? data.email.trim().toLowerCase() : null;

    if (normalizedPhone || normalizedEmail) {
      const duplicate = await this.findDuplicate(normalizedPhone, normalizedEmail);
      if (duplicate) {
        throw new Error(
          "A registration with this phone number or email already exists. Please contact the church office if you believe this is an error."
        );
      }
    }

    return prisma.person.create({
      data: {
        fullName: data.fullName.trim(),
        phone: normalizedPhone,
        email: normalizedEmail,
        gender: data.gender || null,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
        village: data.village?.trim() || null,
        parish: data.parish?.trim() || null,
        subCounty: data.subCounty?.trim() || null,
        district: data.district?.trim() || "Kapchorwa",
        category: data.category || "MEMBER",
        status: data.status || "ACTIVE",
        notes: data.notes?.trim() || null,
        dateJoined: data.dateJoined ? new Date(data.dateJoined) : new Date(),
      },
    });
  }

  /**
   * Update existing person
   */
  static async update(id: string, data: Partial<PersonInput>) {
    const existing = await prisma.person.findUnique({ where: { id } });
    if (!existing) {
      throw new Error("Person record not found");
    }

    const normalizedPhone = data.phone !== undefined ? normalizeUgandanPhone(data.phone) : existing.phone;
    const normalizedEmail =
      data.email !== undefined ? (data.email ? data.email.trim().toLowerCase() : null) : existing.email;

    if (normalizedPhone || normalizedEmail) {
      const duplicate = await this.findDuplicate(normalizedPhone, normalizedEmail, id);
      if (duplicate) {
        throw new Error("Another member with this phone number or email already exists.");
      }
    }

    return prisma.person.update({
      where: { id },
      data: {
        ...(data.fullName ? { fullName: data.fullName.trim() } : {}),
        ...(data.phone !== undefined ? { phone: normalizedPhone } : {}),
        ...(data.email !== undefined ? { email: normalizedEmail } : {}),
        ...(data.gender !== undefined ? { gender: data.gender } : {}),
        ...(data.dateOfBirth !== undefined
          ? { dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null }
          : {}),
        ...(data.village !== undefined ? { village: data.village?.trim() || null } : {}),
        ...(data.parish !== undefined ? { parish: data.parish?.trim() || null } : {}),
        ...(data.subCounty !== undefined ? { subCounty: data.subCounty?.trim() || null } : {}),
        ...(data.district !== undefined ? { district: data.district?.trim() || null } : {}),
        ...(data.category ? { category: data.category } : {}),
        ...(data.status ? { status: data.status } : {}),
        ...(data.notes !== undefined ? { notes: data.notes?.trim() || null } : {}),
        ...(data.dateJoined ? { dateJoined: new Date(data.dateJoined) } : {}),
      },
    });
  }

  /**
   * Soft delete person (set status = INACTIVE)
   */
  static async softDelete(id: string) {
    return prisma.person.update({
      where: { id },
      data: { status: "INACTIVE" },
    });
  }

  /**
   * Permanent delete (SUPER_ADMIN only)
   */
  static async permanentDelete(id: string) {
    return prisma.person.delete({
      where: { id },
    });
  }

  /**
   * Get single person by ID with attendance count
   */
  static async getById(id: string) {
    return prisma.person.findUnique({
      where: { id },
      include: {
        _count: {
          select: { attendance: true },
        },
        attendance: {
          include: {
            event: {
              select: { id: true, name: true, date: true, location: true },
            },
          },
          orderBy: { markedAt: "desc" },
          take: 10,
        },
      },
    });
  }

  /**
   * List people with multi-filter, search, pagination & sorting
   */
  static async list(filters: PersonFilterInput) {
    const {
      search,
      category,
      status,
      gender,
      village,
      parish,
      subCounty,
      district,
      dateFrom,
      dateTo,
      page = 1,
      pageSize = 25,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = filters;

    const where: Prisma.PersonWhereInput = {};

    if (search && search.trim()) {
      const q = search.trim();
      const phoneQ = normalizeUgandanPhone(q) || q;
      where.OR = [
        { fullName: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
        { phone: { contains: phoneQ, mode: "insensitive" } },
        { village: { contains: q, mode: "insensitive" } },
      ];
    }

    if (category) where.category = category;
    if (status) where.status = status;
    if (gender) where.gender = gender;
    if (village) where.village = { contains: village.trim(), mode: "insensitive" };
    if (parish) where.parish = { contains: parish.trim(), mode: "insensitive" };
    if (subCounty) where.subCounty = { contains: subCounty.trim(), mode: "insensitive" };
    if (district) where.district = { contains: district.trim(), mode: "insensitive" };

    if (dateFrom || dateTo) {
      where.dateJoined = {};
      if (dateFrom) where.dateJoined.gte = new Date(dateFrom);
      if (dateTo) {
        const to = new Date(dateTo);
        to.setHours(23, 59, 59, 999);
        where.dateJoined.lte = to;
      }
    }

    const [total, items] = await Promise.all([
      prisma.person.count({ where }),
      prisma.person.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { [sortBy]: sortOrder },
      }),
    ]);

    return {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }
}
