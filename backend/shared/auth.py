from fastapi import Header, HTTPException


def verify_token(authorization: str = Header(...)):
  if not authorization.startswith("Bearer "):
    raise HTTPException(status_code=401, detail="Invalid token")
  return {"user_id": "demo-user"}