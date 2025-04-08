
from flask import Flask, request, jsonify
from ai_services.anomaly_detector.detector import AnomalyDetector
from ai_services.logger.log_writer import write_log
from ai_services.monitor.monitor import record_access
from ai_services.recovery.recover import auto_recover

app = Flask(__name__)
detector = AnomalyDetector()

@app.route('/analyze', methods=['POST'])
def process_request():
    data = request.get_json()

    url_id = data.get('id')
    ip = data.get('ip', 'unknown')
    user_agent = data.get('user_agent', '')

    is_anomaly = detector.is_anomalous(ip)
    write_log("access", f"{ip} | {url_id} | {user_agent}")
    record_access(url_id, ip)

    recovery_action = {}
    if is_anomaly:
        write_log("anomaly", f"{ip} triggered anomaly detection")
        recovery_action = auto_recover(ip)

    return jsonify({
        'anomaly': is_anomaly,
        'recovery_action': recovery_action
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
