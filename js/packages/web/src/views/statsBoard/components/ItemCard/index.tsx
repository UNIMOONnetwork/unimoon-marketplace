import React, { ReactElement } from 'react';
import { Link } from 'react-router-dom';

import { Col, Row, Avatar } from 'antd';

const ItemCard = ({ index, collection }): ReactElement => {
  return (
    <Link to={`/`}>
      <div className="item-card">
        <Row>
          <Col xs={4} sm={4} md={2} lg={2} style={{ paddingLeft: '15px' }}>
            {index + 1}
          </Col>
          <Col xs={0} sm={0} md={2} lg={2}>
            <Avatar
              style={{ height: 50, width: 50, cursor: 'pointer' }}
              src={collection.image}
            />
          </Col>
          <Col xs={15} sm={15} md={8} lg={8}>
            {collection.name}
          </Col>
          <Col xs={5} sm={5} md={4} lg={4}>
            {collection.members.length}
          </Col>
          <Col xs={0} sm={0} md={4} lg={4}>
            0
          </Col>
          <Col xs={0} sm={0} md={4} lg={4}>
            0
          </Col>
        </Row>
      </div>
    </Link>
  );
};

export default ItemCard;
