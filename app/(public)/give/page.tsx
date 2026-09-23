import React from "react";
import { ContentService } from "@/services/content.service";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Heart, Smartphone, Landmark, CheckCircle2, ShieldCheck, Copy, Phone } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Church Giving & Tithes",
  description:
    "Support Manifest Kapchorwa through MTN Mobile Money, Airtel Money, and Stanbic Bank Uganda.",
};

export const revalidate = 60;

export default async function GivePage() {
  const giveContent = await ContentService.getContent("GIVING_INFORMATION");
  let givingData: any = {};
  try {
    givingData = JSON.parse(giveContent.content);
  } catch {
    givingData = {
      mtnMoMo: { name: "Manifest Kapchorwa Ministry", number: "0770 123456", code: "*165*3#" },
      airtelMoney: { name: "Manifest Kapchorwa Ministry", number: "0750 123456", code: "*185*9#" },
      bank: {
        bankName: "Stanbic Bank Uganda",
        accountName: "Manifest Kapchorwa Ministry",
        accountNumber: "9030012345678",
        branch: "Kapchorwa Branch",
      },
      instructions:
        "When giving via Mobile Money or Bank transfer, please use your Full Name or Phone Number as the reference (e.g. 'Tithe - John Chemutai').",
    };
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Page Header */}
      <div className="text-center space-y-3">
        <Badge variant="clay">Giving & Stewardship</Badge>
        <h1 className="font-heading text-3xl sm:text-5xl font-bold text-neutral-900">
          Partner in God’s Work
        </h1>
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-neutral-600 leading-relaxed">
          “Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver.” (2 Corinthians 9:7)
        </p>
      </div>

      {/* Giving Methods Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* MTN Mobile Money */}
        <Card className="border-t-4 border-t-amber-500 bg-white hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between mb-1">
              <Badge variant="warning">MTN Mobile Money</Badge>
              <Smartphone className="h-5 w-5 text-amber-600" />
            </div>
            <CardTitle className="text-xl">MTN MoMo Giving</CardTitle>
            <CardDescription>Direct mobile payment or merchant code</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="rounded-xl bg-amber-50/70 p-3.5 border border-amber-200/60 space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-neutral-500">Account Name:</span>
                <span className="font-bold text-neutral-900">{givingData.mtnMoMo?.name}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-neutral-500">Phone / MoMo Number:</span>
                <span className="font-bold text-amber-900 font-mono text-sm">{givingData.mtnMoMo?.number}</span>
              </div>
              {givingData.mtnMoMo?.code && (
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-500">Dial Code:</span>
                  <span className="font-semibold text-neutral-800">{givingData.mtnMoMo?.code}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Airtel Money */}
        <Card className="border-t-4 border-t-red-600 bg-white hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between mb-1">
              <Badge variant="destructive">Airtel Money</Badge>
              <Smartphone className="h-5 w-5 text-red-600" />
            </div>
            <CardTitle className="text-xl">Airtel Money Giving</CardTitle>
            <CardDescription>Direct Airtel money transfer</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="rounded-xl bg-red-50/70 p-3.5 border border-red-200/60 space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-neutral-500">Account Name:</span>
                <span className="font-bold text-neutral-900">{givingData.airtelMoney?.name}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-neutral-500">Airtel Number:</span>
                <span className="font-bold text-red-900 font-mono text-sm">{givingData.airtelMoney?.number}</span>
              </div>
              {givingData.airtelMoney?.code && (
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-500">Dial Code:</span>
                  <span className="font-semibold text-neutral-800">{givingData.airtelMoney?.code}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Bank Details */}
        <Card className="md:col-span-2 border-t-4 border-t-highland-800 bg-white hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between mb-1">
              <Badge variant="default">Bank Transfer</Badge>
              <Landmark className="h-5 w-5 text-highland-800" />
            </div>
            <CardTitle className="text-xl">Direct Bank Deposit / Wire Transfer</CardTitle>
            <CardDescription>For tithes, building projects, and mission support</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-neutral-50 p-4 rounded-2xl border border-neutral-200">
              <div>
                <span className="text-xs text-neutral-500 block">Bank Name</span>
                <span className="font-bold text-sm text-neutral-900">{givingData.bank?.bankName}</span>
              </div>
              <div>
                <span className="text-xs text-neutral-500 block">Account Name</span>
                <span className="font-bold text-sm text-neutral-900">{givingData.bank?.accountName}</span>
              </div>
              <div>
                <span className="text-xs text-neutral-500 block">Account Number</span>
                <span className="font-bold text-sm text-highland-900 font-mono">{givingData.bank?.accountNumber}</span>
              </div>
              <div>
                <span className="text-xs text-neutral-500 block">Branch</span>
                <span className="font-bold text-sm text-neutral-900">{givingData.bank?.branch}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Giving Instructions */}
      <div className="rounded-3xl bg-cream-100 border border-cream-200 p-6 sm:p-10 space-y-4">
        <h3 className="font-heading text-lg font-bold text-neutral-900">Giving Reference & Inquiries</h3>
        <p className="text-sm text-neutral-700 leading-relaxed">
          {givingData.instructions}
        </p>
        <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-neutral-600 border-t border-neutral-200/80">
          <span className="flex items-center gap-1.5">
            <Phone className="h-4 w-4 text-highland-700" />
            Treasurer / Finance Office: +256 770 123456
          </span>
          <Link href="/contact" className="font-semibold text-highland-800 hover:underline">
            Visit Church Office →
          </Link>
        </div>
      </div>
    </div>
  );
}
