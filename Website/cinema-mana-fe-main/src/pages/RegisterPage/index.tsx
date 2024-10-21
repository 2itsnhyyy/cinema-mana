import { Col, Row } from 'antd';
import React from 'react';
type Props = {};

const RegisterPage = (props: Props) => {
  return (
    <Row className='rounded-md'>
      <Col span={8}></Col>
      <Col span={16}>
        <div>Register</div>
      </Col>
    </Row>
  );
};

export default RegisterPage;
