
interface SteadfastOrderResponse {
    status: number;
    message: string;
    consignment_id?: number;
    tracking_code?: string;
    invoice?: string;
}

const BASE_URL = 'https://portal.steadfast.com.bd/api/v1';

// You should normally put these in .env files
const API_KEY = import.meta.env.VITE_STEADFAST_API_KEY || '';
const SECRET_KEY = import.meta.env.VITE_STEADFAST_SECRET_KEY || '';

export const sendToSteadfast = async (order: any): Promise<{ success: boolean; message: string; data?: any }> => {
    if (!API_KEY || !SECRET_KEY) {
        console.warn("⚠️ Steadfast API keys are missing! Check .env file.");
        return { success: false, message: "API Configuration Missing" };
    }

    const payload = {
        invoice: order.id,
        recipient_name: order.customer_name,
        recipient_phone: order.phone,
        recipient_address: order.address,
        cod_amount: order.total_price,
        note: 'Order from Friends Gallery'
    };

    try {
        const response = await fetch(`${BASE_URL}/create_order`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Api-Key': API_KEY,
                'Secret-Key': SECRET_KEY
            },
            body: JSON.stringify(payload)
        });

        const data: SteadfastOrderResponse = await response.json();

        if (response.ok && data.status === 200) {
            return { success: true, message: "Order sent to courier successfully!", data };
        } else {
            return { success: false, message: data.message || "Failed to send to courier" };
        }
    } catch (error: any) {
        console.error("❌ Steadfast API Error:", error);
        return { success: false, message: error.message || "Network error" };
    }
};
