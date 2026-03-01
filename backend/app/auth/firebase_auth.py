from fastapi import HTTPException, Header
import firebase_admin
from firebase_admin import auth, credentials
import os

if not firebase_admin._apps:
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    cred_path = os.path.join(BASE_DIR, "firebase_credentials.json")
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)


async def verify_firebase_token(authorization: str = Header(...)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Invalid authorization header format"
        )

    token = authorization.split("Bearer ")[1]

    try:
        decoded_token = auth.verify_id_token(
            token,
            clock_skew_seconds=60  # ← must be here
        )
        return decoded_token["uid"]

    except auth.ExpiredIdTokenError:
        raise HTTPException(status_code=401, detail="Token has expired - Please login again")
    except auth.InvalidIdTokenError as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")
    except auth.RevokedIdTokenError:
        raise HTTPException(status_code=401, detail="Token has been revoked - Please login again")
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Authentication failed: {str(e)}")

# import firebase_admin
# from firebase_admin import credentials, auth
# from fastapi import HTTPException, Security
# from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
# from app.config import settings

# cred = credentials.Certificate(settings.firebase_credentials_path)
# firebase_admin.initialize_app(cred)

# security = HTTPBearer()

# async def verify_firebase_token(credentials: HTTPAuthorizationCredentials = Security(security)):
#     try:
#         token = credentials.credentials
#         decoded_token = auth.verify_id_token(token)
#         return decoded_token['uid']
#     except Exception as e:
#         raise HTTPException(status_code=401, detail=f"Invalid authentication: {str(e)}")