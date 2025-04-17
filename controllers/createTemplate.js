// Use this function to create a new template from scratch
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export const createTemplate = async (req, res) => {
  const {
    elementName,
    content,
    category = 'MARKETING',
    templateType = 'TEXT',
    languageCode = 'en',
    header = '',
    footer = '',
    buttons = [],
    example,
    messageSendTTL = 43200
  } = req.body;

  try {
    // Validate required fields
    if (!elementName || !content) {
      return res.status(400).json({
        success: false,
        error: 'elementName and content are required fields'
      });
    }

    const encodedParams = new URLSearchParams();
    
    // Set required parameters
    encodedParams.set('category', category);
    encodedParams.set('templateType', templateType);
    encodedParams.set('elementName', elementName);
    encodedParams.set('languageCode', languageCode);
    encodedParams.set('vertical', 'TEXT');
    encodedParams.set('content', content);
    
    // Set optional parameters
    if (header) encodedParams.set('header', header);
    if (footer) encodedParams.set('footer', footer);
    
    // Process buttons
    if (buttons.length > 0) {
      encodedParams.set('buttons', JSON.stringify(buttons));
    } else if (category === 'AUTHENTICATION') {
      // Default OTP button for authentication templates
      encodedParams.set('buttons', JSON.stringify([{
        type: 'OTP',
        otp_type: 'COPY_CODE',
        text: 'Copy OTP'
      }]));
    }

    // Generate example if not provided
    const generatedExample = example || 
      content.replace(/\{\{1\}\}/g, '4')
             .replace(/\{\{2\}\}/g, '2023-01-01');
    encodedParams.set('example', generatedExample);
    
    encodedParams.set('message_send_ttl_seconds', messageSendTTL.toString());

    const response = await axios.post(
      `https://partner.gupshup.io/partner/app/${process.env.appID}/templates`,
      encodedParams.toString(),
      {
        headers: {
          accept: 'application/json',
          token: process.env.app_token,
          'content-type': 'application/x-www-form-urlencoded'
        }
      }
    );

    return res.status(200).json({
      success: true,
      templateId: response.data.id,
      response: response.data
    });

  } catch (error) {
    console.error('Template creation error:', error.response?.data || error.message);
    return res.status(error.response?.status || 500).json({
      success: false,
      error: error.response?.data?.message || error.message,
      details: error.response?.data
    });
  }
};