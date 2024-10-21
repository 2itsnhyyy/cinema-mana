import { Checkbox, Form, FormInstance, Input, InputNumber } from 'antd';
import { useEffect } from 'react';

type Props = {
  onFormInstanceReady: (instance: FormInstance<any>) => void;
  initialValues: any;
};

const TheaterRoomForm = ({ initialValues, onFormInstanceReady }: Props) => {
  const [form] = Form.useForm();
  useEffect(() => {
    onFormInstanceReady(form);
  }, []);

  return (
    <Form
      labelCol={{ span: 10 }}
      wrapperCol={{ span: 20 }}
      layout='horizontal'
      initialValues={initialValues}
      form={form}
    >
      <Form.Item label='Room number' name='roomNumber' required>
        <Input />
      </Form.Item>

      <Form.Item label='Number of rows' name='numOfRows' required>
        <InputNumber min={1} />
      </Form.Item>
      <Form.Item
        label='Number of seats per row'
        name='numOfSeatsPerRow'
        required
      >
        <InputNumber min={1} />
      </Form.Item>

      <Form.Item label='Active' name='isActive' valuePropName='checked'>
        <Checkbox />
      </Form.Item>
    </Form>
  );
};

export default TheaterRoomForm;
