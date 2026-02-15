-- Quick Test: Check if products exist
SELECT COUNT(*) as product_count FROM products;
SELECT COUNT(*) as category_count FROM categories;

-- If products table is empty, uncomment and run the INSERT below:

/*
-- Insert all 18 products
INSERT INTO public.products (name, category, price, stock, image_url, description, isPopular, isNew) VALUES
  ('মরিয়ম খেজুর (১ কেজি)', 'dates', 1200.00, 10, '/images/marium-khejur_compressed.webp', 'উন্নত মানের সৌদি মরিয়ম খেজুর। রমজানে ইফতারের জন্য সেরা পছন্দ।', true, false),
  ('আজওয়া খেজুর প্রিমিয়াম', 'dates', 1500.00, 10, '/images/black-khejur_compressed.webp', 'মদিনার বিখ্যাত আজওয়া খেজুর। সুস্বাদু এবং পুষ্টিকর।', true, false),
  ('রুহ আফজা (৭৫০ মিলি)', 'drinks', 450.00, 10, '/images/roapja_compressed.webp', 'ইফতারের ক্লান্তি দূর করতে রুহ আফজা।', true, false),
  ('স্পেশাল হালিম মিক্স', 'iftar', 120.00, 10, '/images/halim_compressed.webp', 'দ্রুত এবং সুস্বাদু হালিম তৈরির জন্য সেরা মিক্স।', false, true),
  ('জায়নামাজ (তুর্কি)', 'islamic', 850.00, 10, '/images/jaynamaz_compressed.webp', 'নরম এবং আরামদায়ক তুর্কি জায়নামাজ।', false, true),
  ('তসবিহ (ক্রিস্টাল)', 'islamic', 250.00, 10, '/images/tosbi_compressed.webp', 'সুন্দর ডিজাইনের ক্রিস্টাল তসবিহ।', false, false),
  ('চিনিগুড়া চাল (৫ কেজি)', 'sehri', 650.00, 10, '/images/cinigura-chal_compressed.webp', 'সুগন্ধি চিনিগুড়া চাল, বিরিয়ানি বা পোলাওয়ের জন্য।', true, false),
  ('খাটি সরিষার তেল (১ লিটার)', 'sehri', 320.00, 10, '/images/khati-sorisha_compressed.webp', 'ঘানি ভাঙা খাটি সরিষার তেল।', false, true),
  ('মেহেরাব খেজুর (প্যাকেট)', 'dates', 800.00, 10, '/images/khejur_compressed.webp', 'মধ্যপ্রাচ্য থেকে আমদানিকৃত মেহেরাব খেজুর।', true, false),
  ('বরই (১ কেজি)', 'dates', 280.00, 10, '/images/boroi_compressed.webp', 'তাজা বরই, ভিটামিন সি সমৃদ্ধ।', false, false),
  ('পেয়ারা জুস (১ লিটার)', 'drinks', 180.00, 10, '/images/peyara-jush_compressed.webp', 'প্রাকৃতিক পেয়ারা জুস।', false, true),
  ('ডিম (১২ পিস)', 'sehri', 160.00, 10, '/images/dim_compressed.webp', 'তাজা দেশি মুরগির ডিম।', true, false),
  ('পেঁয়াজু মিক্স', 'iftar', 95.00, 10, '/images/peyaji-mix_compressed.webp', 'সহজে পেঁয়াজু বানানোর জন্য রেডিমেড মিক্স।', false, true),
  ('জিলাপি (১ কেজি)', 'iftar', 420.00, 10, '/images/jilapi_compressed.webp', 'মিষ্টি এবং সুস্বাদু জিলাপি।', true, false),
  ('কুরআন শরীফ (বাংলা অনুবাদ)', 'islamic', 550.00, 10, '/images/Quran-Sharif_compressed.webp', 'বাংলা অনুবাদসহ কুরআন শরীফ।', true, false),
  ('আতর (৬ মিলি)', 'islamic', 380.00, 10, '/images/ator_compressed.webp', 'আরবি আতর।', false, true),
  ('দুধ (১ লিটার)', 'drinks', 85.00, 10, '/images/milk_compressed.webp', 'তাজা পাস্তুরিত দুধ।', true, false),
  ('ছোলা বুট (১ কেজি)', 'iftar', 110.00, 10, '/images/sola-but_compressed.webp', 'ইফতারের জন্য ছোলা বুট।', true, false)
ON CONFLICT DO NOTHING;
*/

-- Verify inserted products
SELECT name, category, price, stock FROM products ORDER BY created_at DESC LIMIT 5;
