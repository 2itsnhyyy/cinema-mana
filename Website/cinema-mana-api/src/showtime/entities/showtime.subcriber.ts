import { EntitySubscriberInterface, EventSubscriber } from 'typeorm';
import { Showtime } from './showtime.entity';
import { ShowtimeStatus } from '../../shared/enum';

@EventSubscriber()
export class ShowtimeSubscriber implements EntitySubscriberInterface<Showtime> {
  listenTo() {
    return Showtime;
  }

  async afterLoad(showtime: Showtime): Promise<void> {
    let now = new Date();
    if (showtime.startTime > now) {
      showtime.status = ShowtimeStatus.NEW;
    } else if (showtime.startTime <= now && showtime.endTime >= now) {
      showtime.status = ShowtimeStatus.PLAYING;
    } else {
      showtime.status = ShowtimeStatus.ENDED;
    }
  }
}
