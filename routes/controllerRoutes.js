import { Router } from "express";
import { getTemplate } from '../controllers/getTemplate.js';
import { sendTemplate } from '../controllers/sendTemplate.js';
import { createTemplate } from '../controllers/createTemplate.js';
import { deleteTemplate } from '../controllers/deleteTemplate.js';
import { updateTemplate } from '../controllers/editTemplate.js';
import { setupSubscription } from "../controllers/setSubscription.js";
import { returnContacts } from "../controllers/returnContacts.js";
import { returnTemplates } from '../controllers/returnTemplates.js';

import { handleWebhook }  from "../webhooks/webhook.js";


const router = Router();

router.post('/send', sendTemplate);
router.post('/subscription', setupSubscription);
router.get('/gettemplate',getTemplate);
router.post('/createtemplate',createTemplate);
router.delete('/deletetemplate',deleteTemplate);
router.put('/edit',updateTemplate);
router.post('/webhook', handleWebhook);

router.get('/contacts', returnContacts);
router.get('/templates', returnTemplates);

export default router;
