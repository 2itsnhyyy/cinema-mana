import EmployeeService from '@/services/EmployeeService';
import { FormInstance, Modal, notification } from 'antd';
import { useEffect, useState } from 'react';
import RoomForm from './RoomForm';
import TheaterRoomService from '@/services/TheaterRoomService';

type Props = {
  open: boolean;
  onFinish: (values: any) => void;
  onCancel: () => void;
  initialValues: any;
};

const EditTheaterRoomFormModal = ({
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
      console.log('Received values:', fieldValues);
      const values = {
        ...fieldValues,
      };
      console.log('values', values);
      await TheaterRoomService.updateOne(initialValues.id, values);
      setConfirmLoading(true);
      onFinish(values);
      formInstance?.resetFields();
      notification.open({
        type: 'success',
        message: 'Successfully edit room',
      });
    } catch (error: any) {
      notification.open({
        type: 'error',
        message: error.message,
      });
    } finally {
      setConfirmLoading(false);
    }
  };

  useEffect(() => {
    formInstance?.setFieldsValue(initialValues);
  }, [initialValues]);

  return (
    <Modal
      title='Edit room'
      open={open}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={onCancel}
      cancelText='Cancel'
      okText='Edit'
    >
      <RoomForm
        initialValues={initialValues}
        onFormInstanceReady={setFormInstance}
      />
    </Modal>
  );
};

export default EditTheaterRoomFormModal;
