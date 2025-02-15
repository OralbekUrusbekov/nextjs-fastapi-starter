import aiohttp
from api.app.bots.config import settings


async def send_telegram_message(message: str):
    bot_token = settings.TELEGRAM_BOT_TOKEN
    chat_id = settings.TELEGRAM_CHAT_ID
    url = f"https://api.telegram.org/bot{bot_token}/sendMessage"

    async with aiohttp.ClientSession() as session:
        async with session.post(url, json={"chat_id": chat_id, "text": message}) as response:
            return await response.json()