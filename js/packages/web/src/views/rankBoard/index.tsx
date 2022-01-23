import { useState, useEffect } from 'react';
import { Table, Input, Button, Space, Row, Col } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';

const data = [
  {
    key: '1',
    rank: 1,
    name: 'John Brown',
    tx: 32,
    address: '3qp2RYC8kGGFHhi9owgBoeNA7ZGZrG1drdj1auJjgc7y',
  },
  {
    key: '2',
    rank: 2,
    name: 'Joe Black',
    tx: 42,
    address: 'BZsw9GHKVdgk3qtAnUjq8td2HRfvDfQNNKFV5QRn7YSf',
  },
  {
    key: '3',
    rank: 3,
    name: 'Jim Green',
    tx: 32,
    address: '0x8A9b6a81805034bB136534da843Ea4E0B41dfd3e',
  },
  {
    key: '4',
    rank: 4,
    name: 'Steven Wang',
    tx: 2,
    address: '0x9efBBaB2ea5E40D379494d094FF650DdefE1E205',
  },
];

export const RankBoard = () => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');

  const getColumnSearchProps = dataIndex => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : '',
    // onFilterDropdownVisibleChange: visible => {
    //   if (visible) {
    //     setTimeout(() => this.searchInput.select(), 100);
    //   }
    // },
    render: text =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = clearFilters => {
    clearFilters();
    setSearchText('');
  };

  const columns = [
    {
      title: 'Rank',
      dataIndex: 'rank',
      key: 'rank',
      width: '10%',
      sorter: (a, b) => a.rank - b.rank,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: '20%',
      ...getColumnSearchProps('name'),
    },
    {
      title: 'Wallet Address',
      dataIndex: 'address',
      key: 'address',
      width: '50%',
      ...getColumnSearchProps('address'),
    },
    {
      title: 'Transactions',
      dataIndex: 'tx',
      key: 'tx',
      sorter: (a, b) => a.tx - b.tx,
      sortDirections: ['descend', 'ascend'],
    },
  ];

  return (
    <>
      <Row>
        <div style={{ fontWeight: 700, fontSize: '3rem' }}>Rank Board</div>
      </Row>
      <Table columns={columns} dataSource={data} />
    </>
  );
};
