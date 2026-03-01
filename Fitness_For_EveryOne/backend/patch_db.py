import sqlite3
import os

db_path = "c:\\Users\\bhanu\\Documents\\Fitness_For_EveryOne\\backend\\fitness.db"
if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    try:
        cur.execute("ALTER TABLE users ADD COLUMN medical_conditions TEXT;")
        conn.commit()
        print("Successfully added medical_conditions column.")
    except Exception as e:
        print(f"Error (column might already exist): {e}")
    conn.close()
else:
    print("Database file not found.")
