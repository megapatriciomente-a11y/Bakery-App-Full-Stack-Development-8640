-- Delícias da Ney Database Schema
-- SQLite Database for managing users and orders

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  item TEXT NOT NULL,
  price REAL NOT NULL,
  user_id INTEGER,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id)
);

-- Insert sample data for testing
INSERT OR IGNORE INTO users (username) VALUES 
  ('Admin'),
  ('Cliente Teste'),
  ('Maria Silva');

INSERT OR IGNORE INTO orders (item, price, user_id) VALUES 
  ('Bolo Coração - R$150,00', 150.00, 1),
  ('Bolo Retangular 27x18cm - R$170,00', 170.00, 2),
  ('Bolo Quadrado 20x20cm - R$200,00', 200.00, 1);