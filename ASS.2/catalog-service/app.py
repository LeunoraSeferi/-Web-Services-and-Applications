import os
from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text

app = Flask(__name__)

DB_HOST = os.getenv("DB_HOST")
DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASS = os.getenv("DB_PASS")

app.config["SQLALCHEMY_DATABASE_URI"] = (
    f"postgresql+psycopg2://{DB_USER}:{DB_PASS}@{DB_HOST}:5432/{DB_NAME}"
)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

@app.get("/catalog/health")
def health():
    return jsonify({"service": "catalog-service", "status": "ok"}), 200

@app.get("/catalog/db-check")
def db_check():
    try:
        db.session.execute(text("SELECT 1"))
        return jsonify({"service": "catalog-service", "db": "connected"}), 200
    except Exception as e:
        return jsonify({"service": "catalog-service", "db": "error", "detail": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
