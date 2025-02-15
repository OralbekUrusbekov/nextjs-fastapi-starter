from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from api.app.bots.telegram_bot import send_telegram_message

router = APIRouter()


class ClientInfo(BaseModel):
    name: str
    phoneNumber: str
    purchaseDate: str


class CartItem(BaseModel):
    id: int
    title: str
    price: float
    quantity: int
    clientInfo: ClientInfo


class CheckoutRequest(BaseModel):
    items: List[CartItem]


@router.post("/checkout")
async def checkout(request: CheckoutRequest):
    try:
        # Process the checkout
        total = sum(item.price * item.quantity for item in request.items)

        # Prepare message for Telegram
        message = "New Order:\n\n"
        for item in request.items:
            message += f"Item: {item.title}\n"
            message += f"Quantity: {item.quantity}\n"
            message += f"Price: ${item.price * item.quantity:.2f}\n"
            message += f"Client: {item.clientInfo.name}\n"
            message += f"Phone: {item.clientInfo.phoneNumber}\n"
            message += f"Purchase Date: {item.clientInfo.purchaseDate}\n\n"

        message += f"Total: ${total:.2f}"

        # Send message to Telegram
        await send_telegram_message(message)

        # Here you would typically save the order to a database

        return {"message": "Checkout successful"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
