"""
Quantum Observability - Entanglement Map Service
Defines causal relationships between system metrics for anomaly detection
"""

from typing import List, Dict, Optional

# Entanglement configuration mapping primary metrics to their causally-linked partners
ENTANGLEMENT_CONFIG: Dict[str, List[str]] = {
    # CPU usage anomalies are linked to user activity and API performance
    "cpu_usage": ["active_users", "api_latency_p99", "request_rate"],
    
    # Memory usage anomalies are linked to database and caching systems
    "memory_usage": ["database_connections", "cache_hit_rate", "garbage_collection_time"],
    
    # Disk usage anomalies affect I/O operations and backup systems
    "disk_usage": ["io_operations", "backup_status", "log_rotation"],
    
    # Network anomalies impact latency and throughput
    "network_io": ["api_latency_p95", "bandwidth_utilization", "packet_loss"],
    
    # Database performance affects multiple downstream metrics
    "database_connections": ["query_response_time", "connection_pool_usage", "deadlock_count"],
    
    # Cache performance impacts user experience metrics
    "cache_hit_rate": ["api_latency_p99", "user_session_duration", "page_load_time"],
    
    # User activity drives system load
    "active_users": ["cpu_usage", "memory_usage", "api_latency_p95"],
    
    # API latency affects user satisfaction
    "api_latency_p99": ["user_bounce_rate", "error_rate", "throughput"],
    
    # Error rates indicate system health
    "error_rate": ["api_latency_p95", "user_satisfaction", "system_uptime"],
    
    # Request rate drives resource consumption
    "request_rate": ["cpu_usage", "memory_usage", "database_connections"]
}

# Thresholds for anomaly detection
ANOMALY_THRESHOLDS: Dict[str, Dict[str, float]] = {
    "cpu_usage": {"critical": 90.0, "warning": 75.0},
    "memory_usage": {"critical": 85.0, "warning": 70.0},
    "disk_usage": {"critical": 90.0, "warning": 80.0},
    "network_io": {"critical": 1000.0, "warning": 800.0},  # MB/s
    "database_connections": {"critical": 80.0, "warning": 60.0},
    "cache_hit_rate": {"critical": 60.0, "warning": 75.0},  # Lower is worse
    "active_users": {"critical": 10000.0, "warning": 8000.0},
    "api_latency_p99": {"critical": 1000.0, "warning": 500.0},  # ms
    "error_rate": {"critical": 5.0, "warning": 2.0},  # percentage
    "request_rate": {"critical": 1000.0, "warning": 800.0}  # requests/second
}

def get_entangled_metrics(primary_metric: str) -> List[str]:
    """
    Get the list of metrics that are causally linked to the primary metric.
    
    Args:
        primary_metric: The metric key that triggered the anomaly
        
    Returns:
        List of metric keys that are entangled with the primary metric
    """
    return ENTANGLEMENT_CONFIG.get(primary_metric, [])

def detect_anomaly(metric_name: str, metric_value: float) -> Optional[str]:
    """
    Detect if a metric value indicates an anomaly.
    
    Args:
        metric_name: The name of the metric
        metric_value: The current value of the metric
        
    Returns:
        'critical' if critical threshold exceeded, 'warning' if warning threshold exceeded, None if normal
    """
    thresholds = ANOMALY_THRESHOLDS.get(metric_name)
    if not thresholds:
        return None
    
    if metric_value >= thresholds["critical"]:
        return "critical"
    elif metric_value >= thresholds["warning"]:
        return "warning"
    
    return None

def get_entanglement_analysis(metrics: Dict[str, float]) -> Dict[str, any]:
    """
    Analyze metrics for anomalies and return entanglement information.
    
    Args:
        metrics: Dictionary of metric names to their current values
        
    Returns:
        Dictionary containing anomaly detection results and entangled metrics
    """
    anomalies = {}
    entangled_metrics = set()
    
    # Check each metric for anomalies
    for metric_name, metric_value in metrics.items():
        anomaly_level = detect_anomaly(metric_name, metric_value)
        if anomaly_level:
            anomalies[metric_name] = {
                "level": anomaly_level,
                "value": metric_value,
                "threshold": ANOMALY_THRESHOLDS[metric_name][anomaly_level]
            }
            
            # Get entangled metrics for this anomaly
            entangled = get_entangled_metrics(metric_name)
            entangled_metrics.update(entangled)
    
    return {
        "anomalies": anomalies,
        "entangled_metrics": list(entangled_metrics),
        "has_anomalies": len(anomalies) > 0,
        "primary_anomaly": max(anomalies.keys()) if anomalies else None
    }

def get_metric_importance(metric_name: str) -> str:
    """
    Get the importance level of a metric for display purposes.
    
    Args:
        metric_name: The name of the metric
        
    Returns:
        'primary', 'secondary', or 'tertiary' based on system impact
    """
    primary_metrics = ["cpu_usage", "memory_usage", "disk_usage", "network_io"]
    secondary_metrics = ["database_connections", "cache_hit_rate", "active_users", "api_latency_p99"]
    
    if metric_name in primary_metrics:
        return "primary"
    elif metric_name in secondary_metrics:
        return "secondary"
    else:
        return "tertiary"
