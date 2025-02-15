from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text  # text функциясын импорттаймыз
import asyncio

DATABASE_URL = "postgresql+asyncpg://postgres:Oralbek@localhost:2028/postgres"

async def test_connection():
    try:
        engine = create_async_engine(DATABASE_URL)
        async with engine.connect() as conn:
            # text() функциясын пайдалану
            result = await conn.execute(text("SELECT 1"))
            print("Деректер қорына қосылым сәтті! Нәтиже:", result.scalar())
        await engine.dispose()
    except Exception as e:
        print("Деректер қорына қосыла алмады. Қате:", e)

asyncio.run(test_connection())
