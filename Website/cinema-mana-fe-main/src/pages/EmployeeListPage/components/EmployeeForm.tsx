import { EmployeeGender, EmployeeRole } from '@/types';
import { DatePicker, Form, FormInstance, Input, Select } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';

type Props = {
  onFormInstanceReady: (instance: FormInstance<any>) => void;
  initialValues: any;
};

const EmployeeForm = ({ initialValues, onFormInstanceReady }: Props) => {
  const [form] = Form.useForm();

  console.log('initialValues', initialValues);
  useEffect(() => {
    onFormInstanceReady(form);
  }, []);

  return (
    <Form
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 20 }}
      layout='horizontal'
      style={{ maxWidth: 1000 }}
      initialValues={initialValues}
      form={form}
    >
      <Form.Item label='Full name' name='name' required>
        <Input />
      </Form.Item>
      {/* add */}
      <Form.Item label='Gender' name='gender' required>
        <Select>
          {Object.values(EmployeeGender).map((gender) => (
            <Select.Option key={gender} value={gender}>
              {gender.toUpperCase()}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label='Role' name='role' required>
        <Select>
          {Object.values(EmployeeRole).map((role) => (
            <Select.Option key={role} value={role}>
              {role.toUpperCase()}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        label='Birth Date'
        name='birthDate'
        required
        initialValue={
          initialValues?.birthDate ? dayjs(initialValues.birthDate) : dayjs()
        }
        getValueProps={(i) => {
          return { value: dayjs(i) };
        }}
      >
        <DatePicker />
      </Form.Item>
      <Form.Item label='Address' name='address'>
        <Input />
      </Form.Item>
      <Form.Item label='Phone number' name='phoneNumber'>
        <Input />
      </Form.Item>
      <Form.Item label='Identity Card' name='identityCard'>
        <Input />
      </Form.Item>
      <Form.Item label='Username' name='username'>
        <Input />
      </Form.Item>
      <Form.Item
        label='Password'
        name='password'
        help='Leave blank to keep the old password'
      >
        <Input.Password allowClear />
      </Form.Item>
    </Form>
  );
};

export default EmployeeForm;
