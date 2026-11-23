"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const MIN_ZOOM = 50;
const MAX_ZOOM = 300;
const ZOOM_STEP = 25;

const pad = (n) => String(n).padStart(2, "0");

// Shared style for the round red-600 icon buttons (arrows + close)
const roundBtn =
  "h-12 w-12 rounded-full border-3 border-red-600 bg-white text-red-600 transition hover:bg-red-600 hover:text-white cursor-pointer";

export default function ProductImage({ images = [] }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState(100);

  const total = images.length;

  const openAt = (i) => {
    setIndex(i);
    setZoom(100);
    setOpen(true);
  };

  const goTo = (i) => {
    setIndex((i + total) % total);
    setZoom(100);
  };

  const zoomIn = () => setZoom((z) => Math.min(z + ZOOM_STEP, MAX_ZOOM));
  const zoomOut = () => setZoom((z) => Math.max(z - ZOOM_STEP, MIN_ZOOM));

  if (total === 0) return null;

  const current = images[index];

  // Split the flat array into pairs: [front, back], [front, back], ...
  const groups = Array.from({ length: Math.ceil(total / 2) }, (_, i) =>
    images.slice(i * 2, i * 2 + 2),
  );

  return (
    <>
      {/* Groups: each group = front (top) + back (bottom) */}
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((group, g) => (
          <div
            key={g}
            className="flex flex-col gap-3 rounded-3xl border-2 border-slate-200 bg-white p-4 transition duration-300 hover:border-red-500"
          >
            {group.map((image, j) => (
              <button
                key={image.id}
                type="button"
                onClick={() => openAt(g * 2 + j)}
                className="group relative overflow-hidden rounded-2xl border bg-slate-50 p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
              >
                <span className="absolute left-3 top-3 z-10 rounded-full border bg-white px-3 py-0.5 text-xs font-bold uppercase tracking-wide text-slate-800 shadow-sm">
                  {j === 0 ? "Front" : "Back"}
                </span>
                <div className="flex aspect-4/5 items-center justify-center overflow-hidden rounded-xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.url}
                    alt={`${j === 0 ? "Front" : "Back"} view ${g + 1}`}
                    className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
                  />
                </div>
              </button>
            ))}
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="flex h-screen w-screen max-w-full  flex-col items-center justify-center gap-0 rounded-none border-0 bg-white/70 p-0 backdrop-blur-xl sm:max-w-none [&>button]:hidden  z-999">
          <DialogTitle className="sr-only">Product image preview</DialogTitle>

          {/* Counter */}
          <div className="absolute right-24 top-6 rounded-full bg-slate-900 px-3 py-1 font-mono text-xs font-semibold text-white">
            {pad(index + 1)} / {pad(total)}
          </div>

          <div className="contents">
            {/* Close */}
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={() => setOpen(false)}
              className={`absolute right-6 top-4 ${roundBtn}`}
              aria-label="Close"
            >
              <X strokeWidth={3} className="h-6 w-6" />
            </Button>

            {/* Previous */}
            {total > 1 && (
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => goTo(index - 1)}
                className={`absolute left-6 top-1/2 -translate-y-1/2 ${roundBtn}`}
                aria-label="Previous image"
              >
                <ChevronLeft strokeWidth={3} className="h-7 w-7" />
              </Button>
            )}
          </div>

          {/* Main image */}
          <div className="flex h-[75vh] w-full items-center justify-center overflow-auto px-24 pt-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={current.url}
              alt={`Product image ${index + 1}`}
              style={{ transform: `scale(${zoom / 100})` }}
              className="max-h-full max-w-full rounded-2xl bg-white object-contain transition-transform duration-200"
            />
          </div>

          <div className="contents">
            {/* Next */}
            {total > 1 && (
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => goTo(index + 1)}
                className={`absolute right-6 top-1/2 -translate-y-1/2 ${roundBtn}`}
                aria-label="Next image"
              >
                <ChevronRight strokeWidth={3} className="h-7 w-7" />
              </Button>
            )}
          </div>

          {/* Zoom controls */}
          <div className="mt-4 flex items-center gap-1 rounded-full border bg-white px-3 py-2 text-slate-900">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={zoomOut}
              disabled={zoom <= MIN_ZOOM}
              className="h-8 w-8 rounded-full text-red-600 hover:bg-red-50 hover:text-red-600"
              aria-label="Zoom out"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="w-14 text-center font-mono text-xs font-semibold">
              {zoom}%
            </span>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={zoomIn}
              disabled={zoom >= MAX_ZOOM}
              className="h-8 w-8 rounded-full text-red-600 hover:bg-red-50 hover:text-red-600"
              aria-label="Zoom in"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>

          {/* Thumbnails */}
          <div className="mb-6 mt-3 flex max-w-[90vw] items-center gap-2 overflow-x-auto rounded-xl border bg-white p-2">
            {images.map((image, i) => (
              <button
                key={image.id}
                type="button"
                onClick={() => goTo(i)}
                className={`h-14 w-12 shrink-0 overflow-hidden rounded-md border-2 bg-white transition ${
                  i === index
                    ? "border-red-600 opacity-100"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
                aria-label={`Go to image ${i + 1}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.url}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
