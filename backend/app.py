from flask import Flask, request, jsonify
import sqlite3
import jwt
import datetime
from flask_cors import CORS


DATABASE = "sql_runner.db"
SECRET_KEY = "my_very_secret_key"

USERNAME = "admin"
PASSWORD = "admin"

recent_queries = {
    USERNAME: []  
}

app = Flask(__name__)
CORS(app)

def generate_token(username):
    payload = {
        "user": username,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")

def verify_token(request):
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    try:
        decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return decoded["user"]
    except:
        return None

@app.post("/login")
def login():
    data = request.get_json()
    if data.get("username") == USERNAME and data.get("password") == PASSWORD:
        token = generate_token(USERNAME)
        return jsonify({"token": token})
    return jsonify({"error": "Invalid username or password"}), 401

def get_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

@app.post("/run-query")
def run_query():
    user = verify_token(request)
    if not user:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json()
    query = data.get("query", "").strip()

    if not query:
        return jsonify({"error": "Query cannot be empty"}), 400

    recent_queries[user].insert(0, query)
    if len(recent_queries[user]) > 10:
        recent_queries[user].pop()

    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute(query)

        if query.lower().startswith("select"):
            rows = cursor.fetchall()
            results = [dict(row) for row in rows]
            return jsonify({"results": results})
        else:
            conn.commit()
            return jsonify({"message": "Query executed successfully"})

    except sqlite3.Error as e:
        return jsonify({"error": str(e)}), 400

    finally:
        conn.close()

@app.get("/recent-queries")
def get_recent_queries():
    user = verify_token(request)
    if not user:
        return jsonify({"error": "Unauthorized"}), 401

    return jsonify({"recent_queries": recent_queries[user]})

@app.get("/tables")
def get_tables():
    user = verify_token(request)
    if not user:
        return jsonify({"error": "Unauthorized"}), 401

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = [row[0] for row in cursor.fetchall()]
    conn.close()
    return jsonify({"tables": tables})

@app.get("/table-info/<table_name>")
def table_info(table_name):
    user = verify_token(request)
    if not user:
        return jsonify({"error": "Unauthorized"}), 401

    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute(f"PRAGMA table_info({table_name});")
        columns = [{"name": row[1], "type": row[2]} for row in cursor.fetchall()]

        cursor.execute(f"SELECT * FROM {table_name} LIMIT 5;")
        sample_rows = [dict(row) for row in cursor.fetchall()]

        return jsonify({"columns": columns, "sample_data": sample_rows})

    except sqlite3.Error as e:
        return jsonify({"error": str(e)}), 400

    finally:
        conn.close()

if __name__ == "__main__":
    app.run(port=5000, debug=True)
