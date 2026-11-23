"use client";

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Autoplay, Pagination, Navigation } from "swiper/modules";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const paginationStyles = `
  .swiper-pagination-bullet {
    background: #dc2626 !important;
    opacity: 1 !important;
    width: 10px !important;
    height: 10px !important;
  }
  .swiper-pagination-bullet-active {
    background: #dc2626 !important;
    width: 24px !important;
    border-radius: 4px !important;
  }
`;

export default function ProductImagesSlide({ images }) {
  const progressCircle = useRef(null);
  const progressContent = useRef(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const onAutoplayTimeLeft = (s, time, progress) => {
    progressCircle.current?.style?.setProperty("--progress", 1 - progress);
    progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
  };

  return (
    <div className="relative">
      <style>{paginationStyles}</style>
      {/* Custom Prev Button */}
      <button
        ref={prevRef}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white border-3 border-red-600 text-red-600 rounded-full p-2 shadow-md hover:bg-red-600 hover:text-white transition-colors"
      >
        <ChevronLeft size={28} strokeWidth={5} />
      </button>

      {/* Custom Next Button */}
      <button
        ref={nextRef}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white border-3 border-red-600 text-red-600 rounded-full p-2 shadow-md hover:bg-red-600 hover:text-white transition-colors"
      >
        <ChevronRight size={28} strokeWidth={5} />
      </button>

      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        pagination={{
          clickable: true,
        }}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onSwiper={(swiper) => {
          // Re-assign after mount
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
          swiper.navigation.init();
          swiper.navigation.update();
        }}
        modules={[Autoplay, Pagination, Navigation]}
        onAutoplayTimeLeft={onAutoplayTimeLeft}
      >
        <div className="autoplay-progress" slot="container-end">
          <span ref={progressContent}></span>
        </div>
        {images.map((image) => (
          <SwiperSlide key={image.id} className="h-auto!">
            <div className="w-full h-62.5 md:h-100 lg:h-auto">
              <Image
                width={1000}
                height={1000}
                src={image.url}
                alt="Loan Banner"
                className="rounded-xl shadow-xl object-cover w-full h-full"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
