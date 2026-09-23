import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, Clock, Heart, Lock } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-950 text-neutral-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Column 1: Ministry Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-36">
                <Image
                  src="/images/logo.png"
                  alt="Manifest Kapchorwa Logo"
                  fill
                  className="object-contain object-left"
                  sizes="150px"
                />
              </div>
              <div className="border-l border-neutral-700 pl-2.5">
                <span className="text-[11px] font-extrabold tracking-wider text-white uppercase block leading-tight">
                  Kapchorwa Manifest
                </span>
                <span className="text-[9px] font-semibold text-highland-400 tracking-wider uppercase block">
                  Eastern Uganda
                </span>
              </div>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              A Christ-centered church community serving Kapchorwa Municipality and the greater Sebei sub-region in Eastern Uganda. Proclaiming the authentic Gospel and raising disciples of grace.
            </p>
            <div className="pt-2">
              <Link
                href="/register"
                className="inline-flex items-center gap-1.5 rounded-lg bg-highland-500 px-3.5 py-2 text-xs font-semibold text-white hover:bg-highland-600 transition-colors shadow"
              >
                <span>Register with Us</span>
              </Link>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-white border-b border-highland-800 pb-2">
              Explore
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Our Church & Vision
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  Weekly Services & Schedule
                </Link>
              </li>
              <li>
                <Link href="/devotions" className="hover:text-white transition-colors">
                  Written Devotionals
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-white transition-colors">
                  Upcoming Church Events
                </Link>
              </li>
              <li>
                <Link href="/prayer" className="hover:text-white transition-colors">
                  Submit a Prayer Request
                </Link>
              </li>
              <li>
                <Link href="/testimony" className="hover:text-white transition-colors">
                  Share Your Testimony
                </Link>
              </li>
              <li>
                <Link href="/give" className="hover:text-white transition-colors">
                  Church Giving (MoMo / Airtel / Bank)
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Service Schedule */}
          <div className="space-y-3">
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-white border-b border-highland-800 pb-2">
              Service Times
            </h4>
            <div className="space-y-2.5 text-xs text-neutral-300">
              <div className="bg-highland-900/60 p-2.5 rounded-lg border border-highland-800/60">
                <span className="font-semibold text-ochre-400 block">Sunday 1st Service</span>
                <span className="text-neutral-300">8:00 AM – 10:30 AM (Celebration)</span>
              </div>
              <div className="bg-highland-900/60 p-2.5 rounded-lg border border-highland-800/60">
                <span className="font-semibold text-ochre-400 block">Sunday 2nd Service</span>
                <span className="text-neutral-300">11:00 AM – 1:30 PM (Main Service)</span>
              </div>
              <div className="bg-highland-900/60 p-2.5 rounded-lg border border-highland-800/60">
                <span className="font-semibold text-ochre-400 block">Wednesday Prayer & Deliverance</span>
                <span className="text-neutral-300">5:00 PM – 7:00 PM</span>
              </div>
            </div>
          </div>

          {/* Column 4: Contact Information */}
          <div className="space-y-3">
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-white border-b border-highland-800 pb-2">
              Contact & Location
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-300">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-clay-400 shrink-0 mt-0.5" />
                <span>Plot 14, Main Street, Kapchorwa Municipality, Eastern Uganda</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-clay-400 shrink-0" />
                <span>+256 770 123456 / +256 750 123456</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-clay-400 shrink-0" />
                <span>info@manifestkapchorwa.org</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-clay-400 shrink-0" />
                <span>Office: Tue - Sat (8:30 AM - 5:00 PM)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-highland-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <p>© {new Date().getFullYear()} Manifest Kapchorwa. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/give" className="hover:text-white transition-colors">
              Giving
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors">
              Contact
            </Link>
            <Link href="/admin/login" className="flex items-center gap-1 text-highland-300 hover:text-white transition-colors">
              <Lock className="h-3 w-3" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
