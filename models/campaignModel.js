import { pool } from "../config/db.js";


export const createTables = async () => {
    try {
      const connection = await pool.getConnection();
      
      const restaurantTable = `
        CREATE TABLE IF NOT EXISTS restaurants (
          id INT AUTO_INCREMENT PRIMARY KEY,
          shop_id INT NOT NULL UNIQUE,
          name VARCHAR(255) NOT NULL
        );
      `;
  
      const customerTable = `
        CREATE TABLE IF NOT EXISTS customers (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          mobile_number VARCHAR(15) NOT NULL
        );
      `;
  
      const templateTable = `
        CREATE TABLE IF NOT EXISTS templates (
          id INT  PRIMARY KEY,
          template_name VARCHAR(255) NOT NULL,
          status VARCHAR(255) DEFAULT 'Pending',
          description TEXT NOT NULL
        );
      `;
  
      const userVisitTable = `
        CREATE TABLE IF NOT EXISTS user_visits (
          id INT AUTO_INCREMENT PRIMARY KEY,
          customer_id INT NOT NULL,
          shop_id INT NOT NULL,
          visited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (customer_id) REFERENCES customers(id),
          FOREIGN KEY (shop_id) REFERENCES restaurants(shop_id)
        );
      `;
  
      const restaurantTemplateTable = `
        CREATE TABLE IF NOT EXISTS restaurant_templates (
          id INT AUTO_INCREMENT PRIMARY KEY,
          shop_id INT NOT NULL,
          template_id INT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (shop_id) REFERENCES restaurants(shop_id),
          FOREIGN KEY (template_id) REFERENCES templates(id)
        );
      `;
      
      // Create all tables
      await connection.query(restaurantTable);
      await connection.query(customerTable);
      await connection.query(templateTable);
      await connection.query(userVisitTable);
      await connection.query(restaurantTemplateTable);
      
      console.log('Tables created successfully.');
      connection.release();
    } catch (error) {
      console.error('Error creating tables:', error);
    }
  };