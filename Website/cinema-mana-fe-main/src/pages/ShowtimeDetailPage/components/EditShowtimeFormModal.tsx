import { Form, FormInstance, Modal } from 'antd';
import { useEffect, useState } from 'react';
import ShowtimeForm from './ShowtimeForm';
import dayjs from 'dayjs';

type Props = {
  open: boolean;
  onFinish: (values: any) => void;
  onCancel: () => void;
  initialValues: any;
};

const EditShowtimeFormModal = ({
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
      console.log('fieldValues', fieldValues);
      const values = {
        ...fieldValues,
        //birthdate: fieldValues['birthdate'].format('YYYY-MM-DD'),
      };

      // formInstance?.resetFields();
      // // call API edit here
      // setConfirmLoading(true);
      // setTimeout(() => {}, 2000);
      // onFinish(values);
      // setConfirmLoading(false);
    } catch (error) {
      console.log('Failed:', error);
    }
  };

  useEffect(() => {
    formInstance?.setFieldsValue(initialValues);
  }, [initialValues]);

  console.log('initialValues', initialValues);
  return (
    <Modal
      title='Edit showtime'
      open={open}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={onCancel}
      cancelText='Cancel'
      okText='Edit'
    >
      <ShowtimeForm
        initialValues={{
          ...initialValues,
          startTime: dayjs(initialValues.startTime),
        }}
        onFormInstanceReady={setFormInstance}
      />
    </Modal>
  );
};

export default EditShowtimeFormModal;
