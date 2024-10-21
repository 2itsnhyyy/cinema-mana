import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input } from 'antd';
import styles from './index.module.scss';
import { useNavigate } from 'react-router-dom';
import AuthService from '@/services/AuthService';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';

type Props = {};

const LoginPage = (props: Props) => {
  const navigate = useNavigate();
  const { employee, login } = useAuth();

  useEffect(() => {
    if (employee) {
      navigate('/');
    }
  }, [employee]);

  const handleOnFinish = async (values: any) => {
    try {
      let response = await AuthService.login(values.username, values.password);
      login(response.data.employee, response.data.accessToken);
      alert('Login successful');
    } catch (error) {
      alert('Login failed');
      console.log('error', error);
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.formLogin}>
        <h1 className={styles.loginTitle}>LOGIN</h1>
        <h4 className={styles.loginMessage}>Welcome to Cinema Management</h4>
        <Form
          name={styles.normalLogin}
          className={styles.loginForm}
          initialValues={{ remember: true }}
          onFinish={handleOnFinish}
        >
          <Form.Item
            name='username'
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input
              prefix={<UserOutlined className='site-form-item-icon' />}
              placeholder='Username'
            />
          </Form.Item>

          <Form.Item
            name='password'
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              allowClear
              prefix={<LockOutlined className='site-form-item-icon' />}
              type='password'
              placeholder='Password'
            />
          </Form.Item>

          <div className='flex items-center justify-between my-4'>
            <Form.Item name='remember' valuePropName='checked' noStyle>
              <Checkbox className={styles.formCheck}>Remember me</Checkbox>

            </Form.Item>

            <a href="">
              Forgot password
            </a>
          </div>

          <Form.Item>
            <Button
              type='primary'
              htmlType='submit'
              className={styles.loginFormButton}
            >
              Log in
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
