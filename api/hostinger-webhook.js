
import { createClient } from '@supabase/supabase-js';

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Method Not Allowed' });
  }

  const receivedSecret = request.headers['x-webhook-secret'];
  const expectedSecret = process.env.HOSTINGER_WEBHOOK_SECRET;

  if (receivedSecret !== expectedSecret) {
    return response.status(401).json({ message: 'Unauthorized' });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const { userId, items } = request.body;

    if (!userId || !items || !Array.isArray(items)) {
      return response.status(400).json({ message: 'Missing userId or items' });
    }

    for (const item of items) {
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('id')
        .eq('hostinger_product_id', item.id)
        .single();

      if (productError || !product) {
        console.error(`Product not found for hostinger_product_id: ${item.id}`);
        continue;
      }

      const { error: insertError } = await supabase
        .from('user_purchases')
        .insert({ user_id: userId, product_id: product.id });

      if (insertError) {
        if (insertError.code === '23505') {
          console.log(`Duplicate purchase attempt for user ${userId} and product ${product.id}`);
        } else {
          throw insertError;
        }
      }
    }

    return response.status(200).json({ message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return response.status(500).json({ message: 'Internal Server Error' });
  }
}
