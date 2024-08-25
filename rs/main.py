from svd_rs import *
import pandas as pd
from fastapi import FastAPI, HTTPException
import uvicorn
import psycopg
from apscheduler.schedulers.background import BackgroundScheduler
import random 
from dotenv import load_dotenv
import os

load_dotenv("../backend/.env")
app = FastAPI()

def get_raw_data():
    conn = psycopg.connect(host=os.getenv("HOST"),
                           dbname=os.getenv("DATABASE"),
                           user=os.getenv("USER"),
                           password=os.getenv("PASSWORD"),
                           port=os.getenv("DATABASE_PORT"))
    cur = conn.cursor()
    cur.execute("SELECT u.id, h.song_id, h.listening_times, h.liked FROM users u left join user_history h on u.id = h.user_id")
    rows = cur.fetchall()
    raw_data = pd.DataFrame(rows, columns=['user_id', 'song_id', 'listening_times', 'liked'])
    cur.close()
    conn.close()
    return raw_data

def get_song_details(song_ids):
    conn = psycopg.connect(host=os.getenv("HOST"),
                           dbname=os.getenv("DATABASE"),
                           user=os.getenv("USER"),
                           password=os.getenv("PASSWORD"),
                           port=os.getenv("DATABASE_PORT"))
    cur = conn.cursor()
    format_strings = ','.join(['%s'] * len(song_ids))
    query = f"""
    SELECT s.id, s.name, u.name as artist 
    FROM songs s 
    join users u on s.artist_id = u.id
    WHERE s.id IN ({format_strings})
    """
    cur.execute(query, tuple(song_ids))
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return {row[0]: {"name": row[1], "artist": row[2]} for row in rows}

def normalize_listening_time(listening_time, min_time, max_time):
    return 5 * (listening_time - min_time) / (max_time - min_time)

def get_rate_train(data):
    data['song_id'] = data['song_id'].fillna(random.randint(1,10))
    data = data.fillna(0)
    rate_train = data.to_numpy()
    min_time = rate_train[:, 2].min()
    max_time = rate_train[:, 2].max()
    for row in rate_train:
        normalized_time = normalize_listening_time(row[2], min_time, max_time)
        like_factor = 1 if row[3] else 0
        row[2] = normalized_time + like_factor 
    rate_train[:, :2] -= 1
    return rate_train

def update_model():
    global rs, rate_train, max_user_id
    data = get_raw_data()
    rate_train = get_rate_train(data)
    max_user_id = np.max(rate_train[:, 0]) + 1
    rs = SVD_RS(rate_train, K=10, user_based=1)
    rs.fit()
    print("Model updated successfully.")

update_model()

scheduler = BackgroundScheduler()
scheduler.add_job(update_model, 'interval', hours=24)
scheduler.start()

@app.get("/predict/{user_id}/{k}")
def get_prediction(user_id: int, k: int):
    if user_id <= 0:
        raise HTTPException(status_code=404, detail="User ID does not exist.")
    elif user_id > max_user_id:
        update_model()
    else:
        predictions = rs.top_k(user_id - 1, k)
        if predictions:
            song_details = get_song_details(predictions)
            result = [{"id": song_id, "name": song_details[song_id]["name"], "artist": song_details[song_id]["artist"]}
                    for song_id in predictions]
            return result
        else:
            raise HTTPException(status_code=404, detail="Can not get with invalid k.")

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)
