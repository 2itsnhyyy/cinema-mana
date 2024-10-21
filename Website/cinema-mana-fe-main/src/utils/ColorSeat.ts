import { SeatStatus, SeatType } from '@/types';

class SeatColorUtils {
  static getSeatBgColorByType(type: SeatType) {
    switch (type) {
      case SeatType.VIP:
        return 'rgba(245, 34, 45, 0.9)';
      case SeatType.ECONOMY:
        return 'rgba(114, 46, 209, 0.9)';
      default:
        return 'black';
    }
  }

  static getSeatBgColor(type: SeatType, status?: SeatStatus) {
    if (!status) {
      return this.getSeatBgColorByType(type);
    }

    switch (status) {
      case SeatStatus.AVAILABLE:
        return type === SeatType.VIP ? 'rgba(245, 34, 45, 0.9)' : 'rgba(114, 46, 209, 0.9)';
      case SeatStatus.BOOKED:
        return 'rgba(64,64,64, 0.9)';
      case SeatStatus.RESERVED:
        return 'blue';
      case SeatStatus.MAINTAINED:
        return 'gray';
      default:
        return 'black';
    }
  }

  static getSeatTextColor(status: SeatStatus, type: SeatType) {
    switch (status) {
      case SeatStatus.AVAILABLE:
        return 'white';
      case SeatStatus.BOOKED:
        return 'black';
      case SeatStatus.RESERVED:
        return 'white';
      case SeatStatus.MAINTAINED:
        return 'white';
      default:
        return 'white';
    }
  }
}

export default SeatColorUtils;
