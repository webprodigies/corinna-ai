'use client'
import { useChatTime } from '@/hooks/conversation/use-conversation'
import React from 'react'
import { Card, CardContent, CardDescription } from '../ui/card'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { User } from 'lucide-react'
import { UrgentIcon } from '@/icons/urgent-icon'

type Props = {
  title: string
  description?: string
  createdAt: Date
  id: string
  onChat(): void
  seen?: boolean
}

const ChatCard = ({
  title,
  description,
  createdAt,
  onChat,
  id,
  seen,
}: Props) => {
  const { messageSentAt, urgent } = useChatTime(createdAt, id)

  return (
    <Card
      onClick={onChat}
      className="rounded-none border-r-0 hover:bg-muted cursor-pointer transition duration-150 ease-in-out"
    >
      <CardContent className="py-4 flex gap-3">
        <div>
          <Avatar>
            <AvatarFallback className="bg-muted">
              <User />
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex justify-between w-full">
          <div>
            <div className="flex gap-5 items-center">
              <CardDescription className="font-bold leading-none text-gray-600">
                {title}
              </CardDescription>
              {urgent && !seen && <UrgentIcon />}
            </div>
            <CardDescription>
              {description
                ? description.substring(0, 20) + '...'
                : 'This chatroom is empty'}
            </CardDescription>
          </div>
          <div className="w-[100px] flex justify-end">
            <CardDescription className="text-xs">
              {createdAt ? messageSentAt : ''}
            </CardDescription>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ChatCard
