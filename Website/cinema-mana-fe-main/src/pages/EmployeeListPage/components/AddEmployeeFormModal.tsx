import { Form, FormInstance, Modal, notification } from 'antd';
import { useEffect, useState } from 'react';
import EmployeeForm from './EmployeeForm';
import EmployeeService from '@/services/EmployeeService';

type Props = {
  open: boolean;
  onFinish: (values: any) => void;
  onCancel: () => void;
  initialValues?: any;
};

const AddEmployeeFormModal = ({
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
        birthDate: fieldValues['birthDate'].format('YYYY-MM-DD'),
      };

      console.log('Received values:', values);
      setConfirmLoading(true);
      await EmployeeService.createOne(values);
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
      title='Add new employee'
      open={open}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={onCancel}
      cancelText='Cancel'
      okText='Add'
    >
      <EmployeeForm
        initialValues={initialValues}
        onFormInstanceReady={setFormInstance}
      />
    </Modal>
  );
};

export default AddEmployeeFormModal;
