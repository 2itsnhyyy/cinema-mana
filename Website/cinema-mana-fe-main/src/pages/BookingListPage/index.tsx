import BookingService from '@/services/BookingService';
import { Booking, Customer, Movie, Showtime, Ticket } from '@/types';
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Popconfirm,
  Row,
  Table,
  Tooltip,
  notification,
} from 'antd';
import { ColumnsType } from 'antd/lib/table';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import styles from './index.module.scss';

type Props = {};

type BookingTable = Omit<Booking, 'createdAt'> & {
  key: number;
  createdAt: string;
};

const convertToTableData = (bookings: Booking[]): BookingTable[] => {
  const tmp = bookings.map((e: Booking): BookingTable => {
    return {
      ...e,
      key: e.id,
      createdAt: dayjs(e.createdAt).format('YYYY-MM-DD HH:mm'),
    };
  });
  return tmp;
};

type DataIndex = keyof BookingTable;

const BookingListPage: React.FC<Props> = (props) => {
  const [dataSource, setDataSource] = useState<BookingTable[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [toggleReload, setToggleReload] = useState(false);

  const columns: ColumnsType<BookingTable> = [
    {
      key: 'id',
      title: 'Poster',
      dataIndex: ['showtime', 'movie'],
      align: 'center',
      render: (mov: Movie) => {
        return (
          <img
            src={mov.poster}
            alt='poster'
            style={{ width: '100px', height: '100px' }}
          />
        );
      },
    },
    {
      key: 'id',
      title: 'Movie',
      dataIndex: ['showtime', 'movie', 'title'],
      align: 'center',
    },
    {
      key: 'customerId',
      title: 'Customer',
      dataIndex: 'customer',
      align: 'center',
      render: (customer: Customer) => {
        return (
          <div>
            <p>{customer.name}</p>
            <p>{customer.phoneNumber}</p>
          </div>
        );
      },
    },
    {
      key: 'id',
      title: 'Showtime infor',
      dataIndex: 'showtime',
      align: 'center',
      render: (showtime: Showtime) => {
        return (
          <div>
            <p>
              {dayjs(showtime.startTime).format('YYYY-MM-DD HH:mm')} -
              {dayjs(showtime.endTime).format('YYYY-MM-DD HH:mm')}
            </p>
            <p>1</p>
          </div>
        );
      },
    },
    {
      key: 'id',
      title: 'Seats',
      dataIndex: 'tickets',
      align: 'center',
      render: (tickets: Ticket[]) => {
        return (
          <div>
            {tickets.map((ticket) => (
              <p key={ticket.id}>
                {ticket.seatNumber} - {ticket.price}đ
              </p>
            ))}
          </div>
        );
      },
    },
    {
      key: 'employeeId',
      title: 'Employee',
      dataIndex: ['employee', 'name'],
      align: 'center',
    },
    {
      key: 'totalPrice',
      title: 'Total Price',
      dataIndex: 'totalPrice',
      align: 'center',
    },
    {
      key: 'createdAt',
      title: 'Created At',
      dataIndex: 'createdAt',
      align: 'center',
    },
    // {
    //   key: 'createdAt',
    //   title: 'Created At',
    //   dataIndex: 'createdAt',
    //   align: 'center',
    // },
    // {
    //   key: 'updatedAt',
    //   title: 'Updated At',
    //   dataIndex: 'updatedAt',
    //   align: 'center',
    // },
  ];

  useEffect(() => {
    (async () => {
      try {
        const response = await BookingService.getMany();
        console.log('BookingListPage -> response', response);
        setBookings(response.data);
        setDataSource(convertToTableData(response.data));
      } catch (error) {
        console.error(error);
        setBookings([]);
        setDataSource([]);
      }
    })();
  }, [toggleReload]);

  return (
    <div>
      <h1 className='text-blue-600 text-2xl'>Booking List</h1>
      <Card>
        <Row gutter={[20, 20]}>
          <Col span={24}>
            <div>
              <Table bordered columns={columns} dataSource={dataSource} />
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default BookingListPage;
