import { Link } from 'react-router-dom';
import { Card, Image, Button, Badge } from 'antd';
import { ThreeDots } from '../MyLoader';

const { Meta } = Card;

export const CollectionCard = (props: any) => {
  const { creator, image, name, className, description, maxSize } = props;

  return (
    <Link to={`/collections/${creator}/${name}`}>
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
