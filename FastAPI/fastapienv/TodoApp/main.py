from fastapi import FastAPI, Depends, HTTPException, Path
import models
from database import engine
from Routers import auth, todos

app = FastAPI()

models.Base.metadata.create_all(bind=engine)

app.include_router(auth.router)
app.include_router(todos.router)