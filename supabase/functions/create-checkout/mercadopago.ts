
import mercadopago from 'mercadopago';

const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

if (!accessToken) {
  throw new Error("MERCADOPAGO_ACCESS_TOKEN is not defined in environment variables.");
}

mercadopago.configure({ access_token: accessToken });

export { mercadopago };
