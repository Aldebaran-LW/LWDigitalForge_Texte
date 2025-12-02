
import { createClient } from '@supabase/supabase-js'
import { mercadopago } from './mercadopago.ts'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)

Deno.serve(async (req) => {
  const { products } = await req.json()

  const items = await Promise.all(
    products.map(async (product) => {
      const { data } = await supabase
        .from('products')
        .select('name,price')
        .eq('id', product.id)
        .single()

      return {
        title: data.name,
        unit_price: data.price,
        quantity: product.quantity,
      }
    }),
  )

  const preference = {
    items,
    back_urls: {
      success: `${process.env.SUPABASE_URL}/success`,
      failure: `${process.env.SUPABASE_URL}/failure`,
      pending: `${process.env.SUPABASE_URL}/pending`,
    },
    auto_return: 'approved',
  }

  const { body } = await mercadopago.preferences.create(preference)

  return new Response(JSON.stringify({ id: body.id }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
