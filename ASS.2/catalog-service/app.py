import os
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

DB_HOST = os.getenv("DB_HOST", "catalog-db")
DB_NAME = os.getenv("DB_NAME", "catalog_db")
DB_USER = os.getenv("DB_USER", "catalog_user")
DB_PASS = os.getenv("DB_PASS", "catalog_pass")

app.config["SQLALCHEMY_DATABASE_URI"] = (
    f"postgresql+psycopg2://{DB_USER}:{DB_PASS}@{DB_HOST}:5432/{DB_NAME}"
)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

class Book(db.Model):
    __tablename__ = "books"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    author = db.Column(db.String(255), nullable=False)
    year = db.Column(db.Integer, nullable=True)
    available = db.Column(db.Boolean, default=True)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "author": self.author,
            "year": self.year,
            "available": self.available,
        }

with app.app_context():
    db.create_all()

@app.get("/catalog/health")
def health():
    return jsonify({"service": "catalog-service", "status": "ok"}), 200

# CREATE
@app.post("/catalog/books")
def create_book():
    data = request.get_json(silent=True) or {}
    title = data.get("title")
    author = data.get("author")

    if not title or not author:
        return jsonify({"error": "title and author are required"}), 400

    book = Book(
        title=title,
        author=author,
        year=data.get("year"),
        available=data.get("available", True),
    )
    db.session.add(book)
    db.session.commit()
    return jsonify(book.to_dict()), 201

# READ ALL
@app.get("/catalog/books")
def read_all_books():
    books = Book.query.order_by(Book.id.asc()).all()
    return jsonify([b.to_dict() for b in books]), 200

# READ ONE
@app.get("/catalog/books/<int:book_id>")
def read_one_book(book_id):
    book = Book.query.get(book_id)
    if not book:
        return jsonify({"error": "Book not found"}), 404
    return jsonify(book.to_dict()), 200

# UPDATE
@app.put("/catalog/books/<int:book_id>")
def update_book(book_id):
    book = Book.query.get(book_id)
    if not book:
        return jsonify({"error": "Book not found"}), 404

    data = request.get_json(silent=True) or {}
    if "title" in data: book.title = data["title"]
    if "author" in data: book.author = data["author"]
    if "year" in data: book.year = data["year"]
    if "available" in data: book.available = data["available"]

    db.session.commit()
    return jsonify(book.to_dict()), 200

# DELETE
@app.delete("/catalog/books/<int:book_id>")
def delete_book(book_id):
    book = Book.query.get(book_id)
    if not book:
        return jsonify({"error": "Book not found"}), 404
    db.session.delete(book)
    db.session.commit()
    return jsonify({"message": "Book deleted"}), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
