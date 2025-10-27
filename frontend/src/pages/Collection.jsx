import { ShopContext } from '../context/ShopContext';
import React, { useContext, useEffect, useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion';
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Helper function to map category names to translation keys
const getCategoryTranslationKey = (categoryName) => {
  const translationMap = {
    'Home Fragrance': 'home_fragrance',
    'Classic Candles': 'classic_candles',
    'Fondant Candles': 'fondant_candles',
    'Poured Candle': 'poured_candle',
    'Linen Candle': 'linen_candle',
    'Melt Candle': 'melt_candle',
    'Gemstone Candle': 'gemstone_candle',
    'Art Pouring': 'art_pouring',
    'Mug Pouring': 'mug_pouring',
    'Decorative Pouring': 'decorative_pouring',
    Diffusers: 'diffusers',
    Scents: 'scents',
    'Packs & Sets': 'packs_sets',
    Gift: 'gift',
    'House Warming': 'house_warming',
    'Special Offer': 'special_offer',
    'Complete Collection': 'complete_collection',
  };

  return (
    translationMap[categoryName] ||
    categoryName.toLowerCase().replace(/\s+/g, '_')
  );
};

const Breadcrumbs = ({
  category,
  subCategory,
  setCategory,
  setSubCategory,
}) => {
  const { t } = useTranslation();

  return (
    <nav aria-label="Breadcrumb" className="py-2 px-6">
      <ol className="flex items-center gap-2 text-sm text-[#5C4B42]">
        <li>
          <div className="hover:underline">
            <Link to="/">{t('home')}</Link>
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
            {t('collection')}
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
                  {t(getCategoryTranslationKey(category))}
                </button>
              ) : (
                <span className="font-medium">
                  {t(getCategoryTranslationKey(category))}
                </span>
              )}
            </li>
          </>
        )}

        {/* Subcategory (non-clickable, current level) */}
        {subCategory && (
          <>
            <li className="text-[#D6A7A0]">/</li>
            <li className="font-medium">
              {t(getCategoryTranslationKey(subCategory))}
            </li>
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
  const [sortType, setSortType] = useState('relevant');
  const [collectionName, setCollectionName] = useState('');
  const location = useLocation();
  const { t } = useTranslation();

  // Mobile dropdown states
  const [mobileDropdown, setMobileDropdown] = useState(null);

  //Filters
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [showOnSale, setShowOnSale] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showBestSeller, setShowBestSeller] = useState(false);

  const displayChosenCategory = (cat) => {
    if (category === cat) {
      setCategory('');
    } else {
      setCategory(cat);
    }
    setSubCategory('');
    setMobileDropdown(null);
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
    setMobileDropdown(null);
  };

  const displayCollectionName = () => {
    if (subCategory !== '') {
      setCollectionName(subCategory);
    } else if (category !== '') {
      setCollectionName(category);
    } else {
      setCollectionName('Complete Collection');
    }
  };

  const displayProductsCount = () => {
    let numberOfItems = filterProducts.length;
    return `${numberOfItems} ${t('products_found')}`;
  };

  const applyFilter = () => {
    let filtered = [...products];

    // Search filter
    if (search) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Category filters
    if (category) {
      filtered = filtered.filter((item) => item.category === category);
    }
    if (subCategory) {
      filtered = filtered.filter((item) => item.subCategory === subCategory);
    }

    // Price filters
    if (minPrice) {
      const min = parseFloat(minPrice);
      if (!isNaN(min)) {
        filtered = filtered.filter((item) => item.price >= min);
      }
    }
    if (maxPrice) {
      const max = parseFloat(maxPrice);
      if (!isNaN(max)) {
        filtered = filtered.filter((item) => item.price <= max);
      }
    }

    // Featured filters
    if (showOnSale) {
      filtered = filtered.filter((item) => item.onSale);
    }
    if (showNew) {
      filtered = filtered.filter((item) => item.newArrival);
    }
    if (showBestSeller) {
      filtered = filtered.filter((item) => item.bestSeller);
    }

    return filtered;
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
    if (location.state?.autoSelectCategory) {
      setCategory(location.state.autoSelectCategory);
      window.scrollTo(0, 0);
    }
  }, [location.state]);

  useEffect(() => {
    setFilterProducts(applyFilter());
    displayCollectionName();
    displayProductsCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    products,
    search,
    category,
    subCategory,
    sortType,
    minPrice,
    maxPrice,
    showOnSale,
    showNew,
    showBestSeller,
  ]);

  useEffect(() => {
    sortCollection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortType, products]);

  {
    /* Flyout tag - Desktop version with hover */
  }
  const FlyoutLink = ({ children, href, FlyoutContent }) => {
    const [open, setOpen] = useState(false);
    const showFlyout = open && FlyoutContent;

    return (
      <div
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className="relative h-fit w-fit hidden sm:block"
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
    const { t } = useTranslation();

    return (
      <div className="border rounded-2xl bg-[#E6E4D8] h-96 w-[35vw] p-6 shadow-xl">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col py-1">
            <h3 className="font-medium text-[#5C4B42] mb-2 text-sm">Candles</h3>
            <a
              href="#"
              className="block rounded-sm px-3 py-2 text-sm hover:bg-[#D6A7A0] text-[#3A3A3A]"
              onClick={() => {
                displayChosenSubCategory('Home Fragrance', 'Classic Candles');
              }}
            >
              {t('classic_candles')}
            </a>
            <a
              href="#"
              className="block rounded-sm px-3 py-2 text-sm hover:bg-[#D6A7A0] text-[#3A3A3A]"
              onClick={() => {
                displayChosenSubCategory('Home Fragrance', 'Fondant Candles');
              }}
            >
              {t('fondant_candles')}
            </a>
            <a
              href="#"
              className="block rounded-sm px-3 py-2 text-sm hover:bg-[#D6A7A0] text-[#3A3A3A]"
              onClick={() => {
                displayChosenSubCategory('Home Fragrance', 'Poured Candle');
              }}
            >
              {t('poured_candle')}
            </a>
            <a
              href="#"
              className="block rounded-sm px-3 py-2 text-sm hover:bg-[#D6A7A0] text-[#3A3A3A]"
              onClick={() => {
                displayChosenSubCategory('Home Fragrance', 'Linen Candle');
              }}
            >
              {t('linen_candle')}
            </a>
            <a
              href="#"
              className="block rounded-sm px-3 py-2 text-sm hover:bg-[#D6A7A0] text-[#3A3A3A]"
              onClick={() => {
                displayChosenSubCategory('Home Fragrance', 'Gemstone Candle');
              }}
            >
              {t('gemstone_candle')}
            </a>
          </div>

          <div className="flex flex-col py-1">
            <h3 className="font-medium text-[#5C4B42] mb-2 text-sm">Pouring</h3>
            <a
              href="#"
              className="block rounded-sm px-3 py-2 text-sm hover:bg-[#D6A7A0] text-[#3A3A3A]"
              onClick={() => {
                displayChosenSubCategory('Home Fragrance', 'Art Pouring');
              }}
            >
              {t('art_pouring')}
            </a>
            <a
              href="#"
              className="block rounded-sm px-3 py-2 text-sm hover:bg-[#D6A7A0] text-[#3A3A3A]"
              onClick={() => {
                displayChosenSubCategory('Home Fragrance', 'Mug Pouring');
              }}
            >
              {t('mug_pouring')}
            </a>
            <a
              href="#"
              className="block rounded-sm px-3 py-2 text-sm hover:bg-[#D6A7A0] text-[#3A3A3A]"
              onClick={() => {
                displayChosenSubCategory(
                  'Home Fragrance',
                  'Decorative Pouring'
                );
              }}
            >
              {t('decorative_pouring')}
            </a>

            <div className="mt-4">
              <h3 className="font-medium text-[#5C4B42] mb-2 text-sm">Other</h3>
              <a
                href="#"
                className="block rounded-sm px-3 py-2 text-sm hover:bg-[#D6A7A0] text-[#3A3A3A]"
                onClick={() => {
                  displayChosenSubCategory('Home Fragrance', 'Diffusers');
                }}
              >
                {t('diffusers')}
              </a>
              <a
                href="#"
                className="block rounded-sm px-3 py-2 text-sm hover:bg-[#D6A7A0] text-[#3A3A3A]"
                onClick={() => {
                  displayChosenSubCategory('Home Fragrance', 'Scents');
                }}
              >
                {t('scents')}
              </a>
            </div>
          </div>
        </div>

        {/* View All Button */}
        <div className="rounded-sm bg-[#D6A7A0]/70 mt-4">
          <button
            value={'Home Fragrance'}
            onClick={() => displayChosenCategory('Home Fragrance')}
            href="#"
            className="block w-full px-4 py-3 text-sm text-font font-medium text-center text-[#3A3A3A] hover:bg-[#D6A7A0]/40 transition-colors"
          >
            {t('view_all')} {t('home_fragrance')} →
          </button>
        </div>
      </div>
    );
  };

  {
    /* Packs & Sets Content */
  }
  const PacksSetsContent = () => {
    const { t } = useTranslation();

    return (
      <div className="border rounded-2xl bg-[#E6E4D8] h-52 w-[25vw] px-6 py-2 shadow-xl">
        <div className="flex flex-col py-1">
          <a
            href="#"
            className="block rounded-sm px-4 py-2 text-sm hover:bg-[#D6A7A0] text-[#3A3A3A]"
            onClick={() => {
              displayChosenSubCategory('Packs & Sets', 'Gift');
            }}
          >
            {t('gift')}
          </a>
          <a
            href="#"
            className="block rounded-sm px-4 py-2 text-sm hover:bg-[#D6A7A0] text-[#3A3A3A]"
            onClick={() => {
              displayChosenSubCategory('Packs & Sets', 'House Warming');
            }}
          >
            {t('house_warming')}
          </a>
          <a
            href="#"
            className="block rounded-sm px-4 py-2 text-sm hover:bg-[#D6A7A0] text-[#3A3A3A]"
            onClick={() => {
              displayChosenSubCategory('Packs & Sets', 'Special Offer');
            }}
          >
            {t('special_offer')}
          </a>
        </div>

        {/* View All Button */}
        <div className="rounded-sm bg-[#D6A7A0]/70 mt-4">
          <button
            value={'Packs & Sets'}
            onClick={() => displayChosenCategory('Packs & Sets')}
            href="#"
            className="block w-full px-4 py-3 text-sm text-font font-medium text-center text-[#3A3A3A] hover:bg-[#D6A7A0]/40 transition-colors"
          >
            {t('view_all')} {t('packs_sets')} →
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col mt-19.25">
      {/* Category Navigation Bar */}
      <div className="flex items-center bg-[#E6E4D8] h-15 w-full shadow-md z-45">
        {/* Desktop Navigation */}
        <div className="hidden sm:flex gap-5 md:gap-20 justify-center md:w-full ps-5 pe-32">
          <FlyoutLink href="#" FlyoutContent={HomeFragranceContent}>
            <p onClick={() => displayChosenCategory('Home Fragrance')}>
              {t('home_fragrance')}
            </p>
          </FlyoutLink>

          <FlyoutLink href="#" FlyoutContent={PacksSetsContent}>
            <p onClick={() => displayChosenCategory('Packs & Sets')}>
              {t('packs_sets')}
            </p>
          </FlyoutLink>
        </div>

        {/* Mobile Navigation */}
        <div className="sm:hidden w-full px-4">
          <div className="flex flex-col space-y-2 w-full relative">
            {/* Home Fragrance Mobile Dropdown */}
            <div className="relative">
              <button
                onClick={() =>
                  setMobileDropdown(
                    mobileDropdown === 'homeFragrance' ? null : 'homeFragrance'
                  )
                }
                className="w-full flex justify-between items-center py-3 px-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-[#5C4B42]">
                  {t('home_fragrance')}
                </span>
                <svg
                  className={`w-4 h-4 transition-transform ${
                    mobileDropdown === 'homeFragrance' ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {mobileDropdown === 'homeFragrance' && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-32 px-4">
                  <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] overflow-y-auto">
                    <div className="p-4 space-y-3">
                      <div className="flex justify-between items-center border-b pb-2">
                        <h2 className="text-lg font-semibold text-[#5C4B42]">
                          {t('home_fragrance')}
                        </h2>
                        <button
                          onClick={() => setMobileDropdown(null)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>

                      {/* Candles Section */}
                      <div>
                        <h3 className="font-semibold text-[#5C4B42] mb-2 text-sm border-b pb-1">
                          Candles
                        </h3>
                        <div className="space-y-1">
                          {[
                            'Classic Candles',
                            'Fondant Candles',
                            'Poured Candle',
                            'Linen Candle',
                            'Gemstone Candle',
                          ].map((subCat) => (
                            <button
                              key={subCat}
                              onClick={() =>
                                displayChosenSubCategory(
                                  'Home Fragrance',
                                  subCat
                                )
                              }
                              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-[#F5F3EB] rounded-md transition-colors"
                            >
                              {t(getCategoryTranslationKey(subCat))}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Pouring Section */}
                      <div>
                        <h3 className="font-semibold text-[#5C4B42] mb-2 text-sm border-b pb-1">
                          Pouring
                        </h3>
                        <div className="space-y-1">
                          {[
                            'Art Pouring',
                            'Mug Pouring',
                            'Decorative Pouring',
                          ].map((subCat) => (
                            <button
                              key={subCat}
                              onClick={() =>
                                displayChosenSubCategory(
                                  'Home Fragrance',
                                  subCat
                                )
                              }
                              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-[#F5F3EB] rounded-md transition-colors"
                            >
                              {t(getCategoryTranslationKey(subCat))}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Other Section */}
                      <div>
                        <h3 className="font-semibold text-[#5C4B42] mb-2 text-sm border-b pb-1">
                          Other
                        </h3>
                        <div className="space-y-1">
                          {['Diffusers', 'Scents'].map((subCat) => (
                            <button
                              key={subCat}
                              onClick={() =>
                                displayChosenSubCategory(
                                  'Home Fragrance',
                                  subCat
                                )
                              }
                              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-[#F5F3EB] rounded-md transition-colors"
                            >
                              {t(getCategoryTranslationKey(subCat))}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* View All Button */}
                      <button
                        onClick={() => displayChosenCategory('Home Fragrance')}
                        className="w-full mt-4 py-3 bg-[#D6A7A0] text-white rounded-lg hover:bg-[#C79790] transition-colors font-medium"
                      >
                        {t('view_all')} {t('home_fragrance')}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Packs & Sets Mobile Dropdown */}
            <div className="relative">
              <button
                onClick={() =>
                  setMobileDropdown(
                    mobileDropdown === 'packsSets' ? null : 'packsSets'
                  )
                }
                className="w-full flex justify-between items-center py-3 px-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-[#5C4B42]">
                  {t('packs_sets')}
                </span>
                <svg
                  className={`w-4 h-4 transition-transform ${
                    mobileDropdown === 'packsSets' ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {mobileDropdown === 'packsSets' && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-32 px-4">
                  <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] overflow-y-auto">
                    <div className="p-4 space-y-3">
                      <div className="flex justify-between items-center border-b pb-2">
                        <h2 className="text-lg font-semibold text-[#5C4B42]">
                          {t('packs_sets')}
                        </h2>
                        <button
                          onClick={() => setMobileDropdown(null)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>

                      <div className="space-y-1">
                        {['Gift', 'House Warming', 'Special Offer'].map(
                          (subCat) => (
                            <button
                              key={subCat}
                              onClick={() =>
                                displayChosenSubCategory('Packs & Sets', subCat)
                              }
                              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-[#F5F3EB] rounded-md transition-colors"
                            >
                              {t(getCategoryTranslationKey(subCat))}
                            </button>
                          )
                        )}
                      </div>

                      {/* View All Button */}
                      <button
                        onClick={() => displayChosenCategory('Packs & Sets')}
                        className="w-full mt-4 py-3 bg-[#D6A7A0] text-white rounded-lg hover:bg-[#C79790] transition-colors font-medium"
                      >
                        {t('view_all')} {t('packs_sets')}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Rest of your original layout */}
      <div className="flex flex-col sm:flex-row mt-5 sm:mt-0 ">
        {/* Filter - Original desktop layout */}
        <div className="self-start min-w-[20vw] w-[70vw] sm:w-[25vw] md:w-[40] h-auto px-10 md:pt-4 md:mt-20 transform -translate-x-[-15vw] sm:-translate-0 md:pb-6 bg-[#E6E4D8] m-2 md:m-5 rounded-2xl transition-all">
          <p
            className="py-2 justify-center text-l md:text-xl flex items-center cursor-pointer gap-10"
            onClick={() => setShowFilter(!showFilter)}
          >
            {t('filters')}
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
            <p className="mb-3 text-sm font-medium">{t('price')}</p>
            <div className="flex flex-col gap-2 text-sm font-light text-[#3A3A3A]">
              <div className="flex gap-2 items-center">
                <label className="w-24">{t('maximum')}:</label>
                <input
                  className="bg-gray-100 rounded ml-2 p-1 w-full"
                  type="number"
                  placeholder="eg: 5000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
              <div className="flex gap-2 items-center">
                <label className="w-24">{t('minimum')}:</label>
                <input
                  className="bg-gray-100 rounded ml-2 p-1 w-full"
                  type="number"
                  placeholder="eg: 80"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div
            className={`border-t-2 border-gray-100 pl-5 py-3 mt-6 ${
              showFilter ? '' : 'hidden'
            } sm:block`}
          >
            <p className="mb-3 text-sm font-medium">{t('featured')}</p>
            <div className="flex flex-col gap-2 text-sm font-light text-[#3A3A3A]">
              <div className="flex gap-2 items-center">
                <input
                  className="w-4 h-4"
                  type="checkbox"
                  checked={showOnSale}
                  onChange={(e) => setShowOnSale(e.target.checked)}
                  id="onSaleCheckbox"
                />
                <label htmlFor="onSaleCheckbox">{t('on_sale')}</label>
              </div>
              <div className="flex gap-2 items-center">
                <input
                  className="w-4 h-4"
                  type="checkbox"
                  checked={showNew}
                  onChange={(e) => setShowNew(e.target.checked)}
                  id="newCheckbox"
                />
                <label htmlFor="newCheckbox">{t('new')}</label>
              </div>
              <div className="flex gap-2 items-center">
                <input
                  className="w-4 h-4"
                  type="checkbox"
                  checked={showBestSeller}
                  onChange={(e) => setShowBestSeller(e.target.checked)}
                  id="bestSellerCheckbox"
                />
                <label htmlFor="bestSellerCheckbox">{t('best_seller')}</label>
              </div>
            </div>
          </div>

          {/* Reset Filters Button */}
          <div className="md:mt-6 md:px-5">
            <button
              className="w-full py-2 my-2 bg-[#D6A7A0] text-white rounded-lg hover:bg-[#C79790] transition-colors"
              onClick={() => {
                setMinPrice('');
                setMaxPrice('');
                setShowOnSale(false);
                setShowNew(false);
                setShowBestSeller(false);
              }}
            >
              {t('reset_filters')}
            </button>
          </div>
        </div>
        <div className="flex-1 min-w-[65vw] min-h-[100vh] md:min-w-[74vw] m-2 md:m-5 p-2">
          <div className="flex justify-center text-3xl">
            <Title
              primaryText={t(getCategoryTranslationKey(collectionName))}
              secondaryText={t('collection')}
            />
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
                placeholder={t('search_placeholder')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <p className="text-center sm:absolute sm:left-1/2 sm:transform sm:translate-x-25 whitespace-nowrap">
              {displayProductsCount()}
            </p>
            <div className="w-auto flex justify-end">
              <select
                className="left-1/2 h-10 border-1 rounded-2xl border-gray-600 text-sm px-3 pr-7 appearance-none bg-gray-100 cursor-pointer hover:bg-gray-200 focus:ring-red-600 focus:border-transparent transition-all"
                onChange={(e) => setSortType(e.target.value)}
                name="Order by:"
                id=""
              >
                <option value="relevant">
                  {t('sort_by')}: {t('relevant')}
                </option>
                <option value="low-high">
                  {t('sort_by')}: {t('low_to_high')}
                </option>
                <option value="high-low">
                  {t('sort_by')}: {t('high_to_low')}
                </option>
              </select>
            </div>
          </div>
          {/* Actual placement of the products */}
          <div className="grid justify-items-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 gap-y-6 m-5 lg:mr-5 xl:mr-0">
            {filterProducts.map((item) => (
              <ProductItem
                key={item._id}
                id={item._id}
                name={item.name}
                price={item.price}
                image={item.image}
                bestSeller={item.bestSeller}
                newArrival={item.newArrival}
                onSale={item.onSale}
                onSalePercent={item.onSalePercent}
                quantity={item.quantity}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collection;
