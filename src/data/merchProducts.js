// AUSSS 2025–26 merch catalogue.
//
// Per the booklet's final page: "All orders are on a pre-order basis. This
// ensures that no expenses or incomes are held by AUSSS. What you pay for is
// what you get." → every product is shipped as a pre-order. The checkout UI
// surfaces this clearly.
//
// Fields:
//   id           – stable slug used as React key + cart key
//   name         – display name
//   tagline      – short marketing line from the booklet (optional)
//   description  – longer paragraph for the product card
//   image        – primary product shot (currently points at booklet pages;
//                  swap in cropped/transparent shots when available)
//   gallery      – extra shots shown on the product card / modal
//   price        – EGP price
//   sizes        – ordered list of available sizes (clothing only)
//   sizeChart    – path to a size-chart image (optional)
//   designs      – ordered list of design / colour / committee variants
//   category     – 'apparel' | 'accessories' | 'stationery'
//   available    – false = hide from the shop entirely
//   preorder     – true = order is fulfilled after production run

export const merchProducts = [
  {
    id: 'tshirt-55',
    name: 'AUSSS T-Shirt, 55th Limited Edition',
    tagline: 'Think Global. Act Local.',
    description:
      'Forest-green ringer tee with white trim. AUSSS shield embroidered on the chest, alligator monogram on the side, and the "Life Savers, Change Makers" script on the back, finished with "55 years of youth, 55 years of impact."',
    image: '/assets/merch/page-04.jpg',
    gallery: ['/assets/merch/page-05.jpg', '/assets/merch/page-06.jpg'],
    price: 300,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    sizeChart: '/assets/merch/size-chart-tshirt.jpg',
    designs: [],
    category: 'apparel',
    available: true,
    preorder: true,
  },
  {
    id: 'jacket',
    name: '"The" AUSSS Jacket',
    tagline: 'Same vibe. Same legacy.',
    description:
      'The varsity jacket is back. Forest-green body with cream wool-blend sleeves, AUSSS shield on the chest, "Life Savers, Change Makers" embroidered on the back, "25/26" + AUSSS-Earth crest on the left sleeve, AUSSS alligator on the right sleeve.',
    image: '/assets/merch/page-11.jpg',
    gallery: [
      '/assets/merch/page-08.jpg',
      '/assets/merch/page-09.jpg',
      '/assets/merch/page-10.jpg',
    ],
    price: 650,
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'],
    sizeChart: '/assets/merch/size-chart-jacket.jpg',
    designs: [],
    category: 'apparel',
    available: true,
    preorder: true,
  },
  {
    id: 'bucket-hat',
    name: 'Dash Bucket Hat',
    tagline: 'When things get too hot.',
    description:
      'Cream cotton bucket hat with the embroidered green AUSSS alligator logo on the front.',
    image: '/assets/merch/page-12.jpg',
    gallery: [],
    price: 150,
    sizes: ['One size'],
    designs: [],
    category: 'accessories',
    available: true,
    preorder: true,
  },
  {
    id: 'notebook',
    name: 'AUSSS Notebook',
    tagline: 'Like it? Note it down.',
    description:
      'Spiral-bound notebook with a committee-themed cover. Pick a standing committee, the Exchange (SCOPE + SCORE) cover, or the Support Divisions cover.',
    image: '/assets/merch/page-13.jpg',
    gallery: ['/assets/merch/page-14.jpg'],
    price: 40,
    sizes: [],
    designs: [
      'SCOPH',
      'SCORA',
      'SCOME',
      'SCORP',
      'Exchange',
      'Support Divisions',
    ],
    // Designs that get their own full-width row in the picker grid.
    wideDesigns: ['Exchange', 'Support Divisions'],
    category: 'stationery',
    available: true,
    preorder: true,
  },
]

// Convenience lookups used by the cart + checkout.
export const productById = Object.fromEntries(
  merchProducts.map((p) => [p.id, p]),
)

export const availableProducts = merchProducts.filter((p) => p.available)
