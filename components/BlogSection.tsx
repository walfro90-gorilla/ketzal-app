import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from "@/components/ui/card"
import { Clock } from 'lucide-react'

const blogPosts = [
  {
    title: 'Exclusive Riding Service Experience',
    excerpt: 'This came with one of the most required and demanding one-way cab services for customers who frequen...',
    image: '/placeholder.svg',
    timeAgo: '3 years ago',
    link: '/blog/exclusive-riding-service'
  },
  {
    title: 'America National Parks with Denver',
    excerpt: 'The Datai Langkawi is situated on the northwest tip of the island Langkawi in Malaysia. Located in a...',
    image: '/placeholder.svg',
    timeAgo: '4 years ago',
    link: '/blog/america-national-parks'
  },
  {
    title: 'Morning in the Northern sea',
    excerpt: 'The North Sea is a sea of the Atlantic Ocean between Great Britain (specifically England and Scotlan...',
    image: '/placeholder.svg',
    timeAgo: '4 years ago',
    link: '/blog/northern-sea'
  }
]

const BlogSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-700 mb-4">Our Latest Blog</h2>
          <p className="text-gray-600">Here is what people say about bookpro</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {blogPosts.map((post, index) => (
            <Card key={index} className="overflow-hidden group">
              <Link href={post.link}>
                <CardContent className="p-0">
                  {/* Image Container */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      style={{ objectFit: 'cover' }}
                      className="transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Clock className="h-4 w-4 mr-2" />
                      {post.timeAgo}
                    </div>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link 
            href="/blog" 
            className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center"
          >
            View All
          </Link>
        </div>
      </div>
    </section>
  )
}

export default BlogSection

