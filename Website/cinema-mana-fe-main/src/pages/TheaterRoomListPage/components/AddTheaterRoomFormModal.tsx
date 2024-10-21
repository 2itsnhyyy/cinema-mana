import EmployeeService from '@/services/EmployeeService';
import { FormInstance, Modal, notification } from 'antd';
import { useState } from 'react';
import TheaterRoomForm from './TheaterRoomForm';
import TheaterRoomService from '@/services/TheaterRoomService';

type Props = {
  open: boolean;
  onFinish: (values: any) => void;
  onCancel: () => void;
  initialValues?: any;
};

const AddTheaterRoomFormModal = ({
  initialValues = {},
  onFinish,
  onCancel,
  open,
}: Props) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [formInstance, setFormInstance] = useState<FormInstance>();

  const handleOk = async () => {
    try {
      const fieldValues = await formInstance?.validateFields();
      const values = {
        ...fieldValues,
      };

      setConfirmLoading(true);
      await TheaterRoomService.createOne(values);
      onFinish(values);
      formInstance?.resetFields();
    } catch (error: any) {
      notification.open({
        type: 'error',
        message: error.message,
      });
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <Modal
      title='Add new room'
      open={open}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={onCancel}
      cancelText='Cancel'
      okText='Add'
    >
      <TheaterRoomForm
        initialValues={initialValues}
        onFormInstanceReady={setFormInstance}
      />
    </Modal>
  );
};

export default AddTheaterRoomFormModal;
