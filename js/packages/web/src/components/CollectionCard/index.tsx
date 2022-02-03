import { Link } from 'react-router-dom';

export const CollectionCard = (props: any) => {
  const { creator, image, name } = props;

  return (
    <Link to={`/collections/${creator}/${name}`}>
      <div className="card-wrapper">
        <div
          className="item-card"
          style={{ backgroundImage: `url(${image || image})` }}
        />
        <div
          className="suisse-normal-black text-center"
          style={{ fontSize: 20, marginBottom: 20 }}
        >
          {name}
        </div>
      </div>
    </Link>
  );
};
