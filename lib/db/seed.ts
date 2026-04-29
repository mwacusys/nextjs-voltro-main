/* eslint-disable @typescript-eslint/no-explicit-any */
import data from '@/lib/data'
import { connectToDatabase } from '.'
import User from './models/user.model'
import Product from './models/product.model'
import Category, { ICategory } from './models/category.model'
import { toSlug } from '@/lib/utils'

type CategoryMap = Record<string, ICategory>

const main = async () => {
  try {
    await connectToDatabase(process.env.MONGODB_URI)

    /* ================= USERS ================= */
    await User.deleteMany()
    await User.insertMany(data.users)

    /* ================= CATEGORIES ================= */
    await Category.deleteMany()

    const map: CategoryMap = {}

    const create = async (name: string, parent?: ICategory | null) => {
      const slug = toSlug(name) // ✅ always consistent

      const cat = await Category.create({
        name,
        slug,
        parent: parent ? parent._id : null,
      })

      map[name] = cat
      return cat
    }

    // ===== BATTERY =====
    const battery = await create('Battery')

    const cylindrical = await create('Cylindrical', battery)
    await create('Li-ion', cylindrical)

    const prismatic = await create('Prismatic', battery)
    await create('LiFePO4', prismatic)

    // ===== BMS =====
    const bms = await create('BMS')
    const smartBms = await create('Smart BMS', bms)
    await create('Standard', smartBms)

    // ===== EMBEDDED =====
    const embedded = await create('Embedded')
    const forlinx = await create('Forlinx Products', embedded)
    await create('BC Board', forlinx)

    // ===== CHARGERS =====
    const chargers = await create('Chargers')
    const acdc = await create('AC-DC Charger', chargers)
    await create('48V', acdc)

    // ===== POWER =====
    const power = await create('Power Conversion Systems')
    const inverter = await create('Inverter', power)
    await create('220Vac', inverter)

    // ===== COMPONENTS =====
    const components = await create('Components')
    const connector = await create('Connector', components)
    await create('XT60', connector)

    /* ================= PRODUCTS ================= */
    await Product.deleteMany()

    const getId = (name?: string) => {
      if (!name) return null

      const cat = map[name]

      if (!cat) {
        console.warn(`⚠️ Category not found: ${name}`)
        return null
      }

      return cat._id
    }

    const products = data.products.map((p) => {
      const categoryId = getId(p.category)

      if (!categoryId) {
        throw new Error(`❌ Product "${p.name}" has invalid category`)
      }

      return {
        ...p,
        category: categoryId,
        subcategory: getId(p.subcategory),
        subSubcategory: getId(p.subSubcategory),
      }
    })

    await Product.insertMany(products)

    console.log('✅ Seed completed successfully')
    process.exit(0)
  } catch (err) {
    console.error('❌ Seed failed:', err)
    process.exit(1)
  }
}

main()
