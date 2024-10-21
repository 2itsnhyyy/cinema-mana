import { EntitySubscriberInterface, EventSubscriber } from 'typeorm';
import { Seat } from './seat.entity';
import { ShowtimeSeat } from '../../showtime-seat/entities/showtime-seat.entity';

@EventSubscriber()
export class SeatSubscriber implements EntitySubscriberInterface<Seat> {
  listenTo() {
    return Seat;
  }

  async afterLoad(seat: Seat): Promise<void> {
    seat.row = seat.seatNumber[0];
    seat.number = parseInt(seat.seatNumber.slice(1));
  }
}
