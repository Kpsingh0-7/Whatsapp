CREATE DATABASE IF NOT EXISTS gupshup;
USE gupshup;

SELECT * FROM food_shop;
SELECT * FROM food_guest;
SELECT * FROM whatsapp_templates;
SELECT * FROM shop_template_map;
SELECT * FROM gupshup_configuration;
SELECT * FROM conversations;
SELECT * FROM messages;
SELECT * FROM message_metadata;
SELECT * FROM unread_message_counts;
SELECT * FROM food_orders;
SELECT * FROM food_item;

DELETE FROM whatsapp_templates;


INSERT INTO food_shop (food_email_id, shop_name, first_name, last_name, email_id, password, food_shop_address_id, mobileno, shop_type, profile_image)
VALUES
(NULL, 'Spicy Kitchen', 'John', 'Doe', 'john@spicy.com', 'pass123', NULL, '1234567890', '1,2', NULL),
(NULL, 'Pizza Palace', 'Jane', 'Smith', 'jane@pizza.com', 'pass234', NULL, '2345678901', '2', NULL),
(NULL, 'Burger Bros', 'Alex', 'Brown', 'alex@burger.com', 'pass345', NULL, '3456789012', '3', NULL),
(NULL, 'Taco Town', 'Maria', 'Garcia', 'maria@taco.com', 'pass456', NULL, '4567890123', '1,3', NULL),
(NULL, 'Curry House', 'Raj', 'Singh', 'raj@curry.com', 'pass567', NULL, '5678901234', '4', NULL);

INSERT INTO food_guest (name, last_name, email_id, mobile_no, profile_image, shop_id)
VALUES
('Michael', 'Jordan', 'mjordan@example.com', '9990000001', NULL, 1),
('Serena', 'Williams', 'swilliams@example.com', '9990000002', NULL, 1),
('Elon', 'Musk', 'emusk@example.com', '9990000003', NULL, 1),
('Oprah', 'Winfrey', 'owinfrey@example.com', '9990000004', NULL, 1),
('Bill', 'Gates', 'bgates@example.com', '9990000005', NULL, 1);


INSERT INTO whatsapp_templates 
( id, external_id, app_id, waba_id, element_name, category, language_code,
  template_type, status, data, container_meta, created_on, modified_on) 
VALUES
('41a5e9b8-2eff-4275-ba9b-d8ae275aec6e', '706639005026520', '7f97d76e-d64a-4c7b-b589-7b607dce5b45', '110171975093525', 'text1', 'marketing', 'en', 'text', 'approved',
 'FoodChow\nWelcome to Foodchow',
 '{"data":"Welcome to Foodchow","header":"FoodChow","sampleText":"Welcome to Foodchow","sampleHeader":"FoodChow","enableSample":true,"editTemplate":false,"allowTemplateCategoryChange":false,"addSecurityRecommendation":false}',
 1743767842476, 1743767872211),

('3b954373-49ac-44b6-8c0a-cbec9d8af9d6', '707728051588886', '7f97d76e-d64a-4c7b-b589-7b607dce5b45', '110171975093525', 'help', 'marketing', 'en', 'text', 'approved',
 'FOODCHOW\nHi {{1}}! 👋 Welcome to {{2}} 🍽️. How can I assist you today? Please choose an option below:👇\nFoodchow No.1 Online Food Ordering System. | [Today\'s Offers] | [Rate Your Experience] | [Give Feedback] | [Claim Offer] | [ Get a Special Coupon ] | [Contact Support]',
 '{"data":"Hi {{1}}! 👋 Welcome to {{2}} 🍽️. How can I assist you today? Please choose an option below:👇","buttons":[{"type":"QUICK_REPLY","text":"Today\'s Offers"},{"type":"QUICK_REPLY","text":"Rate Your Experience"},{"type":"QUICK_REPLY","text":"Give Feedback"},{"type":"QUICK_REPLY","text":"Claim Offer"},{"type":"QUICK_REPLY","text":" Get a Special Coupon "},{"type":"QUICK_REPLY","text":"Contact Support"}],"header":"FOODCHOW","footer":"Foodchow No.1 Online Food Ordering System.","sampleText":"Hi s! 👋 Welcome to s 🍽️. How can I assist you today? Please choose an option below:👇","sampleHeader":"FOODCHOW","enableSample":true,"editTemplate":false,"allowTemplateCategoryChange":false,"addSecurityRecommendation":false}',
 1743682444140, 1743682444140),

('41b2ad32-3c05-4301-b7ad-d85dd0a6400f', '1416335212911475', '7f97d76e-d64a-4c7b-b589-7b607dce5b45', '110171975093525', 'google_review', 'marketing', 'en', 'text', 'approved',
 'FOODCHOW\n🌟 Thank you for your 5-star review! 🌟\n\nWe truly appreciate your support. 🙌 As a special reward, get *{{1}}% OFF* on your next order! 🎉\n\n📢 Just leave us a review on Google and share a screenshot with us to claim your discount!\nFoodchow No.1 Online Food Ordering System | [Leave a Review,https://www.google.com/search?...]',
 '{"data":"🌟 Thank you for your 5-star review! 🌟\\n\\nWe truly appreciate your support. 🙌 As a special reward, get *{{1}}% OFF* on your next order! 🎉\\n\\n📢 Just leave us a review on Google and share a screenshot with us to claim your discount!","buttons":[{"type":"URL","text":"Leave a Review","url":"https://www.google.com/search?..."}],"header":"FOODCHOW","footer":"Foodchow No.1 Online Food Ordering System","sampleText":"🌟 Thank you for your 5-star review! 🌟\\n\\nWe truly appreciate your support. 🙌 As a special reward, get *15% OFF* on your next order! 🎉\\n\\n📢 Just leave us a review on Google and share a screenshot with us to claim your discount!","sampleHeader":"FOODCHOW","enableSample":true,"editTemplate":false,"allowTemplateCategoryChange":false,"addSecurityRecommendation":false}',
 1743585911229, 1743585911229),

('2df8a4f8-f13a-4504-aeb0-6db2121765b5', '1211594867200578', '7f97d76e-d64a-4c7b-b589-7b607dce5b45', '110171975093525', 'reply', 'marketing', 'en', 'text', 'approved',
 'FOODCHOW\nWe\'re sorry to hear that. Could you share what went wrong?',
 '{"data":"We\'re sorry to hear that. Could you share what went wrong?","header":"FOODCHOW","sampleText":"We\'re sorry to hear that. Could you share what went wrong?","sampleHeader":"FOODCHOW","enableSample":true,"editTemplate":false,"allowTemplateCategoryChange":false,"addSecurityRecommendation":false}',
 1743576715763, 1743576720438),

('0619f5bb-c408-45dd-98d1-143c70410fd3', '4022501484636253', '7f97d76e-d64a-4c7b-b589-7b607dce5b45', '110171975093525', 'feedback', 'marketing', 'en', 'text', 'approved',
 'Hello | [Feedback]',
 '{"data":"Hello","buttons":[{"type":"FLOW","text":"Feedback","flow_id":"3061412807339647","flow_action":"NAVIGATE","navigate_screen":"RECOMMEND"}],"enableSample":true,"editTemplate":false,"allowTemplateCategoryChange":false,"addSecurityRecommendation":false}',
 1743575796582, 1743575796582),

('7d0600d7-44d7-454e-802a-779372582641', '620709364287728', '7f97d76e-d64a-4c7b-b589-7b607dce5b45', '110171975093525', 'feedback_template', 'utility', 'en', 'text', 'approved',
 'FOODCHOW\nHello {{1}},\n\nThank you for dining with us at {{2}}! We hope you had a wonderful experience.\n\nWe\'d love to hear your feedback on how to improve our service. If you provide your feedback within the next 10 minutes, you’ll also receive 10 coins that can be used for future visits!\n\nPlease click the button below to share your thoughts:\n\nGive Feedback\n\nYour opinion matters to us, and we appreciate your time!\n\nThank you for choosing {{3}},\n{{4}} Team\nFoodchow No.1 Online Food Ordering System | [5 Star] | [4 Star] | [3 Star] | [2 Star] | [1 Star]',
 '{"data":"Hello {{1}},\\n\\nThank you for dining with us at {{2}}! We hope you had a wonderful experience.\\n\\nWe\'d love to hear your feedback on how to improve our service. If you provide your feedback within the next 10 minutes, you’ll also receive 10 coins that can be used for future visits!\\n\\nPlease click the button below to share your thoughts:\\n\\nGive Feedback\\n\\nYour opinion matters to us, and we appreciate your time!\\n\\nThank you for choosing {{3}},\\n{{4}} Team","buttons":[{"type":"QUICK_REPLY","text":"5 Star"},{"type":"QUICK_REPLY","text":"4 Star"},{"type":"QUICK_REPLY","text":"3 Star"},{"type":"QUICK_REPLY","text":"2 Star"},{"type":"QUICK_REPLY","text":"1 Star"}],"header":"FOODCHOW","footer":"Foodchow No.1 Online Food Ordering System","sampleText":"Hello Partik,...","sampleHeader":"FOODCHOW","enableSample":true,"editTemplate":false,"allowTemplateCategoryChange":false,"addSecurityRecommendation":false}',
 1743490488792, 1743490488792);
 
 
 INSERT INTO shop_template_map (shop_id, template_id)
VALUES
(1, '0619f5bb-c408-45dd-98d1-143c70410fd3'),
(1, '2df8a4f8-f13a-4504-aeb0-6db2121765b5'),
(2, '3b954373-49ac-44b6-8c0a-cbec9d8af9d6'),
(2, '41a5e9b8-2eff-4275-ba9b-d8ae275aec6e'),
(3, '41b2ad32-3c05-4301-b7ad-d85dd0a6400f'),
(3, '2df8a4f8-f13a-4504-aeb0-6db2121765b5'),
(4, '7d0600d7-44d7-454e-802a-779372582641'),
(4, '0619f5bb-c408-45dd-98d1-143c70410fd3'),
(5, '41a5e9b8-2eff-4275-ba9b-d8ae275aec6e'),
(5, '41b2ad32-3c05-4301-b7ad-d85dd0a6400f');

INSERT INTO gupshup_configuration (shop_id, gupshup_id)
VALUES
(1, 1001),
(2, 1002),
(3, 1003),
(4, 1004),
(5, 1005);


INSERT INTO conversations (shop_id, guest_id, last_message_time, is_active)
VALUES
(1, 1, NOW(), 1),
(2, 2, NOW(), 0),
(3, 3, NOW(), 1),
(4, 4, NOW(), 0),
(5, 5, NOW(), 1);

INSERT INTO messages (conversation_id, sender_type, sender_id, message_type, content, template_id, template_data, media_url, status, external_message_id)
VALUES
(1, 'shop', 1, 'text', 'Welcome to Spicy Kitchen!', '41a5e9b8-2eff-4275-ba9b-d8ae275aec6e', NULL, NULL, 'sent', 'ext-msg-001'),
(2, 'guest', 2, 'text', 'Pizza was great!', '3b954373-49ac-44b6-8c0a-cbec9d8af9d6', NULL, NULL, 'read', 'ext-msg-002'),
(3, 'shop', 3, 'template', NULL, '41b2ad32-3c05-4301-b7ad-d85dd0a6400f', '{"delivery_time":"30 mins"}', NULL, 'delivered', 'ext-msg-003'),
(4, 'system', 0, 'template', NULL, '2df8a4f8-f13a-4504-aeb0-6db2121765b5', NULL, NULL, 'sent', 'ext-msg-004'),
(5, 'shop', 5, 'text', 'Hope you enjoyed the meal!', '0619f5bb-c408-45dd-98d1-143c70410fd3', NULL, NULL, 'read', 'ext-msg-005');

INSERT INTO message_metadata (message_id, key, value) VALUES
(1, 'channel', 'whatsapp'),
(2, 'channel', 'whatsapp'),
(3, 'channel', 'whatsapp'),
(4, 'channel', 'whatsapp'),
(5, 'channel', 'whatsapp');

INSERT INTO unread_message_counts (conversation_id, shop_unread_count, guest_unread_count) VALUES
(1, 1, 0),
(2, 1, 0),
(3, 1, 0),
(4, 1, 0),
(5, 1, 0);

INSERT INTO food_orders (id, order_id, shop_id, amount, discount, total_amount, guest_id, order_status_id) VALUES
(1, 101, 1, 100.00, 10.00, 90.00, 1, 1),
(2, 102, 2, 150.00, 15.00, 135.00, 2, 2),
(3, 103, 3, 200.00, 20.00, 180.00, 3, 1),
(4, 104, 4, 250.00, 25.00, 225.00, 4, 3),
(5, 105, 5, 300.00, 30.00, 270.00, 5, 2);

INSERT INTO food_item (item_id, item_name, description, shop_id) VALUES
(1, 'Spicy Paneer', 'Paneer cooked in spicy gravy', 1),
(2, 'Margherita Pizza', 'Classic cheese pizza', 2),
(3, 'Cheeseburger', 'Beef burger with cheese', 3),
(4, 'Tacos', 'Crispy tacos with salsa', 4),
(5, 'Chicken Curry', 'Chicken cooked in rich curry', 5);
