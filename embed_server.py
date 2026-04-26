from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer

app = Flask(__name__)

model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

@app.route("/embed", methods=["POST"])
def embed():
    data = request.json
    query = data["query"]

    embedding = model.encode([query], normalize_embeddings=True)[0].tolist()

    return jsonify({"embedding": embedding})

app.run(port=5000)