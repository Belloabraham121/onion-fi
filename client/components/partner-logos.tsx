import Image from "next/image"

export function PartnerLogos() {
  const partners = [
    { name: "Uniswap", logo: "https://icons.llamao.fi/icons/protocols/uniswap?w=32&h=32" },
    { name: "Aave", logo: "https://icons.llamao.fi/icons/protocols/aave?w=32&h=32" },
    { name: "Compound", logo: "https://icons.llamao.fi/icons/protocols/compound?w=32&h=32" },
    { name: "Curve", logo: "https://icons.llamao.fi/icons/protocols/curve?w=32&h=32" },
    { name: "Yearn", logo: "https://icons.llamao.fi/icons/protocols/yearn?w=32&h=32" },
    { name: "Convex", logo: "https://icons.llamao.fi/icons/protocols/convex?w=32&h=32" },
    { name: "1inch", logo: "https://icons.llamao.fi/icons/protocols/1inch?w=32&h=32" },
    { name: "Balancer", logo: "https://icons.llamao.fi/icons/protocols/balancer?w=32&h=32" },
  ]

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
