import { Form, FormInstance, Modal, notification } from 'antd';
import { useEffect, useState } from 'react';
import ShowtimeForm from './ShowtimeForm';
import ShowtimeService from '@/services/ShowtimeService';

type Props = {
  open: boolean;
  onFinish: (values: any) => void;
  onCancel: () => void;
  initialValues?: any;
};

const AddShowtimeFormModal = ({
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
        startTime: fieldValues.startTime.toISOString(),
        endTime: undefined,
      };
      console.log('Received values:', values);

      // call API here
      setConfirmLoading(true);
      await ShowtimeService.createOne(values);
      onFinish(values);
      formInstance?.resetFields();
    } catch (error: any) {
      console.log('Failed:', error);
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
      title='Add new showtime'
      open={open}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={onCancel}
      cancelText='Cancel'
      okText='Add'
    >
      <ShowtimeForm
        initialValues={initialValues}
        onFormInstanceReady={setFormInstance}
      />
    </Modal>
  );
};

export default AddShowtimeFormModal;
