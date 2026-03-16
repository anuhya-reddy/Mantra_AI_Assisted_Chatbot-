import sqlite3
from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key="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",
)
from flask import Flask, render_template, jsonify, request
import json

from datetime import datetime

# Tell Flask where frontend files are
app = Flask(
    __name__,
    template_folder="frontend",
    static_folder="frontend"
)
# ==============================
# DATABASE INITIALIZATION
# ==============================

def init_db():
    conn = sqlite3.connect("chatbot.db")
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            role TEXT,
            name TEXT,
            specialization TEXT,
            mobile TEXT,
            selected_patch TEXT,
            created_at TEXT
        )
    """)

    conn.commit()
    conn.close()

# Run database setup when app starts
init_db()

# ==============================
# ROUTE: HOME PAGE
# ==============================

@app.route("/")
def home():
    return render_template("index.html")


# ==============================
# ROUTE: GET THERAPIES DATA
# ==============================

@app.route("/api/therapies", methods=["GET"])
def get_therapies():
    try:
        file_path = os.path.join(app.static_folder, "therapies.json")
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ==============================
# ROUTE: SAVE USER DATA
# ==============================

@app.route("/api/save-user", methods=["POST"])
def save_user():
    try:
        user_data = request.json

        role = user_data.get("role")
        name = user_data.get("name")
        specialization = user_data.get("specialization")
        mobile = user_data.get("mobile")
        selected_patch = user_data.get("selectedPatch")

        conn = sqlite3.connect("chatbot.db")
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO users (
                role,
                name,
                specialization,
                mobile,
                selected_patch,
                created_at
            )
            VALUES (?, ?, ?, ?, ?, ?)
        """, (
            role,
            name,
            specialization,
            mobile,
            selected_patch,
            datetime.now().isoformat()
        ))

        conn.commit()
        user_id = cursor.lastrowid
        conn.close()

        return jsonify({
            "message": "User data saved successfully",
            "user_id": user_id
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500





@app.route("/api/ai-answer", methods=["POST"])
def ai_answer():
    try:
        data = request.json
        question = data.get("question")
        base_answer = data.get("base_answer")
        language = data.get("language")

        
        # Convert short code to full language name
        if language == "hi":
            lang_text = "Hindi"
        elif language == "te":
            lang_text = "Telugu"
        else:
            lang_text = "English"

                # ==============================
        # SELF-ASSESSMENT MODE
        # ==============================

        if data.get("assessment"):

            score = data.get("score")
            dose = data.get("dose")
            safety = data.get("safetyFlag")
            relapse = data.get("relapseFlag")

            if score <= 2:
                level = "Low"
            elif score <= 5:
                level = "Moderate"
            else:
                level = "High"

            prompt = f"""
You are a clinical smoking cessation assistant.

Assessment results:
Nicotine dependence score: {score}
Dependence level: {level}
Recommended starting dose: {dose}
Safety concerns present: {safety}
Relapse risk present: {relapse}

Generate a professional clinical recommendation including:
- Dependence interpretation
- Starting Nitof dose explanation
- 12-week structured step-down plan
- Combination therapy advice if relapse risk is true and score >=6
- Safety advisory if safety concerns are present

Do not use markdown.
Do not use headings.
Use plain text only.
Respond fully in {lang_text}.
"""

            response = client.chat.completions.create(
                model="openai/gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3,
            )

            return jsonify({
                "answer": response.choices[0].message.content
            })

        #  CONDITION LOGIC
        if base_answer and base_answer.strip() != question.strip():

            prompt = f"""
You are a medical assistant chatbot for patch therapy.

Rewrite the following answer professionally and medically accurately.

Base Answer:
{base_answer}

Rules:
- Do not add commentary.
- Do not mention rewriting.
- Keep meaning unchanged.
- Provide only the final polished answer.
- Do not use markdown.
- Do not use **bold** formatting.
- Do not use ### headings.
- Use plain text only.
- Provide the answer in visually appealing bullet points manner.
- Respond fully in {lang_text}.
"""

        else:

            prompt = f"""
You are a medical assistant chatbot specialized in patch therapy.

Answer the following question professionally and medically accurately.

Question:
{question}

Rules:
- Be clear and professional.
- Stay within nicotine patch therapy context.
- Do not use markdown.
- Do not use **bold** formatting.
- Do not use ### headings.
- Use plain text only.
- Respond fully in {lang_text}.
"""

        response = client.chat.completions.create(
            model="openai/gpt-3.5-turbo",
            messages=[
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
        )

        return jsonify({
            "answer": response.choices[0].message.content
        })

    except Exception as e:
        print("AI ERROR:", str(e))
        return jsonify({"error": str(e)}), 500
    
@app.route("/check-users")
def check_users():
    conn = sqlite3.connect("chatbot.db")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users")
    rows = cursor.fetchall()
    conn.close()
    return {"data": rows}   
    


# ==============================
# RUN SERVER
# ==============================

@app.route("/api/update-patch", methods=["POST"])
def update_patch():
    try:
        data = request.json
        user_id = data.get("user_id")
        selected_patch = data.get("selected_patch")

        conn = sqlite3.connect("chatbot.db")
        cursor = conn.cursor()

        cursor.execute("""
            UPDATE users
            SET selected_patch = ?
            WHERE id = ?
        """, (selected_patch, user_id))

        conn.commit()
        conn.close()

        return jsonify({"message": "Patch updated"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route("/api/metrics")
def get_metrics():

    conn = sqlite3.connect("chatbot.db")
    cursor = conn.cursor()

    # 1️ Total Users
    cursor.execute("SELECT COUNT(*) FROM users")
    total_users = cursor.fetchone()[0]

    # 2️ Role Distribution
    cursor.execute("""
        SELECT role, COUNT(*)
        FROM users
        GROUP BY role
    """)
    role_data = dict(cursor.fetchall())

    doctor_count = role_data.get("doctor", 0)
    consumer_count = role_data.get("consumer", 0)

    if total_users > 0:
        doctor_percentage = round((doctor_count / total_users) * 100, 2)
        consumer_percentage = round((consumer_count / total_users) * 100, 2)
    else:
        doctor_percentage = 0
        consumer_percentage = 0

    # 3️ Patch Distribution
    cursor.execute("""
        SELECT selected_patch, COUNT(*)
        FROM users
        WHERE selected_patch IS NOT NULL AND selected_patch != ''
        GROUP BY selected_patch
    """)
    patch_data = dict(cursor.fetchall())

    if patch_data:
        most_popular_patch = max(patch_data, key=patch_data.get)
    else:
        most_popular_patch = None

    # 4️ Specialization Distribution
    cursor.execute("""
        SELECT specialization, COUNT(*)
        FROM users
        WHERE specialization IS NOT NULL AND specialization != ''
        GROUP BY specialization
    """)
    specialization_data = dict(cursor.fetchall())

    if specialization_data:
        top_specialization = max(specialization_data, key=specialization_data.get)
    else:
        top_specialization = None

    # 5️ Patch by Role
    cursor.execute("""
        SELECT role, selected_patch, COUNT(*)
        FROM users
        WHERE selected_patch IS NOT NULL AND selected_patch != ''
        GROUP BY role, selected_patch
    """)
    patch_role_data = cursor.fetchall()

    # 6️ Doctor Patch Preference
    cursor.execute("""
        SELECT selected_patch, COUNT(*)
        FROM users
        WHERE role = 'doctor'
        AND selected_patch IS NOT NULL
        GROUP BY selected_patch
    """)
    doctor_patch_data = dict(cursor.fetchall())

    # 7️ Consumer Patch Preference
    cursor.execute("""
        SELECT selected_patch, COUNT(*)
        FROM users
        WHERE role = 'consumer'
        AND selected_patch IS NOT NULL
        GROUP BY selected_patch
    """)
    consumer_patch_data = dict(cursor.fetchall())

    conn.close()

    return jsonify({
        "total_users": total_users,
        "role_distribution": role_data,
        "doctor_percentage": doctor_percentage,
        "consumer_percentage": consumer_percentage,
        "patch_distribution": patch_data,
        "most_popular_patch": most_popular_patch,
        "specialization_distribution": specialization_data,
        "top_specialization": top_specialization,
        "patch_by_role": patch_role_data,
        "doctor_patch_distribution": doctor_patch_data,
        "consumer_patch_distribution": consumer_patch_data
    })

@app.route("/api/ai-dashboard-blueprint", methods=["GET"])
def ai_dashboard_blueprint():
    try:
        conn = sqlite3.connect("chatbot.db")
        cursor = conn.cursor()

        # Collect metrics
        cursor.execute("SELECT COUNT(*) FROM users")
        total_users = cursor.fetchone()[0]

        cursor.execute("""
            SELECT role, COUNT(*)
            FROM users
            GROUP BY role
        """)
        role_data = dict(cursor.fetchall())

        cursor.execute("""
            SELECT selected_patch, COUNT(*)
            FROM users
            WHERE selected_patch IS NOT NULL AND selected_patch != ''
            GROUP BY selected_patch
        """)
        patch_data = dict(cursor.fetchall())

        cursor.execute("""
            SELECT specialization, COUNT(*)
            FROM users
            WHERE specialization IS NOT NULL AND specialization != ''
            GROUP BY specialization
        """)
        specialization_data = dict(cursor.fetchall())

        conn.close()

        metrics_payload = {
            "total_users": total_users,
            "role_distribution": role_data,
            "patch_distribution": patch_data,
            "specialization_distribution": specialization_data
        }

        prompt = f"""
You are a senior business intelligence dashboard architect.

Given this analytics data:

{metrics_payload}

Your task:
Design a professional executive dashboard blueprint.

Rules:
- Return STRICT valid JSON.
- No markdown.
- No explanation.
- No backticks.
- Only raw JSON.
- Include atleast 4 KPIs and 4 charts 
- Make it colourful and visually appealing 

You may include:
- Multiple KPIs
- Multiple charts
- Pie, bar, line charts
- Role comparison
- Specialization analysis

Available data keys:
-total_users
-role_distribution
-doctor_percentage
-consumer_percentage
-patch_distribution
-most_popular_patch
-specialization_distribution
-top_specialization
-patch_by_role
-doctor_patch_distribution
-consumer_patch_distribution

Format:

{{
  "kpis": ["metric_key1", "metric_key2"],
  "charts": [
      {{
        "type": "bar | pie | line",
        "data_key": "existing_metric_key",
        "title": "Chart Title"
      }}
  ]
}}
"""

        response = client.chat.completions.create(
            model="openai/gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
        )

        blueprint_text = response.choices[0].message.content.strip()

        # SAFELY parse AI JSON
        try:
            blueprint_json = json.loads(blueprint_text)
            return jsonify(blueprint_json)
        except Exception:
            return jsonify({
                "error": "AI returned invalid JSON",
                "raw_output": blueprint_text
            }), 500

    except Exception as e:
        return jsonify({"error": str(e)}), 500
 

if __name__ == "__main__":
    app.run(debug=True)
