import { Loader } from '@/components/loader'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { APPOINTMENT_TIME_SLOTS } from '@/constants/timeslots'
import { cn } from '@/lib/utils'
import React from 'react'
import { FieldValues, UseFormRegister } from 'react-hook-form'

type Props = {
  date: Date | undefined
  onBooking: React.Dispatch<React.SetStateAction<Date | undefined>>
  onBack(): void
  register: UseFormRegister<FieldValues>
  onSlot(slot: string): void
  currentSlot?: string
  loading: boolean
  bookings:
    | {
        date: Date
        slot: string
      }[]
    | undefined
}

const BookAppointmentDate = ({
  date,
  onBooking,
  onBack,
  register,
  onSlot,
  currentSlot,
  loading,
  bookings,
}: Props) => {
  return (
    <div className="flex flex-col gap-5 justify-center">
      <div className="flex justify-center">
        <h2 className="text-4xl font-bold mb-5">Book a meeting</h2>
      </div>
      <div className="flex gap-10 flex-col sm:flex-row">
        <div className="w-[300px]">
          <h6>Discovery Call</h6>
          <CardDescription>
            During this call, we aim to explore potential avenues for
            partnership, promotional opportunities, or any other means through
            which we can contribute to the success of your company.
          </CardDescription>
        </div>
        <div>
          <Calendar
            mode="single"
            selected={date}
            onSelect={onBooking}
            className="rounded-md border"
          />
        </div>
        <div className="flex flex-col gap-5">
          {APPOINTMENT_TIME_SLOTS.map((slot, key) => (
            <Label
              htmlFor={`slot-${key}`}
              key={key}
            >
              <Card
                onClick={() => onSlot(slot.slot)}
                className={cn(
                  currentSlot == slot.slot ? 'bg-grandis' : 'bg-peach',
                  'px-10 py-4',
                  bookings &&
                    bookings.some(
                      (booking) =>
                        `${booking.date.getDate()}/${booking.date.getMonth()}` ===
                          `${date?.getDate()}/${date?.getMonth()}` &&
                        booking.slot == slot.slot
                    )
                    ? 'bg-gray-300'
                    : 'cursor-pointer border-orange hover:bg-grandis transition duration-150 ease-in-out'
                )}
              >
                <Input
                  {...(bookings &&
                  bookings.some(
                    (booking) =>
                      booking.date == date && booking.slot == slot.slot
                  )
                    ? {
                        disabled: true,
                      }
                    : {
                        disabled: false,
                      })}
                  className="hidden"
                  type="radio"
                  value={slot.slot}
                  {...register('slot')}
                  id={`slot-${key}`}
                />
                {slot.slot}
              </Card>
            </Label>
          ))}
        </div>
      </div>
      <div className="flex gap-5 justify-center mt-5">
        <Button
          type="button"
          onClick={onBack}
          variant={'outline'}
        >
          Edit Questions?
        </Button>
        <Button>
          <Loader loading={loading}>Book Now</Loader>
        </Button>
      </div>
    </div>
  )
}

export default BookAppointmentDate
