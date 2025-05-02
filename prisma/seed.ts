import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

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

  // Create each SME with their corresponding users
  const warungMadeSME = await prisma.user.create({
    data: {
      name: 'Made',
      email: 'warungmade@example.com',
      password: await bcrypt.hash('password123', 10),
      phone: '+62812345678',
      sme: {
        create: {
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
            create: [{ categoryId: categories[0].id }]
          },
          images: {
            create: [{
              url: '/placeholder.jpg',
              alt: 'Warung Made Storefront',
              isFeatured: true
            }]
          },
          products: {
            create: [
              {
                name: 'Nasi Campur Bali',
                description: 'Nasi dengan berbagai lauk khas Bali',
                price: 35000
              },
              {
                name: 'Bebek Betutu',
                description: 'Bebek bumbu khas Bali yang dibungkus daun pisang',
                price: 85000
              }
            ]
          }
        }
      }
    },
    include: {
      sme: true
    }
  })

  const dewiArtSME = await prisma.user.create({
    data: {
      name: 'Dewi',
      email: 'dewi.art@example.com',
      password: await bcrypt.hash('password123', 10),
      phone: '+62876543210',
      sme: {
        create: {
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
            create: [{ categoryId: categories[1].id }]
          },
          images: {
            create: [{
              url: '/placeholder.jpg',
              alt: 'Dewi Art Gallery Storefront',
              isFeatured: true
            }]
          },
          products: {
            create: [
              {
                name: 'Lukisan Tradisional Bali',
                description: 'Lukisan dengan motif tradisional Bali',
                price: 1500000
              },
              {
                name: 'Patung Garuda',
                description: 'Patung Garuda ukiran kayu',
                price: 2500000
              }
            ]
          }
        }
      }
    },
    include: {
      sme: true
    }
  })

  const batuBataSME = await prisma.user.create({
    data: {
      name: 'Wayan',
      email: 'batubata@example.com',
      password: await bcrypt.hash('password123', 10),
      phone: '+62890123456',
      sme: {
        create: {
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
            create: [{ categoryId: categories[2].id }]
          },
          images: {
            create: [{
              url: '/placeholder.jpg',
              alt: 'Batu Bata Fashion Store',
              isFeatured: true
            }]
          },
          products: {
            create: [
              {
                name: 'Kemeja Endek Modern',
                description: 'Kemeja dengan kain endek Bali modern',
                price: 450000
              },
              {
                name: 'Dress Batik Bali',
                description: 'Dress dengan motif batik khas Bali',
                price: 650000
              }
            ]
          }
        }
      }
    },
    include: {
      sme: true
    }
  })

  console.log('Seeding completed successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })