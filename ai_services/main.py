from flask import Flask, request, jsonify
from ai_services.anomaly_detector.detector import AnomalyDetector
from ai_services.logger.log_writer import write_log
from ai_services.recovery.recover import auto_recover

app = Flask(__name__)
detector = AnomalyDetector()  # <-- This was missing

@app.route('/analyze', methods=['POST'])
def analyze_traffic():
    data = request.get_json()
    ip = data.get('ip')
    short_code = data.get('short_code')
    user_agent = data.get('user_agent')

    print(f"[REQUEST] IP: {ip}, Short Code: {short_code}, Agent: {user_agent}")

    # Step 1: Detect Anomaly
    is_anomalous = detector.detect(ip, user_agent)

    # Step 2: Log every request
    write_log(ip, short_code, user_agent)

    # Step 3: Auto-Recovery (block IPs if over limit)
    recovery_result = auto_recover(ip)
    if recovery_result["action"] == "blocked":
        print(f"[RECOVERY] IP {ip} has been blocked: {recovery_result['reason']}")

    return jsonify({
        "ip": ip,
        "anomaly_detected": is_anomalous,
        "recovery_action": recovery_result
    })

if __name__ == '__main__':
    app.run(debug=True)
