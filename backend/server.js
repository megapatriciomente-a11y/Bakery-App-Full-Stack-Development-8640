const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const port = 3001;
const JWT_SECRET = 'delicias_da_ney_secret_key_2024';

app.use(cors());
app.use(express.json());

// Initialize SQLite database
const dbPath = path.join(__dirname, 'delicias.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to SQLite database');
    
    // Create customers table
    db.run(`CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      phone TEXT,
      address TEXT,
      city TEXT,
      zipcode TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    
    // Create admin users table
    db.run(`CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    
    // Create orders table
    db.run(`CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER NOT NULL,
      items TEXT NOT NULL,
      total_amount REAL NOT NULL,
      delivery_address TEXT NOT NULL,
      payment_method TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES customers (id)
    )`);

    // Create default admin user
    const adminPassword = bcrypt.hashSync('admin123', 10);
    db.run(`INSERT OR IGNORE INTO admin_users (username, password) VALUES (?, ?)`, 
      ['admin', adminPassword]);
  }
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token de acesso requerido' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

// Customer Registration
app.post('/api/customers/register', async (req, res) => {
  const { name, email, password, phone, address, city, zipcode } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Nome, email e senha são obrigatórios' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    db.run(`INSERT INTO customers (name, email, password, phone, address, city, zipcode) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, email, hashedPassword, phone || '', address || '', city || '', zipcode || ''],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ message: 'Email já cadastrado' });
          }
          return res.status(500).json({ message: 'Erro ao criar conta', error: err.message });
        }
        
        const token = jwt.sign(
          { id: this.lastID, email: email, type: 'customer' },
          JWT_SECRET,
          { expiresIn: '24h' }
        );
        
        res.status(201).json({
          message: 'Conta criada com sucesso',
          token,
          user: { id: this.lastID, name, email, phone, address, city, zipcode }
        });
      }
    );
  } catch (error) {
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Customer Login
app.post('/api/customers/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email e senha são obrigatórios' });
  }

  db.get(`SELECT * FROM customers WHERE email = ?`, [email], async (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }

    if (!user) {
      return res.status(401).json({ message: 'Email ou senha incorretos' });
    }

    try {
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: 'Email ou senha incorretos' });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, type: 'customer' },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        message: 'Login realizado com sucesso',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          city: user.city,
          zipcode: user.zipcode
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  });
});

// Admin Login
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Usuário e senha são obrigatórios' });
  }

  db.get(`SELECT * FROM admin_users WHERE username = ?`, [username], async (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }

    if (!user) {
      return res.status(401).json({ message: 'Usuário ou senha incorretos' });
    }

    try {
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: 'Usuário ou senha incorretos' });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username, type: 'admin' },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        message: 'Login realizado com sucesso',
        token,
        user: { id: user.id, username: user.username, role: user.role }
      });
    } catch (error) {
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  });
});

// Get customer profile
app.get('/api/customers/profile', authenticateToken, (req, res) => {
  if (req.user.type !== 'customer') {
    return res.status(403).json({ message: 'Acesso negado' });
  }

  db.get(`SELECT id, name, email, phone, address, city, zipcode FROM customers WHERE id = ?`, 
    [req.user.id], (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    res.json(user);
  });
});

// Update customer profile
app.put('/api/customers/profile', authenticateToken, (req, res) => {
  if (req.user.type !== 'customer') {
    return res.status(403).json({ message: 'Acesso negado' });
  }

  const { name, phone, address, city, zipcode } = req.body;

  db.run(`UPDATE customers SET name = ?, phone = ?, address = ?, city = ?, zipcode = ? WHERE id = ?`,
    [name, phone || '', address || '', city || '', zipcode || '', req.user.id],
    function(err) {
      if (err) {
        return res.status(500).json({ message: 'Erro ao atualizar perfil' });
      }
      res.json({ message: 'Perfil atualizado com sucesso' });
    }
  );
});

// Create order
app.post('/api/orders', authenticateToken, (req, res) => {
  if (req.user.type !== 'customer') {
    return res.status(403).json({ message: 'Acesso negado' });
  }

  const { items, totalAmount, deliveryAddress, paymentMethod } = req.body;

  if (!items || !totalAmount || !deliveryAddress || !paymentMethod) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
  }

  db.run(`INSERT INTO orders (customer_id, items, total_amount, delivery_address, payment_method) 
          VALUES (?, ?, ?, ?, ?)`,
    [req.user.id, JSON.stringify(items), totalAmount, deliveryAddress, paymentMethod],
    function(err) {
      if (err) {
        return res.status(500).json({ message: 'Erro ao criar pedido', error: err.message });
      }
      
      res.status(201).json({
        message: 'Pedido criado com sucesso',
        orderId: this.lastID
      });
    }
  );
});

// Get customer orders
app.get('/api/customers/orders', authenticateToken, (req, res) => {
  if (req.user.type !== 'customer') {
    return res.status(403).json({ message: 'Acesso negado' });
  }

  db.all(`SELECT * FROM orders WHERE customer_id = ? ORDER BY created_at DESC`,
    [req.user.id], (err, orders) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao buscar pedidos' });
    }
    
    const formattedOrders = orders.map(order => ({
      ...order,
      items: JSON.parse(order.items)
    }));
    
    res.json(formattedOrders);
  });
});

// Admin: Get all orders
app.get('/api/admin/orders', authenticateToken, (req, res) => {
  if (req.user.type !== 'admin') {
    return res.status(403).json({ message: 'Acesso negado' });
  }

  db.all(`SELECT o.*, c.name as customer_name, c.email as customer_email 
          FROM orders o 
          JOIN customers c ON o.customer_id = c.id 
          ORDER BY o.created_at DESC`, [], (err, orders) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao buscar pedidos' });
    }
    
    const formattedOrders = orders.map(order => ({
      ...order,
      items: JSON.parse(order.items)
    }));
    
    res.json(formattedOrders);
  });
});

// Admin: Update order status
app.put('/api/admin/orders/:id/status', authenticateToken, (req, res) => {
  if (req.user.type !== 'admin') {
    return res.status(403).json({ message: 'Acesso negado' });
  }

  const { status } = req.body;
  const orderId = req.params.id;

  db.run(`UPDATE orders SET status = ? WHERE id = ?`, [status, orderId], function(err) {
    if (err) {
      return res.status(500).json({ message: 'Erro ao atualizar status' });
    }
    res.json({ message: 'Status atualizado com sucesso' });
  });
});

// Admin: Get statistics
app.get('/api/admin/stats', authenticateToken, (req, res) => {
  if (req.user.type !== 'admin') {
    return res.status(403).json({ message: 'Acesso negado' });
  }

  db.all(`SELECT 
    COUNT(*) as totalOrders,
    SUM(total_amount) as totalRevenue,
    COUNT(DISTINCT customer_id) as totalCustomers,
    AVG(total_amount) as averageOrderValue
    FROM orders`, [], (err, stats) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao buscar estatísticas' });
    }
    
    const result = stats[0];
    res.json({
      totalOrders: result.totalOrders || 0,
      totalRevenue: result.totalRevenue ? parseFloat(result.totalRevenue).toFixed(2) : '0.00',
      totalCustomers: result.totalCustomers || 0,
      averageOrderValue: result.averageOrderValue ? parseFloat(result.averageOrderValue).toFixed(2) : '0.00'
    });
  });
});

// Admin: Get all customers
app.get('/api/admin/customers', authenticateToken, (req, res) => {
  if (req.user.type !== 'admin') {
    return res.status(403).json({ message: 'Acesso negado' });
  }

  db.all(`SELECT id, name, email, phone, city, created_at FROM customers ORDER BY created_at DESC`, 
    [], (err, customers) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao buscar clientes' });
    }
    res.json(customers);
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  db.close((err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Database connection closed.');
    }
    process.exit(0);
  });
});

app.listen(port, () => {
  console.log(`🚀 Delícias da Ney server running on http://localhost:${port}`);
  console.log(`📊 API endpoints available at http://localhost:${port}/api/`);
});