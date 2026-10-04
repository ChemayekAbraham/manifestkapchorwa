"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ShoppingBag,
  ExternalLink,
  MessageCircle,
  Search,
  Sparkles,
  MapPin,
  Check,
  Truck,
  ShieldCheck,
  X,
  Plus,
  Minus,
} from "lucide-react";

export interface ProductItem {
  id: string;
  name: string;
  category: "T-Shirts" | "Caps" | "Hoodies & Jumpers" | "Accessories";
  priceUGX: number;
  formattedPrice: string;
  imageUrl: string;
  description: string;
  colors: string[];
  sizes: string[];
  featured?: boolean;
  distributionUrl: string;
}

export const MERCHANDISE_PRODUCTS: ProductItem[] = [
  {
    id: "classic-tshirt",
    name: "Classic Phaneroo T-Shirt",
    category: "T-Shirts",
    priceUGX: 30000,
    formattedPrice: "UGX 30,000",
    imageUrl: "https://distribution.phaneroo.org/wp-content/uploads/2026/04/Classic-Tshirt-clear-scaled-e1777383078364-310x310.png",
    description: "Official Phaneroo unisex classic crewneck tee with premium screen printed branding. Lightweight, breathable 100% combed cotton.",
    colors: ["Black", "White", "Navy Blue"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    featured: true,
    distributionUrl: "https://distribution.phaneroo.org/product/classic-t-shirt/",
  },
  {
    id: "anomaly-of-grace-tshirt",
    name: "The Anomaly of Grace T-Shirt",
    category: "T-Shirts",
    priceUGX: 30000,
    formattedPrice: "UGX 30,000",
    imageUrl: "https://distribution.phaneroo.org/wp-content/uploads/2026/04/The-Anomaly-of-Grace-clear-scaled-e1778132745643-310x310.png",
    description: "Special edition 'The Anomaly of Grace' inspirational tee celebrating God's supernatural favor and the manifestation of sons of God.",
    colors: ["White", "Black", "Charcoal"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    featured: true,
    distributionUrl: "https://distribution.phaneroo.org/product/anomaly-of-grace/",
  },
  {
    id: "phaneroo-cap",
    name: "Phaneroo Signature Embroidered Cap",
    category: "Caps",
    priceUGX: 15000,
    formattedPrice: "UGX 15,000",
    imageUrl: "https://distribution.phaneroo.org/wp-content/uploads/2026/05/Cap-15k-Photoroom-e1778312722457-310x310.png",
    description: "Structured cotton twill cap with high-density embroidered 3D Phaneroo emblem and adjustable metal buckle strap.",
    colors: ["Black", "White", "Dark Green", "Navy"],
    sizes: ["Adjustable (One Size)"],
    featured: true,
    distributionUrl: "https://distribution.phaneroo.org/product/cap-2/",
  },
  {
    id: "phaneroo-jumpers",
    name: "Phaneroo Premium Fleece Jumper / Hoodie",
    category: "Hoodies & Jumpers",
    priceUGX: 60000,
    formattedPrice: "UGX 60,000",
    imageUrl: "https://distribution.phaneroo.org/wp-content/uploads/2026/04/Jumpers-60k-Photoroom1-310x310.png",
    description: "Heavyweight brushed fleece hoodie tailored for cold highland mornings in Kapchorwa and evening overnight prayer assemblies.",
    colors: ["Jet Black", "Heather Grey", "Forest Green"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    featured: true,
    distributionUrl: "https://distribution.phaneroo.org/product/jumpers/",
  },
  {
    id: "mgp-jacket",
    name: "MGP (My Great Price) Athletic Jacket",
    category: "Hoodies & Jumpers",
    priceUGX: 65000,
    formattedPrice: "UGX 65,000",
    imageUrl: "https://distribution.phaneroo.org/wp-content/uploads/2026/05/MGP-Jacket-65k-Photoroom.png",
    description: "Full-zip athletic bomber track jacket with premium My Great Price gold insignia, comfortable ribbed trims, and zippered pockets.",
    colors: ["Navy & Gold", "Classic Black"],
    sizes: ["M", "L", "XL", "XXL"],
    featured: true,
    distributionUrl: "https://distribution.phaneroo.org/",
  },
  {
    id: "mgp-bag",
    name: "MGP Messenger & Fellowship Bag",
    category: "Accessories",
    priceUGX: 30000,
    formattedPrice: "UGX 30,000",
    imageUrl: "https://distribution.phaneroo.org/wp-content/uploads/2026/05/MGP-Bag-30k-Photoroom-e1777637415651-310x310.png",
    description: "Water-resistant, padded travel shoulder bag with dedicated compartments for Bibles, devotions, notebooks, tablets, and pens.",
    colors: ["Black & Gold", "Navy Blue"],
    sizes: ["One Size"],
    distributionUrl: "https://distribution.phaneroo.org/",
  },
  {
    id: "phaneroo-umbrella",
    name: "Phaneroo Heavy-Duty Windproof Umbrella",
    category: "Accessories",
    priceUGX: 25000,
    formattedPrice: "UGX 25,000",
    imageUrl: "https://distribution.phaneroo.org/wp-content/uploads/2026/05/Umbrellas-25k-Photoroom-310x310.png",
    description: "Double-canopy stormproof umbrella built to withstand strong highland rains and wind with automatic button release.",
    colors: ["Navy / Lime Green", "Black"],
    sizes: ["Large 54-inch Canopy"],
    distributionUrl: "https://distribution.phaneroo.org/",
  },
  {
    id: "kids-mugs",
    name: "Inspirational Scripture Ceramic Mug",
    category: "Accessories",
    priceUGX: 25000,
    formattedPrice: "UGX 25,000",
    imageUrl: "https://distribution.phaneroo.org/wp-content/uploads/2026/05/Kids-Mugs-25k-Photoroom-e1777639375406-310x310.png",
    description: "Glossy ceramic mug with uplifting kingdom scriptures and faith illustrations. Microwave and dishwasher safe.",
    colors: ["Kids Vibrant", "Classic White"],
    sizes: ["350 ml"],
    distributionUrl: "https://distribution.phaneroo.org/",
  },
];

const CATEGORIES = [
  "All Items",
  "T-Shirts",
  "Caps",
  "Hoodies & Jumpers",
  "Accessories",
] as const;

export function MerchandiseClient() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All Items");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeModalProduct, setActiveModalProduct] = useState<ProductItem | null>(null);

  // Modal ordering state
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);

  const filteredProducts = useMemo(() => {
    return MERCHANDISE_PRODUCTS.filter((item) => {
      const matchesCategory =
        selectedCategory === "All Items" || item.category === selectedCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const openOrderModal = (product: ProductItem) => {
    setActiveModalProduct(product);
    setSelectedSize(product.sizes[0] || "");
    setSelectedColor(product.colors[0] || "");
    setQuantity(1);
  };

  const handleWhatsAppOrder = (product: ProductItem) => {
    const totalAmount = product.priceUGX * quantity;
    const text = encodeURIComponent(
      `Praise God! I would like to order merchandise from Manifest Kapchorwa:\n\n` +
        `• Item: ${product.name}\n` +
        `• Category: ${product.category}\n` +
        `• Size: ${selectedSize}\n` +
        `• Color: ${selectedColor}\n` +
        `• Quantity: ${quantity}\n` +
        `• Total: UGX ${totalAmount.toLocaleString()}\n` +
        `• Pickup Point: Joshua Cheptegei Foundation Office, Kapchorwa Town\n\n` +
        `Please confirm availability and payment details. Thank you!`
    );
    window.open(`https://wa.me/256770123456?text=${text}`, "_blank");
  };

  return (
    <div className="space-y-10">
      {/* Search & Category Filter Header Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-neutral-200 shadow-sm">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-highland-800 text-white shadow-sm"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <Input
            placeholder="Search merchandise..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-neutral-50 border-neutral-200 text-xs sm:text-sm h-10"
          />
        </div>
      </div>

      {/* Local Kapchorwa Pickup Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-highland-900 to-highland-800 text-white p-4 sm:p-6 shadow-md border border-highland-700/60 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 shrink-0 rounded-xl bg-highland-700 flex items-center justify-center text-amber-400">
            <MapPin className="h-5 w-5" />
          </div>
          <div className="space-y-0.5 text-center sm:text-left">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
              Local Pickup in Kapchorwa
            </span>
            <p className="text-xs sm:text-sm text-neutral-100">
              Collect ordered merchandise directly at <strong>Joshua Cheptegei Foundation Office</strong>, Kapchorwa Town, or order online directly from <strong>distribution.phaneroo.org</strong>.
            </p>
          </div>
        </div>

        <a
          href="https://distribution.phaneroo.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 px-4 py-2 text-xs font-bold transition-all shadow-md shrink-0"
        >
          <span>Official Distribution Site</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-neutral-200 p-8 space-y-3">
          <ShoppingBag className="h-12 w-12 text-neutral-400 mx-auto" />
          <h3 className="font-heading text-lg font-bold text-neutral-900">No merchandise found</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Try adjusting your search query or select another category filter to explore products.
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSelectedCategory("All Items");
              setSearchQuery("");
            }}
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group rounded-3xl bg-white border border-neutral-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              {/* Image Area */}
              <div
                onClick={() => openOrderModal(product)}
                className="relative aspect-square w-full bg-neutral-50 p-6 flex items-center justify-center overflow-hidden cursor-pointer"
              >
                {product.featured && (
                  <div className="absolute top-3 left-3 z-10">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-neutral-950 shadow-sm">
                      <Sparkles className="h-3 w-3" />
                      Popular
                    </span>
                  </div>
                )}

                <div className="relative w-full h-full group-hover:scale-108 transition-transform duration-300">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-neutral-500 font-medium">
                    <Badge variant="outline" className="text-[10px] px-2 py-0">
                      {product.category}
                    </Badge>
                    <span className="text-highland-700 font-semibold">In Stock</span>
                  </div>
                  <h3
                    onClick={() => openOrderModal(product)}
                    className="font-heading text-base font-bold text-neutral-900 group-hover:text-highland-800 transition-colors cursor-pointer line-clamp-1"
                  >
                    {product.name}
                  </h3>
                  <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block">Price</span>
                    <span className="font-heading text-lg font-black text-highland-900">
                      {product.formattedPrice}
                    </span>
                  </div>

                  <Button
                    size="sm"
                    variant="clay"
                    onClick={() => openOrderModal(product)}
                    className="text-xs font-bold gap-1 shadow-sm"
                  >
                    <ShoppingBag className="h-3.5 w-3.5" />
                    <span>Order</span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Official Distribution Site Showcase Banner */}
      <div className="rounded-3xl bg-neutral-950 text-white p-6 sm:p-10 border border-neutral-800 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl">
        <div className="space-y-3 text-center lg:text-left max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Phaneroo Distribution Store</span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-black text-white">
            Get All Your Official Ministry Items Online
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            Browse the complete online catalog on <strong>distribution.phaneroo.org</strong> — including conference materials, sermon notebooks, Next Gen youth collections, and gift sets delivered worldwide.
          </p>
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-neutral-400 pt-1">
            <span className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-green-400" />
              100% Genuine Merchandise
            </span>
            <span className="flex items-center gap-1.5">
              <Truck className="h-4 w-4 text-green-400" />
              Delivery across Uganda
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-green-400" />
              Secure Mobile Money & Cards
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <a
            href="https://distribution.phaneroo.org/shop/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold px-6 py-3.5 text-sm transition-all shadow-lg hover:shadow-amber-500/20"
          >
            <span>Visit distribution.phaneroo.org</span>
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>

      {/* Product Detail & Order Modal */}
      {activeModalProduct && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setActiveModalProduct(null)}
        >
          <div
            className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-neutral-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setActiveModalProduct(null)}
              className="absolute top-4 right-4 z-10 h-9 w-9 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center transition-colors"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Product Image Area */}
              <div className="relative aspect-square md:aspect-auto md:h-full bg-neutral-50 p-8 flex items-center justify-center border-b md:border-b-0 md:border-r border-neutral-100">
                <div className="relative w-full h-64 sm:h-72">
                  <Image
                    src={activeModalProduct.imageUrl}
                    alt={activeModalProduct.name}
                    fill
                    sizes="400px"
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Product Info & Order Area */}
              <div className="p-6 sm:p-8 space-y-5">
                <div className="space-y-1">
                  <Badge variant="clay" className="text-[10px] font-bold">
                    {activeModalProduct.category}
                  </Badge>
                  <h3 className="font-heading text-xl font-bold text-neutral-900 leading-tight">
                    {activeModalProduct.name}
                  </h3>
                  <div className="pt-1 flex items-baseline gap-2">
                    <span className="font-heading text-2xl font-black text-highland-900">
                      {activeModalProduct.formattedPrice}
                    </span>
                    <span className="text-xs text-neutral-500">each</span>
                  </div>
                </div>

                <p className="text-xs text-neutral-600 leading-relaxed">
                  {activeModalProduct.description}
                </p>

                {/* Size Selector */}
                {activeModalProduct.sizes.length > 0 && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-800 block">
                      Select Size:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {activeModalProduct.sizes.map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => setSelectedSize(sz)}
                          className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-all ${
                            selectedSize === sz
                              ? "bg-highland-800 text-white border-highland-800 shadow-sm"
                              : "bg-white text-neutral-700 border-neutral-300 hover:border-neutral-400"
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Color Selector */}
                {activeModalProduct.colors.length > 0 && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-800 block">
                      Available Color:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {activeModalProduct.colors.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setSelectedColor(c)}
                          className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-all ${
                            selectedColor === c
                              ? "bg-neutral-900 text-white border-neutral-900 shadow-sm"
                              : "bg-white text-neutral-700 border-neutral-300 hover:border-neutral-400"
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-800 block">
                    Quantity:
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-neutral-300 rounded-lg overflow-hidden bg-white">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-2 hover:bg-neutral-100 text-neutral-700 transition-colors"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="px-4 text-xs font-bold text-neutral-900">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-2 hover:bg-neutral-100 text-neutral-700 transition-colors"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <span className="text-xs font-semibold text-neutral-600">
                      Total:{" "}
                      <strong className="text-highland-900">
                        UGX {(activeModalProduct.priceUGX * quantity).toLocaleString()}
                      </strong>
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 space-y-2">
                  <Button
                    onClick={() => handleWhatsAppOrder(activeModalProduct)}
                    className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs sm:text-sm py-2.5 gap-2 shadow-sm"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Order via WhatsApp (Local Pickup)</span>
                  </Button>

                  <a
                    href={activeModalProduct.distributionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-neutral-300 hover:bg-neutral-50 text-xs font-semibold text-neutral-700 transition-colors"
                  >
                    <span>Buy Directly on distribution.phaneroo.org</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>

                <div className="text-[11px] text-neutral-500 text-center">
                  📍 Pickup at Joshua Cheptegei Foundation Office, Kapchorwa Town
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
