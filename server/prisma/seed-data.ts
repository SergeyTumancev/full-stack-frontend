export type SeedProduct = {
  slug: string;
  name: string;
  price: number;
  description: string;
  emoji: string;
};

export const products: SeedProduct[] = [
  {
    slug: 'wireless-headphones',
    name: 'Беспроводные наушники',
    price: 4990,
    description: 'Наушники с активным шумоподавлением и 30 часами работы от батареи.',
    emoji: '🎧',
  },
  {
    slug: 'mechanical-keyboard',
    name: 'Механическая клавиатура',
    price: 6490,
    description: 'Компактная клавиатура с тактильными переключателями и подсветкой.',
    emoji: '⌨️',
  },
  {
    slug: 'smart-watch',
    name: 'Умные часы',
    price: 12990,
    description: 'Часы с пульсометром, GPS и уведомлениями со смартфона.',
    emoji: '⌚',
  },
  {
    slug: 'coffee-mug',
    name: 'Керамическая кружка',
    price: 890,
    description: 'Кружка объёмом 350 мл с термоизоляцией и ярким принтом.',
    emoji: '☕',
  },
  {
    slug: 'notebook',
    name: 'Блокнот в твёрдой обложке',
    price: 450,
    description: 'Блокнот формата A5 на 192 страницы с точками для записей и скетчей.',
    emoji: '📓',
  },
  {
    slug: 'backpack',
    name: 'Городской рюкзак',
    price: 3490,
    description: 'Рюкзак на 20 литров с отделением для ноутбука до 15 дюймов.',
    emoji: '🎒',
  },
  {
    slug: 'desk-lamp',
    name: 'Настольная лампа',
    price: 1990,
    description: 'Светодиодная лампа с регулировкой яркости и цветовой температуры.',
    emoji: '💡',
  },
  {
    slug: 'plant',
    name: 'Живое растение в горшке',
    price: 1290,
    description: 'Неприхотливое комнатное растение, которое подойдёт даже новичку.',
    emoji: '🪴',
  },
];
