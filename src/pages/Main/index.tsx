import './index.scss'
import React from 'react';
import Content from './Content';
import { Layout } from 'antd';

const Main: React.FC = () => {
 
  return (
    <Layout className="main">
      <Content />
    </Layout>
  )
}

export default Main
