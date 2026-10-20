import React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Phone, MessageCircle, Mail, MapPin } from "lucide-react";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  phone: string;
  phoneFormatted: string;
  imageUrl: string;
  bio: string;
  location?: string;
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "zipporah-njeri",
    name: "Zipporah Njeri",
    role: "Team Leader",
    phone: "+256752262410",
    phoneFormatted: "+256 752 262 410 (0752262410)",
    imageUrl: "/images/team/zipporah-njeri.jpg",
    bio: "Guiding and coordinating the Manifest Kapchorwa fellowship team, overseeing weekly services, community outreach missions, pastoral care, and discipleship across the Sebei highlands.",
    location: "Kapchorwa Town, Uganda",
  },
  {
    id: "caleb-prince",
    name: "Caleb Prince",
    role: "Administrator",
    phone: "+256778112567",
    phoneFormatted: "+256 778 112 567 (0778112567)",
    imageUrl: "/images/team/caleb-prince.jpg",
    bio: "Overseeing ministry administration, service planning, operations logistics, communications, and member coordination for Manifest Kapchorwa.",
    location: "Kapchorwa Town, Uganda",
  },
  {
    id: "rhema-sarah",
    name: "Rhema Sarah",
    role: "Finance",
    phone: "+256775097338",
    phoneFormatted: "+256 775 097 338 (0775097338)",
    imageUrl: "/images/team/rhema-sarah.jpg",
    bio: "Overseeing ministry financial stewardship, tithes and partnership records, financial accountability, and resource budgeting for Manifest Kapchorwa.",
    location: "Kapchorwa Town, Uganda",
  },
  {
    id: "kiplangat-louis",
    name: "Kiplangat Louis",
    role: "Assistant Admin",
    phone: "+256766026044",
    phoneFormatted: "+256 766 026 044 (0766026044)",
    imageUrl: "/images/team/kiplangat-louis.jpg",
    bio: "Assisting in ministry administration, service operations, media coordination, event execution, and member support for Manifest Kapchorwa.",
    location: "Kapchorwa Town, Uganda",
  },
  {
    id: "kipsang-shedrack",
    name: "Kipsang Shedrack",
    role: "Media",
    phone: "+256788284200",
    phoneFormatted: "+256 788 284 200 (0788284200)",
    imageUrl: "/images/team/kipsang-shedrack.jpg",
    bio: "Directing ministry media, photography, livestreaming, sound engineering, visual projections, and digital communications for Manifest Kapchorwa services and missions.",
    location: "Kapchorwa Town, Uganda",
  },
];

export function LeadershipSection() {
  return (
    <section id="leadership" className="space-y-8 scroll-mt-24">
      <div className="text-center space-y-3">
        <Badge variant="clay">Servant Leadership</Badge>
        <h2 className="font-heading text-2xl sm:text-4xl font-bold text-neutral-900">
          Meet Our Ministry Leadership Team
        </h2>
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-neutral-600 leading-relaxed">
          Dedicated men and women of God serving the body of Christ, advancing the Gospel of grace, and shepherding believers across Kapchorwa Municipality.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto w-full">
        {TEAM_MEMBERS.map((member) => (
          <div
            key={member.id}
            className="group rounded-3xl bg-white border border-neutral-200 overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
          >
            {/* Portrait Image Container */}
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-100">
              <Image
                src={member.imageUrl}
                alt={member.name}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover object-top group-hover:scale-105 transition-transform duration-500 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-75 transition-opacity" />

              {/* Role badge */}
              <div className="absolute top-4 left-4 z-10">
                <Badge variant="ochre" className="bg-amber-500 text-neutral-950 font-bold shadow-md">
                  {member.role}
                </Badge>
              </div>

              {/* Bottom name overlay on photo */}
              <div className="absolute bottom-4 left-4 right-4 z-10 text-white">
                <h3 className="font-heading text-xl font-bold drop-shadow-sm">
                  {member.name}
                </h3>
                {member.location && (
                  <p className="text-xs text-neutral-200 flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3 w-3 text-amber-400" />
                    <span>{member.location}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Details & Actions */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                {member.bio}
              </p>

              {/* Contact Actions */}
              <div className="space-y-2.5 pt-4 border-t border-neutral-100">
                <a
                  href={`tel:${member.phone}`}
                  className="flex items-center justify-between p-3 rounded-xl bg-highland-50 hover:bg-highland-100/80 border border-highland-200/60 text-highland-900 transition-colors group/link"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-lg bg-highland-600 text-white flex items-center justify-center shrink-0">
                      <Phone className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-highland-700 block">
                        Direct Contact
                      </span>
                      <span className="text-xs font-semibold">
                        {member.phoneFormatted}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-highland-700 group-hover/link:translate-x-0.5 transition-transform">
                    Call ↗
                  </span>
                </a>

                <a
                  href={`https://wa.me/${member.phone.replace("+", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
