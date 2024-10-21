import EmployeeService from '@/services/EmployeeService';
import { FormInstance, Modal, notification } from 'antd';
import { useEffect, useState } from 'react';
import EmployeeForm from './EmployeeForm';

type Props = {
  open: boolean;
  onFinish: (values: any) => void;
  onCancel: () => void;
  initialValues: any;
};

const EditEmployeeFormModal = ({
  initialValues = {},
  onFinish,
  onCancel,
  open,
}: Props) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [formInstance, setFormInstance] = useState<FormInstance>();

  console.log('initialValues', initialValues);
  const handleOk = async () => {
    try {
      const fieldValues = await formInstance?.validateFields();
      console.log('Received values:', fieldValues);
      const values = {
        ...fieldValues,
        birthDate: fieldValues['birthDate'].format('YYYY-MM-DD'),
      };
      await EmployeeService.updateOne(initialValues.id, values);
      setConfirmLoading(true);
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

  useEffect(() => {
    formInstance?.setFieldsValue(initialValues);
  }, [initialValues]);

  return (
    <Modal
      title='Edit employee'
      open={open}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={onCancel}
      cancelText='Cancel'
      okText='Edit'
    >
      <EmployeeForm
        initialValues={initialValues}
        onFormInstanceReady={setFormInstance}
      />
    </Modal>
  );
};

export default EditEmployeeFormModal;
