import os
from datetime import datetime

LOG_DIR = "ai-service/logs"
os.makedirs(LOG_DIR, exist_ok=True)

def write_log(*args):
    log_file = os.path.join(LOG_DIR, f"{datetime.utcnow().date()}.log")
    timestamp = datetime.utcnow().isoformat()

    if len(args) == 3:
        # Access log format
        ip, short_code, user_agent = args
        log_line = f"{timestamp} | ACCESS | IP: {ip}, SHORT_CODE: {short_code}, USER_AGENT: {user_agent}\n"
    elif len(args) == 2:
        # Anomaly or custom log
        event_type, details = args
        log_line = f"{timestamp} | {event_type.upper()} | {details}\n"
    else:
        log_line = f"{timestamp} | INVALID_LOG_FORMAT | args={args}\n"

    with open(log_file, "a") as f:
        f.write(log_line)

def read_logs():
    logs = []
    if not os.path.exists(LOG_DIR):
        return logs

    for filename in os.listdir(LOG_DIR):
        filepath = os.path.join(LOG_DIR, filename)
        with open(filepath, "r") as f:
            logs.extend(f.readlines())
    return logs
