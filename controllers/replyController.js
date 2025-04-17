import { sendTemplate } from "./sendTemplate.js";

export function handleReply(message) {
  const messageText = message.message.toLowerCase();
  let templateName;
  let parameters = [];

  switch (true) {
    case /^[1-3] star$/.test(messageText):
      templateName = "reply";
      parameters = [];
      break;
    case /^[4-5] star$/.test(messageText):
      templateName = "google_review";
      parameters = ["25"];
      break;
      case ["hii", "hi", "hiii", "hello", "helo", "helloo"].some(word => messageText.includes(word)):
      templateName = "help";
      parameters = ["KPSINGH", "FOODCHOW"];
      break;
    case messageText.includes("hep"):
      templateName = "customer_support";
      break;
    case messageText.includes("promo"):
      templateName = "promotional_offer";
      break;
    default:
      templateName = null;
  }

  if (templateName) {
    const fakeRequest = {
      body: {
        phoneNumber: message.from,
        templateName: templateName,
        languageCode: "en",
        parameters: parameters,
      },
    };
    const fakeResponse = {
      status: (code) => ({
        json: (data) => console.log(`Response (${code}):`, data),
      }),
    };
    
    sendTemplate(fakeRequest, fakeResponse);
  }
}
