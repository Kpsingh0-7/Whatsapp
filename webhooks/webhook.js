import { handleReply } from "../controllers/replyController.js";
import { pool } from "../config/db.js";

export async function handleWebhook(req, res) {
  console.log("Received message:", JSON.stringify(req.body, null, 2));

  const messages = req.body.entry?.[0]?.changes || [];

  for (const change of messages) {
    const msg = change.value?.messages?.[0];

    if (msg) {
      const businessNumber =
        change.value.metadata?.display_phone_number || "Unknown";
      const customerNumber = msg.from;
      const customerName =
        change.value.contacts?.[0]?.profile?.name || "Unknown";
      const messageText = msg.text?.body || msg.button?.text || "No text";
      const messageType = msg.type;
      const messageId = msg.id;
      const timestamp = msg.timestamp;
      const templateName = msg.button?.payload || null;
      const sender = "customer"; // Assuming all incoming messages are from the customer
      const webhookEvent = JSON.stringify(req.body); // Storing full event JSON

      try {
        // Check if the message_id already exists
        const [existingMessage] = await pool.query(
          `SELECT message_id FROM whatsapp_business_chats WHERE message_id = ?`,
          [messageId]
        );

        if (existingMessage.length === 0) {
          // Insert new incoming message
          const insertQuery = `
            INSERT INTO whatsapp_business_chats 
            (business_number, customer_number, customer_name, sender, message, message_type, template_name, status, message_id, webhook_event) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;
          await pool.query(insertQuery, [
            businessNumber,
            customerNumber,
            customerName,
            sender,
            messageText,
            messageType,
            templateName,
            "received", // Default status for incoming messages
            messageId,
            webhookEvent,
          ]);

          console.log(`Inserted new message: ${messageId}`);
        } else {
          console.log(`Message already exists: ${messageId}`);
        }
      } catch (error) {
        console.error("Error inserting message:", error);
      }

      handleReply({
        from: customerNumber,
        message: messageText,
        payload: msg.button?.payload || null,
        timestamp: timestamp,
      });
    }

    // Process status updates
    // Process status updates
    if (change.value?.statuses) {
      const statusPriority = {
        sent: 1,
        delivered: 2,
        read: 3,
      };

      for (const statusUpdate of change.value.statuses) {
        const { gs_id, status } = statusUpdate;

        try {
          const [existing] = await pool.query(
            `SELECT status FROM whatsapp_business_chats WHERE message_id = ?`,
            [gs_id]
          );

          if (existing.length) {
            const currentStatus = existing[0].status;

            if (currentStatus === "read") {
              console.log(`Skipping update: message ${gs_id} is already read`);
            } else if (
              !statusPriority[currentStatus] ||
              statusPriority[status] > statusPriority[currentStatus]
            ) {
              const updateQuery = `
            UPDATE whatsapp_business_chats 
            SET status = ? 
            WHERE message_id = ?
          `;
              await pool.query(updateQuery, [status, gs_id]);
              console.log(
                `Updated message status: Message ID ${gs_id}, Status ${status}`
              );
            } else {
              console.log(
                `Ignored status update: ${gs_id} is already ${currentStatus}`
              );
            }
          } else {
            console.warn(
              `Message ID not found in DB for status update: ${gs_id}`
            );
          }
        } catch (error) {
          console.error("Error updating message status:", error);
        }
      }
    }
  }

  res.status(200).json({ success: true });
}
