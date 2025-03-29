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