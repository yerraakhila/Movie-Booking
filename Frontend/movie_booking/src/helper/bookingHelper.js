function calculateSeatCost(booking) {
  return booking.seats
    ? booking.seats.reduce((acc, seat) => acc + seat.cost, 0)
    : 0;
}

export function calculateTotal(booking) {
  const seats_cost = calculateSeatCost(booking);
  const gst = seats_cost * 0.18;
  const convenience = 50;
  return seats_cost + gst + convenience;
}
