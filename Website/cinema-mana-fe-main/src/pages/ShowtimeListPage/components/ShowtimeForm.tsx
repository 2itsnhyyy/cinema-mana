import MovieService from '@/services/MovieService';
import TheaterRoomService from '@/services/TheaterRoomService';
import { Movie, TheaterRoom } from '@/types';
import {
  Col,
  DatePicker,
  Form,
  FormInstance,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
} from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';

type Props = {
  onFormInstanceReady: (instance: FormInstance<any>) => void;
  initialValues: any;
};

const ShowtimeForm = ({ initialValues, onFormInstanceReady }: Props) => {
  const [form] = Form.useForm();
  const [movieOptions, setMovieOptions] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [startTime, setStartTime] = useState<Dayjs | null>();
  const [theaterRoomOptions, setTheaterRoomOptions] = useState<TheaterRoom[]>(
    []
  );

  useEffect(() => {
    onFormInstanceReady(form);
  }, []);
  useEffect(() => {
    (async () => {
      const response = await MovieService.getMany();
      setMovieOptions(response.data);
    })();
    (async () => {
      const response = await TheaterRoomService.getMany();
      setTheaterRoomOptions(response.data);
    })();
  }, []);

  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  console.log('startTime', startTime);
  return (
    <Form
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 24 }}
      layout='horizontal'
      initialValues={initialValues}
      form={form}
    >
      <Form.Item label='TheaterRoom' name='theaterRoomId'>
        <Select
          showSearch
          placeholder='Select a room'
          optionFilterProp='children'
          filterOption={filterOption}
          options={theaterRoomOptions.map((room) => ({
            label: room.roomNumber.toString(),
            value: room.id.toString(),
          }))}
        />
      </Form.Item>
      <Form.Item label='Movie' name='movieId'>
        <Select
          showSearch
          placeholder='Select a room'
          optionFilterProp='children'
          filterOption={filterOption}
          options={movieOptions.map((room) => ({
            label: `${room.title} - ${dayjs(room.releaseDate).format(
              'YYYY-MM-DD'
            )} - ${room.duration} minutes`,
            value: room.id.toString(),
          }))}
          onChange={(value) => {
            setSelectedMovie(movieOptions.find((e) => e.id === +value) || null);
          }}
        />
      </Form.Item>

      <Form.Item label='Start Time' name='startTime'>
        <DatePicker
          showTime
          needConfirm={false}
          minDate={dayjs()}
          onChange={setStartTime}
          value={startTime}
        />
      </Form.Item>

      {selectedMovie && startTime && (
        <Row>
          <Col span={6} className='text-end mr-1 mb-4'>
            <h2>End Time: </h2>
          </Col>
          <Col span={17}>
            <p>
              {dayjs(startTime)
                .add(selectedMovie.duration, 'minute')
                .format('YYYY-MM-DD HH:mm')}
            </p>
          </Col>
        </Row>
      )}

      <Form.Item label='Economy Price' name='economyPrice'>
        <InputNumber step={1000} />
      </Form.Item>
      <Form.Item label='VIP Price' name='vipPrice'>
        <InputNumber step={1000} />
      </Form.Item>
    </Form>
  );
};

export default ShowtimeForm;
