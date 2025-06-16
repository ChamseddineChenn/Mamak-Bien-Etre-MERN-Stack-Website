import { ShopContext } from '../context/ShopContext';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

const ProductItem = ({ id, image, name, price }) => {
  const { currency } = useContext(ShopContext);

  return (
    <Link className="text-[#3A3A3A] cursor-pointer" to={`/product/${id}`}>
      <div className="overflow-hidden h-auto w-auto rounded-xl">
        <img
          className="object-contain w-full aspect-square hover:scale-110 transition ease-in-out"
          src={image[0]}
          alt=""
        />
      </div>
      <p className="pt-3 pb-1 text-sm">{name}</p>
      <p className="text-sm font-medium">
        {currency} {price}
      </p>
    </Link>
  );
};

export default ProductItem;
