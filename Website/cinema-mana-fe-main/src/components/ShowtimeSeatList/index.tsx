import { SeatStatus, SeatType, ShowtimeSeat } from '@/types';
import SeatColorUtils from '@/utils/ColorSeat';
import React from 'react';
import SeatComponent from '../Seat';

export type SeatMapByRow = {
  [key: string]: ShowtimeSeat[];
};

type props = {
  seatMapByRow: SeatMapByRow;
  selectedIds?: number[];
  onSeatClick?: (seat: ShowtimeSeat) => void;
};

const ShowtimeSeatList: React.FC<props> = ({
  seatMapByRow,
  selectedIds,
  onSeatClick,
}) => {
  const selectedMap =
    (selectedIds || []).reduce((acc, seatId) => {
      acc[seatId] = true;
      return acc;
    }, {} as { [key: number]: boolean }) || {};

  return (
    <div className='bg-gray-800 p-12 rounded-sm'>
      <h2 className='text-center bg-white mb-4 rounded-sm'>Screen</h2>
      <div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          {Object.keys(seatMapByRow).map((row) => {
            return (
              <div key={row} style={{ display: 'flex', gap: '10px' }}>
                {seatMapByRow[row]
                  .sort((a, b) => a.number - b.number)
                  .map((seat) => {
                    return (
                      <SeatComponent
                        selected={selectedMap[seat.id]}
                        disabled={seat.status === SeatStatus.BOOKED}
                        bgColor={SeatColorUtils.getSeatBgColor(
                          seat.type,
                          seat.status
                        )}
                        seat={seat}
                        onSeatClick={onSeatClick}
                        key={seat.id}
                      />
                    );
                  })}
              </div>
            );
          })}
        </div>
      </div>

      <div className='flex justify-center gap-2 mt-4'>
        <div className='flex items-center gap-2 text-white'>
          <SeatComponent
            selected={false}
            bgColor={SeatColorUtils.getSeatBgColor(SeatType.VIP)}
          />
          <span>VIP</span>
        </div>
        <div className='flex items-center gap-2'>
          <SeatComponent
            selected={false}
            bgColor={SeatColorUtils.getSeatBgColor(SeatType.ECONOMY)}
          />
          <span className='text-white'>Economy</span>
        </div>
        <div className='flex items-center gap-2'>
          <SeatComponent
            selected={false}
            bgColor={SeatColorUtils.getSeatBgColor(
              SeatType.ECONOMY,
              SeatStatus.BOOKED
            )}
          />
          <span className='text-white'>BOOKED</span>
        </div>
      </div>
    </div>
  );
};

export default ShowtimeSeatList;
