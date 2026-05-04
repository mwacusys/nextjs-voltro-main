import { Data, IProductInput, IUserInput } from '@/types'
import { toSlug } from './utils'
import bcrypt from 'bcryptjs'
import { i18n } from '@/i18n-config'

// Helper: auto add department
const withDepartment = (
  products: Omit<IProductInput, 'department'>[],
  department: string
): IProductInput[] =>
  products.map((p) => ({
    ...p,
    department,
  }))

// ---------------- USERS ----------------
const users: IUserInput[] = [
  {
    name: 'John',
    email: 'admin@example.com',
    password: bcrypt.hashSync('123456', 5),
    role: 'Admin',
    address: {
      fullName: 'John Doe',
      street: '111 Main St',
      city: 'New York',
      province: 'NY',
      postalCode: '10001',
      country: 'USA',
      phone: '123-456-7890',
    },
    paymentMethod: 'Stripe',
    emailVerified: false,
  },
]

// ---------------- PRODUCTS ----------------
const batteryProducts: Omit<IProductInput, 'department'>[] = [
  {
    name: 'Nike Mens Slim-fit Long-Sleeve T-Shirt',
    slug: toSlug('Nike Mens Slim-fit Long-Sleeve T-Shirt'),
    category: 'Cylindrical',
    images: ['/images/p11-1.jpg', '/images/p11-2.jpg'],
    tags: ['new-arrival'],
    isPublished: true,
    price: 21.8,
    listPrice: 0,
    brand: 'Nike',
    avgRating: 4.71,
    numReviews: 7,
    ratingDistribution: [
      { rating: 1, count: 0 },
      { rating: 2, count: 0 },
      { rating: 3, count: 0 },
      { rating: 4, count: 2 },
      { rating: 5, count: 5 },
    ],
    numSales: 9,
    countInStock: 11,
    description: 'Made with chemicals safer for human health',
    sizes: ['S', 'M'],
    colors: ['Green', 'Red'],
    reviews: [],
  },
  {
    name: 'Jerzees Long-Sleeve Heavyweight Blend T-Shirt',
    slug: toSlug('Jerzees Long-Sleeve Heavyweight Blend T-Shirt'),
    category: 'Prismatic',
    images: ['/images/p12-1.jpg'],
    tags: ['featured'],
    isPublished: true,
    price: 23.78,
    listPrice: 0,
    brand: 'Jerzees',
    avgRating: 4.2,
    numReviews: 10,
    ratingDistribution: [{ rating: 5, count: 5 }],
    numSales: 29,
    countInStock: 12,
    description: 'Heavyweight cotton',
    sizes: ['S'],
    colors: ['Black'],
    reviews: [],
  },
]

const bmsProducts: Omit<IProductInput, 'department'>[] = [
  {
    name: 'Smart BMS 8S LiFePO4',
    slug: toSlug('Smart BMS 8S LiFePO4'),
    category: 'Smart BMS',
    images: ['/images/p11-1.jpg'],
    tags: ['best-seller'],
    isPublished: true,
    price: 49.99,
    listPrice: 59.99,
    brand: 'DALY',
    avgRating: 4.5,
    numReviews: 5,
    ratingDistribution: [{ rating: 5, count: 5 }],
    numSales: 20,
    countInStock: 15,
    description: 'Smart BMS for LiFePO4 battery packs',
    sizes: [],
    colors: [],
    reviews: [],
  },
]

const products: IProductInput[] = [
  ...withDepartment(batteryProducts, 'Battery'),
  ...withDepartment(bmsProducts, 'BMS'),
]

// ---------------- NAVBAR MENUS ----------------
const headerMenus = [
  {
    name: 'New Arrivals',
    href: '/search?tag=new-arrival',
  },
  {
    name: 'Featured Products',
    href: '/search?tag=featured',
  },
  {
    name: 'Best Brands',
    href: '/search?tag=best-seller',
  },
  {
    name: 'Voltro Products',
    href: '/search?department=Battery',
  },
  {
    name: 'Case Studies',
    href: '/page/case-studies',
  },
  {
    name: 'Support',
    href: '/page/support',
  },
  {
    name: 'Contact',
    href: '/page/contact',
  },
  {
    name: 'Company Introduction',
    href: '/page/company-introduction',
  },
]

const carousels = [
  {
    title: 'Most Popular Battery For Sale',
    buttonCaption: 'Shop Now',
    image: '/images/banner3.png',
    url: '/search?department=Battery',
    isPublished: true,
  },
  {
    title: 'Best Sellers in BMS',
    buttonCaption: 'Shop Now',
    image: '/images/banner1.png',
    url: '/search?department=BMS',
    isPublished: true,
  },
  {
    title: 'Best Deals on Battery Products',
    buttonCaption: 'See More',
    image: '/images/banner2.png',
    url: '/search?department=Battery',
    isPublished: true,
  },
]

// ---------------- DATA ----------------
const data: Data = {
  users,
  products,
  reviews: [],
  webPages: [],
  headerMenus,
  carousels,
  settings: [
    {
      common: {
        freeShippingMinPrice: 35,
        isMaintenanceMode: false,
        defaultTheme: 'light',
        defaultColor: 'gold',
        pageSize: 9,
      },
      site: {
        name: 'VOLTRO',
        description: 'VOLTRO E-commerce',
        keywords: 'battery, bms, automation',
        url: 'https://example.com',
        logo: '/icons/logo.svg',
        slogan: 'Powering Future',
        author: 'VOLTRO',
        copyright: '2026 VOLTRO. All rights reserved.',
        email: 'admin@example.com',
        address: 'Korea',
        phone: '+82',
      },
      carousels: carousels.map(({ isPublished, ...carousel }) => carousel),
      availableLanguages: i18n.locales.map((l) => ({
        code: l.code,
        name: l.name,
      })),
      defaultLanguage: 'en-US',
      availableCurrencies: [
        {
          name: 'USD',
          code: 'USD',
          symbol: '$',
          convertRate: 1,
        },
      ],
      defaultCurrency: 'USD',
      availablePaymentMethods: [
        {
          name: 'Stripe',
          commission: 0,
        },
      ],
      defaultPaymentMethod: 'Stripe',
      availableDeliveryDates: [
        {
          name: 'Next 5 Days',
          daysToDeliver: 5,
          shippingPrice: 4.9,
          freeShippingMinPrice: 35,
        },
      ],
      defaultDeliveryDate: 'Next 5 Days',
    },
  ],
}

export default data