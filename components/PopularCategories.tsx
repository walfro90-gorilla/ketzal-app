import Image from 'next/image'
import Link from 'next/link'
import { useEffect } from 'react'


// const categories = [
//   { name: 'Playas', image: 'https://picsum.photos/1200/1300', link: '/category/beaches' },
//   { name: 'Ciudades coloniales', image: 'https://picsum.photos/1200/1300', link: '/category/colonial-cities' },
//   { name: 'Ruinas mayas', image: 'https://picsum.photos/1200/1300', link: '/category/mayan-ruins' },
//   { name: 'Ecoturismo', image: 'https://picsum.photos/1200/1300', link: '/category/ecotourism' },
// ]



interface Category {
  name: string;
  image: string;
  link: string;
}

interface PopularCategoriesProps {
  services: unknown[];
  categories: Category[];
}

const PopularCategories = ({ services, categories }: PopularCategoriesProps) => {
  useEffect(() => {
    console.log("Services:", services)
  })


  return (


    <section className="py-16 bg-gray-100 dark:bg-zinc-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-gray-100">Categorías populares</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link key={category.name} href={'/tours'} className="group">
              <div className="relative overflow-hidden rounded-lg shadow-md aspect-square">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  style={{ objectFit: 'cover' }}
                  className="rounded-lg group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 dark:bg-opacity-60 flex items-center justify-center">
                  <h3 className="text-white text-xl font-semibold drop-shadow dark:text-gray-100">{category.name}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>

  )
}

export default PopularCategories

