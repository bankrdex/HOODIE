export type PrintPlacement =
  | 'Front Print'
  | 'Back Print'
  | 'Front & Back Print'
  | 'Sleeve Print'

export interface ProductColor {
  id: string
  name: string
  hex: string
  imagePath: string
}

export interface HoodProduct {
  id: string
  name: string
  collection: string
  tagline: string
  description: string
  price: number
  isDrop: boolean
  unitsTotal: number
  printPlacement: PrintPlacement
  colors: ProductColor[]
  details: string[]
  includes: { emoji: string; label: string; sub: string }[]
}

export const PRODUCTS: HoodProduct[] = [
  {
    id: 'zabal',
    name: 'HOOD Zabal Edition',
    collection: 'Drop 001',
    tagline: '12 colors. 240 units. First drop.',
    description:
      'The first HOOD drop. Premium heavyweight cotton in 12 exclusive colorways. Add your custom text and chest logo at checkout.',
    price: 49.99,
    isDrop: true,
    unitsTotal: 240,
    printPlacement: 'Front & Back Print',
    colors: [
      { id: 'arctic-white',    name: 'Arctic White',    hex: '#EDEAE0', imagePath: '/zabal/arctic-white.png' },
      { id: 'ash-gray',        name: 'Ash Gray',        hex: '#8C8C8C', imagePath: '/zabal/ash-gray.png' },
      { id: 'burnt-orange',    name: 'Burnt Orange',    hex: '#C44B00', imagePath: '/zabal/burnt-orange.png' },
      { id: 'chocolate-brown', name: 'Chocolate Brown', hex: '#3B1A07', imagePath: '/zabal/chocolate-brown.png' },
      { id: 'crimson-red',     name: 'Crimson Red',     hex: '#B30015', imagePath: '/zabal/crimson-red.png' },
      { id: 'deep-purple',     name: 'Deep Purple',     hex: '#3D0080', imagePath: '/zabal/deep-purple.png' },
      { id: 'forest-green',    name: 'Forest Green',    hex: '#1E4D1E', imagePath: '/zabal/forest-green.png' },
      { id: 'gold-mustard',    name: 'Gold Mustard',    hex: '#C49A00', imagePath: '/zabal/gold-mustard.png' },
      { id: 'ice-blue',        name: 'Ice Blue',        hex: '#89B4C8', imagePath: '/zabal/ice-blue.png' },
      { id: 'midnight-black',  name: 'Midnight Black',  hex: '#0D0D0D', imagePath: '/zabal/midnight-black.png' },
      { id: 'navy-blue',       name: 'Navy Blue',       hex: '#002266', imagePath: '/zabal/navy-blue.png' },
      { id: 'royal-blue',      name: 'Royal Blue',      hex: '#1C3FCC', imagePath: '/zabal/royal-blue.png' },
    ],
    details: [
      '400GSM heavyweight cotton hoodie',
      'Custom text — front and back (you choose at checkout)',
      'Chest logo — your image or Farcaster PFP',
      'Matching snapback hat — same colorway',
      'Premium leather key holder with HOOD stamp',
      '20 units per color — 240 total worldwide',
    ],
    includes: [
      { emoji: '🧥', label: 'Premium Hoodie', sub: '400GSM heavyweight cotton' },
      { emoji: '🧢', label: 'Matching Hat', sub: 'Structured snapback — same colorway' },
      { emoji: '🔑', label: 'Key Holder', sub: 'Premium leather with HOOD stamp' },
    ],
  },
  {
    id: 'hoodies-fam',
    name: 'HOODIES FAM',
    collection: 'Drop 002',
    tagline: '3 colors. 30 units. Community drop.',
    description:
      'The HOODIES FAM drop. Black, Green, and White. HOOD community branding front and back. Only 30 units exist worldwide.',
    price: 25.99,
    isDrop: true,
    unitsTotal: 30,
    printPlacement: 'Front & Back Print',
    colors: [
      { id: 'black', name: 'Black', hex: '#0D0D0D', imagePath: '/hoodies-fam/black.png' },
      { id: 'green', name: 'Green', hex: '#84CC16', imagePath: '/hoodies-fam/green.png' },
      { id: 'white', name: 'White', hex: '#F5F5F5', imagePath: '/hoodies-fam/white.png' },
    ],
    details: [
      '400GSM heavyweight cotton hoodie',
      'HOOD community branding front and back',
      'Available in Black, Green, and White',
      '10 units per color — 30 total worldwide',
      'Custom text at checkout (front + back)',
    ],
    includes: [
      { emoji: '🧥', label: 'Premium Hoodie', sub: '400GSM heavyweight cotton' },
      { emoji: '🧢', label: 'Matching Hat', sub: 'Structured snapback — same colorway' },
      { emoji: '🔑', label: 'Key Holder', sub: 'Premium finish with HOOD stamp' },
    ],
  },
]

export function getProduct(id: string): HoodProduct | undefined {
  return PRODUCTS.find((p) => p.id === id)
}

export const PLACEMENT_COLORS: Record<string, string> = {
  'Front Print':        'text-lime-400 bg-lime-400/10 border-lime-400/20',
  'Back Print':         'text-blue-400 bg-blue-400/10 border-blue-400/20',
  'Front & Back Print': 'text-purple-400 bg-purple-400/10 border-purple-400/20',
  'Sleeve Print':       'text-amber-400 bg-amber-400/10 border-amber-400/20',
}

export const SHIPPING_FEE = 9.99
