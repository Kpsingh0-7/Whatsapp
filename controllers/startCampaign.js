
export const startCampaign = async(req,res)=>{
    const{ shop_id, template_id}=req.body;
    
  const Template = getTemplate(template_id);
  pool.query(
    'SELECT id FROM customers WHERE restaurant_id = ?',
    [shopId],
    async (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      const userIds = results.map((row) => row.id);

      // Call the processCampaignForUser function for each user
      const promises = userIds.map((userId) => processCampaignForUser(userId, template_id));
      
      await Promise.all(promises);
    }
);

}