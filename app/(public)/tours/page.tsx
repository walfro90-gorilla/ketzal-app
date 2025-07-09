'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input, Slider, Rate, Button as AntButton,  Card as AntCard } from 'antd'
import { Card, CardContent } from '@/components/ui/card'
import { getServices } from '@/app/(protected)/services/services.api'
import Link from 'next/link'
import Footer from '@/components/Footer'
import Loader from '@/components/Loader'
import { useLoading } from '@/components/LoadingContext'

const { Search } = Input

interface Tour {
  id: string | number;
  name: string;
  price: number;
  location?: string;
  rating?: number;
  reviewCount?: number;
  description?: string;
  images?: {
    imgBanner?: string;
    [key: string]: string | undefined;
  };
  serviceType?: string;
  // Add more fields as needed
}

export default function TourPage() {
  const [tours, setTours] = useState<Tour[]>([])
  const [search, setSearch] = useState('')
  const [price, setPrice] = useState<[number, number]>([0, 10000])
  const [rating, setRating] = useState(0)
  const [filtered, setFiltered] = useState<Tour[]>([])
  const [pageLoading, setPageLoading] = useState(true)
  const { setLoading } = useLoading();
  const router = useRouter();

  useEffect(() => {
    // Espera a que el DOM esté listo
    if (typeof window !== 'undefined') {
      window.addEventListener('load', () => setPageLoading(false))
      if (document.readyState === 'complete') setPageLoading(false)
    }
    return () => {
      window.removeEventListener('load', () => setPageLoading(false))
    }
  }, [])

  useEffect(() => {
    getServices().then((data) => {
      const onlyTours = data.filter((s: Tour) => s.serviceType === 'tour')
      setTours(onlyTours)
      setFiltered(onlyTours)
      setLoading(false)
    })
  }, [setLoading])

  useEffect(() => {
    let result = tours
    if (search) {
      result = result.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()))
    }
    result = result.filter((t) => t.price >= price[0] && t.price <= price[1])
    if (rating > 0) {
      result = result.filter((t) => (t.rating || 0) >= rating)
    }
    setFiltered(result)
  }, [search, price, rating, tours])

  if (pageLoading) return <Loader />

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900">
      <div className="container mx-auto px-2 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="md:col-span-1">
            <Card className="mb-6 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700">
              <CardContent>
                <div className="mb-6 mt-2">
                  <label htmlFor="tour-search" className="flex items-center gap-2 font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    <svg className="w-5 h-5 text-gray-500 dark:text-gray-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                    Buscar tours
                  </label>
                  <Search
                    id="tour-search"
                    placeholder="Ejemplo: Chichen Itzá, playa, aventura..."
                    allowClear
                    onSearch={setSearch}
                    onChange={e => setSearch(e.target.value)}
                    value={search}
                    className="rounded-md bg-white dark:bg-zinc-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-zinc-700 placeholder-gray-400 dark:placeholder-gray-400 [&_.ant-input]:bg-white [&_.ant-input]:dark:bg-zinc-700 [&_.ant-input]:text-gray-900 [&_.ant-input]:dark:text-gray-100 [&_.ant-input]:placeholder-gray-400 [&_.ant-input]:dark:placeholder-gray-400 [&_.ant-input-affix-wrapper]:bg-white [&_.ant-input-affix-wrapper]:dark:bg-zinc-700 [&_.ant-input-affix-wrapper]:border-gray-300 [&_.ant-input-affix-wrapper]:dark:border-zinc-700 [&_.ant-input-search-button]:bg-gray-100 [&_.ant-input-search-button]:dark:bg-zinc-700 [&_.ant-input-search-button]:text-gray-700 [&_.ant-input-search-button]:dark:text-gray-100 [&_.anticon-search]:text-gray-500 [&_.anticon-search]:dark:text-gray-300"
                    style={{
                      backgroundColor: undefined,
                      color: undefined,
                      border: undefined,
                      borderRadius: undefined,
                    }}
                  />
                </div>
                <div className="mb-6">
                  <div className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Precio</div>
                  <Slider
                    range
                    min={0}
                    max={10000}
                    step={100}
                    value={price}
                    onChange={value => {
                      if (Array.isArray(value) && value.length === 2) setPrice([value[0], value[1]]);
                    }}
                    marks={{ 0: <span className="text-gray-700 dark:text-gray-200">$0</span>, 10000: <span className="text-gray-700 dark:text-gray-200">$10k</span> }}
                  />
                </div>
                <div className="mb-6">
                  <div className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Calificación mínima</div>
                  <Rate value={rating} onChange={setRating} allowClear />
                </div>
                {/* Puedes agregar más filtros aquí (tipo, duración, etc) */}
              </CardContent>
            </Card>
          </div>
          {/* Tour List */}
          <div className="md:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.length === 0 && (
                <div className="col-span-full text-center text-gray-500 dark:text-gray-400">No se encontraron tours.</div>
              )}
              {filtered.map((tour) => (
                <AntCard
                  key={tour.id}
                  hoverable
                  cover={tour.images?.imgBanner ? (
                  <img
                    alt={tour.name}
                    src={tour.images.imgBanner}
                    className="h-56 w-full object-cover"
                  />
                  ) : null}
                  className="overflow-hidden shadow border-0 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100"
                  styles={{ body: { background: 'inherit', color: 'inherit' } }}
                  onClick={() => {
                    setLoading(true);
                    router.push(`/tours/${tour.id}`);
                  }}
                >
                  <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-lg line-clamp-1 text-gray-900 dark:text-gray-100">{tour.name}</span>
                    <span className="text-green-600 dark:text-green-400 font-semibold text-lg">${tour.price}</span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-300 line-clamp-2 mb-1">{tour.location}</div>
                  <div className="flex items-center gap-2 mb-1">
                    <Rate disabled value={tour.rating || 0} />
                    <span className="text-xs text-gray-400 dark:text-gray-500">({tour.reviewCount || 0})</span>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 mb-2">{tour.description}</div>
                  <Link href={`/tours/${tour.id}`} className="block">
                    <AntButton type="primary" className="w-full" onClick={(e) => { e.stopPropagation(); setLoading(true); }}>Ver detalles</AntButton>
                  </Link>
                  </div>
                </AntCard>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}