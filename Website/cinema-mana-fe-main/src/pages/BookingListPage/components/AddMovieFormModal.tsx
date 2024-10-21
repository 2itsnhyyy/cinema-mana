import { FormInstance, Modal } from 'antd';
import { useState } from 'react';
import MovieForm from './MovieForm';
import MovieService from '@/services/MovieService';

type Props = {
  open: boolean;
  onFinish: (values: any) => void;
  onCancel: () => void;
  initialValues?: any;
};

const AddMovieFormModal = ({
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
        releaseDate: fieldValues['releaseDate'].format('YYYY-MM-DD'),
      };
      console.log('Success:', values);
      setConfirmLoading(true);
      await MovieService.createOne(values);
      setConfirmLoading(false);
      onFinish(values);
      formInstance?.resetFields();
    } catch (error) {
      console.log('Failed:', error);
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <Modal
      title='Add new movie'
      open={open}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={onCancel}
      cancelText='Cancel'
      okText='Add'
    >
      <MovieForm
        initialValues={initialValues}
        onFormInstanceReady={setFormInstance}
      />
    </Modal>
  );
};

export default AddMovieFormModal;
