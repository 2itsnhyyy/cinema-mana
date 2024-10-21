import { FormInstance, Modal } from 'antd';
import { useEffect, useState } from 'react';
import MovieForm from './MovieForm';
import MovieService from '@/services/MovieService';
import dayjs from 'dayjs';

type Props = {
  open: boolean;
  onFinish: (values: any) => void;
  onCancel: () => void;
  initialValues: any;
};

const EditMovieFormModal = ({
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
        birthdate: fieldValues['releaseDate'].format('YYYY-MM-DD'),
      };

      setConfirmLoading(true);
      await MovieService.updateOne(initialValues.id, values);

      formInstance?.resetFields();
      onFinish(values);
      setConfirmLoading(false);
    } catch (error) {
      console.log('Failed:', error);
    }
  };

  useEffect(() => {
    formInstance?.setFieldsValue(initialValues);
  }, [initialValues]);

  return (
    <Modal
      title='Edit movie'
      open={open}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={onCancel}
      cancelText='Cancel'
      okText='Edit'
    >
      <MovieForm
        initialValues={{
          ...initialValues,
          releaseDate: dayjs(initialValues?.releaseDate),
        }}
        onFormInstanceReady={setFormInstance}
      />
    </Modal>
  );
};

export default EditMovieFormModal;
