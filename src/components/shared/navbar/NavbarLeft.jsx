import Image from "next/image";
import Link from "next/link";

export default function NavbarLeft() {
  return (
    <Link href="/" className="flex items-center shrink-0 gap-2">
      <div className="w-11 h-11 relative shrink-0">
        <Image
          src="/img/logo.png"
          alt="BITSS Logo"
          width={44}
          height={44}
          priority
          fetchPriority="high"
          loading="eager"
          className="w-full h-full object-contain"
        />
      </div>
      <span className="font-['Outfit'] text-[21px] font-black text-slate-900 tracking-tight leading-none shrink-0">
        BITSS
      </span>
    </Link>
  );
}
