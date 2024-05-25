'use client'
import React from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { useStripeCustomer } from '@/hooks/billing/use-billing'
import { Loader } from '@/components/loader'
import { Card } from '@/components/ui/card'
import { Elements } from '@stripe/react-stripe-js'
import Image from 'next/image'
import { CustomerPaymentForm } from './payment-form'

type Props = {
  onBack(): void
  products?:
    | {
        name: string
        image: string
        price: number
      }[]
    | undefined
  amount?: number
  onNext(): void
  stripeId?: string
}

const PaymentCheckout = ({
  onBack,
  onNext,
  amount,
  products,
  stripeId,
}: Props) => {
  const StripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISH_KEY!,
    {
      stripeAccount: stripeId!,
    }
  )
  const { stripeSecret, loadForm } = useStripeCustomer(amount!, stripeId!)

  return (
    <Loader loading={loadForm}>
      <div className="flex flex-col gap-5 justify-center">
        <div className="flex justify-center">
          <h2 className="text-4xl font-bold mb-5">Payment</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="col-span-1 border-r-2 pr-5 flex flex-col">
            <h2 className="text-3xl font-bold mb-5">${amount}</h2>
            {products &&
              products.map((product, key) => (
                <Card
                  key={key}
                  className="w-full flex gap-2 p-3"
                >
                  <div className="w-2/12 aspect-square relative">
                    <Image
                      src={`https://ucarecdn.com/${product.image}/`}
                      alt="product"
                      fill
                    />
                  </div>
                  <div className="flex-1 flex justify-between">
                    <p className="text-xl font-semibold">{product.name}</p>
                    <p className="text-2xl font-bold">${product.price}</p>
                  </div>
                </Card>
              ))}
          </div>
          <div className="col-span-1 pl-5">
            {stripeSecret && StripePromise && (
              <Elements
                stripe={StripePromise}
                options={{
                  clientSecret: stripeSecret,
                }}
              >
                <CustomerPaymentForm onNext={onNext} />
              </Elements>
            )}
          </div>
        </div>
      </div>
    </Loader>
  )
}

export default PaymentCheckout
