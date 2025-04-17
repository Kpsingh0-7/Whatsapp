import { pool } from '../config/db.js';

export const  returnContacts = async (req, res) => {
  try {
    const [rows] = await pool.execute(`
        SELECT 
          fg.created_at,
          fg.name,
          fg.last_name,
          fg.mobile_no,
          c.is_active
        FROM 
          food_guest fg
        LEFT JOIN 
          conversations c ON fg.guest_id = c.guest_id
      `);
      

    res.json(rows);
  } catch (error) {
    console.error('Error fetching guests:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


