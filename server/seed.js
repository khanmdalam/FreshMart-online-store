const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()
const Product = require('./models/product')
const Category = require('./models/category')

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('MongoDB connected')

    // Clear existing data
    await Product.deleteMany()
    await Category.deleteMany()
    console.log('Cleared existing data')

    // Create categories
    const categories = await Category.insertMany([
      { name: 'Fresh Vegetables', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400', description: 'Fresh farm vegetables' },
      { name: 'Fruits', image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400', description: 'Fresh fruits' },
      { name: 'Dairy & Eggs', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400', description: 'Dairy products and eggs' },
      { name: 'Bakery', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400', description: 'Fresh bakery items' },
      { name: 'Meat & Fish', image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400', description: 'Fresh meat and fish' },
      { name: 'Beverages', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400', description: 'Drinks and beverages' },
      { name: 'Paan Corner', image: 'https://imgs.search.brave.com/v5aE2TFgKOudf_SAodORtZoyc_jpRBh0Wl4nRy--G9s/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/cGl4YWJheS5jb20v/cGhvdG8vMjAxNC8x/MS8xNC8xOS81NS9s/aWdodGVyLTUzMTE3/MF82NDAuanBn', description: 'Cigerattes and other paan products' },

    ])

    console.log('Categories created')

    const vegs = categories[0]._id
    const fruits = categories[1]._id
    const dairy = categories[2]._id
    const bakery = categories[3]._id
    const meat = categories[4]._id
    const beverages = categories[5]._id
    const paan = categories[6]._id

    // Create products
    await Product.insertMany([
      // Vegetables
      { name: 'Organic Spinach', price: 35, stock: 100, category: vegs, imageURL: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400', description: 'Fresh organic spinach' },
      { name: 'Fresh Broccoli', price: 60, stock: 80, category: vegs, imageURL: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400', description: 'Fresh green broccoli' },
      { name: 'Red Bell Pepper', price: 85, stock: 60, category: vegs, imageURL: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400', description: 'Fresh red bell pepper' },
      { name: 'Carrot Bunch', price: 40, stock: 120, category: vegs, imageURL: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400', description: 'Fresh carrot bunch' },
      { name: 'Organic Red Tomatoes', price: 30, stock: 100, category: vegs, imageURL: 'https://images.unsplash.com/photo-1546094096-0df4bcabd337?w=400', description: 'Farm fresh tomatoes' },
      { name: 'Fresh Cucumber', price: 25, stock: 90, category: vegs, imageURL: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=400', description: 'Fresh green cucumber' },

      // Fruits
      { name: 'Fresh Apple', price: 120, stock: 50, category: fruits, imageURL: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400', description: 'Fresh red apples from Kashmir' },
      { name: 'Banana', price: 45, stock: 100, category: fruits, imageURL: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400', description: 'Fresh organic bananas' },
      { name: 'Orange', price: 90, stock: 70, category: fruits, imageURL: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=400', description: 'Fresh juicy oranges' },
      { name: 'Pomegranate', price: 140, stock: 40, category: fruits, imageURL: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400', description: 'Fresh pomegranate' },
      { name: 'Watermelon', price: 50, stock: 30, category: fruits, imageURL: 'https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?w=400', description: 'Fresh watermelon' },
      { name: 'Fresh Mangoes', price: 150, stock: 60, category: fruits, imageURL: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400', description: 'Sweet Alphonso mangoes' },

      // Dairy & Eggs
      { name: 'Fresh Whole Milk', price: 60, stock: 100, category: dairy, imageURL: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400', description: 'Fresh whole milk' },
      { name: 'Farm Eggs', price: 80, stock: 200, category: dairy, imageURL: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400', description: 'Farm fresh eggs' },
      { name: 'Paneer', price: 90, stock: 50, category: dairy, imageURL: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400', description: 'Fresh homemade paneer' },
      { name: 'Butter', price: 55, stock: 80, category: dairy, imageURL: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400', description: 'Fresh farm butter' },
      { name: 'Curd', price: 40, stock: 100, category: dairy, imageURL: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400', description: 'Fresh homemade curd' },

      // Bakery
      { name: 'Whole Wheat Bread', price: 45, stock: 60, category: bakery, imageURL: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400', description: 'Freshly baked whole wheat bread' },
      { name: 'Croissant', price: 30, stock: 40, category: bakery, imageURL: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400', description: 'Buttery fresh croissant' },
      { name: 'Muffin', price: 25, stock: 50, category: bakery, imageURL: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400', description: 'Fresh chocolate muffin' },
      { name: 'Baguette', price: 50, stock: 30, category: bakery, imageURL: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc7c?w=400', description: 'Fresh French baguette' },

      // Meat & Fish
      { name: 'Fresh Chicken', price: 200, stock: 50, category: meat, imageURL: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400', description: 'Fresh farm chicken' },
      { name: 'Salmon Fillet', price: 350, stock: 30, category: meat, imageURL: 'https://images.unsplash.com/photo-1574781330855-d0db8cc6a79c?w=400', description: 'Fresh salmon fillet' },
      { name: 'Prawns', price: 400, stock: 25, category: meat, imageURL: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400', description: 'Fresh prawns' },
      { name: 'Mutton', price: 500, stock: 20, category: meat, imageURL: 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=400', description: 'Fresh mutton' },

      // Beverages
      { name: 'Orange Juice', price: 80, stock: 60, category: beverages, imageURL: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400', description: 'Fresh squeezed orange juice' },
      { name: 'Green Tea', price: 120, stock: 80, category: beverages, imageURL: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400', description: 'Premium green tea' },
      { name: 'Coconut Water', price: 40, stock: 70, category: beverages, imageURL: 'https://images.unsplash.com/photo-1559181567-c3190bda8a41?w=400', description: 'Fresh coconut water' },
      { name: 'Mango Smoothie', price: 90, stock: 50, category: beverages, imageURL: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400', description: 'Fresh mango smoothie' },

      // Paan Corner
      { name: 'Marlboro Red', price: 210, stock: 100, category: paan, imageURL: 'https://imgs.search.brave.com/a7t66RVxhqYqZqSYHmDUFeNaSHN9l5aN_l4hbMKiIg8/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMubWVtZS1hcnNl/bmFsLmNvbS80M2M4/NzIxNzJmMGU1MDc5/MjY0YzQ5OGMyODE4/MjU5MS5qcGc', description: 'Marlboro Red Cigarettes' },
      { name: 'Marlboro Advance', price: 115, stock: 100, category: paan, imageURL: 'https://imgs.search.brave.com/jYGW1a3ZnG46fmapekX9hDLJw5G7NLrKXlC-WQ7MAG8/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWFn/ZS5jZG4uc2hweS5p/bi8zMTk1NTEvMTcw/MTQzNzA0MTg5MF8x/LmpwZWc_d2lkdGg9/NjAwJmZvcm1hdD13/ZWJw', description: 'Marlboro Advanced Cigarettes' },



    ])


    console.log('Products created')
    console.log('✅ Database seeded successfully!')
    process.exit()

  } catch (error) {
    console.error('Error seeding database:', error)
    process.exit(1)
  }
}

seedData()