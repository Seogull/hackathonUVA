'''''
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
                        combo_start_time = time.time()
                    else:
                        await websocket.send_text("Time's up. You missed your turn.")
                        combo_sender = None
                        current_combo = None
                        rounds_played += 1
                        current_turn_index += 1
                        continue  # Skip to next round

                    current_turn_index += 1
                except Exception as e:
                    await websocket.send_text(f"Error: {str(e)}")
            elif combo_sender and current_combo:
                msg =  await websocket.receive_text()
                attempted_combo = msg.split(",")
                time_taken = round(time.time() - combo_start_time,2)
                
                if attempted_combo == current_combo:
                    await websocket.send_text(f"Correct! You took {time_taken}s")
                    await clients[combo_sender].send_text(f"{client_id} completed your combo in {time_taken}s!")
                    completion_times[client_id].append(time_taken)
                else:
                    await websocket.send_text(f"Incorrect! Wrong combo")
                    await clients[combo_sender].send_text(f"{client_id} failed your combo")
                    completion_times[client_id].append(15.0)
                current_combo = None
                combo_sender = None
                combo_start_time = None
                
                rounds_player += 1
                current_turn_index += 1
        await competetion_winner()
    except WebSocketDisconnect:
        clients.pop(client_id, None)
        
async def declare_winner():
    p1_time = sum(completion_times["player1"])
    p2_time = sum(completion_times["player2"])

    result = "🏁 Game Over!\n"
    result += f"player1: {p1_time:.2f}s total\n"
    result += f"player2: {p2_time:.2f}s total\n"

    # Determine winner
    if p1_time < p2_time:
        result += "Winner: player1!"
    elif p2_time < p1_time:
        result += "Winner: player2!"
    else:
        result += " t's a tie!"

    # Send result to both players directly
    if "player1" in clients:
        await clients["player1"].send_text(result)
    if "player2" in clients:
        await clients["player2"].send_text(result)

                    
                    
                     
''''