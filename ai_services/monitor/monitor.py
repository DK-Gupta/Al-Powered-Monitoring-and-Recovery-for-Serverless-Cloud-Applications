# monitor.py
import json
from datetime import datetime, timedelta
from collections import defaultdict
import os

# Safer absolute path
METRICS_FILE = os.path.join(os.path.dirname(__file__), 'metrics.json')


# Phase 2: Record access
def record_access(ip, user_agent):
    data = {}
    if os.path.exists(METRICS_FILE):
        with open(METRICS_FILE, 'r') as f:
            try:
                data = json.load(f)
            except json.JSONDecodeError:
                data = {}
    
    if 'requests' not in data:
        data['requests'] = []

    data['requests'].append({
        "timestamp": datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"),
        "ip": ip,
        "user_agent": user_agent
    })

    with open(METRICS_FILE, 'w') as f:
        json.dump(data, f, indent=2)

# Phase 3: Analyze metrics
def load_metrics(file_path=METRICS_FILE):
    with open(file_path, 'r') as f:
        data = json.load(f)
    return data.get('requests', [])

def analyze_metrics(metrics):
    request_count_per_ip = defaultdict(int)
    now = datetime.utcnow()
    time_window = timedelta(minutes=10)

    for entry in metrics:
        try:
            timestamp = datetime.strptime(entry['timestamp'], "%Y-%m-%dT%H:%M:%SZ")
        except ValueError:
            try:
                timestamp = datetime.strptime(entry['timestamp'], "%Y-%m-%dT%H:%M:%S.%f")
            except ValueError:
                continue  # skip bad format

        if now - timestamp <= time_window:
            request_count_per_ip[entry['ip']] += 1

    anomalies = {ip: count for ip, count in request_count_per_ip.items() if count > 5}
    return anomalies


# Phase 4: Provide metrics externally
def get_metrics():
    return load_metrics()


if __name__ == "__main__":
    metrics = load_metrics()
    anomalies = analyze_metrics(metrics)

    if anomalies:
        print("🚨 Anomalies detected:")
        for ip, count in anomalies.items():
            print(f"IP: {ip} made {count} requests in the last 10 minutes")
    else:
        print("✅ No anomalies detected.")
