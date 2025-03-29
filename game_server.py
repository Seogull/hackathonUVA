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

def get_opponent(client_id: str):  # get opponent of current player
    if client_id == "player1":
        return "player2"
    else:
        return "player1"

    try:
        while rounds_played < max_rounds:
            current_turn = turn_order[current_turn_index % 2]
            if client_id == current_turn:
                await websocket.send_text(f" Round {rounds_played + 1}: Your turn to send a 4-move combo (10s)...")

                try:
                    combo_task = asyncio.create_task(websocket.receive_text())
                    done, _ = await asyncio.wait({combo_task}, timeout=10, return_when=asyncio.FIRST_COMPLETED)

                    if combo_task in done:
                        combo = combo_task.result().split(",")

                        if len(combo) != 4:
                            await websocket.send_text("Combo must have exactly 4 moves.")
                            continue

                        current_combo = combo
                        combo_sender = client_id
                        opponent_id = get_opponent(client_id)
                        await websocket.send_text(f" Combo set: {','.join(combo)}")
                        await clients[opponent_id].send_text(f" {client_id} sent you a combo. Type the combo.")
                    else:
                        # Timeout: combo not sent in 10 seconds
                        await websocket.send_text("Time's up. You missed your turn.")
                        combo_sender = None
                        current_combo = None
                        rounds_played += 1
                        current_turn_index += 1
                        continue  # Skip to next round

                    # Switch to the other player's turn (to replicate combo)
                    current_turn_index += 1

					



		   
