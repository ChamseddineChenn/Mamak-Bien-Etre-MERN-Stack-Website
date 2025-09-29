import { ShopContext } from '../context/ShopContext';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ProductItem = ({
  id,
  image,
  name,
  price,
  bestSeller,
  newArrival,
  onSale,
  onSalePercent,
  quantity, // Add quantity prop
}) => {
  const { currency } = useContext(ShopContext);
  const { t } = useTranslation();

  return (
    <Link
      className="text-[#3A3A3A] cursor-pointer relative group"
      to={`/product/${id}`}
    >
      {quantity === 0 && (
        <div className="absolute top-0 left-0 w-full h-[90%] bg-opacity-60 flex items-center justify-center z-10">
          <span className="text-[#A6A58A] bg-black/70 w-full m-auto text-center font-bold text-lg mx-2 rounded">
            {t('sold_out')}
          </span>
        </div>
      )}
      {/* Flags Container */}
      <div className="absolute top-3 left-3 z-10 flex flex-col space-y-2">
        {bestSeller && (
          <span className="bg-[#FFD700] text-[#5C4B42] px-2 py-1 rounded-full text-xs font-medium">
            {t('best_seller')}
          </span>
        )}
        {newArrival && (
          <span className="bg-[#FF6B6B] text-white px-2 py-1 rounded-full text-xs font-medium">
            {t('new')}
          </span>
        )}
        {onSale && (
          <span className="bg-[#6BCB77] text-white px-2 py-1 rounded-full text-xs font-medium">
            {t('sale')}: {onSalePercent}%
          </span>
        )}
      </div>

      <div className="overflow-hidden h-auto w-auto rounded-xl">
        <img
          className="object-contain w-full aspect-square hover:scale-110 transition ease-in-out"
          src={image[0]}
          alt={name}
        />
      </div>
      <p className="pt-3 pb-1 text-sm">{name}</p>
      <div className="flex items-baseline gap-2">
        {onSale ? (
          <>
            <p className="text-sm font-medium text-[#D6A7A0]">
              {currency} {(price * (1 - onSalePercent / 100)).toFixed(2)}
            </p>
            <p className="text-xs text-gray-400 line-through">
              {currency} {price.toFixed(2)}
            </p>
          </>
        ) : (
          <p className="text-sm font-medium">
            {currency} {price.toFixed(2)}
          </p>
        )}
      </div>
    </Link>
  );
};

export default ProductItem;
