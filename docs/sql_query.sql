-- Crear tabla productos
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  short_description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  images TEXT[],
  category VARCHAR(100),
  subcategory VARCHAR(100),
  sizes TEXT[],
  colors TEXT[],
  stock INTEGER DEFAULT 0,
  gender VARCHAR(50),
  status VARCHAR(20) DEFAULT 'active',
  sku VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);


-- Permite a los usuarios sin autenticar ver los productos
CREATE POLICY "Allow public read access" ON products
  FOR SELECT USING (true);

-- Permite a los usuarios autenticados actualizar productos
CREATE POLICY "Allow authenticated users to update" ON products
  FOR UPDATE USING (auth.role() = 'authenticated');


-- Crea la tabla usuarios
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'user',
  is_owner BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,
  phone VARCHAR(50),
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT TRUE
);

--Manejo de eventos login
CREATE OR REPLACE FUNCTION public.update_last_login()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.users 
  SET last_login = NOW() 
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para login
CREATE OR REPLACE TRIGGER on_user_login
  AFTER UPDATE OF last_sign_in_at ON auth.users
  FOR EACH ROW
  WHEN (OLD.last_sign_in_at IS DISTINCT FROM NEW.last_sign_in_at)
  EXECUTE FUNCTION public.update_last_login();


-- Inserta los productos en la Base de Datos
-- Para agregar nuevos productos sigue la misma estructura
-- Antes se deben de agregar en public/assets/...
INSERT INTO products (title, description, short_description, price, images, category, subcategory, sizes, colors, stock, gender, status) VALUES
(
  'Bordado Floral Tradicional',
  'Hermoso bordado floral con colores vibrantes, ideal para botas. Diseño tradicional hecho a mano con técnicas ancestrales.',
  'Bordado floral con colores vibrantes',
  25.99,
  ARRAY['/assets/imagenes/producto1/product1-1.avif', '/assets/imagenes/producto1/product1-2.jpg', '/assets/imagenes/producto1/product1-3.jpg'],
  'women',
  'Floral',
  ARRAY['Micro', 'Mediana', 'Grande'],
  ARRAY['Rojo', 'Azul', 'Verde'],
  15,
  'Mujer',
  'active'
),
(
  'Bordado Geométrico Maya',
  'Inspirado en la cultura maya, este bordado geométrico representa la conexión con nuestras raíces.',
  'Diseño geométrico inspirado en la cultura maya',
  32.50,
  ARRAY['/assets/imagenes/producto2/product-2.avif', '/assets/imagenes/producto2/product2-1.jpg', '/assets/imagenes/producto2/product2-3.jpg'],
  'men',
  'Geométrico',
  ARRAY['S', 'M', 'L', 'XL', 'XXL'],
  ARRAY['Negro', 'Blanco', 'Gris'],
  8,
  'Hombre',
  'active'
),
(
  'Bordado de Flores',
  'Detallado bordado de Flores de colores.',
  'Flores con detalles en colores brillantes',
  45.00,
  ARRAY['/assets/imagenes/producto3/product3.avif', '/assets/imagenes/producto3/product3-2.jpg', '/assets/imagenes/producto3/product3-3.jpg'],
  'women',
  'Animales',
  ARRAY['M', 'L', 'XL'],
  ARRAY['Multicolor', 'Azul', 'Verde'],
  5,
  'Mujer',
  'active'
),
(
  'Bordado Hollywood',
  'Diseños especiales.',
  'Diseños especiales a como el cliente lo solicita',
  22.50,
  ARRAY['/assets/imagenes/producto7/product7.avif', '/assets/product6-2.jpg', '/assets/product6-3.jpg'],
  'kids',
  'Temporada',
  ARRAY['Único'],
  ARRAY['Rojo', 'Verde', 'Dorado'],
  20,
  'Niños',
  'active'
),
(
  'Bordado de Flores de Sacuanjoche',
  'Nuestra flor nacional bordada con hilos de seda.',
  'Flor nacional de Nicaragua bordada con detalles',
  38.99,
  ARRAY['/assets/imagenes/producto5/product5.avif', '/assets/product5-2.jpg', '/assets/product5-3.jpg'],
  'women',
  'Floral',
  ARRAY['S', 'M', 'L', 'XL'],
  ARRAY['Amarillo', 'Blanco', 'Naranja'],
  10,
  'Mujer',
  'active'
),
(
  'Bordado Botas',
  'Elegante diseño de bordados para botas, simbolizando libertad y transformación.',
  'Bordados en botas con detalles brillantes',
  28.99,
  ARRAY['/assets/imagenes/producto6/producto6.avif', '/assets/imagenes/producto6/product6.avif', '/assets/imagenes/producto4/product4.avif'],
  'women',
  'Botas',
  ARRAY['38', '40', '41'],
  ARRAY['Cafe', 'Negra', 'Ariat'],
  12,
  'Mujer',
  'active'
),
(
  'Bordado Personalizado Iniciales',
  'Bordado personalizado con iniciales o nombre, perfecto para regalos únicos.',
  'Diseño personalizado con iniciales',
  120.00,
  ARRAY['/assets/imagenes/producto9/product9.avif', '/assets/product8-2.jpg', '/assets/product8-3.jpg'],
  'kids',
  'Personalizado',
  ARRAY['S', 'M', 'L'],
  ARRAY['Oro', 'Plata', 'Negro'],
  25,
  'Niños',
  'active'
),
(
  'Bordado Premium Colección',
  'Bordado de lujo con hilos de seda y detalles en oro.',
  'Colección premium de alta calidad',
  250.00,
  ARRAY['/assets/imagenes/producto8/product8.avif', '/assets/product9-2.jpg', '/assets/product9-3.jpg'],
  'women',
  'Premium',
  ARRAY['S', 'M', 'L'],
  ARRAY['Dorado', 'Plateado', 'Blanco'],
  3,
  'Mujer',
  'active'
);



