import React from 'react'
import { Label } from '../ui/label'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardTitle } from '../ui/card'
import { Input } from '../ui/input'

type Props = {
  title: string
  description: string
  price: string
  onPayment(payment: string): void
  payment: string
  id: string
}

const SubscriptionCard = ({
  title,
  description,
  price,
  onPayment,
  payment,
  id,
}: Props) => {
  return (
    <Label htmlFor={id}>
      <Card
        className={cn(
          'w-full cursor-pointer',
          payment == id && 'border-orange'
        )}
      >
        <CardContent className="flex justify-between p-2">
          <div className="flex items-center gap-3">
            <Card className={cn('flex justify-center p-3 border-none')}>
              <CardTitle>${price}</CardTitle>
            </Card>
            <div className="">
              <CardDescription className="font-bold">{title}</CardDescription>
              <CardDescription className="font-light">
                {description}
              </CardDescription>
            </div>
          </div>
          <div>
            <div
              className={cn(
                'w-4 h-4 rounded-full',
                payment == id ? 'bg-peach' : 'bg-platinum'
              )}
            />
            <Input
              onClick={() => onPayment(title)}
              value={id}
              id={id}
              className="hidden"
              type="radio"
            />
          </div>
        </CardContent>
      </Card>
    </Label>
  )
}

export default SubscriptionCard
