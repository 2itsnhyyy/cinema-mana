import { Seat, SeatType, ShowtimeSeat } from '@/types';
import SeatColorUtils from '@/utils/ColorSeat';
import React from 'react';
import SeatComponent from '../Seat';

type SeatMapByRow = {
  [key: string]: Seat[];
};

type props = {
  seatMapByRow: SeatMapByRow;
  onSeatClick: (seat: Seat) => void;
  readonly?: boolean;
  selectedIds?: number[];
};

const SeatList: React.FC<props> = ({
  seatMapByRow,
  onSeatClick,
  selectedIds,
}) => {
  const selectedMap =
    (selectedIds || []).reduce((acc, seatId) => {
      acc[seatId] = true;
      return acc;
    }, {} as { [key: number]: boolean }) || {};

  return (
    <div className='bg-gray-800 p-2 rounded-sm'>
      <h2 className='text-center bg-slate-400 mb-4'>Screen</h2>
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
                        bgColor={SeatColorUtils.getSeatBgColor(seat.type)}
                        selected={selectedMap[seat.id]}
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
    </div>
  );
};

export default SeatList;
