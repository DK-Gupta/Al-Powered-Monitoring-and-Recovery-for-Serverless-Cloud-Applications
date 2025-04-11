import os
from datetime import datetime

# ✅ Define directory and file path for logs
LOG_DIR = "ai_services/logger"
os.makedirs(LOG_DIR, exist_ok=True)

LOG_FILE = os.path.join(LOG_DIR, "logs.txt")

def write_log(*args):
    timestamp = datetime.utcnow().isoformat()

    if len(args) == 3:
        # Access log: IP + short code + user agent
        ip, short_code, user_agent = args
        log_line = f"{timestamp} | ACCESS | IP: {ip}, SHORT_CODE: {short_code}, USER_AGENT: {user_agent}\n"
    elif len(args) == 2:
        # Anomaly or custom log
        event_type, details = args
        log_line = f"{timestamp} | {event_type.upper()} | {details}\n"
    else:
        log_line = f"{timestamp} | INVALID_LOG_FORMAT | args={args}\n"

    with open(LOG_FILE, "a") as f:
        f.write(log_line)

def read_logs():
    if not os.path.exists(LOG_FILE):
        return []

    with open(LOG_FILE, "r") as f:
        return f.readlines()
