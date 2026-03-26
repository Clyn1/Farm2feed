// src/services/mockData.js
// All mock data used across the application

export const MOCK_PRODUCTS = [
  {
    id: 1,
    name: 'Fresh Tomatoes',
    price: 120,
    unit: 'kg',
    quantity: 50,
    category: 'Vegetables',
    emoji: '🍅',
    farmer: 'John Kamau',
    phone: '+254 712 345 678',
    location: 'Nyeri',
    description:
      'Sun-ripened tomatoes grown organically on the fertile slopes of Mt. Kenya. Rich in lycopene and bursting with natural flavor. Ideal for cooking, salads, and sauces.',
    rating: 4.8,
    reviews: 24,
  },
  {
    id: 2,
    name: 'Sweet Mangoes',
    price: 80,
    unit: 'kg',
    quantity: 200,
    category: 'Fruits',
    emoji: '🥭',
    farmer: 'Mary Wanjiku',
    phone: '+254 723 456 789',
    location: 'Mombasa',
    description:
      'Premium Alphonso mangoes hand-picked at perfect ripeness. Exceptionally sweet and aromatic, sourced from coastal farms with rich volcanic soil.',
    rating: 4.9,
    reviews: 41,
  },
  {
    id: 3,
    name: 'White Maize',
    price: 45,
    unit: 'kg',
    quantity: 500,
    category: 'Grains',
    emoji: '🌽',
    farmer: 'Peter Omondi',
    phone: '+254 734 567 890',
    location: 'Eldoret',
    description:
      'Drought-resistant white maize, sun-dried and carefully cleaned. Perfect for ugali, flour milling, and animal feed. Rift Valley grown.',
    rating: 4.6,
    reviews: 18,
  },
  {
    id: 4,
    name: 'Sukuma Wiki',
    price: 30,
    unit: 'bundle',
    quantity: 100,
    category: 'Vegetables',
    emoji: '🥬',
    farmer: 'Grace Achieng',
    phone: '+254 745 678 901',
    location: 'Kisumu',
    description:
      'Fresh kale bundles harvested daily at dawn. High in iron, calcium, and vitamins A, C, and K. A staple of the Kenyan diet.',
    rating: 4.7,
    reviews: 33,
  },
  {
    id: 5,
    name: 'Free-Range Eggs',
    price: 500,
    unit: 'tray',
    quantity: 30,
    category: 'Poultry',
    emoji: '🥚',
    farmer: 'Samuel Mutua',
    phone: '+254 756 789 012',
    location: 'Machakos',
    description:
      'Farm-fresh eggs from free-range, corn-fed hens roaming open pastures. Zero antibiotics, zero hormones. Rich golden yolks.',
    rating: 4.9,
    reviews: 52,
  },
  {
    id: 6,
    name: 'Hass Avocados',
    price: 150,
    unit: 'kg',
    quantity: 80,
    category: 'Fruits',
    emoji: '🥑',
    farmer: 'Jane Njoki',
    phone: '+254 767 890 123',
    location: 'Muranga',
    description:
      'Creamy Hass avocados at perfect ripeness. Grown without chemical pesticides on highland farms. Packed with healthy fats and nutrients.',
    rating: 4.8,
    reviews: 29,
  },
  {
    id: 7,
    name: 'Irish Potatoes',
    price: 55,
    unit: 'kg',
    quantity: 300,
    category: 'Vegetables',
    emoji: '🥔',
    farmer: 'David Kiptoo',
    phone: '+254 778 901 234',
    location: 'Bomet',
    description:
      'Large, clean Irish potatoes from the fertile highlands of Rift Valley. Perfect for chips, stew, and roasting.',
    rating: 4.5,
    reviews: 16,
  },
  {
    id: 8,
    name: 'Raw Wildflower Honey',
    price: 800,
    unit: '500ml',
    quantity: 25,
    category: 'Others',
    emoji: '🍯',
    farmer: 'Alice Kemunto',
    phone: '+254 789 012 345',
    location: 'Kajiado',
    description:
      'Pure unprocessed wildflower honey from indigenous log beehives. Harvested once a year. Rich in antioxidants and natural enzymes.',
    rating: 5.0,
    reviews: 67,
  },
]

export const MOCK_ORDERS = [
  { id: '#F2F-001', product: 'Fresh Tomatoes', buyer: 'Alice N.', amount: 600, status: 'Paid', date: 'Mar 15, 2025' },
  { id: '#F2F-002', product: 'Sweet Mangoes', buyer: 'Brian K.', amount: 400, status: 'Paid', date: 'Mar 14, 2025' },
  { id: '#F2F-003', product: 'Sukuma Wiki', buyer: 'Carol M.', amount: 150, status: 'Pending', date: 'Mar 14, 2025' },
  { id: '#F2F-004', product: 'Hass Avocados', buyer: 'David O.', amount: 750, status: 'Paid', date: 'Mar 12, 2025' },
]

export const MOCK_CONSUMER_ORDERS = [
  { id: '#F2F-010', product: 'Sweet Mangoes', farmer: 'Mary W.', amount: 400, status: 'Paid', date: 'Mar 15, 2025' },
  { id: '#F2F-011', product: 'Irish Potatoes', farmer: 'David K.', amount: 275, status: 'Paid', date: 'Mar 13, 2025' },
  { id: '#F2F-012', product: 'Raw Honey', farmer: 'Alice K.', amount: 800, status: 'Pending', date: 'Mar 11, 2025' },
]

export const AI_DISEASES = [
  {
    disease: 'Early Blight (Alternaria solani)',
    confidence: 91,
    severity: 'Moderate',
    treatment:
      'Remove and destroy all infected leaves immediately. Apply a copper-based fungicide (e.g., Copper Oxychloride) every 7–10 days. Ensure good air circulation by spacing plants properly. Avoid overhead irrigation — water at the base only. Rotate crops next season to break the disease cycle.',
  },
  {
    disease: 'Leaf Rust (Puccinia triticina)',
    confidence: 87,
    severity: 'High',
    treatment:
      'Apply a systemic fungicide containing tebuconazole or propiconazole as soon as symptoms appear. Remove severely infected plants to prevent spread. Maintain field drainage and avoid over-irrigation. Use certified rust-resistant varieties in next planting season.',
  },
  {
    disease: 'Powdery Mildew (Erysiphe cichoracearum)',
    confidence: 78,
    severity: 'Low',
    treatment:
      'Spray affected plants with a potassium bicarbonate or sulfur-based solution. Increase plant spacing to improve airflow. Avoid excess nitrogen fertilizer which promotes soft, susceptible growth. Neem oil spray is an effective organic alternative — apply in the morning.',
  },
  {
    disease: 'No Disease Detected ✓',
    confidence: 97,
    severity: 'None',
    treatment:
      'Your crop appears healthy! Continue with your current management practices. Maintain proper watering schedules, balanced fertilization, and routine field monitoring. Scout for pests weekly and keep records of crop growth for future reference.',
  },
  {
    disease: 'Bacterial Wilt (Ralstonia solanacearum)',
    confidence: 83,
    severity: 'High',
    treatment:
      'Remove and destroy all infected plants immediately — do not compost them. Avoid working in the field when wet, as this spreads bacteria. Solarize the soil between seasons. Use certified disease-free seeds and resistant varieties. Implement a 3-year crop rotation plan.',
  },
  {
    disease: 'Cassava Mosaic Virus',
    confidence: 85,
    severity: 'Moderate',
    treatment:
      'Remove infected plants and replace with certified virus-free cuttings. Control whitefly populations using yellow sticky traps and neem-based sprays, as they are the primary vector. Avoid planting near infected fields. Use mosaic-resistant cassava varieties.',
  },
]