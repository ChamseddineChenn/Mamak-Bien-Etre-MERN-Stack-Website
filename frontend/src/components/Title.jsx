import React from 'react';

const Title = ({ primaryText, secondaryText }) => {
  return (
    <div className="inline-flex gap-2 items-center mb-3">
      <p className="w-8 sm:w-12 h-[1px] sm:h-[2px] bg-[#3A3A3A]"></p>
      <p className="text-[#3A3A3A]-500">
        {primaryText}{' '}
        <span className="text-[#C4A484] font-medium"> {secondaryText} </span>
      </p>
      <p className="w-8 sm:w-12 h-[1px] sm:h-[2px] bg-[#3A3A3A]"></p>
    </div>
  );
};

export default Title;
