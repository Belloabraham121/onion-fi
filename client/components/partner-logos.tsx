"use client";

import Image from "next/image"
import { useState, useEffect } from "react"

interface Partner {
  name: string;
  logo: string;
}

export function PartnerLogos() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await fetch('/api/protocols');
        if (response.ok) {
          const data = await response.json();
          // Take first 8 protocols and format them as partners
          const formattedPartners = data.protocols.slice(0, 8).map((protocol: any) => ({
            name: protocol.name,
            logo: protocol.logo || `https://icons.llamao.fi/icons/protocols/${protocol.slug || protocol.name.toLowerCase()}?w=32&h=32`
          }));
          setPartners(formattedPartners);
        } else {
          // Fallback to hardcoded partners if API fails
          setPartners([
            { name: "Uniswap", logo: "https://icons.llamao.fi/icons/protocols/uniswap?w=32&h=32" },
            { name: "Aave", logo: "https://icons.llamao.fi/icons/protocols/aave?w=32&h=32" },
            { name: "Compound", logo: "https://icons.llamao.fi/icons/protocols/compound?w=32&h=32" },
            { name: "Curve", logo: "https://icons.llamao.fi/icons/protocols/curve?w=32&h=32" },
            { name: "Yearn", logo: "https://icons.llamao.fi/icons/protocols/yearn?w=32&h=32" },
            { name: "Convex", logo: "https://icons.llamao.fi/icons/protocols/convex?w=32&h=32" },
            { name: "1inch", logo: "https://icons.llamao.fi/icons/protocols/1inch?w=32&h=32" },
            { name: "Balancer", logo: "https://icons.llamao.fi/icons/protocols/balancer?w=32&h=32" },
          ]);
        }
      } catch (error) {
        console.error('Failed to fetch partners:', error);
        // Fallback to hardcoded partners
        setPartners([
          { name: "Uniswap", logo: "https://icons.llamao.fi/icons/protocols/uniswap?w=32&h=32" },
          { name: "Aave", logo: "https://icons.llamao.fi/icons/protocols/aave?w=32&h=32" },
          { name: "Compound", logo: "https://icons.llamao.fi/icons/protocols/compound?w=32&h=32" },
          { name: "Curve", logo: "https://icons.llamao.fi/icons/protocols/curve?w=32&h=32" },
          { name: "Yearn", logo: "https://icons.llamao.fi/icons/protocols/yearn?w=32&h=32" },
          { name: "Convex", logo: "https://icons.llamao.fi/icons/protocols/convex?w=32&h=32" },
          { name: "1inch", logo: "https://icons.llamao.fi/icons/protocols/1inch?w=32&h=32" },
          { name: "Balancer", logo: "https://icons.llamao.fi/icons/protocols/balancer?w=32&h=32" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto mb-20">
        <div className="flex items-center justify-center gap-8 md:gap-12 lg:gap-16 flex-wrap opacity-60">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="flex items-center gap-2 text-white animate-pulse">
              <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
              <div className="w-16 h-4 bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto mb-20">
      <div className="flex items-center justify-center gap-8 md:gap-12 lg:gap-16 flex-wrap opacity-60">
        {partners.map((partner) => (
          <div key={partner.name} className="flex items-center gap-2 text-white">
            <Image
              src={partner.logo}
              alt={`${partner.name} logo`}
              width={32}
              height={32}
              className="rounded-full"
            />
            <span className="font-semibold">{partner.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
