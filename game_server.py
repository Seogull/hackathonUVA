from fastapi import FastAPI, WebSocket, WebSocketDisconnect
import asyncio
import time

app = FastAPI()
clients: Dict[str, WebSocket] = {}
turn_order = ["player1", "player2"]
current_turn_index = 0
current_combo = None
combo_sender = None
combo_start_time = None
rounds_played = 0
max_rounds = 4

completion_times: Dict[str, List[float]] = { # Score/time of each player
    "player1": [],
    "player2": []
}

def get_opponent(client_id: str): #get opponent of current player
    if client_id == "player1":
        return "player2"
    else:
        return "player1"