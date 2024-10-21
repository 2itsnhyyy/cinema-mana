import {
  Checkbox,
  DatePicker,
  Form,
  FormInstance,
  Input,
  InputNumber,
  Modal,
  Select,
} from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

type Props = {
  onFormInstanceReady: (instance: FormInstance<any>) => void;
  initialValues: any;
};

const MovieForm = ({ initialValues, onFormInstanceReady }: Props) => {
  const [form] = Form.useForm();

  console.log('initialValues', initialValues);
  useEffect(() => {
    onFormInstanceReady(form);
  }, []);

  return (
    <Form
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      layout='horizontal'
      style={{ maxWidth: 1200 }}
      initialValues={initialValues}
      form={form}
    >
      <Form.Item label='Title' name='title'>
        <Input />
      </Form.Item>

      <Form.Item label='Author' name='author'>
        <Input />
      </Form.Item>

      <Form.Item label='Poster' name='poster' help='Input image URL'>
        <Input />
      </Form.Item>

      <Form.Item label='Description' name='description'>
        <Input.TextArea />
      </Form.Item>

      <Form.Item label='Type' name='type'>
        <Input />
      </Form.Item>

      <Form.Item label='Duration' name='duration' help='minutes'>
        <InputNumber />
      </Form.Item>

      <Form.Item
        label='Release Date'
        name='releaseDate'
        initialValue={
          initialValues?.releaseDate
            ? dayjs(initialValues.releaseDate)
            : dayjs()
        }
        getValueProps={(i) => {
          return { value: dayjs(i) };
        }}
      >
        <DatePicker />
      </Form.Item>
      <Form.Item label='Published' name='isPublished' valuePropName='checked'>
        <Checkbox />
      </Form.Item>
    </Form>
  );
};

export default MovieForm;
