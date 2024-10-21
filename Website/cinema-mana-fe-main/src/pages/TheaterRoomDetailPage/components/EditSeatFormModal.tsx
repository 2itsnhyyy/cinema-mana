import ShowtimeService from '@/services/ShowtimeService';
import TheaterRoomService from '@/services/TheaterRoomService';
import { Form, Modal, Select, notification } from 'antd';
import { useEffect, useState } from 'react';

type Props = {
  open: boolean;
  onFinish: (values: any) => void;
  onCancel: () => void;
  initialValues: any;
  roomId: number;
  selectedSeatIds: number[];
};

const EditSeatFormModal = ({
  initialValues = {},
  onFinish,
  onCancel,
  open,
  roomId,
  selectedSeatIds,
}: Props) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();
  const handleOk = async () => {
    try {
      const fieldValues = await form?.validateFields();
      form?.resetFields();
      // call API edit here
      setConfirmLoading(true);
      await TheaterRoomService.updateSeats(roomId, {
        ...fieldValues,
        seatIds: selectedSeatIds.map((id) => Number(id)),
      });
      onFinish(fieldValues);
      form.resetFields();
      notification.open({
        type: 'success',
        message: 'Successfully edit seats',
      });
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

  useEffect(() => {
    form?.setFieldsValue(initialValues);
  }, [initialValues]);

  return (
    <Modal
      title='Edit seats'
      open={open}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={onCancel}
      cancelText='Cancel'
      okText='Edit'
    >
      <Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 24 }}
        layout='horizontal'
        initialValues={initialValues}
        form={form}
      >
        <Form.Item label='Seat type' name='seatType'>
          <Select
            placeholder='Select a seat type'
            optionFilterProp='children'
            options={[
              { label: 'VIP', value: 'VIP' },
              { label: 'Economy', value: 'ECONOMY' },
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditSeatFormModal;