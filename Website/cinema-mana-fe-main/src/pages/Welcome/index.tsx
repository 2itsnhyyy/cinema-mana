import { Card, Col, Image, Row } from 'antd';
import React from 'react';

const Welcome = () => {
  return (
    <Card className='h-full'>
      <Row className='h-full' justify='center'>
        <Col span={24}>
          <h1 className='text-2xl text-blue-600' style={
            {fontWeight: 'bold'
          }}>
            Welcome to Cinema Management
          </h1>
          <h5 className='text-base text-slate-700 mt-2'>
            Find your future! Manage your cinema with us
          </h5>
        </Col>
        <Col span={10}>
          {/* <Image src={Cinama} alt='logo' height={'100%'} preview={false} /> */}
        </Col>
      </Row>
    </Card>
  );
};

export default Welcome;
