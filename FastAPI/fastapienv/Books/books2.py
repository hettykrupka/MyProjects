from typing import Optional
from fastapi import Body, FastAPI, Path, Query, HTTPException
from pydantic import BaseModel, Field
from starlette import status

app = FastAPI()

class Book:
        id: int
        title: str
        author: str
        description: str
        rating: int
        published_date: int

        def __init__(self, id, title, author, description, rating, published_date):
            self.id = id
            self.title = title
            self.author = author
            self.description = description
            self.rating = rating
            self.published_date = published_date

class BookRequest(BaseModel):
    id: Optional[int] = None
    title: str = Field(min_length = 3)
    author: str = Field(min_legnth = 1)
    description: str = Field(min_length = 1, max_length = 100)
    rating: int = Field(gt=0, lt=6)
    published_date: int = Field(min_legnth=4, lt=2024)

    class Config:
        json_schema_extra = {
            'example': {
                'title': 'A new book',
                'author': 'codingwithroby',
                'description': 'a new description of a book',
                'rating': 5,
                'published_date': 2020
            }
        }

BOOKS = [
    Book(1, 'Computer Science Pro', 'codingwithroby', 'great book!', 5, 2010),
    Book(2, 'Computer Science Pro Vol 2', 'codingwithroby', 'great book!', 4, 2011),
    Book(3, 'Computer Science Pro Vol 3', 'codingwithroby', 'great book!', 1, 2021)
]

@app.get("/books", status_code=status.HTTP_200_OK)
async def read_all_books():
    return BOOKS

@app.get("/books/{book_id}", status_code=status.HTTP_200_OK)
async def read_book(book_id: int = Path(gt=0)):
    for book in BOOKS:
        if book_id == book.id:
            return book
    raise HTTPException(status_code=404, detail='Item not found')


@app.get("/books/publish/", status_code=status.HTTP_200_OK)
async def read_book_by_published_date(published_date: int = Query(min_legnth=4, lt=2024)):
    books_to_return = []
    for book in BOOKS:
        if published_date == book.published_date:
            books_to_return.append(book)
    return books_to_return

@app.get("/books/", status_code=status.HTTP_200_OK)
async def read_book_by_rating(book_rating: int = Query(gt=0, lt=6)):
    books_to_return = []
    for book in BOOKS:
        if book_rating == book.rating:
            books_to_return.append(book)
    return books_to_return

@app.post("/create-book", status_code=status.HTTP_201_CREATED)
async def create_book(book_request: BookRequest):
    new_book = Book(**book_request.model_dump())
    BOOKS.append(find_book_id(new_book))

def find_book_id(book: Book):
    book.id = 1 if len(BOOKS) == 0 else BOOKS[-1].id + 1
    return book

@app.put("/books/update_book", status_code=status.HTTP_204_NO_CONTENT)
async def update_book(book: BookRequest):
    book_changed = False
    for i in range(len(BOOKS)):
        if BOOKS[i].id == book.id:
            BOOKS[i] = book
            book_changed = True
    if not book_changed:
        raise HTTPException(status_code=404, detail = 'Item not found')

@app.delete("/books/{book_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_book(book_id: int = Path(gt=0)):
    book_changed = False
    for i in range(len(BOOKS)):
        if BOOKS[i].id == book_id:
            BOOKS.pop(i)
            book_changed = True
            break
    if not book_changed:
        raise HTTPException(status_code=404, detail='Item not found')