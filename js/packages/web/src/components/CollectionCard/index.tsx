import { Link } from 'react-router-dom';
import { Card, Image, Typography, Badge, Avatar } from 'antd';
import { ThreeDots } from '../MyLoader';
import { CardLoader } from '../MyLoader';

const { Title } = Typography;
const { Meta } = Card;

export const CollectionCard = (props: any) => {
  const { creator, image, name, className, description, maxSize } = props;
  return (
    <Link to={`/collections/${creator}/${name.trim()}`}>
      <Card hoverable={true} className={`art-card ${className ?? ''}`}>
        <div className="art-card__header">
          <div className="edition-badge">{name}</div>
        </div>
        <div className="art-content__wrapper">
          <Image
            fallback="image-placeholder.svg"
            src={image}
            preview={false}
            wrapperClassName={className}
            loading="lazy"
            placeholder={<ThreeDots />}
          />
        </div>
        <Meta title={`${description}`} />
      </Card>
    </Link>
  );
};

export const CollectionsContentView = ({ loading, collections }) => {
  return (
    <div className="artwork-grid">
      {!loading ? (
        collections && collections.length > 0 ? (
          collections.map((item, index) => (
            <CollectionCard {...item} key={index} />
          ))
        ) : (
          <span>No filtered collections</span>
        )
      ) : (
        Array(4)
          .fill({})
          .map((_, index) => <CardLoader key={index} />)
      )}
    </div>
  );
};

export const CollectionCard2 = props => {
  const { creator, image, name, members } = props;

  return (
    <>
      <Link to={`/collections/${creator}/${name.trim()}`}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Badge count={members.length} offset={[-15, 15]} color="pink">
            <Avatar
              style={{ height: 110, width: 110, cursor: 'pointer' }}
              src={image}
            />
          </Badge>
          <Title level={2} style={{ margin: '0 0 0 20px' }}>
            {name}
          </Title>
        </div>
      </Link>
    </>
  );
};
