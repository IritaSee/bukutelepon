import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // First, create some categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Kuliner',
        description: 'Makanan dan minuman khas Bali'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Kerajinan',
        description: 'Produk kerajinan tangan khas Bali'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Fashion',
        description: 'Pakaian dan aksesori khas Bali'
      }
    })
  ])

  // Create some SMEs
  const warungMade = await prisma.sME.create({
    data: {
      name: 'Warung Made',
      description: 'Warung terkenal yang menyajikan makanan khas Bali dengan cita rasa autentik',
      email: 'warungmade@example.com',
      phone: '+62812345678',
      whatsapp: '+62812345678',
      instagram: '@warungmade.bali',
      facebook: 'warungmade.bali',
      website: 'https://warungmade.com',
      address: 'Jalan Raya Ubud No. 123',
      city: 'Gianyar',
      district: 'Ubud',
      village: 'Ubud',
      postalCode: '80571',
      latitude: -8.506853,
      longitude: 115.263091,
      categories: {
        create: [
          {
            categoryId: categories[0].id,  // Kuliner
          }
        ]
      },
      images: {
        create: [
          {
            url: '/placeholder.jpg',
            alt: 'Warung Made Storefront',
            isFeatured: true
          }
        ]
      }
    }
  })

  // Create products for Warung Made
  await Promise.all([
    prisma.product.create({
      data: {
        name: 'Nasi Campur Bali',
        description: 'Nasi dengan berbagai lauk khas Bali',
        price: 35000,
        smeId: warungMade.id,
        images: {
          create: [
            {
              url: '/placeholder.jpg',
              alt: 'Nasi Campur Bali',
              isFeatured: true,
              smeId: warungMade.id
            }
          ]
        }
      }
    }),
    prisma.product.create({
      data: {
        name: 'Bebek Betutu',
        description: 'Bebek bumbu khas Bali yang dibungkus daun pisang',
        price: 85000,
        smeId: warungMade.id,
        images: {
          create: [
            {
              url: '/placeholder.jpg',
              alt: 'Bebek Betutu',
              isFeatured: true,
              smeId: warungMade.id
            }
          ]
        }
      }
    })
  ])

  const dewiArt = await prisma.sME.create({
    data: {
      name: 'Dewi Art Gallery',
      description: 'Galeri seni yang menampilkan berbagai kerajinan tangan khas Bali',
      email: 'dewi.art@example.com',
      phone: '+62876543210',
      whatsapp: '+62876543210',
      instagram: '@dewiart.bali',
      facebook: 'dewiart.bali',
      website: 'https://dewiart.com',
      address: 'Jalan Tegalalang No. 45',
      city: 'Gianyar',
      district: 'Tegalalang',
      village: 'Tegalalang',
      postalCode: '80561',
      latitude: -8.441741,
      longitude: 115.275799,
      categories: {
        create: [
          {
            categoryId: categories[1].id,  // Kerajinan
          }
        ]
      },
      images: {
        create: [
          {
            url: '/placeholder.jpg',
            alt: 'Dewi Art Gallery Storefront',
            isFeatured: true
          }
        ]
      }
    }
  })

  // Create products for Dewi Art
  await Promise.all([
    prisma.product.create({
      data: {
        name: 'Lukisan Tradisional Bali',
        description: 'Lukisan dengan motif tradisional Bali',
        price: 1500000,
        smeId: dewiArt.id,
        images: {
          create: [
            {
              url: '/placeholder.jpg',
              alt: 'Lukisan Tradisional Bali',
              isFeatured: true,
              smeId: dewiArt.id
            }
          ]
        }
      }
    }),
    prisma.product.create({
      data: {
        name: 'Patung Garuda',
        description: 'Patung Garuda ukiran kayu',
        price: 2500000,
        smeId: dewiArt.id,
        images: {
          create: [
            {
              url: '/placeholder.jpg',
              alt: 'Patung Garuda',
              isFeatured: true,
              smeId: dewiArt.id
            }
          ]
        }
      }
    })
  ])

  const batuBata = await prisma.sME.create({
    data: {
      name: 'Batu Bata Fashion',
      description: 'Butik fashion yang menjual pakaian modern dengan sentuhan tradisional Bali',
      email: 'batubata@example.com',
      phone: '+62890123456',
      whatsapp: '+62890123456',
      instagram: '@batubata.fashion',
      facebook: 'batubata.fashion',
      website: 'https://batubata.com',
      address: 'Jalan Kuta Raya No. 88',
      city: 'Badung',
      district: 'Kuta',
      village: 'Kuta',
      postalCode: '80361',
      latitude: -8.719827,
      longitude: 115.169401,
      categories: {
        create: [
          {
            categoryId: categories[2].id,  // Fashion
          }
        ]
      },
      images: {
        create: [
          {
            url: '/placeholder.jpg',
            alt: 'Batu Bata Fashion Store',
            isFeatured: true
          }
        ]
      }
    }
  })

  // Create products for Batu Bata
  await Promise.all([
    prisma.product.create({
      data: {
        name: 'Kemeja Endek Modern',
        description: 'Kemeja dengan kain endek Bali modern',
        price: 450000,
        smeId: batuBata.id,
        images: {
          create: [
            {
              url: '/placeholder.jpg',
              alt: 'Kemeja Endek Modern',
              isFeatured: true,
              smeId: batuBata.id
            }
          ]
        }
      }
    }),
    prisma.product.create({
      data: {
        name: 'Dress Batik Bali',
        description: 'Dress dengan motif batik khas Bali',
        price: 650000,
        smeId: batuBata.id,
        images: {
          create: [
            {
              url: '/placeholder.jpg',
              alt: 'Dress Batik Bali',
              isFeatured: true,
              smeId: batuBata.id
            }
          ]
        }
      }
    })
  ])

  console.log({ categories, warungMade, dewiArt, batuBata })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })