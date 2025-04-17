import axios from 'axios';
import dotenv from 'dotenv';
import moment from 'moment';
import { pool } from '../config/db.js';

dotenv.config();



// export const sendMessage = async (req, res) => {
//   const { phoneNumber, message } = req.body;

//   try {
//     if (!phoneNumber || !message) {
//       return res.status(400).json({ success: false, error: 'phoneNumber and message are required' });
//     }

//     // Fetch the latest message timestamp for the given phoneNumber
//     const [rows] = await pool.execute(
//       `SELECT timestamp FROM whatsapp_business_chats 
//        WHERE customer_number = ? 
//        ORDER BY timestamp DESC 
//        LIMIT 1`, 
//       [phoneNumber]
//     );

//     const lastMessageTimestamp = rows.length > 0 ? rows[0].timestamp : null;

//     console.log(`Last message timestamp for ${phoneNumber}:`, lastMessageTimestamp);

//     // Check if the last message was sent within 24 hours
//     const isWithin24Hours =
//       lastMessageTimestamp && moment().diff(moment.utc(lastMessageTimestamp), 'hours') < 24;

//     if (!isWithin24Hours) {
//       return res.status(403).json({
//         success: false,
//         error: 'Cannot send message outside the 24-hour session window'
//       });
//     }

//     // Prepare Free-form Message
//     const requestData = {
//       messaging_product: 'whatsapp',
//       recipient_type: 'individual',
//       to: phoneNumber,
//       type: 'text',
//       text: { body: message }
//     };

//     // Send the request to Gupshup API
//     const response = await axios.post(
//       `https://partner.gupshup.io/partner/app/${process.env.appID}/v3/message`,
//       requestData,
//       {
//         headers: {
//           'accept': 'application/json',
//           'Authorization': process.env.app_token,
//           'Content-Type': 'application/json'
//         }
//       }
//     );

//     return res.status(200).json({
//       success: true,
//       messageId: response.data.messages?.[0]?.id,
//       response: response.data
//     });

//   } catch (error) {
//     console.error('Error sending WhatsApp message:', error.response?.data || error.message);
//     return res.status(error.response?.status || 500).json({
//       success: false,
//       error: error.response?.data?.message || error.message,
//       details: error.response?.data
//     });
//   }
// };




// export const sendTemplate = async (req, res) => {
//   const { phoneNumber, message, templateName, languageCode = 'en', parameters = [] } = req.body;

//   try {
//     if (!phoneNumber) {
//       return res.status(400).json({ success: false, error: 'phoneNumber is required' });
//     }

//     // Fetch the latest message timestamp for the given phoneNumber
//     const [rows] = await pool.execute(
//       `SELECT timestamp FROM whatsapp_business_chats 
//        WHERE customer_number = ? 
//        ORDER BY timestamp DESC 
//        LIMIT 1`, 
//       [phoneNumber]
//     );

//     const lastMessageTimestamp = rows.length > 0 ? rows[0].timestamp : null;
//     console.log(`Last message timestamp for ${phoneNumber}:`, lastMessageTimestamp);

//     // Check if the last message was sent within 24 hours
//     const isWithin24Hours =
//       lastMessageTimestamp && moment().diff(moment.utc(lastMessageTimestamp), 'hours') < 24;

//     let responses = [];

//     // Send Free-form Message (if within 24-hour session window and message is provided)
//     if (isWithin24Hours && message) {
//       const freeFormData = {
//         messaging_product: 'whatsapp',
//         recipient_type: 'individual',
//         to: phoneNumber,
//         type: 'text',
//         text: { body: message }
//       };

//       const freeFormResponse = await axios.post(
//         `https://partner.gupshup.io/partner/app/${process.env.appID}/v3/message`,
//         freeFormData,
//         {
//           headers: {
//             'accept': 'application/json',
//             'Authorization': process.env.app_token,
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       const freeFormMessageId = freeFormResponse.data.messages?.[0]?.id || null;
//       responses.push({ type: 'text', messageId: freeFormMessageId, response: freeFormResponse.data });

//       // Store Free-form Message in the Database
//       await pool.execute(
//         `INSERT INTO whatsapp_business_chats 
//          (business_number, customer_number, sender, message, message_type, template_name, status, message_id, webhook_event) 
//          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//         [
//           process.env.source_number || null,
//           phoneNumber,
//           'bot',
//           message,
//           'text',
//           null,
//           'sent',
//           freeFormMessageId,
//           JSON.stringify(freeFormResponse.data || {})
//         ]
//       );
//     }

//     // Send Template Message (if provided, regardless of 24-hour rule)
//     if (templateName) {
//       const templateData = {
//         messaging_product: 'whatsapp',
//         recipient_type: 'individual',
//         to: phoneNumber,
//         type: 'template',
//         template: {
//           name: templateName,
//           language: { code: languageCode },
//           components: []
//         }
//       };

//       if (parameters.length > 0) {
//         templateData.template.components.push({
//           type: 'body',
//           parameters: parameters.map(param => ({
//             type: 'text',
//             text: param
//           }))
//         });
//       }

//       const templateResponse = await axios.post(
//         `https://partner.gupshup.io/partner/app/${process.env.appID}/v3/message`,
//         templateData,
//         {
//           headers: {
//             'accept': 'application/json',
//             'Authorization': process.env.app_token,
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       const templateMessageId = templateResponse.data.messages?.[0]?.id || null;
//       responses.push({ type: 'template', messageId: templateMessageId, response: templateResponse.data });

//       // Store Template Message in the Database
//       await pool.execute(
//         `INSERT INTO whatsapp_business_chats 
//          (business_number, customer_number, sender, message, message_type, template_name, status, message_id, webhook_event) 
//          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//         [
//           process.env.source_number || null,
//           phoneNumber,
//           'bot',
//           `Template: ${templateName}`,
//           'template',
//           templateName,
//           'sent',
//           templateMessageId,
//           JSON.stringify(templateResponse.data || {})
//         ]
//       );
//     }

//     return res.status(200).json({
//       success: true,
//       responses
//     });

//   } catch (error) {
//     console.error('Error sending WhatsApp message:', error.response?.data || error.message);
//     return res.status(error.response?.status || 500).json({
//       success: false,
//       error: error.response?.data?.message || error.message,
//       details: error.response?.data
//     });
//   }
// };

export const sendTemplate = async (req, res) => {
  const {
    phoneNumber,
    message,
    templateName,
    languageCode = 'en',
    parameters = [],
    shop_id,
    guest_id
  } = req.body;

  try {
    if (!phoneNumber || !shop_id || !guest_id) {
      return res.status(400).json({ success: false, error: 'phoneNumber, shop_id, and guest_id are required' });
    }

    // Ensure conversation exists (or create one)
    const [existing] = await pool.execute(
      `SELECT conversation_id FROM conversations WHERE shop_id = ? AND guest_id = ?`,
      [shop_id, guest_id]
    );

    let conversation_id;
    if (existing.length > 0) {
      conversation_id = existing[0].conversation_id;
    } else {
      const [insertResult] = await pool.execute(
        `INSERT INTO conversations (shop_id, guest_id) VALUES (?, ?)`,
        [shop_id, guest_id]
      );
      conversation_id = insertResult.insertId;
    }

    const [rows] = await pool.execute(
      `SELECT sent_at FROM messages 
       WHERE conversation_id = ? 
       ORDER BY sent_at DESC 
       LIMIT 1`,
      [conversation_id]
    );

    const lastMessageTimestamp = rows.length > 0 ? rows[0].sent_at : null;
    const isWithin24Hours =
      lastMessageTimestamp && moment().diff(moment.utc(lastMessageTimestamp), 'hours') < 24;

    let responses = [];

    // Send Free-form Message (within 24-hour window)
    if (isWithin24Hours && message) {
      const freeFormData = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: phoneNumber,
        type: 'text',
        text: { body: message }
      };

      const freeFormResponse = await axios.post(
        `https://partner.gupshup.io/partner/app/${process.env.appID}/v3/message`,
        freeFormData,
        {
          headers: {
            'accept': 'application/json',
            'Authorization': process.env.app_token,
            'Content-Type': 'application/json'
          }
        }
      );

      const freeFormMessageId = freeFormResponse.data.messages?.[0]?.id || null;

      await pool.execute(
        `INSERT INTO messages 
          (conversation_id, sender_type, sender_id, message_type, content, status, external_message_id, sent_at) 
         VALUES (?, 'shop', ?, 'text', ?, 'sent', ?, NOW())`,
        [conversation_id, shop_id, message, freeFormMessageId]
      );

      responses.push({ type: 'text', messageId: freeFormMessageId, response: freeFormResponse.data });
    }

    // Send Template Message
    if (templateName) {
      const templateData = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: phoneNumber,
        type: 'template',
        template: {
          name: templateName,
          language: { code: languageCode },
          components: []
        }
      };

      if (parameters.length > 0) {
        templateData.template.components.push({
          type: 'body',
          parameters: parameters.map(param => ({
            type: 'text',
            text: param
          }))
        });
      }

      const templateResponse = await axios.post(
        `https://partner.gupshup.io/partner/app/${process.env.appID}/v3/message`,
        templateData,
        {
          headers: {
            'accept': 'application/json',
            'Authorization': process.env.app_token,
            'Content-Type': 'application/json'
          }
        }
      );

      const templateMessageId = templateResponse.data.messages?.[0]?.id || null;

      await pool.execute(
        `INSERT INTO messages 
          (conversation_id, sender_type, sender_id, message_type, element_name, template_data, status, external_message_id, sent_at) 
         VALUES (?, 'shop', ?, 'template', ?, ?, 'sent', ?, NOW())`,
        [
          conversation_id,
          shop_id,
          templateName,
          JSON.stringify({ parameters }),
          templateMessageId
        ]
      );

      responses.push({ type: 'template', messageId: templateMessageId, response: templateResponse.data });
    }

    return res.status(200).json({
      success: true,
      responses
    });

  } catch (error) {
    console.error('Error sending WhatsApp message:', error.response?.data || error.message);
    return res.status(error.response?.status || 500).json({
      success: false,
      error: error.response?.data?.message || error.message,
      details: error.response?.data
    });
  }
};