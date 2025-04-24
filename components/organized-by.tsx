import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface OrganizedByProps {
  id: string,
  name: string
  memberSince: string
  avatar: string
}

export function OrganizedBy({id, name, memberSince, avatar }: OrganizedByProps) {
  return (
    <Card className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium text-gray-900 dark:text-gray-100">Organizado por:</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3">
            <a href={`/supplier/${id}`} className="relative w-12 h-12 shrink-0">
            <Image
              src={avatar}
              alt={name}
              fill
              sizes="100vw"
              style={{ objectFit: 'cover' }}
              className="rounded-full object-cover border border-gray-200 dark:border-zinc-700"
            />
            </a>
            <div>
            <a href={`/supplier/${id}`} className="font-medium hover:underline text-gray-900 dark:text-gray-100">
              {name}
            </a>
            <div className="text-sm text-gray-500 dark:text-gray-300">Asociado Ketzal desde:{' '}
              {
                new Date(memberSince).toLocaleDateString("es-MX", {
                  year: "numeric",
                  month: "short",
                  day: "2-digit",
                })
              }
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

