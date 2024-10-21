import TheaterRoomService from '@/services/TheaterRoomService';
import { Seat, SeatType, TheaterRoom } from '@/types';
import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, Card, Col, Row, notification } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingPage from '../LoadingPage';
import EditTheaterRoomFormModal from './components/EditTheaterRoomFormModal';
import styles from './index.module.scss';
import SeatColorUtils from '@/utils/ColorSeat';
import EditSeatFormModal from './components/EditSeatFormModal';
import SeatList from '@/components/SeatList';

type Props = {};

type SeatMapByRow = {
  [key: string]: Seat[];
};

const TheaterRoomDetailPage: React.FC<Props> = (props) => {
  const navigate = useNavigate();
  const [room, setTheaterRoom] = useState<TheaterRoom | undefined>();
  const [seatMapByRow, setSeatMapByRow] = useState<SeatMapByRow>({});
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editSeatModalOpen, setEditSeatModalOpen] = useState(false);
  const [toggleReload, setToggleReload] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (!id || isNaN(+id)) {
      navigate('/theater-rooms');
    }
    (async () => {
      try {
        const res = await TheaterRoomService.getTheaterRoomById(+id!);
        console.log('res', res.data);
        setTheaterRoom(res.data);
        let seatMapByRow: SeatMapByRow = {};

        res.data.seats.forEach((seat) => {
          if (!seatMapByRow[seat.row]) {
            seatMapByRow[seat.row] = [];
          }
          seatMapByRow[seat.row].push(seat);
        });
        setSeatMapByRow(seatMapByRow);
      } catch (error: any) {
        notification.open({
          type: 'error',
          message: 'Error',
          description: error.message,
        });
      }
    })();
  }, [toggleReload]);

  const onSeatClick = (seat: Seat) => {
    setSelectedIds((prev) => {
      if (prev.includes(seat.id)) {
        return prev.filter((id) => id !== seat.id);
      } else {
        return [...prev, seat.id];
      }
    });
  };

  const forceReload = () => {
    setToggleReload(!toggleReload);
  };
  if (!room) {
    return <LoadingPage />;
  }

  return (
    <div className='p-4 w-full h-full'>
      <EditTheaterRoomFormModal
        open={editModalOpen}
        initialValues={room}
        onCancel={() => {
          setEditModalOpen(false);
        }}
        onFinish={(_) => {
          setEditModalOpen(false);
          forceReload();
        }}
      />
      <EditSeatFormModal
        open={editSeatModalOpen}
        roomId={room.id}
        selectedSeatIds={selectedIds}
        initialValues={{}}
        onCancel={() => {
          setEditSeatModalOpen(false);
        }}
        onFinish={(_) => {
          setEditSeatModalOpen(false);
          forceReload();
        }}
      />
      <h1 className='text-blue-600 text-2xl'>Theater room Information</h1>
      <Card>
        <Row gutter={[20, 20]}>
          <Col className='flex justify-between w-full'>
            <div>
              <h2 className='text-lg'>Room Number: {room?.roomNumber}</h2>
              <h2 className='text-lg'>
                Capacity: {room?.numOfRows * room?.numOfSeatsPerRow}
              </h2>
              <h2 className='text-lg'>Number of Rows: {room?.numOfRows}</h2>
              <h2 className='text-lg'>
                Number of Seats per Row: {room?.numOfSeatsPerRow}
              </h2>
            </div>
            <div>
              <Button
                block
                type='primary'
                icon={<PlusCircleOutlined />}
                className='mb-2'
                onClick={() => {
                  setEditModalOpen(true);
                }}
              >
                Edit
              </Button>

              <Button
                block
                type='primary'
                icon={<PlusCircleOutlined />}
                className='mb-2'
                onClick={() => {
                  setEditSeatModalOpen(true);
                }}
              >
                Edit Seats
              </Button>
            </div>
          </Col>
          <Col span={24}>
            <SeatList
              seatMapByRow={seatMapByRow}
              onSeatClick={onSeatClick}
              selectedIds={selectedIds}
            />
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default TheaterRoomDetailPage;
