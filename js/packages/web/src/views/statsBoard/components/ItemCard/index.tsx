import React, { ReactElement } from 'react';
import { Link } from 'react-router-dom';

import { Col, Row, Avatar } from 'antd';

const ItemCard = ({ index, collection }): ReactElement => {
  return (
    <Link to={`/`}>
      <div className="item-card">
        <Row>
          <Col span={2} style={{ paddingLeft: '15px' }}>
            {index + 1}
          </Col>
          <Col span={2}>
            <Avatar
              style={{ height: 50, width: 50, cursor: 'pointer' }}
              src={collection.image}
            />
          </Col>
          <Col xs={15} sm={15} md={7} lg={7}>
            {collection.name}
          </Col>
          <Col xs={5} sm={5} md={4} lg={4}>
            590000
          </Col>
          <Col xs={0} sm={0} md={3} lg={3}>
            3
          </Col>
          <Col xs={0} sm={0} md={3} lg={3}>
            62.63
          </Col>
          <Col xs={0} sm={0} md={3} lg={3}>
            50
          </Col>
        </Row>
      </div>
    </Link>
  );
};

export default ItemCard;
