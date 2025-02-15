import json
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, WebSocket, WebSocketDisconnect

router = APIRouter(
    tags=["websocket"],
    prefix='/ws'
)


class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[int, List[WebSocket]] = {}
        self.general_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket, category_id: Optional[int] = None):
        await websocket.accept()
        if category_id is None:
            self.general_connections.append(websocket)
            print(f"WebSocket connected to general: {websocket}")
        else:

            if category_id not in self.active_connections:
                self.active_connections[category_id] = []
            self.active_connections[category_id].append(websocket)
            print(f"WebSocket connected to category {category_id}: {websocket}")

    def disconnect(self, websocket: WebSocket, category_id: Optional[int] = None):
        if category_id is None:
            if websocket in self.general_connections:
                self.general_connections.remove(websocket)
                print(f"WebSocket disconnected from general: {websocket}")
        else:

            if category_id in self.active_connections and websocket in self.active_connections[category_id]:
                self.active_connections[category_id].remove(websocket)
                print(f"WebSocket disconnected from category {category_id}: {websocket}")
                if not self.active_connections[category_id]:
                    del self.active_connections[category_id]

    async def broadcast(self, message: Dict[str, Any], category_id: Optional[int] = None):
        # Жіберілетін хабарламаны JSON форматына түрлендіру
        formatted_message = json.dumps({
            "action": message.get("action"),
            "category_id": category_id,
            "data": message.get("data")
        })
        if category_id is None:
            for connection in self.general_connections:
                try:
                    await connection.send_text(formatted_message)
                except Exception as e:
                    print(f"Error broadcasting to general connection: {str(e)}")
        elif category_id in self.active_connections:
            for connection in self.active_connections[category_id]:
                try:
                    await connection.send_text(formatted_message)
                except Exception as e:
                    print(f"Error broadcasting to category {category_id} connection: {str(e)}")


manager = ConnectionManager()


@router.websocket("/chat")
async def websocket_endpoint(websocket: WebSocket):
    category_id = None
    await manager.connect(websocket, category_id)
    try:
        while True:
            data = await websocket.receive_json()
            print(f"Received message: {data}")
            if "category_id" in data:
                category_id = data["category_id"]
                manager.disconnect(websocket)
                await manager.connect(websocket, category_id)
                continue
            if "username" in data and "message" in data:
                message = {
                    "action": "new_message",
                    "category_id": category_id,
                    "data": {
                        "username": data["username"],
                        "message": data["message"]
                    }
                }
                await manager.broadcast(message, category_id)

    except WebSocketDisconnect:
        manager.disconnect(websocket, category_id)
        print(f"WebSocket connection closed for category {category_id}")

    except Exception as e:
        print(f"WebSocket error: {str(e)}")
