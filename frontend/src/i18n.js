import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Default translations
const resources = {
  en: {
    translation: {
      // Navigation
      home: 'Home',
      collection: 'Collection',
      about: 'About',
      contact: 'Contact',
      profile: 'My Profile',
      orders: 'Orders',
      logout: 'Logout',
      login: 'Login',
      menu: 'Menu',

      // Hero section
      hero_subtitle:
        'Elevate your space with scents that inspire serenity and warmth',
      hero_title: 'Handcrafted Candles & Exquisite Perfumes',
      hero_main_title: 'Scents that soothe, uplift and enchant',
      shop_now: 'Shop Now',

      // Additional Services
      tailored_services: 'Tailored Services',
      services_description:
        "Whether it's a gift for them or a treat for you, our tailored services add that extra layer of care and charm",
      gift_wrapping: 'Gift Wrapping',
      gift_wrapping_desc:
        'Elegant packaging with personalized notes for your special gifts',
      custom_scents: 'Custom Scents',
      custom_scents_desc:
        'Personalized fragrance blend tailored to your special preferences',
      complementary_samples: 'Complementary Samples',
      complementary_samples_desc:
        'Curated sample selection to help you find your special match',

      // Collection page
      filters: 'Filters',
      price: 'Price',
      maximum: 'Maximum',
      minimum: 'Minimum',
      featured: 'Featured',
      on_sale: 'On Sale',
      new: 'New',
      best_seller: 'Best Seller',
      reset_filters: 'Reset Filters',
      products_found: 'Products found',
      sort_by: 'Sort By',
      relevant: 'Relevant',
      low_to_high: 'Low to High Price',
      high_to_low: 'High to Low Price',
      home_fragrance: 'Home Fragrance',
      diffusers: 'Diffusers',
      scents: 'Scents',
      packs_sets: 'Packs & Sets',
      view_all: 'View All',
      complete_collection: 'Complete',
      poured_candle: 'Poured Candle',
      linen_candle: 'Linen Candle',
      classic_candles: 'Classic Candles',
      fondant_candles: 'Fondant Candles',
      gemstone_candle: 'Gemstone Candle',
      art_pouring: 'Art Pouring',
      mug_pouring: 'Mug Pouring',
      decorative_pouring: 'Decorative Pouring',
      gift: 'Gift',
      house_warming: 'House Warming',
      special_offer: 'Special Offer',

      // Cart
      cart: 'Cart',
      your_cart_is_empty: 'Your cart is empty',
      subtotal: 'Subtotal',
      view_cart: 'View Cart',

      // Search
      search: 'Search',
      search_placeholder: 'Search...',

      // Additional translations for components
      best_sellers: 'Best Sellers',
      best_sellers_description:
        'Our most-loved scents — tried, tested, and adored by our community',
      new_arrivals: 'New Arrivals',
      new_arrivals_description:
        'Discover our newest creations — crafted to elevate your space and soothe your senses',
      cart_total: 'Cart Total',
      delivery_fee: 'Delivery fee',
      total: 'Total',
      company: 'COMPANY',
      delivery: 'Delivery',
      get_in_touch: 'GET IN TOUCH',
      our_social_media: 'OUR SOCIAL MEDIA',
      footer_description:
        'We craft artisanal candles and perfumes designed to elevate everyday moments with elegance, emotion, and scent — made with care, quality ingredients, and a personal touch.',
      all_rights_reserved: 'All rights reserved.',
      newsletter_title:
        'Want to stay updated on our latest offers? Sign up to our Newsletter!',
      newsletter_placeholder: 'Enter Your Email',
      notify_me: 'Notify Me!',
      sending: 'Sending...',
      privacy_notice: 'We respect your privacy. Unsubscribe at any time.',
      my_plural: 'My',

      // New translations for ProductItem and RelatedProducts
      sold_out: 'SOLD OUT',
      sale: 'Sale',
      related: 'Related',
      products: 'Products',

      // About page translations
      about_hero_alt: 'Mamak Bien-Être artisan workshop',
      our_story: 'Our Story',
      about_story_1:
        'Founded by Malak Chaherli, Mamak Bien-Être began as a passionate endeavor to create luxurious, handcrafted candles and perfumes that awaken the senses and elevate everyday moments.',
      about_story_2:
        'Each product is carefully formulated using traditional techniques combined with modern craftsmanship to deliver exceptional quality.',
      our_mission: 'Our Mission',
      about_mission:
        'To craft sensory experiences that bring comfort, joy and tranquility to your spaces, using only the finest natural ingredients and sustainable practices.',
      why: 'Why',
      choose_us: 'Choose Us',
      quality_assurance: 'Quality Assurance',
      quality_description:
        'Every product undergoes rigorous testing to ensure premium quality and longevity.',
      natural_ingredients: 'Natural Ingredients',
      natural_description:
        'We use only pure, responsibly-sourced ingredients with no harmful additives.',
      exceptional_service: 'Exceptional Service',
      service_description:
        'Personalized attention from founder Malak who oversees every order.',
      meet: 'Meet',
      the_founder: 'The Founder',
      founder_intro:
        'The heart and hands behind every Mamak Bien-Être creation',
      about_story_alt: 'Malak Chaherli crafting products',
      founder_alt: 'Malak Chaherli, Founder of Mamak Bien-Être',
      founder_name: 'Malak Chaherli',
      founder_title: 'Founder & Master Artisan',
      founder_desc_1:
        'With a lifelong passion for fragrance and craftsmanship, Malak founded Mamak Bien-Être to share her vision of sensory elegance. Each product reflects her meticulous attention to detail and commitment to quality.',
      founder_desc_2:
        'When not creating new scents, Malak personally oversees every aspect of production, ensuring each item meets her exacting standards before reaching your home.',
      about_us: 'About',
      us: 'Us',

      // Contact page translations
      contact_subtitle:
        "We'd love to hear from you! Reach out for inquiries, collaborations, or just to say hello.",
      contact_img_alt: 'Mamak Bien-Être storefront',
      our_store: 'Our Store',
      address: 'Address',
      phone: 'Phone',
      email: 'Email',
      join_our_team: 'Join Our Team',
      join_team_desc:
        "We're always looking for passionate individuals to join our growing family of artisans.",
      explore_jobs: 'Explore Job Opportunities',
      find_us: 'Find Us',
      map_title: 'Mamak Bien-Être location map',

      // Collection page additional translations
      room_sprays: 'Room Sprays',
      candle_sets: 'Candle Sets',
      gift_sets: 'Gift Sets',
      scent_combos: 'Scent Combinations',
      shopping: 'Shopping',
      your_cart_feels_lonely: 'Your Cart Feels Lonely',
      discover_products_message:
        "You haven't added anything to your cart yet. Discover our amazing products!",
      empty_cart_alt: 'Empty cart',
      decrease_quantity_alt: 'Decrease quantity',
      increase_quantity_alt: 'Increase quantity',
      remove_item_alt: 'Remove item',
      proceed_to_checkout: 'Proceed To Checkout',
      stock_warning: '{{quantity}} items available in stock',

      // Add these new keys for Login page
      error_email_required: 'Email is required',
      error_email_invalid: 'Please enter a valid email',
      error_password_required: 'Password is required',
      error_password_length: 'Password must be at least 8 characters',
      error_fullName_required: 'Full name is required',
      error_confirmPassword_required: 'Please confirm your password',
      error_passwords_mismatch: 'Passwords do not match',
      welcome_back_message: 'Welcome back! Please enter your details',
      join_us_message: 'Join us today! Create your account',
      full_name_placeholder: 'Full Name',
      full_name_aria: 'Full Name',
      email_placeholder: 'Email',
      email_aria: 'Email Address',
      password_placeholder: 'Password',
      password_aria: 'Password',
      confirm_password_placeholder: 'Confirm Password',
      confirm_password_aria: 'Confirm Password',
      forgot_password: 'Forgot your password?',
      click_here: 'Click here!',
      already_have_account: 'Already have an account? Login here',
      create_account_link: 'Create account',
      sign_in: 'Sign In',
      sign_up: 'Sign Up',
      processing: 'Processing...',
      registration_successful: 'Registration successful!',
      login_successful: 'Login successful!',
      authentication_failed: 'Authentication failed',
      authentication_error: 'Authentication error',
      server_error: 'Server error',
      network_error: 'Network error - please check your connection',
      login_form_aria: 'Login form',
      signup_form_aria: 'Sign up form',
      reset_password_aria: 'Reset password',
      switch_to_signup_aria: 'Switch to sign up',
      switch_to_login_aria: 'Switch to login',
      create_account: 'Create account',
      show_password_aria: 'Show password',
      hide_password_aria: 'Hide password',
      secure_auth_message: 'Secure authentication with end-to-end encryption',
      ssl_secured: 'SSL Secured',
      privacy_protected: 'Privacy Protected',
      add_to_cart: 'Add to Cart',
      out_of_stock: 'Out of Stock',
      in_stock: '{{count}} in stock',
      technical_description: 'Technical Description',
      technical_specifications: 'Technical Specifications',
      reviews: 'Reviews',
      write_review: 'Write a Review',
      rating: 'Rating',
      share_experience: 'Share your experience with this product...',
      submit_review: 'Submit Review',
      submitting_review: 'Submitting...',
      no_reviews: 'No reviews yet. Be the first to review!',
      original_natural: '100% Original & Natural',
      cash_delivery: 'Cash on delivery available',
      return_policy: '7-day return policy',

      // UserProfile translations
      account_details: 'Account Details',
      shipping_address: 'Shipping Address',
      change_password: 'Change Password',
      account_information: 'Account Information',
      full_name_label: 'Full Name',
      email_address: 'Email Address',
      contact_support_email: 'Contact support to change your email',
      save_changes: 'Save Changes',
      saving: 'Saving...',
      shipping_information: 'Shipping Information',
      recipient_name: 'Recipient Name *',
      street_address: 'Street Address *',
      city_label: 'City *',
      state_label: 'State',
      postal_code: 'Postal Code *',
      country_label: 'Country',
      phone_number: 'Phone Number *',
      invalid_phone: 'Invalid phone number format',
      save_address: 'Save Address',
      current_password: 'Current Password *',
      new_password: 'New Password *',
      confirm_new_password: 'Confirm New Password *',
      password_length_hint: 'Must be at least 8 characters',
      updating: 'Updating...',
      change_password_button: 'Change Password',

      // Orders page translations
      my_orders: 'My Orders',
      no_orders: 'No Orders Yet',
      no_orders_message:
        "You haven't placed any orders yet. Start shopping to see your orders here!",
      browse_collection: 'Browse Collection',
      order_number: 'Order #{{id}}',
      placed_on: 'Placed on: {{date}}',
      order_total: 'Total: {{currency}} {{amount}}',
      items_count: '{{count}} item{{s}}',
      view_details: 'View Details',
      track_order: 'Track Order',
      awaiting_delivery: 'Awaiting Delivery',
      in_delivery: 'In Delivery',
      delivered: 'Delivered',
      paused: 'Paused',
      cancelled: 'Cancelled',

      // OrderConfirmation translations
      thank_you: 'Thank You For Your Order!',
      order_placed: 'Your order #{{id}} has been placed successfully',
      status_label: 'Status:',
      order_date: 'Order Date: {{date}}',
      order_summary: 'Order Summary',
      subtotal_label: 'Subtotal',
      delivery_fee_label: 'Delivery Fee',
      total_label: 'Total',
      shipping_info: 'Shipping Information',
      name_label: 'Name:',
      address_label: 'Address:',
      city_info: 'City:',
      state_info: 'State:',
      postal_code_info: 'Postal Code:',
      country_info: 'Country:',
      phone_info: 'Phone:',
      payment_method: 'Payment Method',
      cash_on_delivery: 'Cash on Delivery',
      international_credit_card: 'International Credit Card',
      national_credit_card: 'National Credit Card',
      email_confirmation: 'You will receive an email confirmation shortly.',
      print_receipt: 'Print Receipt',
      continue_shopping: 'Continue Shopping',
      view_my_orders: 'View My Orders',

      // Newsletter translations
      enter_email_warning: 'Please enter your email',
      unsubscribe_failed: 'Failed to unsubscribe',
      unsubscribe_title: 'Unsubscribe from Newsletter',
      unsubscribe_message:
        "We're sorry to see you go. Enter your email to unsubscribe.",
      unsubscribe_button: 'Unsubscribe',
      email_verified_success: 'Email verified successfully!',
      verification_failed: 'Verification failed. Please try again.',
      verifying_email: 'Verifying your email...',
      verification_success_title: 'Verification Successful!',
      verification_success_message:
        "Your email has been verified. You'll now receive our latest offers and updates.",
      invalid_link_title: 'Invalid Verification Link',
      invalid_link_message:
        'The verification link is invalid or has expired. Please try subscribing again.',
      verification_error_title: 'Verification Error',
      verification_error_message:
        'Something went wrong. Please try again later.',
      // Place Order
      online_payment: 'Online Payment',
      proceed_to_payment: 'Proceed To Payment',
      place_order: 'Place Order',
      use_saved_address: 'Use Saved Address',
      use_new_address: 'Use New Address',
      information: 'Information',
      order: 'Order',
      payment: 'Payment',
      method: 'Method',
    },
  },
  fr: {
    translation: {
      // Navigation
      home: 'Accueil',
      collection: 'Collection',
      about: 'À propos',
      contact: 'Contact',
      profile: 'Mon Profil',
      orders: 'Commandes',
      logout: 'Déconnexion',
      login: 'Connexion',
      menu: 'Menu',

      // Hero section
      hero_subtitle:
        'Élevez votre espace avec des parfums qui inspirent sérénité et chaleur',
      hero_title: 'Bougies artisanales et parfums exquis',
      hero_main_title: 'Des parfums qui apaisent, élèvent et enchantent',
      shop_now: 'Acheter maintenant',

      // Additional Services
      tailored_services: 'Services Sur Mesure',
      services_description:
        'Que ce soit un cadeau pour eux ou un plaisir pour vous, nos services sur mesure ajoutent cette touche supplémentaire de soin et de charme',
      gift_wrapping: 'Emballage Cadeau',
      gift_wrapping_desc:
        'Emballage élégant avec notes personnalisées pour vos cadeaux spéciaux',
      custom_scents: 'Parfums Personnalisés',
      custom_scents_desc:
        'Mélange de parfum personnalisé adapté à vos préférences spéciales',
      complementary_samples: 'Échantillons Complémentaires',
      complementary_samples_desc:
        "Sélection d'échantillons organisée pour vous aider à trouver votre match spécial",

      // Collection page
      filters: 'Filtres',
      price: 'Prix',
      maximum: 'Maximum',
      minimum: 'Minimum',
      featured: 'En vedette',
      on_sale: 'En solde',
      new: 'Nouveau',
      best_seller: 'Meilleur vendeur',
      reset_filters: 'Réinitialiser les filtres',
      products_found: 'Produits trouvés',
      sort_by: 'Trier par',
      relevant: 'Pertinent',
      low_to_high: 'Prix croissant',
      high_to_low: 'Prix décroissant',
      home_fragrance: "Parfum d'ambiance",
      diffusers: 'Diffuseurs',
      scents: 'Parfums',
      packs_sets: 'Packs & Ensembles',
      view_all: 'Voir tout',
      complete_collection: 'Toute La',
      poured_candle: 'Bougie Coulée',
      linen_candle: 'Bougie de Linge',
      classic_candles: 'Bougies Classiques',
      fondant_candles: 'Bougies Fondantes',
      gemstone_candle: 'Bougie Gemstone',
      art_pouring: 'Coulée d’Art',
      mug_pouring: 'Coulée Mug',
      decorative_pouring: 'Coulée Déco',
      gift: 'Cadeau',
      house_warming: 'Cadeau de Pendaison de Crémaillère',
      special_offer: 'Offre Spéciale',

      // Cart
      cart: 'Panier',
      your_cart_is_empty: 'Votre panier est vide',
      subtotal: 'Sous-total',
      view_cart: 'Voir le panier',

      // Search
      search: 'Rechercher',
      search_placeholder: 'Rechercher...',

      // Additional translations for components
      best_sellers: 'Meilleurs Ventes',
      best_sellers_description:
        'Nos parfums les plus appréciés — testés, éprouvés et adorés par notre communauté',
      new_arrivals: 'Nouveautés',
      new_arrivals_description:
        'Découvrez nos dernières créations — conçues pour embellir votre espace et apaiser vos sens',
      cart_total: 'Total Panier',
      delivery_fee: 'Frais de livraison',
      total: 'Total',
      company: 'ENTREPRISE',
      delivery: 'Livraison',
      get_in_touch: 'CONTACTEZ-NOUS',
      our_social_media: 'NOS RÉSEAUX SOCIAUX',
      footer_description:
        'Nous créons des bougies artisanales et des parfums conçus pour sublimer les moments du quotidien avec élégance, émotion et senteur — fabriqués avec soin, des ingrédients de qualité et une touche personnelle.',
      all_rights_reserved: 'Tous droits réservés.',
      newsletter_title:
        'Vous souhaitez être informé de nos dernières offres ? Inscrivez-vous à notre newsletter !',
      newsletter_placeholder: 'Entrez votre email',
      notify_me: 'Notifiez-moi !',
      sending: 'Envoi en cours...',
      privacy_notice:
        'Nous respectons votre vie privée. Désabonnez-vous à tout moment.',
      my_plural: 'Mes',

      // New translations for ProductItem and RelatedProducts
      sold_out: 'ÉPUISÉ',
      sale: 'Solde',
      related: 'Autre',
      products: 'Produits',

      // About page translations
      about_hero_alt: 'Atelier artisanal Mamak Bien-Être',
      our_story: 'Notre Histoire',
      about_story_1:
        'Fondée par Malak Chaherli, Mamak Bien-Être a commencé comme une entreprise passionnée pour créer des bougies et parfums luxueux et artisanaux qui éveillent les sens et subliment les moments du quotidien.',
      about_story_2:
        'Chaque produit est soigneusement formulé en utilisant des techniques traditionnelles combinées à un savoir-faire moderne pour offrir une qualité exceptionnelle.',
      our_mission: 'Notre Mission',
      about_mission:
        'Créer des expériences sensorielles qui apportent confort, joie et tranquillité à vos espaces, en utilisant uniquement les meilleurs ingrédients naturels et des pratiques durables.',
      why: 'Pourquoi',
      choose_us: 'Nous Choisir',
      quality_assurance: 'Assurance Qualité',
      quality_description:
        'Chaque produit subit des tests rigoureux pour garantir une qualité premium et une longue durée de vie.',
      natural_ingredients: 'Ingrédients Naturels',
      natural_description:
        "Nous n'utilisons que des ingrédients purs, provenant de sources responsables, sans additifs nocifs.",
      exceptional_service: 'Service Exceptionnel',
      service_description:
        'Attention personnalisée de la fondatrice Malak qui supervise chaque commande.',
      meet: 'Rencontrez',
      the_founder: 'La Fondatrice',
      founder_intro:
        'Le cœur et les mains derrière chaque création Mamak Bien-Être',
      about_story_alt: 'Malak Chaherli fabriquant des produits',
      founder_alt: 'Malak Chaherli, Fondatrice de Mamak Bien-Être',
      founder_name: 'Malak Chaherli',
      founder_title: 'Fondatrice & Artisane Maître',
      founder_desc_1:
        "Avec une passion de toujours pour les parfums et l'artisanat, Malak a fondé Mamak Bien-Être pour partager sa vision de l'élégance sensorielle. Chaque produit reflète son attention méticuleuse aux détails et son engagement envers la qualité.",
      founder_desc_2:
        "Quand elle ne crée pas de nouvelles senteurs, Malak supervise personnellement chaque aspect de la production, s'assurant que chaque article répond à ses normes exigeantes avant d'arriver chez vous.",
      about_us: 'À Propos De',
      us: 'Nous',

      // Contact page translations
      contact_subtitle:
        'Nous aimerions avoir de vos nouvelles ! Contactez-nous pour des demandes, collaborations ou simplement pour dire bonjour.',
      contact_img_alt: 'Devanture de Mamak Bien-Être',
      our_store: 'Notre Magasin',
      address: 'Adresse',
      phone: 'Téléphone',
      email: 'E-mail',
      join_our_team: 'Rejoignez Notre Équipe',
      join_team_desc:
        "Nous cherchons toujours des personnes passionnées pour rejoindre notre famille grandissante d'artisans.",
      explore_jobs: 'Explorer les Opportunités',
      find_us: 'Nous Trouver',
      map_title: 'Carte de localisation de Mamak Bien-Être',

      // Collection page additional translations
      room_sprays: 'Sprays Ambiance',
      candle_sets: 'Sets de Bougies',
      gift_sets: 'Coffrets Cadeaux',
      scent_combos: 'Combinaisons de Parfums',
      shopping: 'Achats',
      your_cart_feels_lonely: 'Votre panier se sent seul',
      discover_products_message:
        "Vous n'avez encore rien ajouté à votre panier. Découvrez nos produits incroyables !",
      empty_cart_alt: 'Panier vide',
      decrease_quantity_alt: 'Diminuer la quantité',
      increase_quantity_alt: 'Augmenter la quantité',
      remove_item_alt: "Supprimer l'article",
      proceed_to_checkout: 'Passer à la caisse',
      stock_warning: '{{quantity}} articles disponibles en stock',

      // Add these new keys for Login page
      error_email_required: "L'email est requis",
      error_email_invalid: 'Veuillez entrer un email valide',
      error_password_required: 'Le mot de passe est requis',
      error_password_length:
        'Le mot de passe doit contenir au moins 8 caractères',
      error_fullName_required: 'Le nom complet est requis',
      error_confirmPassword_required: 'Veuillez confirmer votre mot de passe',
      error_passwords_mismatch: 'Les mots de passe ne correspondent pas',
      welcome_back_message:
        'Content de vous revoir ! Veuillez entrer vos détails',
      join_us_message: "Rejoignez-nous aujourd'hui ! Créez votre compte",
      full_name_placeholder: 'Nom complet',
      full_name_aria: 'Nom complet',
      email_placeholder: 'E-mail',
      email_aria: 'Adresse e-mail',
      password_placeholder: 'Mot de passe',
      password_aria: 'Mot de passe',
      confirm_password_placeholder: 'Confirmer le mot de passe',
      confirm_password_aria: 'Confirmer le mot de passe',
      forgot_password: 'Mot de passe oublié ?',
      click_here: 'Cliquez ici !',
      already_have_account: 'Vous avez déjà un compte ? Connectez-vous ici',
      create_account_link: 'Créer un compte',
      sign_in: 'Se connecter',
      sign_up: "S'inscrire",
      processing: 'Traitement en cours...',
      registration_successful: 'Inscription réussie !',
      login_successful: 'Connexion réussie !',
      authentication_failed: "Échec de l'authentification",
      authentication_error: "Erreur d'authentification",
      server_error: 'Erreur serveur',
      network_error: 'Erreur réseau - veuillez vérifier votre connexion',
      login_form_aria: 'Formulaire de connexion',
      signup_form_aria: "Formulaire d'inscription",
      reset_password_aria: 'Réinitialiser le mot de passe',
      switch_to_signup_aria: "Passer à l'inscription",
      switch_to_login_aria: 'Passer à la connexion',
      create_account: 'Créer un compte',
      show_password_aria: 'Afficher le mot de passe',
      hide_password_aria: 'Masquer le mot de passe',
      secure_auth_message:
        'Authentification sécurisée avec chiffrement de bout en bout',
      ssl_secured: 'SSL Sécurisé',
      privacy_protected: 'Confidentialité protégée',
      // Product page translations
      add_to_cart: 'Ajouter au panier',
      out_of_stock: 'En rupture de stock',
      in_stock: '{{count}} en stock',
      technical_description: 'Description technique',
      technical_specifications: 'Spécifications techniques',
      reviews: 'Avis',
      write_review: 'Écrire un avis',
      rating: 'Note',
      share_experience: 'Partagez votre expérience avec ce produit...',
      submit_review: "Soumettre l'avis",
      submitting_review: 'Envoi en cours...',
      no_reviews:
        'Aucun avis pour le moment. Soyez le premier à donner votre avis !',
      original_natural: '100% Original & Naturel',
      cash_delivery: 'Paiement à la livraison disponible',
      return_policy: 'Politique de retour de 7 jours',

      // UserProfile translations
      account_details: 'Détails du compte',
      shipping_address: 'Adresse de livraison',
      change_password: 'Changer le mot de passe',
      account_information: 'Informations du compte',
      full_name_label: 'Nom complet',
      email_address: 'Adresse e-mail',
      contact_support_email: 'Contactez le support pour changer votre e-mail',
      save_changes: 'Enregistrer les modifications',
      saving: 'Enregistrement...',
      shipping_information: 'Informations de livraison',
      recipient_name: 'Nom du destinataire *',
      street_address: 'Adresse *',
      city_label: 'Ville *',
      state_label: 'État/Région',
      postal_code: 'Code postal *',
      country_label: 'Pays',
      phone_number: 'Numéro de téléphone *',
      invalid_phone: 'Format de numéro de téléphone invalide',
      save_address: "Enregistrer l'adresse",
      current_password: 'Mot de passe actuel *',
      new_password: 'Nouveau mot de passe *',
      confirm_new_password: 'Confirmer le nouveau mot de passe *',
      password_length_hint: 'Doit contenir au moins 8 caractères',
      updating: 'Mise à jour...',
      change_password_button: 'Changer le mot de passe',

      // Orders page translations
      my_orders: 'Mes commandes',
      no_orders: 'Aucune commande',
      no_orders_message:
        "Vous n'avez pas encore passé de commande. Commencez vos achats pour voir vos commandes ici !",
      browse_collection: 'Parcourir la collection',
      order_number: 'Commande #{{id}}',
      placed_on: 'Passée le : {{date}}',
      order_total: 'Total : {{currency}} {{amount}}',
      items_count: '{{count}} article{{s}}',
      view_details: 'Voir les détails',
      track_order: 'Suivre la commande',
      awaiting_delivery: 'En attente de livraison',
      in_delivery: 'En cours de livraison',
      delivered: 'Livrée',
      paused: 'En pause',
      cancelled: 'Annulée',

      // OrderConfirmation translations
      thank_you: 'Merci pour votre commande !',
      order_placed: 'Votre commande #{{id}} a été passée avec succès',
      status_label: 'Statut :',
      order_date: 'Date de commande : {{date}}',
      order_summary: 'Récapitulatif de commande',
      subtotal_label: 'Sous-total',
      delivery_fee_label: 'Frais de livraison',
      total_label: 'Total',
      shipping_info: 'Informations de livraison',
      name_label: 'Nom :',
      address_label: 'Adresse :',
      city_info: 'Ville :',
      state_info: 'État/Région :',
      postal_code_info: 'Code postal :',
      country_info: 'Pays :',
      phone_info: 'Téléphone :',
      payment_method: 'Méthode de paiement',
      cash_on_delivery: 'Paiement à la livraison',
      international_credit_card: 'Carte de crédit internationale',
      national_credit_card: 'Carte de crédit nationale',
      email_confirmation: 'Vous recevrez bientôt un e-mail de confirmation.',
      print_receipt: 'Imprimer le reçu',
      continue_shopping: 'Continuer les achats',
      view_my_orders: 'Voir mes commandes',

      // Newsletter translations
      enter_email_warning: 'Veuillez entrer votre email',
      unsubscribe_failed: 'Échec de la désinscription',
      unsubscribe_title: 'Se désabonner de la newsletter',
      unsubscribe_message:
        'Nous sommes désolés de vous voir partir. Entrez votre email pour vous désabonner.',
      unsubscribe_button: 'Se désabonner',
      email_verified_success: 'Email vérifié avec succès !',
      verification_failed: 'Échec de la vérification. Veuillez réessayer.',
      verifying_email: 'Vérification de votre email...',
      verification_success_title: 'Vérification réussie !',
      verification_success_message:
        'Votre email a été vérifié. Vous recevrez désormais nos dernières offres et mises à jour.',
      invalid_link_title: 'Lien de vérification invalide',
      invalid_link_message:
        'Le lien de vérification est invalide ou a expiré. Veuillez réessayer de vous abonner.',
      verification_error_title: 'Erreur de vérification',
      verification_error_message:
        "Quelque chose s'est mal passé. Veuillez réessayer plus tard.",

      // Place Order
      online_payment: 'Payment en Ligne',
      proceed_to_payment: 'Procéder au paiement',
      place_order: 'Passer la Commande',
      use_saved_address: 'Utiliser l"adresse enregistrée',
      use_new_address: 'Utiliser une nouvelle adresse',
      information: 'Détails',
      order: 'Commande',
      payment: 'Paiement',
      method: 'Méthode',
    },
  },
  de: {
    translation: {
      // Navigation
      home: 'Startseite',
      collection: 'Kollektio',
      about: 'Über Uns',
      contact: 'Kontakt',
      profile: 'Mein Profil',
      orders: 'Bestellungen',
      logout: 'Abmelden',
      login: 'Anmelden',
      menu: 'Menü',

      // Hero section
      hero_subtitle:
        'Veredeln Sie Ihren Raum mit Düften, die Serenität und Wärme inspirieren',
      hero_title: 'Handgefertigte Kerzen & Exquisite Parfüms',
      hero_main_title: 'Düfte, die beruhigen, erheben und bezaubern',
      shop_now: 'Jetzt einkaufen',

      // Additional Services
      tailored_services: 'Maßgeschneiderte Dienstleistungen',
      services_description:
        'Ob es ein Geschenk für sie ist oder eine Belohnung für Sie, unsere maßgeschneiderten Dienstleistungen fügen diese zusätzliche Schicht von Pflege und Charme hinzu',
      gift_wrapping: 'Geschenkverpackung',
      gift_wrapping_desc:
        'Elegante Verpackung mit personalisierten Notizen für Ihre besonderen Geschenke',
      custom_scents: 'Maßgeschneiderte Düfte',
      custom_scents_desc:
        'Personalierte Duftmischung, die auf Ihre besonderen Vorlieben zugeschnitten ist',
      complementary_samples: 'Komplementäre Proben',
      complementary_samples_desc:
        'Kurierte Probenauswahl, die Ihnen hilft, Ihren besonderen Match zu finden',

      // Collection page
      filters: 'Filter',
      price: 'Preis',
      maximum: 'Maximum',
      minimum: 'Minimum',
      featured: 'Vorgestellt',
      on_sale: 'Im Angebot',
      new: 'Neu',
      best_seller: 'Bestseller',
      reset_filters: 'Filter zurücksetzen',
      products_found: 'Produkte gefunden',
      sort_by: 'Sortieren nach',
      relevant: 'Relevant',
      low_to_high: 'Preis aufsteigend',
      high_to_low: 'Preis absteigend',
      home_fragrance: 'Raumduft',
      diffusers: 'Diffusoren',
      scents: 'Düfte',
      packs_sets: 'Packs & Sets',
      view_all: 'Alle ansehen',
      complete_collection: 'Vollständige',
      poured_candle: 'Gegossene Kerze',
      linen_candle: 'Leinen Kerze',
      classic_candles: 'Klassische Kerzen',
      fondant_candles: 'Fondant Kerzen',
      gemstone_candle: 'Edelstein Kerze',
      art_pouring: 'Kunstgießen',
      mug_pouring: 'Becher Gießen',
      decorative_pouring: 'Dekoratives Gießen',
      gift: 'Geschenk',
      house_warming: 'Einzugsgeschenk',
      special_offer: 'Sonderangebot',

      // Cart
      cart: 'Warenkorb',
      your_cart_is_empty: 'Ihr Warenkorb ist leer',
      subtotal: 'Zwischensumme',
      view_cart: 'Warenkorb ansehen',

      // Search
      search: 'Suchen',
      search_placeholder: 'Suchen...',

      // Additional translations for components
      best_sellers: 'Bestseller',
      best_sellers_description:
        'Unsere beliebtesten Düfte — von unserer Community getestet, geprüft und geliebt',
      new_arrivals: 'Neuheiten',
      new_arrivals_description:
        'Entdecken Sie unsere neuesten Kreationen — designed, um Ihren Raum zu verschönern und Ihre Sinne zu beruhigen',
      cart_total: 'Warenkorbgesamt',
      delivery_fee: 'Liefergebühr',
      total: 'Gesamtsumme',
      company: 'FIRMA',
      delivery: 'Lieferung',
      get_in_touch: 'KONTAKT AUFNEHMEN',
      our_social_media: 'UNSERE SOZIALEN MEDIEN',
      footer_description:
        'Wir fertigen handgefertigte Kerzen und Parfüms, die alltägliche Momente mit Eleganz, Emotion und Duft bereichern sollen — hergestellt mit Sorgfalt, hochwertigen Inhaltsstoffen und einer persönlichen Note.',
      all_rights_reserved: 'Alle Rechte vorbehalten.',
      newsletter_title:
        'Möchten Sie über unsere neuesten Angebote auf dem Laufenden bleiben? Melden Sie sich für unseren Newsletter an!',
      newsletter_placeholder: 'Geben Sie Ihre E-Mail ein',
      notify_me: 'Benachrichtigen Sie mich!',
      sending: 'Wird gesendet...',
      privacy_notice:
        'Wir respektieren Ihre Privatsphäre. Sie können sich jederzeit abmelden.',
      my_plural: 'Meine',

      // New translations for ProductItem and RelatedProducts
      sold_out: 'AUSVERKAUFT',
      sale: 'Verkauf',
      related: 'Ähnliche',
      products: 'Produkte',

      // About page translations
      about_hero_alt: 'Mamak Bien-Être Kunsthandwerkswerkstatt',
      our_story: 'Unsere Geschichte',
      about_story_1:
        'Gegründet von Malak Chaherli, begann Mamak Bien-Être als leidenschaftliches Bestreben, luxuriöse, handgefertigte Kerzen und Parfüms zu kreieren, die die Sinne wecken und alltägliche Momente bereichern.',
      about_story_2:
        'Jedes Produkt wird sorgfältig mit traditionellen Techniken und modernem Handwerk formuliert, um außergewöhnliche Qualität zu liefern.',
      our_mission: 'Unsere Mission',
      about_mission:
        'Sinnliche Erlebnisse zu schaffen, die Komfort, Freude und Ruhe in Ihre Räume bringen, unter Verwendung nur der feinsten natürlichen Zutaten und nachhaltiger Praktiken.',
      why: 'Warum',
      choose_us: 'Uns Wählen',
      quality_assurance: 'Qualitätssicherung',
      quality_description:
        'Jedes Produkt durchläuft rigorose Tests, um Premium-Qualität und Langlebigkeit zu gewährleisten.',
      natural_ingredients: 'Natürliche Zutaten',
      natural_description:
        'Wir verwenden nur reine, verantwortungsvoll bezogene Zutaten ohne schädliche Zusätze.',
      exceptional_service: 'Außergewöhnlicher Service',
      service_description:
        'Persönliche Aufmerksamkeit von Gründerin Malak, die jede Bestellung überwacht.',
      meet: 'Treffen Sie',
      the_founder: 'Die Gründerin',
      founder_intro:
        'Das Herz und die Hände hinter jeder Mamak Bien-Être Kreation',
      about_story_alt: 'Malak Chaherli bei der Produktherstellung',
      founder_alt: 'Malak Chaherli, Gründerin von Mamak Bien-Être',
      founder_name: 'Malak Chaherli',
      founder_title: 'Gründerin & Meisterhandwerkerin',
      founder_desc_1:
        'Mit einer lebenslangen Leidenschaft für Düfte und Handwerkskunst gründete Malak Mamak Bien-Être, um ihre Vision von sensorischer Eleganz zu teilen. Jedes Produkt spiegelt ihre akribische Aufmerksamkeit für Details und ihr Engagement für Qualität wider.',
      founder_desc_2:
        'Wenn sie nicht neue Düfte kreiert, überwacht Malak persönlich jeden Aspekt der Produktion und stellt sicher, dass jedes Stück ihren anspruchsvollen Standards entspricht, bevor es Ihr Zuhause erreicht.',
      about_us: 'Über',
      us: 'Uns',

      // Contact page translations
      contact_subtitle:
        'Wir würden uns freuen, von Ihnen zu hören! Melden Sie sich für Anfragen, Zusammenarbeiten oder einfach nur, um Hallo zu sagen.',
      contact_img_alt: 'Mamak Bien-Être Geschäftsfront',
      our_store: 'Unser Geschäft',
      address: 'Adresse',
      phone: 'Telefon',
      email: 'E-Mail',
      join_our_team: 'Werden Sie Teil Unseres Teams',
      join_team_desc:
        'Wir sind immer auf der Suche nach leidenschaftlichen Menschen, die unserer wachsenden Familie von Handwerkern beitreten möchten.',
      explore_jobs: 'Jobmöglichkeiten Erkunden',
      find_us: 'Finden Sie Uns',
      map_title: 'Standortkarte von Mamak Bien-Être',

      // Collection page additional translations
      room_sprays: 'Raumsprays',
      candle_sets: 'Kerzensets',
      gift_sets: 'Geschenksets',
      scent_combos: 'Duftkombinationen',
      shopping: 'Einkaufen',
      your_cart_feels_lonely: 'Ihr Warenkorb fühlt sich einsam',
      discover_products_message:
        'Sie haben noch nichts in Ihren Warenkorb gelegt. Entdecken Sie unsere tollen Produkte!',
      empty_cart_alt: 'Leerer Warenkorb',
      decrease_quantity_alt: 'Menge verringern',
      increase_quantity_alt: 'Menge erhöhen',
      remove_item_alt: 'Artikel entfernen',
      proceed_to_checkout: 'Zur Kasse gehen',
      stock_warning: '{{quantity}} Artikel verfügbar auf Lager',

      // Add these new keys for Login page
      error_email_required: 'E-Mail ist erforderlich',
      error_email_invalid: 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
      error_password_required: 'Passwort ist erforderlich',
      error_password_length: 'Passwort muss mindestens 8 Zeichen lang sein',
      error_fullName_required: 'Vollständiger Name ist erforderlich',
      error_confirmPassword_required: 'Bitte bestätigen Sie Ihr Passwort',
      error_passwords_mismatch: 'Passwörter stimmen nicht überein',
      welcome_back_message: 'Willkommen zurück! Bitte geben Sie Ihre Daten ein',
      join_us_message:
        'Schließen Sie sich uns heute an! Erstellen Sie Ihr Konto',
      full_name_placeholder: 'Vollständiger Name',
      full_name_aria: 'Vollständiger Name',
      email_placeholder: 'E-Mail',
      email_aria: 'E-Mail-Adresse',
      password_placeholder: 'Passwort',
      password_aria: 'Passwort',
      confirm_password_placeholder: 'Passwort bestätigen',
      confirm_password_aria: 'Passwort bestätigen',
      forgot_password: 'Passwort vergessen?',
      click_here: 'Hier klicken!',
      already_have_account: 'Haben Sie bereits ein Konto? Hier anmelden',
      create_account_link: 'Konto erstellen',
      sign_in: 'Anmelden',
      sign_up: 'Registrieren',
      processing: 'Wird verarbeitet...',
      registration_successful: 'Registrierung erfolgreich!',
      login_successful: 'Anmeldung erfolgreich!',
      authentication_failed: 'Authentifizierung fehlgeschlagen',
      authentication_error: 'Authentifizierungsfehler',
      server_error: 'Serverfehler',
      network_error: 'Netzwerkfehler - bitte überprüfen Sie Ihre Verbindung',
      login_form_aria: 'Anmeldeformular',
      signup_form_aria: 'Registrierungsformular',
      reset_password_aria: 'Passwort zurücksetzen',
      switch_to_signup_aria: 'Zur Registrierung wechseln',
      switch_to_login_aria: 'Zur Anmeldung wechseln',
      create_account: 'Konto erstellen',
      show_password_aria: 'Passwort anzeigen',
      hide_password_aria: 'Passwort ausblenden',
      secure_auth_message:
        'Sichere Authentifizierung mit Ende-zu-Ende-Verschlüsselung',
      ssl_secured: 'SSL Gesichert',
      privacy_protected: 'Privatsphäre geschützt',
      // Product page translations
      add_to_cart: 'In den Warenkorb',
      out_of_stock: 'Nicht auf Lager',
      in_stock: '{{count}} auf Lager',
      technical_description: 'Technische Beschreibung',
      technical_specifications: 'Technische Spezifikationen',
      reviews: 'Bewertungen',
      write_review: 'Bewertung schreiben',
      rating: 'Bewertung',
      share_experience: 'Teilen Sie Ihre Erfahrungen mit diesem Produkt...',
      submit_review: 'Bewertung abschicken',
      submitting_review: 'Wird übermittelt...',
      no_reviews:
        'Noch keine Bewertungen. Seien Sie der Erste, der eine Bewertung abgibt!',
      original_natural: '100% Original & Natürlich',
      cash_delivery: 'Nachnahme verfügbar',
      return_policy: '7-Tage-Rückgaberecht',

      // UserProfile translations
      account_details: 'Kontodetails',
      shipping_address: 'Lieferadresse',
      change_password: 'Passwort ändern',
      account_information: 'Kontoinformationen',
      full_name_label: 'Vollständiger Name',
      email_address: 'E-Mail-Adresse',
      contact_support_email:
        'Kontaktieren Sie den Support, um Ihre E-Mail zu ändern',
      save_changes: 'Änderungen speichern',
      saving: 'Wird gespeichert...',
      shipping_information: 'Versandinformationen',
      recipient_name: 'Empfängername *',
      street_address: 'Straße und Hausnummer *',
      city_label: 'Stadt *',
      state_label: 'Bundesland',
      postal_code: 'Postleitzahl *',
      country_label: 'Land',
      phone_number: 'Telefonnummer *',
      invalid_phone: 'Ungültiges Telefonnummernformat',
      save_address: 'Adresse speichern',
      current_password: 'Aktuelles Passwort *',
      new_password: 'Neues Passwort *',
      confirm_new_password: 'Neues Passwort bestätigen *',
      password_length_hint: 'Muss mindestens 8 Zeichen lang sein',
      updating: 'Wird aktualisiert...',
      change_password_button: 'Passwort ändern',

      // Orders page translations
      my_orders: 'Meine Bestellungen',
      no_orders: 'Noch keine Bestellungen',
      no_orders_message:
        'Sie haben noch keine Bestellungen aufgegeben. Beginnen Sie mit dem Einkaufen, um Ihre Bestellungen hier zu sehen!',
      browse_collection: 'Kollektio durchsuchen',
      order_number: 'Bestellung #{{id}}',
      placed_on: 'Aufgegeben am: {{date}}',
      order_total: 'Gesamt: {{currency}} {{amount}}',
      items_count: '{{count}} Artikel',
      view_details: 'Details anzeigen',
      track_order: 'Bestellung verfolgen',
      awaiting_delivery: 'Wartet auf Lieferung',
      in_delivery: 'Wird geliefert',
      delivered: 'Geliefert',
      paused: 'Pausiert',
      cancelled: 'Storniert',

      // OrderConfirmation translations
      thank_you: 'Vielen Dank für Ihre Bestellung!',
      order_placed: 'Ihre Bestellung #{{id}} wurde erfolgreich aufgegeben',
      status_label: 'Status:',
      order_date: 'Bestelldatum: {{date}}',
      order_summary: 'Bestellübersicht',
      subtotal_label: 'Zwischensumme',
      delivery_fee_label: 'Liefergebühr',
      total_label: 'Gesamtsumme',
      shipping_info: 'Versandinformationen',
      name_label: 'Name:',
      address_label: 'Adresse:',
      city_info: 'Stadt:',
      state_info: 'Bundesland:',
      postal_code_info: 'Postleitzahl:',
      country_info: 'Land:',
      phone_info: 'Telefon:',
      payment_method: 'Zahlungsmethode',
      cash_on_delivery: 'Nachnahme',
      international_credit_card: 'Internationale Kreditkarte',
      national_credit_card: 'Nationale Kreditkarte',
      email_confirmation: 'Sie erhalten in Kürze eine E-Mail-Bestätigung.',
      print_receipt: 'Beleg drucken',
      continue_shopping: 'Weiter einkaufen',
      view_my_orders: 'Meine Bestellungen anzeigen',

      // Newsletter translations
      enter_email_warning: 'Bitte geben Sie Ihre E-Mail-Adresse ein',
      unsubscribe_failed: 'Abbestellung fehlgeschlagen',
      unsubscribe_title: 'Vom Newsletter abmelden',
      unsubscribe_message:
        'Es tut uns leid, dass Sie gehen. Geben Sie Ihre E-Mail-Adresse ein, um sich abzumelden.',
      unsubscribe_button: 'Abmelden',
      email_verified_success: 'E-Mail erfolgreich verifiziert!',
      verification_failed:
        'Verifizierung fehlgeschlagen. Bitte versuchen Sie es erneut.',
      verifying_email: 'Ihre E-Mail wird verifiziert...',
      verification_success_title: 'Verifizierung erfolgreich!',
      verification_success_message:
        'Ihre E-Mail wurde verifiziert. Sie erhalten nun unsere neuesten Angebote und Updates.',
      invalid_link_title: 'Ungültiger Verifizierungslink',
      invalid_link_message:
        'Der Verifizierungslink ist ungültig oder abgelaufen. Bitte versuchen Sie, sich erneut anzumelden.',
      verification_error_title: 'Verifizierungsfehler',
      verification_error_message:
        'Etwas ist schief gelaufen. Bitte versuchen Sie es später erneut.',

      // Place Order
      online_payment: 'Online-Zahlung',
      proceed_to_payment: 'Weiter zur Zahlung',
      place_order: 'Bestellung Aufgeben',
    },
  },
};

// Initialize i18n
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    debug:
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'cookie', 'navigator'],
      caches: ['localStorage', 'cookie'],
    },
  });

export default i18n;
