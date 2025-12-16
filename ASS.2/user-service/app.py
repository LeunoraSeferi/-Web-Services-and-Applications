import os
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

DB_HOST = os.getenv("DB_HOST", "user-db")
DB_NAME = os.getenv("DB_NAME", "user_db")
DB_USER = os.getenv("DB_USER", "user_user")
DB_PASS = os.getenv("DB_PASS", "user_pass")

app.config["SQLALCHEMY_DATABASE_URI"] = (
    f"mysql+pymysql://{DB_USER}:{DB_PASS}@{DB_HOST}:3306/{DB_NAME}"
)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False, unique=True)

    def to_dict(self):
        return {"id": self.id, "full_name": self.full_name, "email": self.email}

with app.app_context():
    db.create_all()

@app.get("/users/health")
def health():
    return jsonify({"service": "user-service", "status": "ok"}), 200

# CREATE
@app.post("/users")
def create_user():
    data = request.get_json(silent=True) or {}
    if not data.get("full_name") or not data.get("email"):
        return jsonify({"error": "full_name and email are required"}), 400

    user = User(full_name=data["full_name"], email=data["email"])
    db.session.add(user)
    try:
        db.session.commit()
    except Exception:
        db.session.rollback()
        return jsonify({"error": "email must be unique"}), 409

    return jsonify(user.to_dict()), 201

# READ ALL 
@app.get("/users")
def read_all_users():
    users = User.query.order_by(User.id.asc()).all()
    return jsonify([u.to_dict() for u in users]), 200

# READ ONE
@app.get("/users/<int:user_id>")
def read_one_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify(user.to_dict()), 200

# UPDATE
@app.put("/users/<int:user_id>")
def update_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json(silent=True) or {}
    if "full_name" in data: user.full_name = data["full_name"]
    if "email" in data: user.email = data["email"]

    try:
        db.session.commit()
    except Exception:
        db.session.rollback()
        return jsonify({"error": "email must be unique"}), 409

    return jsonify(user.to_dict()), 200

# DELETE
@app.delete("/users/<int:user_id>")
def delete_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted"}), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
