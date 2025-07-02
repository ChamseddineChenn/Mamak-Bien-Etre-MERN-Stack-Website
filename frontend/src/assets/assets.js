import logo from './logo.png';
import login_icon from './login_icon.png';
import cart_icon from './cart_icon.png';
import menu_icon from './menu_icon.png';
import close_icon from './close_icon.png';
import back_icon from './back_icon.png';
import bg_image from './HeroPic2.jpg';
import bg_about_img from './MalakProductsDisplay.jpeg';
import malak_portrait_img from './Malak Portrait.jpeg';
import candle_img from './candle1.jpg';
import candle2_img from './candle2.jpg';
import giftwrapping_img from './GiftWrapping.jpg';
import customcandles_img from './CusCandles.jpg';
import candlessample_img from './SamplesPic.jpg';
import fb_icon from './facebook_icon.png';
import ig_icon from './instagram_icon.png';
import search_icon from './search_icon.png';
import air_freshner from './RoomSpray.jpg';
import candle_diffuser1 from './Diffuser1.png';
import star_icon from './star.png';
import natural_icon from './Natural.png';
import cash_icon from './cash.png';
import cashback_icon from './cashback.png';
import arrow_up_icon from './arrow-up.png';
import arrow_down_icon from './arrow-down.png';
import bin_icon from './bin.png';
import card_icon from './Card.png';
import quality_icon from './Quality Products.png';
import natural_ing_icon from './Natural Ingredients.png';
import address_icon from './location.png';
import phone_icon from './phone.png';
import email_icon from './email.png';
import customer_service_icon from './Customer Service.png';
import contact_img from './Contact.jpg';

export const assets = {
  logo,
  login_icon,
  cart_icon,
  menu_icon,
  close_icon,
  back_icon,
  bg_image,
  bg_about_img,
  malak_portrait_img,
  candle_img,
  candle2_img,
  giftwrapping_img,
  customcandles_img,
  candlessample_img,
  fb_icon,
  ig_icon,
  search_icon,
  air_freshner,
  candle_diffuser1,
  star_icon,
  natural_icon,
  cash_icon,
  cashback_icon,
  arrow_up_icon,
  arrow_down_icon,
  bin_icon,
  card_icon,
  quality_icon,
  natural_ing_icon,
  customer_service_icon,
  contact_img,
  address_icon,
  phone_icon,
  email_icon,
};

export const products = [
  {
    _id: '00001',
    name: 'Earthy Candle',
    description: 'a simple candle that lights up',
    price: 25,
    image: [candle_img],
    category: 'Home Fragrance',
    subCategory: 'Classic Candles',
    sizes: ['S', 'M', 'L'],
    date: 23042025,
    bestseller: false,
    onSale: false,
  },
  {
    _id: '00002',
    name: 'Earthy Candle expensive',
    description: 'a simple candle that lights up',
    price: 55,
    image: [candle_img],
    category: 'Home Fragrance',
    subCategory: 'Classic Candles',
    sizes: ['S', 'M', 'L'],
    date: 23042025,
    bestseller: false,
    onSale: false,
  },
  {
    _id: '00003',
    name: 'Earthy Candle Very Expensive',
    description: 'a simple candle that lights up',
    price: 125,
    image: [
      candle_img,
      candle_img,
      candle_img,
      candle_img,
      candle_img,
      candle_img,
      candle_img,
    ],
    category: 'Home Fragrance',
    subCategory: 'Classic Candles',
    sizes: ['S', 'M', 'L'],
    date: 23042025,
    bestseller: false,
    onSale: false,
  },
  {
    _id: '00004',
    name: 'Earthy Candle Cheap',
    description: 'a simple candle that lights up',
    price: 15,
    image: [candle_img],
    category: 'Home Fragrance',
    subCategory: 'Classic Candles',
    sizes: ['S', 'M', 'L'],
    date: 23042025,
    bestseller: false,
    onSale: false,
  },
  {
    _id: '00005',
    name: 'Earthy Candle Almost Free Sample',
    description: 'a simple candle that lights up',
    price: 1,
    image: [candle_img],
    category: 'Home Fragrance',
    subCategory: 'Classic Candles',
    sizes: ['S', 'M', 'L'],
    date: 23042025,
    bestseller: false,
    onSale: false,
  },
  {
    _id: '00006',
    name: 'Snow Candle',
    description: 'a simple candle that lights up',
    price: 25,
    image: [candle2_img],
    category: 'Home Fragrance',
    subCategory: 'Classic Candles',
    sizes: ['S', 'M', 'L'],
    date: 23042025,
    bestseller: true,
    onSale: false,
  },
  {
    _id: '00007',
    name: 'Snow Candle',
    description: 'a simple candle that lights up',
    price: 25,
    image: [candle2_img],
    category: 'Home Fragrance',
    subCategory: 'Classic Candles',
    sizes: ['S', 'M', 'L'],
    date: 23042025,
    bestseller: true,
    onSale: false,
  },
  {
    _id: '00008',
    name: 'Snow Candle',
    description: 'a simple candle that lights up',
    price: 25,
    image: [candle2_img],
    category: 'Home Fragrance',
    subCategory: 'Classic Candles',
    sizes: ['S', 'M', 'L'],
    date: 23042025,
    bestseller: true,
    onSale: false,
  },
  {
    _id: '00009',
    name: 'Snow Candle',
    description: 'a simple candle that lights up',
    price: 25,
    image: [candle2_img],
    category: 'Home Fragrance',
    subCategory: 'Classic Candles',
    sizes: ['S', 'M', 'L'],
    date: 23042025,
    bestseller: true,
    onSale: false,
  },
  {
    _id: '00010',
    name: 'Snow Candle',
    description: 'a simple candle that lights up',
    price: 25,
    image: [candle2_img],
    category: 'Home Fragrance',
    subCategory: 'Classic Candles',
    sizes: ['S', 'M', 'L'],
    date: 23042025,
    bestseller: true,
    onSale: false,
  },
  {
    _id: '00011',
    name: 'Air Freshner',
    description: 'air freshner to make your home smell crisp',
    price: 10,
    image: [air_freshner],
    category: 'Scents',
    subCategory: 'Air Freshner',
    sizes: ['S', 'M', 'L'],
    date: 23042025,
    bestseller: true,
    onSale: false,
  },
  {
    _id: '00012',
    name: 'Candle Diffuser',
    description: 'diffuser to melt your fondant candle and enjoy the aroma',
    price: 15,
    image: [candle_diffuser1],
    category: 'Home Fragrance',
    subCategory: 'Diffuser',
    sizes: ['S', 'M', 'L'],
    date: 23042025,
    bestseller: true,
    onSale: false,
  },
];
