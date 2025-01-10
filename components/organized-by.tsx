import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface OrganizedByProps {
  name: string
  memberSince: string
  avatar: string
}

export function OrganizedBy({ name, memberSince, avatar }: OrganizedByProps) {
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">Organized by</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12">
            <Image
              src={avatar}
              alt={name}
              fill
              className="rounded-full object-cover"
            />
          </div>
          <div>
            <div className="font-medium">{name}</div>
            <div className="text-sm text-gray-500">Member Since {memberSince}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

