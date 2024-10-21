import { Movie } from '@/types';
import {
  DeleteOutlined,
  EditOutlined,
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
import dayjs from 'dayjs';
import React, { useEffect, useRef, useState } from 'react';
import AddMovieFormModal from './components/AddMovieFormModal';
import EditMovieFormModal from './components/EditMovieFormModal';
import styles from './index.module.scss';
import MovieService from '@/services/MovieService';

type Props = {};

type MovieTable = {
  key: string;
  poster: string;
  title: string;
  author: string;
  description: string;
  type: string;
  duration: string;
  releaseDate: string;
  createAt: string;
  updateAt: string;
};

const convertToTableData = (movies: Movie[]): MovieTable[] => {
  const tmp = movies.map((e: Movie): MovieTable => {
    return {
      ...e,
      key: e.id,
      releaseDate: dayjs(e.releaseDate).format('YYYY-MM-DD'),
    };
  });
  return tmp;
};

type DataIndex = keyof MovieTable;

const MovieListPage: React.FC<Props> = (props) => {
  const [confirmVisibleItem, setConfirmVisibleItem] = useState('');
  const [dataSource, setDataSource] = useState<MovieTable[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | undefined>();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [toggleReload, setToggleReload] = useState(false);

  const searchInput = useRef<InputRef>(null);

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): TableColumnType<MovieTable> => ({
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
  const columns: ColumnsType<MovieTable> = [
    {
      key: 'poster',
      title: 'Poster',
      dataIndex: 'poster',
      align: 'center',
      render: (poster: string) => {
        return (
          <img
            src={poster}
            alt='poster'
            style={{ width: '100px', height: '100px' }}
          />
        );
      },
    },
    {
      key: 'title',
      title: 'Title',
      dataIndex: 'title',
      align: 'center',
      ...getColumnSearchProps('title'),
    },
    {
      key: 'author',
      title: 'Author',
      dataIndex: 'author',
      align: 'center',
      ...getColumnSearchProps('author'),
    },
    {
      key: 'description',
      title: 'Description',
      dataIndex: 'description',
      align: 'center',
    },
    {
      key: 'type',
      title: 'Type',
      dataIndex: 'type',
      align: 'center',
      ...getColumnSearchProps('type'),
    },
    {
      key: 'duration',
      title: 'Duration',
      dataIndex: 'duration',
      align: 'center',
    },
    {
      key: 'releaseDate',
      title: 'Release Date',
      dataIndex: 'releaseDate',
      align: 'center',
      ...getColumnSearchProps('releaseDate'),
    },
    {
      key: 'isPublished',
      title: 'Published',
      dataIndex: 'isPublished',
      align: 'center',
      render: (isPublished: boolean) => {
        return isPublished ? 'Yes' : 'No';
      },
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
    {
      key: 'id',
      dataIndex: 'id',
      align: 'center',
      render: (id: any) => {
        return (
          <div>
            <Tooltip title='Edit'>
              <Button
                onClick={() => {
                  let data = movies.find((e) => e.id === id);
                  setSelectedMovie(data);
                  setEditModalOpen(true);
                }}
                icon={<EditOutlined />}
                className={styles.action}
              />
            </Tooltip>
            <Tooltip title='Delete'>
              <Popconfirm
                title='Are you sure delete this task?'
                open={confirmVisibleItem === id}
                onConfirm={() => {
                  handleDeleteMovie(id);
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

  const handleDeleteMovie = async (id: any) => {
    try {
      await MovieService.deleteOne(id);
      setToggleReload(!toggleReload);
      notification.open({
        type: 'success',
        message: 'Successfully delete employee',
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await MovieService.getMany();
        setMovies(response.data);
        setDataSource(convertToTableData(response.data));
      } catch (error) {
        console.error(error);
        setMovies([]);
        setDataSource([]);
      }
    })();
  }, [toggleReload]);

  const showAddModal = () => {
    setAddModalOpen(true);
  };

  return (
    <div>
      <AddMovieFormModal
        open={addModalOpen}
        initialValues={{}}
        onCancel={() => {
          setAddModalOpen(false);
        }}
        onFinish={(_) => {
          setToggleReload(!toggleReload);
          setAddModalOpen(false);
          notification.open({
            type: 'success',
            message: 'Successfully add new employee',
          });
        }}
      />
      <EditMovieFormModal
        open={editModalOpen}
        initialValues={selectedMovie}
        onCancel={() => {
          setSelectedMovie(undefined);
          setEditModalOpen(false);
        }}
        onFinish={(_) => {
          setToggleReload(!toggleReload);
          setSelectedMovie(undefined);
          notification.open({
            type: 'success',
            message: 'Successfully edit employee',
          });
          setEditModalOpen(false);
        }}
      />
      <h1 className='text-blue-600 text-2xl'>Movie List</h1>
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

export default MovieListPage;
