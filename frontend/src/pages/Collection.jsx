import { ShopContext } from '../context/ShopContext';
import React, { useContext, useEffect, useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion';
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumbs = ({
  category,
  subCategory,
  setCategory,
  setSubCategory,
}) => {
  return (
    <nav aria-label="Breadcrumb" className="py-2 px-6">
      <ol className="flex items-center gap-2 text-sm text-[#5C4B42]">
        <li>
          <div className="hover:underline">
            <Link to="/">Home</Link>
          </div>
        </li>
        {/* Collection (always clickable) */}
        <li className="text-[#D6A7A0]">/</li>
        <li>
          <button
            onClick={() => {
              setCategory('');
              setSubCategory('');
            }}
            className="hover:underline cursor-pointer"
          >
            Collection
          </button>
        </li>

        {/* Category (clickable unless it's the current level) */}
        {category && (
          <>
            <li className="text-[#D6A7A0]">/</li>
            <li>
              {subCategory ? (
                <button
                  onClick={() => setSubCategory('')}
                  className="hover:underline cursor-pointer"
                >
                  {category}
                </button>
              ) : (
                <span className="font-medium">{category}</span>
              )}
            </li>
          </>
        )}

        {/* Subcategory (non-clickable, current level) */}
        {subCategory && (
          <>
            <li className="text-[#D6A7A0]">/</li>
            <li className="font-medium">{subCategory}</li>
          </>
        )}
      </ol>
    </nav>
  );
};

const Collection = () => {
  const { products, search, setSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [sortType, setSortType] = useState('relavent');
  const [collectionName, setCollectionName] = useState('');
  const location = useLocation();

  useEffect(() => {
    if (location.state?.autoSelectCategory) {
      setCategory(location.state.autoSelectCategory);
      // Optional: Scroll to top when filter is applied
      window.scrollTo(0, 0);
    }
  }, [location.state]);

  const displayChosenCategory = (cat) => {
    if (category === cat) {
      setCategory('');
    } else {
      setCategory(cat);
    }
    setSubCategory('');
  };

  const displayChosenSubCategory = (cat, subCat) => {
    if (category !== cat) {
      setCategory('');
      setCategory(cat);
    }
    if (subCategory === subCat) {
      setSubCategory('');
    } else {
      setSubCategory('');
      setSubCategory(subCat);
    }
  };

  const displayCollectionName = () => {
    if (subCategory !== '') {
      setCollectionName(subCategory);
    } else if (category !== '') {
      setCollectionName(category);
    } else {
      setCollectionName('Complete');
    }
  };

  const displayProductsCount = () => {
    let numberOfItems = filterProducts.length;
    return numberOfItems;
  };

  const applyFilter = () => {
    let productsCopy = products.slice();

    if (search) {
      productsCopy = productsCopy.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (!category == '') {
      productsCopy = productsCopy.filter((item) =>
        category.includes(item.category)
      );
    }
    if (!subCategory == '') {
      productsCopy = productsCopy.filter((item) =>
        subCategory.includes(item.subCategory)
      );
    }

    setFilterProducts(productsCopy);
  };

  const sortCollection = () => {
    let fpCopy = filterProducts.slice();

    switch (sortType) {
      case 'low-high':
        setFilterProducts(fpCopy.sort((a, b) => a.price - b.price));
        break;
      case 'high-low':
        setFilterProducts(fpCopy.sort((a, b) => b.price - a.price));
        break;

      default:
        applyFilter();
        break;
    }
  };

  useEffect(() => {
    applyFilter();
    displayCollectionName();
    displayProductsCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, subCategory, search]);

  useEffect(() => {
    sortCollection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortType]);

  {
    /* Flyout tag */
  }
  const FlyoutLink = ({ children, href, FlyoutContent }) => {
    const [open, setOpen] = useState(false);
    const showFlyout = open && FlyoutContent;

    return (
      <div
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className="relative h-fit w-fit"
      >
        <a className="relative text-[#3A3A3A]" href={href}>
          {children}
          <span
            className="absolute -bottom-2 -left-2 -right-2 h-0.5 rounded-full bg-[#C4A484] transition-transform duration-300 ease-out"
            style={{ transform: open ? 'scaleX(1)' : 'scaleX(0)' }}
          ></span>
        </a>
        <AnimatePresence>
          {showFlyout && (
            <motion.div
              className="absolute left-1/2 top-17 md:top-15"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              style={{ x: '-50%' }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <div className="absolute bg-transparent -left-0 -right-0 -top-10 h-10" />
              <div className="absolute border-t border-l  left-1/2 top-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-[#E6E4D8]" />
              <FlyoutContent />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  {
    /* Home Fragrance Content */
  }

  const HomeFragranceContent = () => {
    return (
      <div className="border rounded-2xl bg-[#E6E4D8] h-80 md:h-52 w-[35vw] p-6 shadow-xl">
        <div className="flex flex-col py-1">
          <a
            href="#"
            className="block rounded-sm px-4 py-2 text-sm hover:bg-[#D6A7A0] text-[#3A3A3A]"
            onClick={() => {
              displayChosenSubCategory('Home Fragrance', 'Classic Candles');
            }}
          >
            Classic Candles
          </a>
          <a
            href="#"
            className="block rounded-sm  px-4 py-2 text-sm hover:bg-[#D6A7A0] text-[#3A3A3A]"
            onClick={() => {
              displayChosenSubCategory('Home Fragrance', 'Fondant Candles');
            }}
          >
            Fondant Candles
          </a>
          <a
            href="#"
            className="block rounded-sm  px-4 py-2 text-sm hover:bg-[#D6A7A0] text-[#3A3A3A]"
            onClick={() => {
              displayChosenSubCategory('Home Fragrance', 'Diffusers');
            }}
          >
            Diffusers
          </a>
        </div>

        {/* View All Button */}
        <div className="rounded-sm bg-[#D6A7A0]/70">
          <button
            value={'Home Fragrance'}
            onClick={() => displayChosenCategory('Home Fragrance')}
            href="#"
            className="block w-full px-4 py-3 text-sm text-font font-medium text-center text-[#3A3A3A] hover:bg-[#D6A7A0]/40 transition-colors"
          >
            View All Home Fragrance →
          </button>
        </div>
      </div>
    );
  };
  const PerfumesAndScentsContent = () => {
    return (
      <div className="border rounded-2xl bg-[#E6E4D8] h-52 w-[35vw] p-6 shadow-xl">
        <div className="flex flex-col py-1">
          <a
            href="#"
            className="block rounded-sm px-4 py-2 text-sm hover:bg-[#D6A7A0] text-[#3A3A3A]"
          >
            Candles
          </a>
          <a
            href="#"
            className="block rounded-sm  px-4 py-2 text-sm hover:bg-[#D6A7A0] text-[#3A3A3A]"
          >
            Diffusers
          </a>
          <a
            href="#"
            className="block rounded-sm  px-4 py-2 text-sm hover:bg-[#D6A7A0] text-[#3A3A3A]"
          >
            Room Sprays
          </a>
        </div>

        {/* View All Button */}
        <div className="rounded-sm bg-[#D6A7A0]/70">
          <a
            href="#"
            className="block px-4 py-3 text-sm text-font font-medium text-center text-[#3A3A3A] hover:bg-[#D6A7A0]/40 transition-colors"
          >
            View All Home Fragrance →
          </a>
        </div>
      </div>
    );
  };
  const PacksAndSetsContent = () => {
    return (
      <div className="border rounded-2xl bg-[#E6E4D8] h-52 w-[35vw] p-6 shadow-xl">
        <div className="flex flex-col py-1">
          <a
            href="#"
            className="block rounded-sm px-4 py-2 text-sm hover:bg-[#D6A7A0] text-[#3A3A3A]"
          >
            Candles
          </a>
          <a
            href="#"
            className="block rounded-sm  px-4 py-2 text-sm hover:bg-[#D6A7A0] text-[#3A3A3A]"
          >
            Diffusers
          </a>
          <a
            href="#"
            className="block rounded-sm  px-4 py-2 text-sm hover:bg-[#D6A7A0] text-[#3A3A3A]"
          >
            Room Sprays
          </a>
        </div>

        {/* View All Button */}
        <div className="rounded-sm bg-[#D6A7A0]/70">
          <a
            href="#"
            className="block px-4 py-3 text-sm text-font font-medium text-center text-[#3A3A3A] hover:bg-[#D6A7A0]/40 transition-colors"
          >
            View All Home Fragrance →
          </a>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col mt-19.25">
      <div className="flex items-center bg-[#E6E4D8] h-15 w-full shadow-md z-45">
        <div className="flex gap-5 md:gap-20 justify-center md:w-full ps-5 pe-5">
          <FlyoutLink href="#" FlyoutContent={HomeFragranceContent}>
            <p onClick={() => displayChosenCategory('Home Fragrance')}>
              Home Fragrance
            </p>
          </FlyoutLink>
          <FlyoutLink href="#">
            <p onClick={() => displayChosenCategory('Scents')}>Scents</p>
          </FlyoutLink>
          <FlyoutLink href="#">
            <p onClick={() => displayChosenCategory('Packs & Sets')}>
              Packs & Sets
            </p>
          </FlyoutLink>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row mt-5 sm:mt-0 ">
        {/* Filter */}
        <div className="self-start min-w-[20vw] w-[70vw] sm:w-[25vw] md:w-[40] h-auto px-10 md:pt-4 transform -translate-x-[-15vw] sm:-translate-0 md:pb-6 bg-[#E6E4D8] m-2 md:m-5 rounded-2xl transition-all">
          <p
            className="py-2 justify-center text-l md:text-xl flex items-center cursor-pointer gap-10"
            onClick={() => setShowFilter(!showFilter)}
          >
            Filters
            <img
              className={'min-w-7 w-7 sm:hidden'}
              src={assets.menu_icon}
              alt=""
            />
          </p>
          <div
            className={`border-t-2 border-gray-100 pl-5 py-3 mt-6 ${
              showFilter ? '' : 'hidden'
            } sm:block`}
          >
            <p className="mb-3 text-sm font-medium">Price</p>
            <div className="flex flex-col gap-2 text-sm font-light text-[#3A3A3A]">
              <div className="flex gap-2">
                <input
                  className="w-3"
                  type="checkbox"
                  value={'Candles'}
                  name=""
                  id=""
                />
                <p className="">
                  Maximum:
                  <input
                    className="bg-gray-100 rounded ml-2 p-1 w-full"
                    type="text"
                    placeholder="eg: 5000$"
                  />
                </p>
              </div>
              <div className="flex gap-2">
                <input
                  className="w-3"
                  type="checkbox"
                  value={'Candles'}
                  name=""
                  id=""
                />
                <p className="">
                  Minimum:
                  <input
                    className="bg-gray-100 rounded ml-2 p-1 w-full"
                    type="text"
                    placeholder="eg: 80$"
                  />
                </p>
              </div>
            </div>
          </div>
          <div
            className={`border-t-2 border-gray-100 pl-5 py-3 mt-6 ${
              showFilter ? '' : 'hidden'
            } sm:block`}
          >
            <p className="mb-3 text-sm font-medium">Featured</p>
            <div className="flex flex-col gap-2 text-sm font-light text-[#3A3A3A]">
              <div className="flex gap-2">
                <input
                  className="w-3"
                  type="checkbox"
                  value={'Candles'}
                  name=""
                  id=""
                />
                <p className="">On Sale</p>
              </div>
              <div className="flex gap-2">
                <input className="w-3" type="checkbox" name="" id="" />
                <p className="">Limited Edition</p>
              </div>
              <div className="flex gap-2">
                <input
                  className="w-3"
                  type="checkbox"
                  value={'Candles'}
                  name=""
                  id=""
                />
                <p className="">New</p>
              </div>
              <div className="flex gap-2">
                <input
                  className="w-3"
                  type="checkbox"
                  value={'Candles'}
                  name=""
                  id=""
                />
                <p className="">Best Seller</p>
              </div>
              <div className="flex gap-2">
                <input
                  className="w-3"
                  type="checkbox"
                  value={'Candles'}
                  name=""
                  id=""
                />
                <p className="">Bundles</p>
              </div>
            </div>
          </div>
          <div
            className={`border-t-2 border-gray-100 pl-5 py-3 mt-6 ${
              showFilter ? '' : 'hidden'
            } sm:block`}
          >
            <p className="mb-3 text-sm font-medium">Flavors</p>
            <div className="flex flex-col gap-2 text-sm font-light text-[#3A3A3A]">
              <div className="flex gap-2">
                <input
                  className="w-3"
                  type="checkbox"
                  value={'Candles'}
                  name=""
                  id=""
                />
                <p className="">Floral</p>
              </div>
              <div className="flex gap-2">
                <input
                  className="w-3"
                  type="checkbox"
                  value={'Candles'}
                  name=""
                  id=""
                />
                <p className="">Fresh/Citrus</p>
              </div>
              <div className="flex gap-2">
                <input
                  className="w-3"
                  type="checkbox"
                  value={'Candles'}
                  name=""
                  id=""
                />
                <p className="">Sweet/Grourmand</p>
              </div>
              <div className="flex gap-2">
                <input
                  className="w-3"
                  type="checkbox"
                  value={'Candles'}
                  name=""
                  id=""
                />
                <p className="">Earthy</p>
              </div>
              <div className="flex gap-2">
                <input
                  className="w-3"
                  type="checkbox"
                  value={'Candles'}
                  name=""
                  id=""
                />
                <p className="">Spicy</p>
              </div>
              <div className="flex gap-2">
                <input
                  className="w-3"
                  type="checkbox"
                  value={'Candles'}
                  name=""
                  id=""
                />
                <p className="">Herbal</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 min-w-[65vw] min-h-[100vh] md:min-w-[74vw] m-2 md:m-5 p-2">
          <div className="flex justify-center text-3xl">
            <Title primaryText={collectionName} secondaryText={'Collection'} />
            {/* Products Section */}
          </div>
          <Breadcrumbs
            category={category}
            subCategory={subCategory}
            setCategory={setCategory}
            setSubCategory={setSubCategory}
          />
          {/* Next Section is for the products navigation bar with the search bar & sorting selector */}
          <div className="flex flex-col sm:flex-row items-center justify-between bg-[#A6A584] h-45 sm:h-15 rounded-2xl mb-5 px-4 m-5 lg:mr-5 xl:mr-0 py-2 gap-2 sm:gap-0">
            <div className="flex items-center gap-2 w-full sm:w-auto sm:mr-auto">
              <img
                className="w-7 min-w-7 object-contain cursor-pointer"
                src={assets.search_icon}
                alt=""
              />
              <input
                className="m-2 p-2  border border-none focus:outline-none rounded-2xl bg-gray-100 w-full sm:w-[20vw] md:w-auto"
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <p className="text-center sm:absolute sm:left-1/2 sm:transform sm:translate-x-25 whitespace-nowrap">
              {displayProductsCount() + ' Products found'}
            </p>
            <div className="w-auto flex justify-end">
              <select
                className="left-1/2 h-10 border-1 rounded-2xl border-gray-600 text-sm px-3 pr-7 appearance-none bg-gray-100 cursor-pointer hover:bg-gray-200 focus:ring-red-600 focus:border-transparent transition-all"
                onChange={(e) => setSortType(e.target.value)}
                name="Order by:"
                id=""
              >
                z<option value="relavent">Sort By: Relavent</option>
                <option value="low-high">Sort By: Low to High Price</option>
                <option value="high-low">Sort By: High to Low Price</option>
              </select>
            </div>
          </div>
          {/* Actual placement of the products */}
          <div className="grid justify-items-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 gap-y-6 m-5 lg:mr-5 xl:mr-0">
            {filterProducts.map((item, index) => (
              <ProductItem
                key={index}
                name={item.name}
                id={item._id}
                price={item.price}
                image={item.image}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collection;
