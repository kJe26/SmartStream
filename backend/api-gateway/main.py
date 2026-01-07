from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from strawberry.fastapi import GraphQLRouter
import strawberry
from shared.auth import verify_token


app = FastAPI()


app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],
  allow_methods=["*"],
  allow_headers=["*"],
)


@app.get("/health")
def health():
  return {"status": "ok"}


@strawberry.type
class Query:
  @strawberry.field
  def hello(self) -> str:
    return "Hello GraphQL"


schema = strawberry.Schema(Query)
app.include_router(GraphQLRouter(schema), prefix="/graphql")