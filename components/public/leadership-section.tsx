import React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Phone, MessageCircle, MapPin, Users } from "lucide-react";
import { INITIAL_TEAM_MEMBERS } from "@/services/team.service";

export interface TeamMemberDisplay {
  id: string;
  name: string;
  role: string;
  phone: string;
  imageUrl?: string | null;
  bio?: string | null;
  location?: string | null;
}

function formatUgandanPhone(raw: string) {
  const digits = raw.replace(/[^0-9]/g, "");
  if (digits.startsWith("256") && digits.length === 12) {
    const local = "0" + digits.slice(3);
    return `+256 ${digits.slice(3, 6)} ${digits.slice(6, 9)} ${digits.slice(9)} (${local})`;
  }
  if (digits.startsWith("0") && digits.length === 10) {
    return `+256 ${digits.slice(1, 4)} ${digits.slice(4, 7)} ${digits.slice(7)} (${digits})`;
  }
  return raw;
}

function getTelUrl(raw: string) {
  const digits = raw.replace(/[^0-9]/g, "");
  if (digits.startsWith("0")) {
    return `tel:+256${digits.slice(1)}`;
  }
  if (digits.startsWith("256")) {
    return `tel:+${digits}`;
  }
  return `tel:${raw}`;
}

function getWhatsAppUrl(raw: string) {
  const digits = raw.replace(/[^0-9]/g, "");
  if (digits.startsWith("0")) {
    return `https://wa.me/256${digits.slice(1)}`;
  }
  if (digits.startsWith("256")) {
    return `https://wa.me/${digits}`;
  }
  return `https://wa.me/${digits}`;
}

interface LeadershipSectionProps {
  members?: TeamMemberDisplay[];
}

export function LeadershipSection({ members }: LeadershipSectionProps) {
  const teamList = members && members.length > 0 ? members : INITIAL_TEAM_MEMBERS;

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
        {teamList.map((member) => (
          <div
            key={member.id}
            className="group rounded-3xl bg-white border border-neutral-200 overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
          >
            <div>
              {/* Portrait Image Container */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-900">
                <Image
                  src={member.imageUrl || "/images/team/avatar-male.jpg"}
                  alt={member.name}
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent opacity-65 group-hover:opacity-75 transition-opacity" />

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

              {/* Details */}
              <div className="p-6">
                {member.bio ? (
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                    {member.bio}
                  </p>
                ) : (
                  <p className="text-xs text-neutral-400 italic">
                    Serving with the Manifest Kapchorwa fellowship team.
                  </p>
                )}
              </div>
            </div>

            {/* Contact Actions */}
            <div className="px-6 pb-6 pt-0 space-y-2.5">
              <a
                href={getTelUrl(member.phone)}
                className="flex items-center justify-between p-3 rounded-xl bg-highland-50 hover:bg-highland-100/80 border border-highland-200/60 text-highland-900 transition-colors group/link"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="h-8 w-8 rounded-lg bg-highland-600 text-white flex items-center justify-center shrink-0">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div className="truncate">
                    <span className="text-[10px] uppercase font-bold text-highland-700 block">
                      Direct Contact
                    </span>
                    <span className="text-xs font-semibold truncate block">
                      {formatUgandanPhone(member.phone)}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold text-highland-700 group-hover/link:translate-x-0.5 transition-transform shrink-0 ml-2">
                  Call ↗
                </span>
              </a>

              <a
                href={getWhatsAppUrl(member.phone)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
