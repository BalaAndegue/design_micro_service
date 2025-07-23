-- Insert default categories
INSERT INTO categories (name, description, slug, icon_name, sort_order) VALUES
('Coques Téléphone', 'Coques personnalisées pour smartphones', 'coques-telephone', 'Smartphone', 1),
('Montres', 'Montres connectées et classiques personnalisables', 'montres', 'Watch', 2),
('Vêtements', 'T-shirts, hoodies et autres vêtements personnalisés', 'vetements', 'Shirt', 3),
('Accessoires', 'Mugs, coussins et autres accessoires personnalisables', 'accessoires', 'Coffee', 4)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample products
INSERT INTO products (name, description, base_price, category_id, image_url, active, customizable, stock_quantity, sku) VALUES
('Coque iPhone 15 Pro', 'Coque de protection premium pour iPhone 15 Pro avec options de personnalisation complètes', 24.99, 1, 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg', true, true, 100, 'IPHONE15PRO-CASE'),
('Coque Samsung Galaxy S24', 'Coque élégante pour Samsung Galaxy S24 avec personnalisation avancée', 22.99, 1, 'https://images.pexels.com/photos/4553618/pexels-photo-4553618.jpeg', true, true, 80, 'GALAXY-S24-CASE'),
('Montre Connectée Sport', 'Montre connectée avec bracelet personnalisable et cadran configurable', 199.99, 2, 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg', true, true, 50, 'SMARTWATCH-SPORT'),
('T-Shirt Premium Coton', 'T-shirt 100% coton bio avec impression haute qualité personnalisable', 29.99, 3, 'https://images.pexels.com/photos/1020585/pexels-photo-1020585.jpeg', true, true, 200, 'TSHIRT-PREMIUM'),
('Mug Céramique Premium', 'Mug en céramique de haute qualité avec impression durable', 16.99, 4, 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg', true, true, 150, 'MUG-CERAMIC'),
('Casquette Personnalisée', 'Casquette ajustable avec broderie personnalisée', 24.99, 3, 'https://images.pexels.com/photos/135620/pexels-photo-135620.jpeg', true, true, 120, 'CAP-CUSTOM')
ON CONFLICT (sku) DO NOTHING;

-- Insert customization options for iPhone case
INSERT INTO customization_options (product_id, name, type, value, display_value, hex_color, additional_price, sort_order) VALUES
-- Colors for iPhone case
(1, 'Noir', 'COLOR', 'black', 'Noir', '#000000', 0.00, 1),
(1, 'Blanc', 'COLOR', 'white', 'Blanc', '#FFFFFF', 0.00, 2),
(1, 'Bleu', 'COLOR', 'blue', 'Bleu', '#3B82F6', 0.00, 3),
(1, 'Rouge', 'COLOR', 'red', 'Rouge', '#EF4444', 0.00, 4),
(1, 'Vert', 'COLOR', 'green', 'Vert', '#10B981', 0.00, 5),
(1, 'Violet', 'COLOR', 'purple', 'Violet', '#8B5CF6', 0.00, 6),
(1, 'Or Rose', 'COLOR', 'rose-gold', 'Or Rose', '#F59E0B', 5.00, 7),
(1, 'Chromé', 'COLOR', 'chrome', 'Chromé', '#C0C0C0', 8.00, 8),

-- Patterns for iPhone case
(1, 'Aucun', 'PATTERN', 'none', 'Aucun motif', null, 0.00, 1),
(1, 'Rayures', 'PATTERN', 'stripes', 'Rayures', null, 3.00, 2),
(1, 'Points', 'PATTERN', 'dots', 'Points', null, 3.00, 3),
(1, 'Géométrique', 'PATTERN', 'geometric', 'Motif géométrique', null, 5.00, 4),
(1, 'Floral', 'PATTERN', 'floral', 'Motif floral', null, 5.00, 5),
(1, 'Abstrait', 'PATTERN', 'abstract', 'Motif abstrait', null, 7.00, 6),

-- Text customization
(1, 'Texte personnalisé', 'TEXT', 'custom-text', 'Votre texte', null, 3.00, 1);

-- Insert customization options for T-shirt
INSERT INTO customization_options (product_id, name, type, value, display_value, hex_color, additional_price, sort_order) VALUES
-- Colors for T-shirt
(4, 'Blanc', 'COLOR', 'white', 'Blanc', '#FFFFFF', 0.00, 1),
(4, 'Noir', 'COLOR', 'black', 'Noir', '#000000', 0.00, 2),
(4, 'Gris', 'COLOR', 'gray', 'Gris', '#6B7280', 0.00, 3),
(4, 'Bleu', 'COLOR', 'blue', 'Bleu', '#3B82F6', 0.00, 4),
(4, 'Rouge', 'COLOR', 'red', 'Rouge', '#EF4444', 0.00, 5),

-- Sizes for T-shirt
(4, 'XS', 'SIZE', 'xs', 'Extra Small', null, 0.00, 1),
(4, 'S', 'SIZE', 's', 'Small', null, 0.00, 2),
(4, 'M', 'SIZE', 'm', 'Medium', null, 0.00, 3),
(4, 'L', 'SIZE', 'l', 'Large', null, 0.00, 4),
(4, 'XL', 'SIZE', 'xl', 'Extra Large', null, 2.00, 5),
(4, 'XXL', 'SIZE', 'xxl', 'Double Extra Large', null, 4.00, 6),

-- Text customization for T-shirt
(4, 'Texte personnalisé', 'TEXT', 'custom-text', 'Votre texte', null, 5.00, 1);

-- Insert customization options for Mug
INSERT INTO customization_options (product_id, name, type, value, display_value, hex_color, additional_price, sort_order) VALUES
-- Colors for Mug
(5, 'Blanc', 'COLOR', 'white', 'Blanc', '#FFFFFF', 0.00, 1),
(5, 'Noir', 'COLOR', 'black', 'Noir', '#000000', 2.00, 2),
(5, 'Bleu', 'COLOR', 'blue', 'Bleu', '#3B82F6', 2.00, 3),
(5, 'Rouge', 'COLOR', 'red', 'Rouge', '#EF4444', 2.00, 4),

-- Text customization for Mug
(5, 'Texte personnalisé', 'TEXT', 'custom-text', 'Votre texte', null, 3.00, 1);

-- Insert default admin user
INSERT INTO users (name, email, password, enabled, verified) VALUES
('Admin', 'admin@customcraft.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', true, true)
ON CONFLICT (email) DO NOTHING;

-- Insert admin role
INSERT INTO user_roles (user_id, role) VALUES
((SELECT id FROM users WHERE email = 'admin@customcraft.com'), 'ADMIN')
ON CONFLICT DO NOTHING;