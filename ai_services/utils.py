import re

# Simulated in-memory blocked IP list (in production, use a persistent store)
BLOCKED_IPS = set()

def is_valid_url(url):
    """
    Validates if a given string is a valid URL.
    """
    regex = re.compile(
        r'^(https?://)'  # http:// or https://
        r'(([A-Za-z0-9.-]+)\.([A-Za-z]{2,6}))'  # domain
        r'(:\d+)?'  # optional port
        r'(/.*)?$',  # path
        re.IGNORECASE
    )
    return re.match(regex, url) is not None

def block_ip(ip):

    print(f"[BLOCKED] IP {ip} is now blocked (simulated).")

    BLOCKED_IPS.add(ip)

def is_blocked(ip):
    """
    Check if the IP is currently blocked.
    """
    return ip in BLOCKED_IPS

def get_request_meta(request):
    """
    Extract useful metadata like IP and user-agent from a simulated request object.
    """
    return {
        "ip": request.get("ip", "unknown"),
        "user_agent": request.get("user_agent", "unknown"),
        "timestamp": request.get("timestamp", "unknown"),
    }
