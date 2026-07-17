export type PrintPlacement =
  | 'Front Print'
  | 'Back Print'
  | 'Front & Back Print'
  | 'Sleeve Print'

export interface ZabalColor {
  id: string
  name: string
  hex: string
  units: number
  imagePath: string
}

export const ZABAL_COLORS: ZabalColor[] = [
  { id: 'arctic-white',     name: 'Arctic White',     hex: '#EDEAE0', units: 20, imagePath: '/zabal/arctic-white.png' },
  { id: 'ash-gray',         name: 'Ash Gray',         hex: '#8C8C8C', units: 20, imagePath: '/zabal/ash-gray.png' },
  { id: 'burnt-orange',     name: 'Burnt Orange',     hex: '#C44B00', units: 20, imagePath: '/zabal/burnt-orange.png' },
  { id: 'chocolate-brown',  name: 'Chocolate Brown',  hex: '#3B1A07', units: 20, imagePath: '/zabal/chocolate-brown.png' },
  { id: 'crimson-red',      name: 'Crimson Red',      hex: '#B30015', units: 20, imagePath: '/zabal/crimson-red.png' },
  { id: 'deep-purple',      name: 'Deep Purple',      hex: '#3D0080', units: 20, imagePath: '/zabal/deep-purple.png' },
  { id: 'forest-green',     name: 'Forest Green',     hex: '#1E4D1E', units: 20, imagePath: '/zabal/forest-green.png' },
  { id: 'gold-mustard',     name: 'Gold Mustard',     hex: '#C49A00', units: 20, imagePath: '/zabal/gold-mustard.png' },
  { id: 'ice-blue',         name: 'Ice Blue',         hex: '#89B4C8', units: 20, imagePath: '/zabal/ice-blue.png' },
  { id: 'midnight-black',   name: 'Midnight Black',   hex: '#0D0D0D', units: 20, imagePath: '/zabal/midnight-black.png' },
  { id: 'navy-blue',        name: 'Navy Blue',        hex: '#002266', units: 20, imagePath: '/zabal/navy-blue.png' },
  { id: 'royal-blue',       name: 'Royal Blue',       hex: '#1C3FCC', units: 20, imagePath: '/zabal/royal-blue.png' },
]

export const ZABAL_PRODUCT = {
  id: 'zabal',
  name: 'HOOD Zabal Edition',
  collection: 'Drop 001',
  tagline: '12 colors. 240 units. First drop.',
  description:
    'The first HOOD drop. Premium heavyweight cotton in 12 exclusive colorways. Add your custom text and chest logo at checkout. Every unit ships with a numbered certificate of authenticity.',
  price: 49.99,
  isDrop: true,
  unitsTotal: 240,
  printPlacement: 'Front & Back Print' as PrintPlacement,
  details: [
    '400GSM heavyweight cotton hoodie',
    'Custom text — front and back (you choose at checkout)',
    'Chest logo — your image or Farcaster PFP',
    'Matching snapback hat — same colorway',
    'Premium leather key holder with HOOD stamp',
    '20 units per color — 240 total worldwide',
    'Numbered certificate of authenticity',
  ],
  includes: [
    { emoji: '🧥', label: 'Premium Hoodie', sub: '400GSM heavyweight cotton' },
    { emoji: '🧢', label: 'Matching Hat', sub: 'Structured snapback — same colorway' },
    { emoji: '🔑', label: 'Key Holder', sub: 'Premium leather with HOOD stamp' },
  ],
}

export const PLACEMENT_COLORS: Record<string, string> = {
  'Front Print':         'text-lime-400 bg-lime-400/10 border-lime-400/20',
  'Back Print':          'text-blue-400 bg-blue-400/10 border-blue-400/20',
  'Front & Back Print':  'text-purple-400 bg-purple-400/10 border-purple-400/20',
  'Sleeve Print':        'text-amber-400 bg-amber-400/10 border-amber-400/20',
}
