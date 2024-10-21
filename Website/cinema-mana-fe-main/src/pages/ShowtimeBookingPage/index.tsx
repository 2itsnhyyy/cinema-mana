import MovieService from '@/services/MovieService';
import { Movie } from '@/types';
import { Card, Col, DatePicker, Row } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ShowtimeDetailModal from './components/ShowtimeDetailModal';

type Props = {};

const ShowtimeBookingPage: React.FC<Props> = (props) => {
  const navigate = useNavigate();
  const [date, setDate] = React.useState(dayjs().format('YYYY-MM-DD'));
  const [movieList, setMovieList] = React.useState<Movie[]>([]);
  const [selectedShowtimeId, setSelectedShowtimeId] = React.useState<number>();
  useEffect(() => {
    (async () => {
      // fetch data
      const res = await MovieService.getByDate(date);
      console.log('res', res.data);
      if (res.data.length !== 0) {
        console.log('res', res.data[0].showtimes);
        let showtime = res.data[0].showtimes[0];

        // for (let i = 0; i < 10; i++) {
        //   res.data[0].showtimes.push({
        //     ...showtime,
        //     id: i,
        //     startTime: dayjs(showtime.startTime).add(i, 'day').toISOString(),
        //     endTime: dayjs(showtime.endTime).add(i, 'day').toISOString(),
        //   });
        // }

        // for (let i = 0; i < 10; i++) {
        //   res.data.push({ ...res.data[0], id: i });
        // }
      }
      setMovieList(res.data);
    })();
  }, [date]);

  return (
    <div>
      <ShowtimeDetailModal
        open={!!selectedShowtimeId}
        onCancel={() => {
          setSelectedShowtimeId(undefined);
        }}
        onFinish={(_) => {
          setSelectedShowtimeId(undefined);
        }}
        showtimeId={selectedShowtimeId!}
      />

      <Card className='p-2'>
        <Row className='mb-2'>
          <DatePicker
            value={dayjs(date)}
            onChange={(date) => {
              setDate(date.format('YYYY-MM-DD'));
            }}
          />
        </Row>
        <div className='flex flex-col gap-2 w-full h-screen overflow-y-auto'>
          {movieList.map((movie) => (
            <div
              className='flex border border-gray-200 p-4 rounded h-[200px]'
              key={movie.id}
            >
              <div className=''>
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className='w-full h-full object-cover'
                />
              </div>
              <div className='flex-auto ml-4 '>
                <h2 className='text-xl font-semibold'>{movie.title}</h2>
                <p className='text-gray-500'>{movie.type}</p>
                <div className='mt-2 flex flex-wrap gap-2'>
                  {movie.showtimes.map((showtime) => (
                    <div key={showtime.id}>
                      <button
                        className='p-2 rounded border border-gray-200 hover:bg-gray-100'
                        onClick={() => {
                          setSelectedShowtimeId(showtime.id);
                        }}
                      >
                        <span className='mr-2 font-bold'>
                          {dayjs(showtime.startTime).format('HH:mm')}
                        </span>
                        - {dayjs(showtime.endTime).format('HH:mm')}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ShowtimeBookingPage;
