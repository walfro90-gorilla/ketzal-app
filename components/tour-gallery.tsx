'use client'

import { useState } from 'react'
import Image from 'next/image'
import '../styles/tour-gallery.css'
import { Carousel } from 'antd'

// type ViewOption = 'photos' | 'video' | 'map'

export function TourGallery({ images }: { images: string[] }) {
  // Filtrar imágenes inválidas
  const validImages = images.filter((img) => typeof img === 'string' && img.length > 0)
  const [mainImage, setMainImage] = useState(validImages[0] || '')
  // const [activeView, setActiveView] = useState<ViewOption>('photos')

  // const handleViewChange = (view: ViewOption) => {
  //   setActiveView(view)
  //   // For now, we'll just show the first image when switching views
  //   // In a real app, you would show different content based on the view
  //   setMainImage(images[0])
  // }

  return (
    <div>
      <div className="gallery-container">
        {mainImage ? (
          <Image
            src={mainImage}
            alt="Tour main image"
            fill
            className="gallery-main-image"
            priority
          />
        ) : (
          <div className="gallery-main-image bg-gray-200 flex items-center justify-center">Sin imagen</div>
        )}
      </div>
{/* 
      <div className="gallery-options">
        <button
          className={`gallery-option ${activeView === 'photos' ? 'active' : ''}`}
          onClick={() => handleViewChange('photos')}
        >
          Photos
        </button>
        <button
          className={`gallery-option ${activeView === 'video' ? 'active' : ''}`}
          onClick={() => handleViewChange('video')}
        >
          Video
        </button>
        <button
          className={`gallery-option ${activeView === 'map' ? 'active' : ''}`}
          onClick={() => handleViewChange('map')}
        >
          Map View
        </button>
      </div> */}


      <Carousel autoplay className="gallery-thumbnails" dots={true} slidesToShow={4} slidesToScroll={1}>
        {validImages.map((image, index) => (
              <div
              key={index}
              className={`gallery-thumbnail ${mainImage === image ? 'active' : ''}`}
              onClick={() => setMainImage(image)}
              style={{ margin: '0 5px', width: '80px', height: '80px' }}
              >
              <Image
                src={image}
                alt={`Tour image ${index + 1}`}
                fill
                className="object-cover"
              />
              </div>
        ))}
      </Carousel>
    </div>
  )
}

