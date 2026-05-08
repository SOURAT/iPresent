import cv2
import numpy as np
import json
import base64
import face_recognition
from pathlib import Path
from PIL import Image
import io
from config import DATASET_DIR, MODEL_PATH, LABEL_MAP_PATH, FACE_MATCH_THRESHOLD

def _decode_base64_image(data_uri: str) -> np.ndarray:
    if "," in data_uri:
        data_uri = data_uri.split(",", 1)[1]
    raw = base64.b64decode(data_uri)
    img = Image.open(io.BytesIO(raw)).convert("RGB")
    return np.array(img)

def train_from_dataset():
    encodings_list = []
    names_list = []
    label_map = {}
    next_label = 0

    for person_dir in sorted(Path(DATASET_DIR).iterdir()):
        if not person_dir.is_dir():
            continue
        person_name = person_dir.name
        label_map[next_label] = person_name

        for img_path in person_dir.glob("*"):
            if img_path.suffix.lower() not in (".jpg", ".jpeg", ".png"):
                continue
            img = face_recognition.load_image_file(str(img_path))
            encs = face_recognition.face_encodings(img)
            if not encs:
                continue
            encodings_list.append(encs[0].tolist())
            names_list.append(person_name)

        next_label += 1

    data = {"encodings": encodings_list, "names": names_list}
    LABEL_MAP_PATH.write_text(json.dumps(data))
    return len(encodings_list), label_map

def load_recognizer():
    if not LABEL_MAP_PATH.exists():
        return [], []
    data = json.loads(LABEL_MAP_PATH.read_text())
    if "encodings" not in data:
        return [], []
    encodings = [np.array(e) for e in data["encodings"]]
    names = data["names"]
    return encodings, names

def recognize_frame(data_uri: str):
    known_encodings, known_names = load_recognizer()
    rgb = _decode_base64_image(data_uri)
    face_locations = face_recognition.face_locations(rgb)
    face_encodings = face_recognition.face_encodings(rgb, face_locations)
    out = {"faces": [], "snapshot_b64": None}

    for (top, right, bottom, left), face_enc in zip(face_locations, face_encodings):
        name, confidence, status = "Unknown", 0.0, "unknown"

        if known_encodings:
            distances = face_recognition.face_distance(known_encodings, face_enc)
            best_idx = np.argmin(distances)
            best_distance = distances[best_idx]
            threshold = FACE_MATCH_THRESHOLD / 100.0

            if best_distance < threshold:
                name = known_names[best_idx]
                confidence = round((1 - best_distance) * 100, 2)
                status = "recognized"

        if status == "unknown" and out["snapshot_b64"] is None:
            face_color = cv2.cvtColor(rgb[top:bottom, left:right], cv2.COLOR_RGB2BGR)
            _, buf = cv2.imencode(".jpg", face_color)
            out["snapshot_b64"] = base64.b64encode(buf).decode()

        out["faces"].append({
            "box": {"x": left, "y": top, "w": right - left, "h": bottom - top},
            "name": name,
            "confidence": confidence,
            "status": status,
        })

    return out

def add_face_to_dataset(person_name: str, snapshot_b64: str):
    person_dir = DATASET_DIR / person_name
    person_dir.mkdir(exist_ok=True, parents=True)
    existing = list(person_dir.glob("*.jpg"))
    new_path = person_dir / f"{person_name}_{len(existing) + 1}.jpg"
    new_path.write_bytes(base64.b64decode(snapshot_b64))
    count, _ = train_from_dataset()
    return count, str(new_path)