'use client';

import React from "react";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";

// Define el tipo de tour según tu modelo de datos
export interface Tour {
  id: string;
  name: string;
  image: string;
  price: number;
  rating: number;
  reviewCount: number;
  location: string;
}

interface TourCarouselProps {
  tours: Tour[];
}

const TourCarousel: React.FC<TourCarouselProps> = ({ tours }) => {
  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    slides: { perView: 3, spacing: 16 },
    breakpoints: {
      "(max-width: 1024px)": { slides: { perView: 2, spacing: 12 } },
      "(max-width: 640px)": { slides: { perView: 1, spacing: 8 } },
    },
    loop: true,
  });

  return (
    <div className="w-full">
      <div ref={sliderRef} className="keen-slider">
        {tours.map((tour) => (
          <div key={tour.id} className="keen-slider__slide bg-white rounded-lg shadow p-4 flex flex-col">
            <img
              src={tour.images.imgAlbum}
              alt={tour.name}
              className="w-full h-48 object-cover rounded-md mb-3"
            />
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">{tour.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{tour.location}</p>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${i < tour.rating ? "text-yellow-400" : "text-gray-300"}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.388-2.46a1 1 0 00-1.175 0l-3.388 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.045 9.394c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.967z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-xs text-gray-500">({tour.reviewCount})</span>
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xl font-bold text-green-600">${tour.price}</span>
                <a href={`/tour/${tour.id}`} className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">Ver más</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TourCarousel;
