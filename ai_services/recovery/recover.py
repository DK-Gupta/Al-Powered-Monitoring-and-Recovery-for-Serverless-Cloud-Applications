import time
from ai_services.logger.log_writer import write_log as log_anomaly
from ai_services.utils import block_ip

# Define threshold
MAX_REQUESTS_PER_MIN = 5  # Lowered for testing

# Store per-IP timestamps
request_log = {}
blocked_ips = {}

def auto_recover(source_ip):
    current_time = time.time()
    window_start = current_time - 60  # 60-second sliding window

    # Initialize for new IP
    if source_ip not in request_log:
        request_log[source_ip] = []

    # Remove old timestamps
    request_log[source_ip] = [ts for ts in request_log[source_ip] if ts > window_start]

    # Append new timestamp
    request_log[source_ip].append(current_time)

    if len(request_log[source_ip]) > MAX_REQUESTS_PER_MIN:
        if source_ip not in blocked_ips:
            block_ip(source_ip)
            log_anomaly(source_ip, "Auto-block triggered due to request flooding")
            blocked_ips[source_ip] = current_time
        return {
            "action": "blocked",
            "reason": "Exceeded allowed requests per minute"
        }

    return {
        "action": "allowed"
    }
