import Tag from "@/components/ui/tag";
import { TESTIMONIALS } from "@/data/home/data";

export default function Testimonials() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="text-center mb-10 sm:mb-14">
          <Tag>Customer Stories</Tag>
          <h2
            className="font-['Barlow_Condensed'] font-black text-slate-900 mt-4 leading-none"
            style={{ fontSize: "clamp(26px,4vw,50px)" }}
          >
            TRUSTED BY <span className="text-red-600">BUSINESSES</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="bg-slate-50 rounded-2xl p-5 sm:p-7 border border-slate-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="font-['Barlow_Condensed'] text-5xl sm:text-6xl text-red-100 font-black leading-none mb-2 sm:mb-3">
                &ldquo;
              </div>
              <p className="text-slate-600 text-[13px] sm:text-[14px] leading-relaxed mb-5 sm:mb-6 italic">
                &ldquo;{t.q}&ldquo;
              </p>
              <div className="flex items-center gap-3 pt-3 sm:pt-4 border-t border-slate-200">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-black text-[10px] sm:text-[11px] font-['Barlow_Condensed'] shrink-0">
                  {t.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div>
                  <div className="text-slate-800 text-[13px] font-semibold">
                    {t.name}
                  </div>
                  <div className="text-slate-400 text-[11px]">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
