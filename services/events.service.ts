import { prisma } from "@/lib/prisma";
import { AttendanceMarkInput, EventInput } from "@/validators/event";

export class EventsService {
  static async create(data: EventInput) {
    return prisma.event.create({
      data: {
        name: data.name.trim(),
        date: new Date(data.date),
        location: data.location?.trim() || "Main Sanctuary, Manifest Kapchorwa",
        description: data.description?.trim() || null,
        published: data.published ?? true,
      },
    });
  }

  static async update(id: string, data: Partial<EventInput>) {
    return prisma.event.update({
      where: { id },
      data: {
        ...(data.name ? { name: data.name.trim() } : {}),
        ...(data.date ? { date: new Date(data.date) } : {}),
        ...(data.location !== undefined ? { location: data.location?.trim() || "Main Sanctuary, Manifest Kapchorwa" } : {}),
        ...(data.description !== undefined ? { description: data.description?.trim() || null } : {}),
        ...(data.published !== undefined ? { published: data.published } : {}),
      },
    });
  }

  static async delete(id: string) {
    return prisma.event.delete({
      where: { id },
    });
  }

  static async getById(id: string) {
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        attendance: {
          include: {
            person: {
              select: {
                id: true,
                fullName: true,
                phone: true,
                email: true,
                category: true,
                village: true,
                status: true,
              },
            },
          },
          orderBy: { markedAt: "desc" },
        },
      },
    });

    if (!event) return null;

    const totalMarked = event.attendance.length;
    const presentCount = event.attendance.filter((a) => a.status === "PRESENT").length;
    const absentCount = totalMarked - presentCount;
    const attendanceRate = totalMarked > 0 ? Math.round((presentCount / totalMarked) * 100) : 0;

    return {
      ...event,
      stats: {
        totalMarked,
        presentCount,
        absentCount,
        attendanceRate,
      },
    };
  }

  static async listUpcoming(limit = 10, onlyPublished = true) {
    return prisma.event.findMany({
      where: {
        date: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        ...(onlyPublished ? { published: true } : {}),
      },
      orderBy: { date: "asc" },
      take: limit,
      include: {
        _count: {
          select: { attendance: true },
        },
      },
    });
  }

  static async listAll(page = 1, pageSize = 20) {
    const [total, items] = await Promise.all([
      prisma.event.count(),
      prisma.event.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { date: "desc" },
        include: {
          _count: {
            select: { attendance: true },
          },
        },
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

  /**
   * Mark attendance for a single person (upsert to prevent duplicates)
   */
  static async markAttendance(eventId: string, data: AttendanceMarkInput) {
    return prisma.eventAttendance.upsert({
      where: {
        eventId_personId: {
          eventId,
          personId: data.personId,
        },
      },
      create: {
        eventId,
        personId: data.personId,
        status: data.status,
        notes: data.notes?.trim() || null,
      },
      update: {
        status: data.status,
        notes: data.notes !== undefined ? (data.notes?.trim() || null) : undefined,
        markedAt: new Date(),
      },
    });
  }

  /**
   * Batch mark attendance for multiple members
   */
  static async batchMarkAttendance(
    eventId: string,
    records: { personId: string; status: "PRESENT" | "ABSENT"; notes?: string | null }[]
  ) {
    return prisma.$transaction(
      records.map((rec) =>
        prisma.eventAttendance.upsert({
          where: {
            eventId_personId: {
              eventId,
              personId: rec.personId,
            },
          },
          create: {
            eventId,
            personId: rec.personId,
            status: rec.status,
            notes: rec.notes?.trim() || null,
          },
          update: {
            status: rec.status,
            notes: rec.notes !== undefined ? (rec.notes?.trim() || null) : undefined,
            markedAt: new Date(),
          },
        })
      )
    );
  }
}
