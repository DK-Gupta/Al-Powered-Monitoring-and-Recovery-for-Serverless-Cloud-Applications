# ai-service/anomaly-detector/detector.py

import time

class AnomalyDetector:
    def __init__(self):
        self.request_counts = {}
        self.time_window = 60  # seconds
        self.threshold = 20    # max requests allowed per IP in time_window

    def is_anomalous(self, ip_address):
        current_time = time.time()

        if ip_address not in self.request_counts:
            self.request_counts[ip_address] = []

        # Filter old requests
        recent_requests = [
            t for t in self.request_counts[ip_address]
            if current_time - t < self.time_window
        ]
        recent_requests.append(current_time)

        self.request_counts[ip_address] = recent_requests

        return len(recent_requests) > self.threshold

    def detect(self, ip_address, user_agent):
        # You can add user_agent-based checks too if needed
        return self.is_anomalous(ip_address)
