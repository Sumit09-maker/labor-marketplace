"use client";

import { Star } from "lucide-react";

export function StarDisplay({
  value,
  size = "h-4 w-4",
  className = "",
}: {
  value: number;
  size?: string;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-0.5 ${className}`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`${size} ${
            i <= Math.round(value)
              ? "fill-amber-400 text-amber-400"
              : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
    </span>
  );
}

export function StarInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          className="transition-transform hover:scale-125 focus:outline-none"
          aria-label={`${i} star`}
        >
          <Star
            className={`h-8 w-8 ${
              i <= value ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
}
