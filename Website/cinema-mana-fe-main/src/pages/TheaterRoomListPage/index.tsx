import TheaterRoomService from '@/services/TheaterRoomService';
import { TheaterRoom } from '@/types';
import {
  DeleteOutlined,
  EyeOutlined,
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
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddTheaterRoomFormModal from './components/AddTheaterRoomFormModal';
import styles from './index.module.scss';

type Props = {};

type TheaterRoomTable = {
  key: number;
  roomNumber: number;
  numOfRows: number;
  numOfSeatsPerRow: number;
  capacity: number;
  isActive: boolean;
};

const convertToTableData = (rooms: TheaterRoom[]): TheaterRoomTable[] => {
  const tmp = rooms.map((e: TheaterRoom): TheaterRoomTable => {
    return {
      ...e,
      key: e.id,
    };
  });
  return tmp;
};

const TheaterRoomListPage: React.FC<Props> = (_) => {
  const navigate = useNavigate();
  const [confirmVisibleItem, setConfirmVisibleItem] = useState('');
  const [dataSource, setDataSource] = useState<TheaterRoomTable[]>([]);
  const [rooms, setTheaterRooms] = useState<TheaterRoom[]>([]);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [toggleReload, setToggleReload] = useState(false);

  const columns: ColumnsType<TheaterRoomTable> = [
    {
      key: 'roomNumber',
      title: 'Room Number',
      dataIndex: 'roomNumber',
      align: 'center',
    },
    {
      key: 'capacity',
      title: 'Capacity',
      dataIndex: 'capacity',
      align: 'center',
      render: (capacity: number, record) => {
        return record.numOfRows * record.numOfSeatsPerRow;
      },
    },
    {
      key: 'isActive',
      title: 'Active',
      dataIndex: 'isActive',
      align: 'center',
      render: (isActive: boolean) => {
        return isActive ? 'Active' : 'Inactive';
      },
    },
    {
      key: 'id',
      dataIndex: 'id',
      align: 'center',
      render: (id: any) => {
        return (
          <div>
            <Tooltip title='View'>
              <Button
                onClick={() => {
                  navigate(`/theater-rooms/${id}`);
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
                  handleDeleteTheaterRoom(id);
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

  const handleDeleteTheaterRoom = async (id: any) => {
    try {
      await TheaterRoomService.deleteOne(id);
      notification.open({
        type: 'success',
        message: 'Successfully delete employee',
      });
      forceReload();
    } catch (error) {
      notification.open({
        type: 'error',
        message: 'Failed to delete employee',
      });
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await TheaterRoomService.getMany();
        const rooms = response.data;
        setTheaterRooms(rooms);
        setDataSource(convertToTableData(rooms));
      } catch (error) {
        console.log('Failed:', error);
      }
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
      <AddTheaterRoomFormModal
        open={addModalOpen}
        initialValues={{}}
        onCancel={() => {
          setAddModalOpen(false);
        }}
        onFinish={(_) => {
          setAddModalOpen(false);
          notification.open({
            type: 'success',
            message: 'Successfully add new employee',
          });
          forceReload();
        }}
      />
      <h1 className='text-blue-600 text-2xl'>TheaterRoom List</h1>
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
              <Table bordered columns={columns} dataSource={dataSource} />
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default TheaterRoomListPage;
