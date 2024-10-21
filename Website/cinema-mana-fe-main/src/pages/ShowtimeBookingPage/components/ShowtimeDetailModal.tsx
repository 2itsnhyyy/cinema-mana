import ShowtimeSeatList, { SeatMapByRow } from '@/components/ShowtimeSeatList';
import ShowtimeService from '@/services/ShowtimeService';
import { Customer, Showtime, ShowtimeSeat } from '@/types';
import { Card, Divider, Modal, notification } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import BookingConfirmation from './BookingConfirmation';
import BookingService from '@/services/BookingService';

type Props = {
  open: boolean;
  onFinish: (values: any) => void;
  onCancel: () => void;
  showtimeId: number;
};

const ShowtimeDetailModal = ({
  // onFinish,
  onCancel,
  open,
  showtimeId,
}: Props) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [showtime, setShowtime] = useState<Showtime>();
  const [seatMapByRow, setSeatMapByRow] = useState<SeatMapByRow>({});
  const [selectedSeats, setSelectedSeats] = useState<ShowtimeSeat[]>([]);
  const [step, setStep] = useState(0);
  const [customer, setCustomer] = useState<Customer | undefined>();

  useEffect(() => {
    setStep(0);
    setSelectedSeats([]);
    if (open) {
      ShowtimeService.getShowtimeById(showtimeId)
        .then((res) => {
          setShowtime(res.data);
          setSeatMapByRow(
            res.data.showtimeSeats.reduce((acc, seat) => {
              if (!acc[seat.row]) {
                acc[seat.row] = [];
              }
              acc[seat.row].push(seat);
              return acc;
            }, {} as SeatMapByRow)
          );
        })
        .catch((error) => {
          console.log('Failed:', error);
          notification.open({
            type: 'error',
            message: error.message,
          });
        });
    }
  }, [open, showtimeId]);

  const handleOk = async () => {
    try {
      setConfirmLoading(true);
      if (step === 0) {
        setStep(1);
        return;
      }

      const booking = {
        showtimeId: showtimeId,
        customerId: customer?.id,
        showtimeSeatIds: selectedSeats.map((s) => s.id),
      };
      await BookingService.create(booking);
      notification.open({
        type: 'success',
        message: 'Booking successfully',
      });
      onCancel();
    } catch (error: any) {
      console.log('Failed:', error);
      notification.open({
        type: 'error',
        message: error.message,
      });
    } finally {
      setConfirmLoading(false);
    }
  };
  const onSeatClick = (seat: ShowtimeSeat) => {
    setSelectedSeats((prev) => {
      if (prev.some((s) => s.id === seat.id)) {
        return prev.filter((s) => s.id !== seat.id);
      } else {
        return [...prev, seat];
      }
    });
  };

  const checkDisabled = () => {
    if (step === 0) {
      return selectedSeats.length === 0;
    }
    return !customer;
  };

  return (
    <Modal
      title='Booking'
      open={open}
      onOk={handleOk}
      okButtonProps={{
        disabled: checkDisabled(),
      }}
      confirmLoading={confirmLoading}
      onCancel={onCancel}
      cancelText='Cancel'
      okText={step === 0 ? 'Next' : 'Finish'}
      width={1000}
    >
      {step === 0 && (
        <>
          <div className='overflow-x-auto'>
            <ShowtimeSeatList
              seatMapByRow={seatMapByRow}
              onSeatClick={onSeatClick}
              selectedIds={selectedSeats.map((s) => s.id)}
            />
          </div>

          <Card>
            <p className='font-bold text-lg'>Movie: {showtime?.movie.title}</p>
            <p>Room: {showtime?.theaterRoom.roomNumber}</p>
            <p className='font-bold text-base'>
              Time: {dayjs(showtime?.startTime).format('YYYY-MM-DD HH:mm')} -
              {dayjs(showtime?.endTime).format('YYYY-MM-DD HH:mm')}
            </p>
            <Divider />
            <p className='font-bold text-lg'>
              Selected Seats:
              {selectedSeats.map((s) => s.seatNumber).join(', ')}
            </p>
            <Divider />
            <p className='font-bold text-lg'>
              Total Price:{' '}
              {selectedSeats.reduce((acc, seat) => acc + seat.price, 0)}
            </p>
          </Card>
        </>
      )}

      {step === 1 && showtime && (
        <BookingConfirmation
          showtime={showtime}
          selectedSeats={selectedSeats}
          onVerify={(customer) => {
            setCustomer(customer);
          }}
        />
      )}
    </Modal>
  );
};

export default ShowtimeDetailModal;
