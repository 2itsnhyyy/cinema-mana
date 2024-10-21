import ShowtimeService from '@/services/ShowtimeService';
import { Showtime, ShowtimeSeat } from '@/types';
import SeatColorUtils from '@/utils/ColorSeat';
import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, Card, Col, Row, notification } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import EditShowtimeFormModal from './components/EditShowtimeFormModal';
import styles from './index.module.scss';
import ShowtimeSeatList from '@/components/ShowtimeSeatList';
import EditSeatFormModal from './components/EditSeatFormModal';
import dayjs from 'dayjs';

type Props = {};
type SeatMapByRow = { [key: string]: ShowtimeSeat[] };

const ShowtimeDetailPage: React.FC<Props> = (props) => {
  const navigate = useNavigate();
  const [showtime, setShowtime] = useState<Showtime | undefined>();
  const [seatMapByRow, setSeatMapByRow] = useState<SeatMapByRow>({});
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editSeatModalOpen, setEditSeatModalOpen] = useState(false);
  const [toggleReload, setToggleReload] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (!id || isNaN(+id)) {
      navigate('/showtimes');
    }
    (async () => {
      // fetch data
      const res = await ShowtimeService.getShowtimeById(+id!);
      setShowtime(res.data);
      let seatMapByRow: SeatMapByRow = {};

      let showtimeSeats = res.data.showtimeSeats;
      showtimeSeats.forEach((seat) => {
        if (!seatMapByRow[seat.row]) {
          seatMapByRow[seat.row] = [];
        }
        seatMapByRow[seat.row].push(seat);
      });
      setSeatMapByRow(seatMapByRow);
    })();
  }, [toggleReload]);

  const forceReload = () => {
    setToggleReload(!toggleReload);
  };

  const onSeatClick = (seat: ShowtimeSeat) => {
    setSelectedIds((prev) => {
      if (prev.includes(seat.id)) {
        return prev.filter((id) => id !== seat.id);
      } else {
        return [...prev, seat.id];
      }
    });
  };
  console.log('selectedIds', selectedIds);

  return (
    <div>
      <EditShowtimeFormModal
        open={editModalOpen}
        initialValues={showtime}
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
        initialValues={{}}
        onCancel={() => {
          setEditSeatModalOpen(false);
        }}
        showtimeId={showtime?.id!}
        selectedSeatIds={selectedIds}
        onFinish={(_) => {
          setEditSeatModalOpen(false);
          forceReload();
        }}
      />
      <Card>
        <Row gutter={[20, 20]}>
          <Col className='flex justify-between w-full'>
            <div>
              <div>
                <h2 className='text-lg'>Showtime Info</h2>
                <div>
                  <b>Movie:</b> {showtime?.movie.title}
                </div>
                <div>
                  <b>Start time:</b>{' '}
                  {dayjs(showtime?.startTime).format('YYYY-MM-DD HH:mm')}
                </div>
                <div>
                  <b>End time:</b>{' '}
                  {dayjs(showtime?.endTime).format('YYYY-MM-DD HH:mm')}
                </div>
                <div>
                  <b>Economy Price:</b> {showtime?.economyPrice}
                </div>
                <div>
                  <b>VIP Price:</b> {showtime?.vipPrice}
                </div>
                <div>
                  <b>Status:</b> {showtime?.status}
                </div>
              </div>
            </div>
            <div>
              {/* <Button
                block
                type='primary'
                disabled={showtime?.status !== 'NEW'}
                className='mb-2'
                icon={<PlusCircleOutlined />}
                onClick={() => {
                  setEditModalOpen(true);
                }}
              >
                Edit
              </Button> */}
              <Button
                block
                type='primary'
                disabled={showtime?.status !== 'NEW'}
                icon={<PlusCircleOutlined />}
                onClick={() => {
                  setEditSeatModalOpen(true);
                }}
              >
                Edit Seats
              </Button>
            </div>
          </Col>
          <Col span={24}>
            <div>
              <ShowtimeSeatList
                onSeatClick={onSeatClick}
                seatMapByRow={seatMapByRow}
                selectedIds={selectedIds}
              />
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default ShowtimeDetailPage;
