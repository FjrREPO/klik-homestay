'use client'
import { Range } from "react-date-range"

import Button from "../button"
import Calendar from "../inputs/calendar"

interface ListingReservationProps {
  price: number
  dateRange: Range
  totalPrice: number
  onChangeDate: (value: Range) => void
  disabled?: boolean
  disabledDates: Date[]
  onSubmit: () => void
}

const ListingReservation: React.FC<ListingReservationProps> = ({
  price,
  dateRange,
  totalPrice,
  onChangeDate,
  disabled,
  disabledDates,
  onSubmit,
}) => {
  const formattedPrice = price.toLocaleString('id-ID');
  const formattedTotalPrice = totalPrice.toLocaleString('id-ID');

  return (
    <div
      className=" bg-white rounded-xl border-[1px] border-neutral-200 overflow-hidden">
      <div className="flex flex-row items-center gap-1 p-4">
        <div className="text-2xl font-semibold">
          Rp {formattedPrice}
        </div>
        <div className="font-light text-neutral-600">
          malam
        </div>
      </div>
      <hr />
      <Calendar
        value={dateRange}
        disabledDates={disabledDates}
        onChange={(value) =>
          onChangeDate(value.selection)}
      />
      <hr />
      <div className="p-4">
        <Button
          disabled={disabled} 
          label="Reservasi" 
          onClick={onSubmit}
        />
      </div>
      <hr />
      <div
        className="p-4 flex flex-row items-center justify-between font-semibold text-lg">
        <div>
          Total
        </div>
        <div>
          Rp {formattedTotalPrice}
        </div>
      </div>
    </div>
  )
}

export default ListingReservation
