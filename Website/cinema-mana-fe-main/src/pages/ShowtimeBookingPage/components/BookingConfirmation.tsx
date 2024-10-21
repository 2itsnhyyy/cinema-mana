import CustomerService from '@/services/CustomerService';
import { Customer, Showtime, ShowtimeSeat } from '@/types';
import { notification } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';

type Props = {
  showtime: Showtime;
  selectedSeats: ShowtimeSeat[];
  onVerify: (customer?: Customer) => void;
};

const BookingConfirmation: React.FC<Props> = ({
  showtime,
  selectedSeats,
  onVerify,
}) => {
  const [phone, setPhone] = React.useState('');
  const [customer, setCustomer] = React.useState<Partial<Customer> | null>(
    null
  );

  useEffect(() => {
    if (customer?.id) {
      onVerify({ ...customer, phoneNumber: phone } as Customer);
    } else {
      onVerify(undefined);
    }
  }, [customer, phone]);

  const handleFind = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    CustomerService.getByPhone(phone)
      .then((res) => {
        if (!res) {
          alert('Người dùng không tồn tại! Vui lòng nhập thông tin liên hệ.');
          return;
        }

        setCustomer(res);
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  const handleCreate = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log('Create new customer', phone, customer);
    CustomerService.create({ phoneNumber: phone, name: customer?.name || '' })
      .then((res) => {
        notification.open({
          type: 'success',
          message: 'Tạo khách hàng thành công',
        });
        setCustomer(res);
      })
      .catch((error) => {
        notification.open({
          type: 'error',
          message: error.message,
        });
      });
  };

  return (
    <div className='bg-gray-900 text-white min-h-screen flex items-center justify-center'>
      <div className='max-w-4xl mx-auto py-8'>
        <div className='bg-gray-800 p-6 rounded-lg'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Ticket Information */}
            <div>
              <h2 className='text-2xl font-bold mb-4'>Thông tin đặt vé</h2>
              <div className='flex items-center mb-4'>
                <img
                  src={showtime.movie.poster}
                  alt='Movie Poster'
                  className='w-24 h-32 mr-4'
                />
                <div>
                  <h3 className='text-xl font-semibold'>
                    {showtime.movie.title}
                  </h3>
                  <p className='text-sm'>Ngày chiếu: {showtime.startTime}</p>
                  <p className='text-sm'>
                    Thời gian: {dayjs(showtime.startTime).format('HH:mm')} -{' '}
                    {dayjs(showtime.endTime).format('HH:mm')}
                  </p>
                  <p className='text-sm'>
                    Phòng chiếu: {showtime.theaterRoom.roomNumber}
                  </p>
                  <p className='text-sm'>Định dạng: 2D Phụ đề English</p>
                </div>
              </div>
              <div className='mb-4'>
                {selectedSeats.map((seat) => (
                  <p key={seat.id} className='text-sm'>
                    Ghế: {seat.seatNumber} - {seat.price}đ
                  </p>
                ))}

                <p className='text-lg font-bold'>
                  Tổng tiền:{' '}
                  {selectedSeats.reduce((acc, seat) => acc + seat.price, 0)}đ
                </p>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className='text-2xl font-bold mb-4'>Thông tin liên hệ</h2>
              <form>
                <div className='mb-4'>
                  <label htmlFor='phone' className='block text-sm mb-2'>
                    Số điện thoại (*)
                  </label>
                  <div className='flex gap-2'>
                    <input
                      type='text'
                      id='phone'
                      name='phone'
                      className='w-full p-2 rounded bg-gray-700 border border-gray-600'
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />

                    <button
                      className='p-3 rounded bg-blue-600 hover:bg-blue-700'
                      onClick={handleFind}
                    >
                      Tìm
                    </button>
                  </div>
                </div>
                <div className='mb-4'>
                  <label htmlFor='name' className='block text-sm mb-2'>
                    Tên khách hàng
                  </label>
                  <input
                    type='text'
                    id='name'
                    name='name'
                    className='w-full p-2 rounded bg-gray-700 border border-gray-600'
                    value={customer?.name}
                    onChange={(e) => {
                      if (customer) {
                        setCustomer({ ...customer, name: e.target.value });
                      } else {
                        setCustomer({
                          name: e.target.value,
                          phoneNumber: phone,
                        });
                      }
                    }}
                  />
                </div>
                {!customer?.id && (
                  <button
                    className='w-full p-3 rounded bg-green-600 hover:bg-green-700 mt-2'
                    onClick={handleCreate}
                  >
                    Tạo mới
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
