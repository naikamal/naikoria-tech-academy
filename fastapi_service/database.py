"""
Database connection for FastAPI service
Connects to the same PostgreSQL database as Django
"""
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from config import settings
import structlog

logger = structlog.get_logger()

# Create async engine
engine = create_async_engine(
    settings.database_url,
    echo=settings.debug,
    future=True
)

# Create session factory
async_session = sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False
)

Base = declarative_base()

async def get_db():
    """Dependency to get database session"""
    async with async_session() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()

async def init_database():
    """Initialize database connection"""
    try:
        # Test connection
        async with engine.begin() as conn:
            # Django handles migrations, so we just test connection
            await conn.execute("SELECT 1")
        
        logger.info("✅ Database connection established")
        
    except Exception as e:
        logger.error("❌ Database connection failed", error=str(e))
        raise