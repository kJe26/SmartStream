from fastapi import Header, HTTPException


def verify_token(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")

    token = authorization.split(" ")[1]
    if token != "demo-token":
        raise HTTPException(status_code=403, detail="Invalid token")

    return {"user_id": "demo-user"}