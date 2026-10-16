import { Order } from '../types';
import { formatSom, formatUzbekDate } from './formatters';

export interface TelegramSendResult {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Format a completed order into a clean, professional Uzbek Telegram message
 */
export function formatOrderTelegramMessage(order: Order): string {
  const itemsText = order.items
    .map(
      (item, idx) =>
        `${idx + 1}. <b>${item.name}</b>\n   Rang: ${item.colorName} | O'lcham: ${item.size}\n   Soni: ${item.quantity} dona x ${formatSom(item.price)}`
    )
    .join('\n');

  const mapLinkText = order.yandexMapUrl
    ? `\n📍 <b>Xarita:</b> <a href="${order.yandexMapUrl}">Yandex Xaritada ko'rish</a>`
    : '';

  const noteText = order.note
    ? `\n💬 <b>Mijoz izohi:</b> <i>${order.note}</i>`
    : '';

  const paymentText =
    order.paymentMethod === 'cash'
      ? "Naqd to'lov (qabul qilinganda)"
      : "Karta orqali / Kelishilgan";

  return `🛍 <b>YANGI BUYURTMA #${order.orderNumber}</b>\n\n` +
    `👤 <b>Xaridor:</b> ${order.customerName}\n` +
    `📞 <b>Telefon:</b> <a href="tel:${order.phone.replace(/\s+/g, '')}">${order.phone}</a>\n` +
    `🏠 <b>Viloyat:</b> ${order.region}\n` +
    `🏙 <b>Shahar/Tuman:</b> ${order.city}\n` +
    `📮 <b>To'liq manzil:</b> ${order.address}${mapLinkText}\n` +
    `💳 <b>To'lov turi:</b> ${paymentText}${noteText}\n\n` +
    `📦 <b>Buyurtma qilingan kiyimlar:</b>\n${itemsText}\n\n` +
    `💵 <b>Mahsulotlar summasi:</b> ${formatSom(order.subtotal)}\n` +
    `🚚 <b>Yetkazib berish:</b> ${order.deliveryFee === 0 ? 'BEPUL' : formatSom(order.deliveryFee)}\n` +
    `💰 <b>JAMI TO'LOV:</b> <b>${formatSom(order.total)}</b>\n\n` +
    `⏰ <b>Buyurtma vaqti:</b> ${formatUzbekDate(order.createdAt)}\n` +
    `<i>SHU BREND — Internet do'koni avtomatlashtirilgan tizimi</i>`;
}

/**
 * Send real Telegram message via Telegram Bot API
 */
export async function sendTelegramMessage(
  botToken: string,
  chatId: string,
  text: string
): Promise<TelegramSendResult> {
  if (!botToken || !chatId) {
    return {
      success: false,
      error: "Telegram Bot Token yoki Chat ID ko'rsatilmagan.",
    };
  }

  try {
    const cleanToken = botToken.trim();
    const cleanChatId = chatId.trim();

    const response = await fetch(
      `https://api.telegram.org/bot${cleanToken}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: cleanChatId,
          text: text,
          parse_mode: 'HTML',
          disable_web_page_preview: false,
        }),
      }
    );

    const data = await response.json();
    if (data.ok) {
      return {
        success: true,
        message: "Xabar Telegram botga muvaffaqiyatli yuborildi!",
      };
    } else {
      return {
        success: false,
        error: data.description || "Telegram API xatolik qaytardi.",
      };
    }
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Internet ulanishida yoki Telegram serverida xatolik.",
    };
  }
}
