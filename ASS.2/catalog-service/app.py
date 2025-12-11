from flask import Flask, jsonify

app = Flask(__name__)

@app.route("/catalog/health", methods=["GET"])
def health():
    return jsonify({
        "service": "catalog-service",
        "status": "ok"
    }), 200


if __name__ == "__main__":
    # IMPORTANT: listen on all interfaces so Docker can reach it
    app.run(host="0.0.0.0", port=5000)
