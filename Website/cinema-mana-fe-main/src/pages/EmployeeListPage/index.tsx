import { Employee, EmployeeGender, EmployeeRole } from '@/types';
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
import AddEmployeeFormModal from './components/AddEmployeeFormModal';
import EditEmployeeFormModal from './components/EditEmployeeFormModal';
import styles from './index.module.scss';
import EmployeeService from '@/services/EmployeeService';

type Props = {};

type EmployeeTable = {
  key: string;
  name: string;
  gender: string;
  phoneNumber: string;
  address: string;
  role: string;
  birthDate: string;
  createdAt: string;
  updatedAt: string;
};

const convertToTableData = (employees: Employee[]): EmployeeTable[] => {
  const tmp = employees.map((e: Employee): EmployeeTable => {
    return {
      ...e,
      key: e.id.toString(),
      //add
      gender: e.gender.charAt(0).toUpperCase() + e.gender.slice(1),
      role: e.role.charAt(0).toUpperCase() + e.role.slice(1),
      birthDate: dayjs(e.birthdate).format('YYYY-MM-DD'),
    };
  });
  return tmp;
};

type DataIndex = keyof EmployeeTable;

const EmployeeListPage: React.FC<Props> = (props) => {
  const [confirmVisibleItem, setConfirmVisibleItem] = useState('');
  const [dataSource, setDataSource] = useState<EmployeeTable[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<
    Employee | undefined
  >();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [toggleReload, setToggleReload] = useState(false);
  const searchInput = useRef<InputRef>(null);

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): TableColumnType<EmployeeTable> => ({
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
  const columns: ColumnsType<EmployeeTable> = [
    {
      key: 'name',
      title: 'Name',
      dataIndex: 'name',
      align: 'center',
      ...getColumnSearchProps('name'),
    },
    {
      key: 'gender',
      title: 'Gender',
      dataIndex: 'gender',
      align: 'center',
      onFilter: (value, record) => record.role === value,
    },
    {
      key: 'phoneNumber',
      title: 'Phone',
      dataIndex: 'phoneNumber',
      align: 'center',
      ...getColumnSearchProps('phoneNumber'),
    },
    {
      key: 'address',
      title: 'Address',
      dataIndex: 'address',
      align: 'center',
      ...getColumnSearchProps('address'),
    },
    {
      key: 'role',
      title: 'Role',
      dataIndex: 'role',
      align: 'center',
      onFilter: (value, record) => record.role === value,
    },
    {
      key: 'birthDate',
      title: 'Birth Date',
      dataIndex: 'birthDate',
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
                  let data = employees.find((e) => e.id === id);
                  setSelectedEmployee(data);
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
                  handleDeleteEmployee(id);
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

  const handleDeleteEmployee = async (id: any) => {
    try {
      await EmployeeService.deleteOne(id);
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
        const response = await EmployeeService.getMany();
        const employees = response.data;
        setEmployees(employees);
        setDataSource(convertToTableData(employees));
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
      <AddEmployeeFormModal
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
      <EditEmployeeFormModal
        open={editModalOpen}
        initialValues={{
          ...selectedEmployee,
          birthDate: dayjs(selectedEmployee?.birthdate),
        }}
        onCancel={() => {
          setSelectedEmployee(undefined);
          setEditModalOpen(false);
        }}
        onFinish={(_) => {
          setSelectedEmployee(undefined);
          notification.open({
            type: 'success',
            message: 'Successfully edit employee',
          });
          setEditModalOpen(false);
          forceReload();
        }}
      />
      <h1 className='text-blue-600 text-2xl'>Employee List</h1>
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

export default EmployeeListPage;
