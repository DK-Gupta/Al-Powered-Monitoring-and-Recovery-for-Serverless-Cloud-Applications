# ai_services/dashboard/dashboard.py

from ai_services.monitor.monitor import load_metrics, analyze_metrics
from ai_services.logger.log_writer import read_logs
import datetime

def display_anomalies():
    print("\n🔍 Anomalies in Last 10 Minutes")
    print("-" * 40)
    metrics = load_metrics()
    anomalies = analyze_metrics(metrics)

    if not anomalies:
        print("✅ No anomalies found.")
    else:
        for ip, count in anomalies.items():
            print(f"🚨 IP: {ip} made {count} requests")

def display_logs():
    print("\n📜 System Logs")
    print("-" * 40)
    logs = read_logs()
    if not logs:
        print("🟢 No logs yet.")
    else:
        for entry in logs[-10:]:  # Show only last 10 entries
            print(entry.strip())

def display_dashboard():
    print("=" * 50)
    print("📊 AI Link Shortener Monitoring Dashboard")
    print(f"🕒 {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 50)

    display_anomalies()
    display_logs()

if __name__ == "__main__":
    display_dashboard()
