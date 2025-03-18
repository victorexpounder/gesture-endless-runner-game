import React from 'react';
import { Space, Table, Tag } from 'antd';
const columns = [
  {
    title: 'Number',
    dataIndex: 'key',
    key: 'key',
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Distance',
    dataIndex: 'distance',
    key: 'distance',
  },
];
const data = [
  {
    key: '1',
    name: 'John Brown 🇳🇬',
    distance: 32,
  },
  {
    key: '2',
    name: 'Jesse Souh 🇨🇳',
    distance: 32,
  },
  
];
const TableComponent  = () => <Table columns={columns} dataSource={data} pagination={false} />;
export default TableComponent;