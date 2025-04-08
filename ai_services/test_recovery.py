# test_recovery.py

from ai_services.recovery.recover import auto_recover

test_ip = "192.168.1.100"

# Simulate 101 rapid requests from the same IP
for i in range(101):
    result = auto_recover(test_ip)
    print(f"Request #{i+1}: {result}")

# 1st 100 should be allowed, 101st should be blocked
