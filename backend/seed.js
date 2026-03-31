require('dotenv').config()
const mongoose = require('mongoose')
const User = require('./models/User')
const Product = require('./models/Product')

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ MongoDB Connected')

    await User.deleteMany({})
    await Product.deleteMany({})
    console.log('🗑️  Cleared existing data')

    const farmers = await User.create([
      { name: 'John Kamau',    email: 'john@farm.com',   password: '123456', role: 'farmer', phone: '+254712345678', location: 'Nyeri' },
      { name: 'Mary Wanjiku',  email: 'mary@farm.com',   password: '123456', role: 'farmer', phone: '+254723456789', location: 'Mombasa' },
      { name: 'Peter Omondi',  email: 'peter@farm.com',  password: '123456', role: 'farmer', phone: '+254734567890', location: 'Eldoret' },
      { name: 'Grace Achieng', email: 'grace@farm.com',  password: '123456', role: 'farmer', phone: '+254745678901', location: 'Kisumu' },
      { name: 'Samuel Mutua',  email: 'samuel@farm.com', password: '123456', role: 'farmer', phone: '+254756789012', location: 'Machakos' },
      { name: 'Jane Njoki',    email: 'jane@farm.com',   password: '123456', role: 'farmer', phone: '+254767890123', location: 'Muranga' },
    ])
    console.log(`✅ Created ${farmers.length} farmers`)

    await User.create({
      name: 'Alice Consumer', email: 'alice@test.com', password: '123456',
      role: 'consumer', phone: '+254700000000', location: 'Nairobi',
    })
    console.log('✅ Created test consumer')

    await Product.create([
      { name: 'Fresh Tomatoes',       price: 120, unit: 'kg',     quantity: 50,  category: 'Vegetables', farmer: farmers[0]._id, phone: '+254712345678', location: 'Nyeri',    description: 'Sun-ripened tomatoes grown organically on the fertile slopes of Mt. Kenya. Rich in lycopene and natural flavor.', isAvailable: true },
      { name: 'Sweet Mangoes',        price: 80,  unit: 'kg',     quantity: 200, category: 'Fruits',     farmer: farmers[1]._id, phone: '+254723456789', location: 'Mombasa',  description: 'Premium Alphonso mangoes hand-picked at perfect ripeness. Exceptionally sweet and aromatic.', isAvailable: true },
      { name: 'White Maize',          price: 45,  unit: 'kg',     quantity: 500, category: 'Grains',     farmer: farmers[2]._id, phone: '+254734567890', location: 'Eldoret',  description: 'Drought-resistant white maize, sun-dried and carefully cleaned. Perfect for ugali and flour milling.', isAvailable: true },
      { name: 'Sukuma Wiki',          price: 30,  unit: 'bundle', quantity: 100, category: 'Vegetables', farmer: farmers[3]._id, phone: '+254745678901', location: 'Kisumu',   description: 'Fresh kale bundles harvested daily. High in iron, calcium, and vitamins A, C, and K.', isAvailable: true },
      { name: 'Free-Range Eggs',      price: 500, unit: 'tray',   quantity: 30,  category: 'Poultry',    farmer: farmers[4]._id, phone: '+254756789012', location: 'Machakos', description: 'Farm-fresh eggs from free-range corn-fed hens. Zero antibiotics, zero hormones.', isAvailable: true },
      { name: 'Hass Avocados',        price: 150, unit: 'kg',     quantity: 80,  category: 'Fruits',     farmer: farmers[5]._id, phone: '+254767890123', location: 'Muranga',  description: 'Creamy Hass avocados at perfect ripeness. Grown without chemical pesticides.', isAvailable: true },
      { name: 'Irish Potatoes',       price: 55,  unit: 'kg',     quantity: 300, category: 'Vegetables', farmer: farmers[0]._id, phone: '+254712345678', location: 'Nyeri',    description: 'Large, clean Irish potatoes from the fertile highlands. Perfect for chips, stew, and roasting.', isAvailable: true },
      { name: 'Raw Wildflower Honey', price: 800, unit: '500ml',  quantity: 25,  category: 'Others',     farmer: farmers[1]._id, phone: '+254723456789', location: 'Kajiado',  description: 'Pure unprocessed wildflower honey from indigenous log beehives. Rich in antioxidants.', isAvailable: true },
      { name: 'Spinach Bundles',      price: 25,  unit: 'bundle', quantity: 150, category: 'Vegetables', farmer: farmers[3]._id, phone: '+254745678901', location: 'Kisumu',   description: 'Fresh spinach packed with iron and vitamins. Harvested in the early morning for maximum freshness.', isAvailable: true },
      { name: 'Passion Fruits',       price: 200, unit: 'kg',     quantity: 60,  category: 'Fruits',     farmer: farmers[2]._id, phone: '+254734567890', location: 'Eldoret',  description: 'Ripe juicy passion fruits bursting with tropical flavor. Great for juice and desserts.', isAvailable: true },
      { name: 'Watermelon',           price: 150, unit: 'piece',  quantity: 40,  category: 'Fruits',     farmer: farmers[4]._id, phone: '+254756789012', location: 'Machakos', description: 'Sweet seedless watermelons grown in the warm lowlands. Refreshing and hydrating.', isAvailable: true },
      { name: 'Green Capsicum',       price: 80,  unit: 'kg',     quantity: 70,  category: 'Vegetables', farmer: farmers[5]._id, phone: '+254767890123', location: 'Muranga',  description: 'Crunchy green capsicums perfect for stir-fries, salads, and stuffing.', isAvailable: true },
      { name: 'Dry Beans',            price: 150, unit: 'kg',     quantity: 200, category: 'Grains',     farmer: farmers[0]._id, phone: '+254712345678', location: 'Nyeri',    description: 'Clean dry beans with no chemicals. High in protein and fiber. Great for githeri and soup.', isAvailable: true },
      { name: 'Bananas',              price: 60,  unit: 'bunch',  quantity: 90,  category: 'Fruits',     farmer: farmers[1]._id, phone: '+254723456789', location: 'Mombasa',  description: 'Ripe yellow bananas from the coast. Naturally sweet and packed with potassium.', isAvailable: true },
      { name: 'Carrots',              price: 70,  unit: 'kg',     quantity: 120, category: 'Vegetables', farmer: farmers[2]._id, phone: '+254734567890', location: 'Eldoret',  description: 'Firm sweet carrots from the highlands. Perfect raw, cooked, or juiced.', isAvailable: true },
      { name: 'Fresh Milk',           price: 60,  unit: 'litre',  quantity: 100, category: 'Dairy',      farmer: farmers[3]._id, phone: '+254745678901', location: 'Kisumu',   description: 'Fresh whole milk from grass-fed cows. No preservatives. Collected twice daily.', isAvailable: true },
    ])
    console.log('✅ Created 16 products')

    console.log('\n🎉 Database seeded successfully!\n')
    console.log('📋 Test Accounts:')
    console.log('   Farmer:   john@farm.com  / 123456')
    console.log('   Farmer:   mary@farm.com  / 123456')
    console.log('   Consumer: alice@test.com / 123456')
    process.exit(0)
  } catch (error) {
    console.error('❌ Seed error:', error.message)
    process.exit(1)
  }
}

seed()
