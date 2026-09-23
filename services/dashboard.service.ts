import { prisma } from "@/lib/prisma";

export class DashboardService {
  /**
   * Fetches all admin dashboard summary data in a single batched parallel execution
   */
  static async getSummary() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalPeople,
      activeMembers,
      newConverts,
      workers,
      unreviewedPrayers,
      pendingTestimonies,
      recentPeople,
      upcomingEvents,
    ] = await Promise.all([
      // Fast database-level counts
      prisma.person.count(),
      prisma.person.count({ where: { status: "ACTIVE" } }),
      prisma.person.count({ where: { category: "NEW_CONVERT" } }),
      prisma.person.count({ where: { category: "WORKER" } }),
      prisma.prayerRequest.count({ where: { isReviewed: false } }),
      prisma.testimony.count({ where: { status: "PENDING" } }),
      // Recent registrations (lean projection)
      prisma.person.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          fullName: true,
          phone: true,
          village: true,
          category: true,
          status: true,
          createdAt: true,
        },
      }),
      // Upcoming events (lean projection)
      prisma.event.findMany({
        take: 4,
        where: { date: { gte: today } },
        orderBy: { date: "asc" },
        select: {
          id: true,
          name: true,
          date: true,
          location: true,
          published: true,
        },
      }),
    ]);

    return {
      stats: {
        "Total People": totalPeople,
        "Active Members": activeMembers,
        "New Converts": newConverts,
        Workers: workers,
      },
      pendingCounts: {
        prayers: unreviewedPrayers,
        testimonies: pendingTestimonies,
      },
      recentPeople,
      upcomingEvents,
    };
  }
}
