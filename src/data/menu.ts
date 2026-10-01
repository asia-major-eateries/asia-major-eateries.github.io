export type MenuDish = {
  country: string;
  name: string;
  description: string;
  defaultProtein: string;
  lowerGlycemicSwap: string;
  image: string;
  alt: string;
};

const menuImage = (slug: string) => `/images/menu/generated/${slug}.webp`;

export const menuDishes: MenuDish[] = [
  {
    country: 'Japan',
    name: 'Tonkotsu Ramen',
    description: 'Creamy ramen with chashu, egg, scallions and nori.',
    defaultProtein: 'Pork',
    lowerGlycemicSwap: 'Lower-glycemic noodle option',
    image: menuImage('japan'),
    alt: 'Tonkotsu ramen with chashu pork, egg, scallions and nori',
  },
  {
    country: 'Thailand',
    name: 'Shrimp Pad Thai',
    description: 'Pad Thai with shrimp, bean sprouts, scallions, peanut and lime.',
    defaultProtein: 'Shrimp',
    lowerGlycemicSwap: 'Lower-glycemic noodle option',
    image: menuImage('thailand'),
    alt: 'Shrimp pad Thai with bean sprouts, peanuts, herbs and lime',
  },
  {
    country: 'Vietnam',
    name: 'Beef Pho',
    description: 'Aromatic pho with beef, herbs, bean sprouts and lime.',
    defaultProtein: 'Beef',
    lowerGlycemicSwap: 'Lower-glycemic noodle option',
    image: menuImage('vietnam'),
    alt: 'Vietnamese beef pho with fresh herbs, bean sprouts and lime',
  },
  {
    country: 'India',
    name: 'Butter Chicken',
    description: 'Butter chicken with aromatic rice and naan.',
    defaultProtein: 'Chicken',
    lowerGlycemicSwap: 'Lower-glycemic rice or vegetable base',
    image: menuImage('india'),
    alt: 'Butter chicken with basmati rice and naan',
  },
  {
    country: 'Nepal',
    name: 'Chicken Momo',
    description: 'Steamed momo dumplings with tomato achar.',
    defaultProtein: 'Chicken',
    lowerGlycemicSwap: 'Vegetable-forward lower-glycemic preparation',
    image: menuImage('nepal'),
    alt: 'Nepali chicken momo dumplings with tomato achar',
  },
  {
    country: 'Pakistan',
    name: 'Chicken Biryani',
    description: 'Fragrant chicken biryani with herbs, fried onion and raita.',
    defaultProtein: 'Chicken',
    lowerGlycemicSwap: 'Lower-glycemic rice or vegetable base',
    image: menuImage('pakistan'),
    alt: 'Pakistani chicken biryani with herbs and raita',
  },
  {
    country: 'Philippines',
    name: 'Chicken Adobo',
    description: 'Glossy braised chicken adobo with garlic rice.',
    defaultProtein: 'Chicken',
    lowerGlycemicSwap: 'Lower-glycemic rice or vegetable base',
    image: menuImage('philippines'),
    alt: 'Filipino chicken adobo with garlic rice',
  },
  {
    country: 'Malaysia',
    name: 'Nasi Lemak',
    description: 'Coconut rice with sambal, cucumber, peanuts, anchovies and chicken.',
    defaultProtein: 'Chicken',
    lowerGlycemicSwap: 'Lower-glycemic coconut grain or vegetable base',
    image: menuImage('malaysia'),
    alt: 'Malaysian nasi lemak with fried chicken, sambal, cucumber and peanuts',
  },
  {
    country: 'Korea',
    name: 'Bibimbap',
    description: 'Vegetables, beef, egg, sesame and gochujang over rice.',
    defaultProtein: 'Beef',
    lowerGlycemicSwap: 'Lower-glycemic grain or vegetable base',
    image: menuImage('korea'),
    alt: 'Korean bibimbap with beef, vegetables, egg and gochujang',
  },
  {
    country: 'China',
    name: 'Kung Pao Chicken',
    description: 'Chicken, dried chile, scallions and peanuts with rice.',
    defaultProtein: 'Chicken',
    lowerGlycemicSwap: 'Lower-glycemic rice or vegetable base',
    image: menuImage('china'),
    alt: 'Kung pao chicken with dried chiles, peanuts, scallions and rice',
  },
];

export const menuPrinciples = [
  'No added MSG',
  'Vegan preparation available for every core dish',
  'Meat or seafood is the default preparation',
  'Lower-glycemic bases and swaps available',
  'Organic and locally grown ingredients prioritized where available',
  'Core menu is approximately 95% shared across locations',
] as const;
