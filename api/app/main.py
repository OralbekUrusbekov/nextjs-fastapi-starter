from api.app.api.auth_router import router as auth_router
from api.app.api.websocket_router import router as websocket_router
from api.app.api.tikket_router import router as tikket_router
from api.app.api.favorites_router import router as favorite_router
from api.app.api.telebot_router import router as telegram_router
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse

app = FastAPI(title="My FastAPI App")

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
app.mount("/favorite", StaticFiles(directory="favorite"), name="favorite")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": exc.detail, "error": str(exc)},
    )

@app.get("/")
def hello():
    return "Hello worlds!"


app.include_router(websocket_router)
app.include_router(auth_router)
app.include_router(tikket_router)
app.include_router(favorite_router)
app.include_router(telegram_router)

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)
