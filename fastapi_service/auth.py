"""
Authentication for FastAPI service
JWT token verification with Django compatibility
"""
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from config import settings
import httpx
import structlog

logger = structlog.get_logger()
security = HTTPBearer()

async def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verify JWT token"""
    try:
        token = credentials.credentials
        
        # Decode JWT token
        payload = jwt.decode(
            token, 
            settings.secret_key, 
            algorithms=[settings.algorithm]
        )
        
        user_id: int = payload.get("user_id")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token",
                headers={"WWW-Authenticate": "Bearer"}
            )
        
        return payload
    
    except JWTError as e:
        logger.error("JWT verification failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"}
        )

async def get_current_user(token_payload: dict = Depends(verify_token)):
    """Get current user information from Django service"""
    try:
        # Get user info from Django API
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{settings.django_service_url}/api/v1/users/profile/",
                headers={"Authorization": f"Bearer {token_payload.get('access_token', '')}"},
                timeout=10.0
            )
            
            if response.status_code == 200:
                user_data = response.json()
                user_data.update(token_payload)  # Merge token data
                return user_data
            else:
                logger.error("Failed to fetch user data", status_code=response.status_code)
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Could not validate user"
                )
                
    except httpx.RequestError as e:
        logger.error("Django service communication failed", error=str(e))
        # Fallback to token payload if Django service is unavailable
        return token_payload

async def get_admin_user(current_user: dict = Depends(get_current_user)):
    """Ensure current user is admin"""
    if current_user.get("user_type") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user