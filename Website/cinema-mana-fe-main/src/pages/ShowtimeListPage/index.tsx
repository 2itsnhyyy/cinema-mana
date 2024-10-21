import { Movie, Showtime, ShowtimeStatus, TheaterRoom } from '@/types';
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusCircleOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Input,
  InputRef,
  Popconfirm,
  Row,
  Space,
  Table,
  TableColumnType,
  Tooltip,
  notification,
} from 'antd';
import { FilterDropdownProps } from 'antd/es/table/interface';
import { ColumnsType } from 'antd/lib/table';
import React, { useEffect, useRef, useState } from 'react';
import AddShowtimeFormModal from './components/AddShowtimeFormModal';
import EditShowtimeFormModal from './components/EditShowtimeFormModal';
import styles from './index.module.scss';
import ShowtimeService from '@/services/ShowtimeService';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

type Props = {};

type ShowtimeTable = {
  key: string;
  theaterRoomId: number;
  theaterRoom: TheaterRoom;
  movieId: number;
  movie: Movie;
  startTime: string;
  endTime: string;
  status: ShowtimeStatus;
};

const convertToTableData = (showtimes: Showtime[]): ShowtimeTable[] => {
  const tmp = showtimes.map((e: Showtime): ShowtimeTable => {
    return {
      ...e,
      key: e.id.toString(),
      startTime: dayjs(e.startTime).format('YYYY-MM-DD HH:mm'),
      endTime: dayjs(e.endTime).format('YYYY-MM-DD HH:mm'),
    };
  });
  return tmp;
};

type DataIndex = keyof ShowtimeTable;

const ShowtimeListPage: React.FC<Props> = (props) => {
  const navigate = useNavigate();
  const [confirmVisibleItem, setConfirmVisibleItem] = useState('');
  const [dataSource, setDataSource] = useState<ShowtimeTable[]>([]);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [selectedShowtime, setSelectedShowtime] = useState<
    Showtime | undefined
  >();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [toggleReload, setToggleReload] = useState(false);

  const searchInput = useRef<InputRef>(null);

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): TableColumnType<ShowtimeTable> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type='primary'
            onClick={() => {
              confirm({ closeDropdown: false });
            }}
            icon={<SearchOutlined />}
            size='small'
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size='small'
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type='link'
            size='small'
            onClick={() => {
              close();
            }}
          >
            Close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });
  const columns: ColumnsType<ShowtimeTable> = [
    {
      key: 'id',
      title: 'ID Movie',
      dataIndex: 'id',
      align: 'center',
      ...getColumnSearchProps('key'),
    },
    {
      key: 'movie',
      title: 'Movie',
      dataIndex: 'movie',
      align: 'center',
      render: (movie: Movie) => {
        // render image with movie.poster and movie.title
        return (
          <div className='flex flex-col items-center'>
            <img
              src={movie.poster}
              alt={movie.title}
              style={{ width: '100px', height: '100px' }}
            />
            <p>{movie.title}</p>
          </div>
        );
      },
    },
    {
      key: 'theaterRoom',
      title: 'Theater Room',
      dataIndex: ['theaterRoom', 'roomNumber'],
      align: 'center',
    },
    {
      key: 'startTime',
      title: 'Start Time',
      dataIndex: 'startTime',
      align: 'center',
    },
    {
      key: 'endTime',
      title: 'End Time',
      dataIndex: 'endTime',
      align: 'center',
    },
    {
      key: 'status',
      title: 'Status',
      dataIndex: 'status',
      align: 'center',
    },
    {
      key: 'id',
      dataIndex: 'id',
      align: 'center',
      render: (id: any) => {
        return (
          <div>
            <Tooltip title='Show'>
              <Button
                onClick={() => {
                  navigate(`/showtimes/${id}`);
                }}
                icon={<EyeOutlined />}
                className={styles.action}
              />
            </Tooltip>
            <Tooltip title='Delete'>
              <Popconfirm
                title='Are you sure delete this task?'
                open={confirmVisibleItem === id}
                onConfirm={() => {
                  handleDeleteShowtime(id);
                  setConfirmVisibleItem('');
                }}
                onCancel={() => setConfirmVisibleItem('')}
                okText='Yes'
                cancelText='No'
              >
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => setConfirmVisibleItem(id)}
                  className={styles.action}
                />
              </Popconfirm>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps['confirm'],
    dataIndex: DataIndex
  ) => {
    confirm();
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
  };

  const handleDeleteShowtime = async (id: any) => {
    try {
      await ShowtimeService.deleteOne(id);
      forceReload();
      notification.open({
        type: 'success',
        message: 'Successfully delete showtime',
      });
    } catch (error: any) {}
  };

  useEffect(() => {
    (async () => {
      // fetch data
      const res = await ShowtimeService.getMany();
      console.log('res', res.data);
      setShowtimes(res.data);
      setDataSource(convertToTableData(res.data));
    })();
  }, [toggleReload]);

  const showAddModal = () => {
    setAddModalOpen(true);
  };

  const forceReload = () => {
    setToggleReload(!toggleReload);
  };

  return (
    <div>
      <AddShowtimeFormModal
        open={addModalOpen}
        initialValues={{}}
        onCancel={() => {
          setAddModalOpen(false);
        }}
        onFinish={(_) => {
          setAddModalOpen(false);
          forceReload();
        }}
      />
      <EditShowtimeFormModal
        open={editModalOpen}
        initialValues={selectedShowtime}
        onCancel={() => {
          setSelectedShowtime(undefined);
          setEditModalOpen(false);
        }}
        onFinish={(_) => {
          setSelectedShowtime(undefined);
          notification.open({
            type: 'success',
            message: 'Successfully edit employee',
          });
          setEditModalOpen(false);
          forceReload();
        }}
      />
      <h1 className='text-blue-600 text-2xl'>Showtime List</h1>
      <Card>
        <Row gutter={[20, 20]}>
          <Col span={4}>
            <Button
              block
              type='primary'
              icon={<PlusCircleOutlined />}
              onClick={showAddModal}
            >
              Add new
            </Button>
          </Col>
          <Col span={24}>
            <div>
              <Table
                bordered
                columns={columns}
                dataSource={dataSource}
                // pagination={{
                //   total: totalSize,
                //   onChange: (page: number) => handleChangePage(page),
                // }}
              />
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default ShowtimeListPage;
