const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware to parse JSON request bodies and serve the test UI
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory product database
let products = [
  { id: 1, name: 'Wireless Mouse', price: 799, description: 'Ergonomic 2.4GHz wireless mouse' },
  { id: 2, name: 'Mechanical Keyboard', price: 2499, description: 'RGB backlit tactile keyboard' }
];
let nextId = 3;

// ==========================================
// RESTful CRUD ROUTES FOR /api/products
// ==========================================

// 1. READ ALL — GET /api/products
app.get('/api/products', (req, res) => {
  res.status(200).json(products);
});

// 2. READ ONE — GET /api/products/:id
app.get('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find(p => p.id === id);

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.status(200).json(product);
});

// 3. CREATE — POST /api/products
app.post('/api/products', (req, res) => {
  const { name, price, description } = req.body;

  if (!name || price === undefined || !description) {
    return res.status(400).json({ error: 'name, price, and description are required' });
  }

  const newProduct = {
    id: nextId++,
    name: name.trim(),
    price: parseFloat(price),
    description: description.trim()
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

// 4. UPDATE — PUT /api/products/:id
app.put('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find(p => p.id === id);

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const { name, price, description } = req.body;
  if (name !== undefined) product.name = name.trim();
  if (price !== undefined) product.price = parseFloat(price);
  if (description !== undefined) product.description = description.trim();

  res.status(200).json(product);
});

// 5. DELETE — DELETE /api/products/:id
app.delete('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = products.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const deletedProduct = products.splice(index, 1)[0];
  res.status(200).json({ message: 'Product deleted', product: deletedProduct });
});

app.listen(PORT, () => {
  console.log(`Product CRUD server running at http://localhost:${PORT}`);
});