

---Food_shop Table for Business
CREATE TABLE `food_shop` (
    `shop_id` bigint NOT NULL AUTO_INCREMENT,
    `food_email_id` bigint DEFAULT NULL,
    `shop_name` varchar(255) DEFAULT NULL,
    `first_name` varchar(100) DEFAULT NULL,
    `last_name` varchar(100) DEFAULT NULL,
    `email_id` varchar(100) DEFAULT NULL,
    `password` varchar(50) DEFAULT NULL,
    `food_shop_address_id` bigint DEFAULT NULL,
    `mobileno` varchar(20) DEFAULT NULL,
    `shop_type` varchar(500) DEFAULT NULL COMMENT 'comma separated Ids from food_shop_type',
    `profile_image` varchar(255) DEFAULT NULL,
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`shop_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

---Food_guest Table for Customer
CREATE TABLE `food_guest` (
    `guest_id` bigint NOT NULL AUTO_INCREMENT,
    `name` varchar(255) DEFAULT NULL,
    `last_name` varchar(50) DEFAULT NULL,
    `email_id` varchar(255) DEFAULT NULL,
    `mobile_no` varchar(20) DEFAULT NULL,
    `profile_image` varchar(255) DEFAULT NULL,
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`guest_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

---Whatsapp Templates
CREATE TABLE `whatsapp_templates` (
    `id` VARCHAR(50) PRIMARY KEY,
    `external_id` VARCHAR(50),
    `app_id` VARCHAR(50),
    `waba_id` VARCHAR(50),
    `element_name` VARCHAR(100),
    `category` VARCHAR(50),
    `language_code` VARCHAR(10),
    `template_type` VARCHAR(20),
    `status` VARCHAR(20),
    `data` TEXT,
    `container_meta` JSON,
    `created_on` BIGINT,
    `modified_on` BIGINT
);

---Shop and Template mapping
CREATE TABLE `shop_template_map` (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `shop_id` bigint NOT NULL,
    `template_id` VARCHAR(50) NOT NULL,
    FOREIGN KEY (`shop_id`) REFERENCES `food_shop`(`shop_id`),
    FOREIGN KEY (`template_id`) REFERENCES `whatsapp_templates`(`id`)
);

---gupshup_configuration
CREATE TABLE `gupshup_configuration` (
    `id` int NOT NULL AUTO_INCREMENT,
    `shop_id` bigint NOT NULL,
    `gupshup_id` bigint NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_gupshup_configuration_food_shop` FOREIGN KEY (`shop_id`) REFERENCES `food_shop`(`shop_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Table for storing Gupshup configuration for shops';



-- New tables for chat functionality

CREATE TABLE `conversations` (
    `conversation_id` bigint NOT NULL AUTO_INCREMENT,
    `shop_id` bigint NOT NULL,
    `guest_id` bigint NOT NULL,
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `last_message_time` timestamp NULL DEFAULT NULL,
    `is_active` tinyint(1) NOT NULL DEFAULT '1',
    PRIMARY KEY (`conversation_id`),
    UNIQUE KEY `shop_guest_unique` (`shop_id`, `guest_id`),
    FOREIGN KEY (`shop_id`) REFERENCES `food_shop`(`shop_id`) ON DELETE CASCADE,
    FOREIGN KEY (`guest_id`) REFERENCES `food_guest`(`guest_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `messages` (
    `message_id` bigint NOT NULL AUTO_INCREMENT,
    `conversation_id` bigint NOT NULL,
    `sender_type` ENUM('shop', 'guest', 'system') NOT NULL,
    `sender_id` bigint NOT NULL,
    `message_type` ENUM('text', 'image', 'template', 'location', 'document', 'audio', 'video') NOT NULL DEFAULT 'text',
    `content` text,
    `template_id` VARCHAR(50) DEFAULT NULL,
    `template_data` JSON DEFAULT NULL,
    `media_url` varchar(255) DEFAULT NULL,
    `sent_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `delivered_at` timestamp NULL DEFAULT NULL,
    `read_at` timestamp NULL DEFAULT NULL,
    `status` ENUM('sent', 'delivered', 'read', 'failed') NOT NULL DEFAULT 'sent',
    `external_message_id` varchar(100) DEFAULT NULL,
    PRIMARY KEY (`message_id`),
    FOREIGN KEY (`conversation_id`) REFERENCES `conversations`(`conversation_id`) ON DELETE CASCADE,
    FOREIGN KEY (`template_id`) REFERENCES `whatsapp_templates`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `message_metadata` (
    `metadata_id` bigint NOT NULL AUTO_INCREMENT,
    `message_id` bigint NOT NULL,
    `key` varchar(100) NOT NULL,
    `value` text NOT NULL,
    PRIMARY KEY (`metadata_id`),
    FOREIGN KEY (`message_id`) REFERENCES `messages`(`message_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `unread_message_counts` (
    `id` bigint NOT NULL AUTO_INCREMENT,
    `conversation_id` bigint NOT NULL,
    `shop_unread_count` int NOT NULL DEFAULT '0',
    `guest_unread_count` int NOT NULL DEFAULT '0',
    `last_updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY (`conversation_id`),
    FOREIGN KEY (`conversation_id`) REFERENCES `conversations`(`conversation_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE food_orders (
    id int not null primary key,
    order_id INT NOT NULL ,
    shop_id INT NOT NULL,
    amount DECIMAL(10,2),
    discount DECIMAL(10,2),
    total_amount DECIMAL(10,2),
    guest_id INT,
    order_status_id INT,
    FOREIGN KEY (shop_id) REFERENCES shops(shop_id),  -- links to shops table
    FOREIGN KEY (guest_id) REFERENCES guests(guest_id)  -- assuming there's a guests table

);


CREATE TABLE food_item (
    item_id INT NOT NULL PRIMARY KEY,
    item_name VARCHAR(255),
    description TEXT,
    shop_id INT NOT NULL,
    FOREIGN KEY (shop_id) REFERENCES shops(shop_id)  -- links to shops table
);

-- Query to get the conversation list ordered by most recent message
SELECT
    c.conversation_id,
    c.title,
    c.type,
    (SELECT u.name
        FROM users u
        JOIN conversation_participants cp ON u.user_id = cp.user_id
        WHERE cp.conversation_id = c.conversation_id AND u.user_id != CURRENT_USER_ID
        LIMIT 1) as contact_name,
    (SELECT m.content
        FROM messages m
        WHERE m.conversation_id = c.conversation_id
        ORDER BY m.sent_at DESC
        LIMIT 1) as last_message,
    (SELECT m.sent_at
        FROM messages m
        WHERE m.conversation_id = c.conversation_id
        ORDER BY m.sent_at DESC
        LIMIT 1) as last_message_time,
    (SELECT COUNT(*)
        FROM messages m
        WHERE m.conversation_id = c.conversation_id AND m.is_read = 0 AND m.sender_id != CURRENT_USER_ID) as unread_count
FROM
    conversations c
JOIN
    conversation_participants cp ON c.conversation_id = cp.conversation_id
WHERE
    cp.user_id = CURRENT_USER_ID
ORDER BY
    last_message_time DESC;
