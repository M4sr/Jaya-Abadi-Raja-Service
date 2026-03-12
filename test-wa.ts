import { sendWhatsAppMessage } from "./src/lib/whatsapp";

async function testWA() {
    console.log("Testing WhatsApp Send...");
    // Using a dummy number or user's number if I had it, but for now just verifying the structure and API call
    const result = await sendWhatsAppMessage("6281234567890", "Test message from Jaya Abadi Raja Service system integration.");
    console.log("Result:", result);
}

testWA();
