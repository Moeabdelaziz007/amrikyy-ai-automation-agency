"""
Probabilistic Root Cause Analyzer
Inspired by quantum superposition principle for anomaly analysis
"""

from typing import Dict, List, Tuple
import math

def analyze_root_cause(metrics: Dict[str, float]) -> Dict[str, float]:
    """
    Analyze root cause probabilities based on metric combinations.
    Uses rule-based engine to determine potential causes and their probabilities.
    
    Args:
        metrics: Dictionary of metric names and their current values
        
    Returns:
        Dictionary of potential root causes with their probabilities (0.0-1.0)
    """
    probabilities = {}
    
    # CPU Usage Analysis
    cpu_usage = metrics.get("cpu_usage", 0)
    if cpu_usage > 90:
        probabilities["database_load"] = probabilities.get("database_load", 0) + 0.5
        probabilities["inefficient_query"] = probabilities.get("inefficient_query", 0) + 0.3
        probabilities["resource_exhaustion"] = probabilities.get("resource_exhaustion", 0) + 0.2
    elif cpu_usage > 75:
        probabilities["database_load"] = probabilities.get("database_load", 0) + 0.3
        probabilities["inefficient_query"] = probabilities.get("inefficient_query", 0) + 0.2
    
    # Memory Usage Analysis
    memory_usage = metrics.get("memory_usage", 0)
    if memory_usage > 85:
        probabilities["memory_leak"] = probabilities.get("memory_leak", 0) + 0.4
        probabilities["database_load"] = probabilities.get("database_load", 0) + 0.3
        probabilities["resource_exhaustion"] = probabilities.get("resource_exhaustion", 0) + 0.3
    elif memory_usage > 70:
        probabilities["memory_leak"] = probabilities.get("memory_leak", 0) + 0.2
        probabilities["database_load"] = probabilities.get("database_load", 0) + 0.2
    
    # API Latency Analysis
    api_latency = metrics.get("api_latency_p99", 0)
    if api_latency > 800:
        probabilities["network_issue"] = probabilities.get("network_issue", 0) + 0.4
        probabilities["database_load"] = probabilities.get("database_load", 0) + 0.4
        probabilities["inefficient_query"] = probabilities.get("inefficient_query", 0) + 0.2
    elif api_latency > 500:
        probabilities["network_issue"] = probabilities.get("network_issue", 0) + 0.2
        probabilities["database_load"] = probabilities.get("database_load", 0) + 0.3
    
    # Network I/O Analysis
    network_io = metrics.get("network_io", 0)
    if network_io > 1000:
        probabilities["network_issue"] = probabilities.get("network_issue", 0) + 0.3
        probabilities["ddos_attack"] = probabilities.get("ddos_attack", 0) + 0.2
        probabilities["high_traffic"] = probabilities.get("high_traffic", 0) + 0.3
    
    # Active Users Analysis
    active_users = metrics.get("active_users", 0)
    if active_users > 10000:
        probabilities["high_traffic"] = probabilities.get("high_traffic", 0) + 0.4
        probabilities["database_load"] = probabilities.get("database_load", 0) + 0.3
        probabilities["resource_exhaustion"] = probabilities.get("resource_exhaustion", 0) + 0.2
    
    # Database Connections Analysis
    db_connections = metrics.get("database_connections", 0)
    if db_connections > 80:
        probabilities["database_load"] = probabilities.get("database_load", 0) + 0.5
        probabilities["connection_pool_exhaustion"] = probabilities.get("connection_pool_exhaustion", 0) + 0.3
    
    # Cache Hit Rate Analysis
    cache_hit_rate = metrics.get("cache_hit_rate", 100)
    if cache_hit_rate < 50:
        probabilities["cache_miss"] = probabilities.get("cache_miss", 0) + 0.4
        probabilities["database_load"] = probabilities.get("database_load", 0) + 0.3
    elif cache_hit_rate < 65:
        probabilities["cache_miss"] = probabilities.get("cache_miss", 0) + 0.2
    
    # Error Rate Analysis
    error_rate = metrics.get("error_rate", 0)
    if error_rate > 5.0:
        probabilities["application_bug"] = probabilities.get("application_bug", 0) + 0.4
        probabilities["database_load"] = probabilities.get("database_load", 0) + 0.2
        probabilities["resource_exhaustion"] = probabilities.get("resource_exhaustion", 0) + 0.2
    elif error_rate > 2.0:
        probabilities["application_bug"] = probabilities.get("application_bug", 0) + 0.2
    
    # Disk Usage Analysis
    disk_usage = metrics.get("disk_usage", 0)
    if disk_usage > 90:
        probabilities["disk_space"] = probabilities.get("disk_space", 0) + 0.4
        probabilities["log_overflow"] = probabilities.get("log_overflow", 0) + 0.3
    elif disk_usage > 80:
        probabilities["disk_space"] = probabilities.get("disk_space", 0) + 0.2
    
    # Normalize probabilities to sum to 1.0
    total = sum(probabilities.values())
    if total > 0:
        normalized = {cause: round(p / total, 3) for cause, p in probabilities.items()}
        # Sort by probability (highest first)
        return dict(sorted(normalized.items(), key=lambda x: x[1], reverse=True))
    
    return {}

def get_superposition_confidence(probabilities: Dict[str, float]) -> float:
    """
    Calculate confidence level based on probability distribution.
    Higher confidence when probabilities are more concentrated.
    
    Args:
        probabilities: Dictionary of cause probabilities
        
    Returns:
        Confidence level (0.0-1.0)
    """
    if not probabilities:
        return 0.0
    
    # Calculate entropy (lower entropy = higher confidence)
    entropy = -sum(p * math.log2(p) for p in probabilities.values() if p > 0)
    max_entropy = math.log2(len(probabilities))
    
    # Convert entropy to confidence (0-1 scale)
    confidence = 1.0 - (entropy / max_entropy) if max_entropy > 0 else 1.0
    return round(confidence, 3)

def get_quantum_recommendations(probabilities: Dict[str, float]) -> List[str]:
    """
    Generate quantum-inspired recommendations based on probabilities.
    
    Args:
        probabilities: Dictionary of cause probabilities
        
    Returns:
        List of recommended actions
    """
    recommendations = []
    
    for cause, prob in probabilities.items():
        if prob > 0.3:  # High probability causes
            if cause == "database_load":
                recommendations.append("🔍 Investigate slow queries and database performance")
            elif cause == "network_issue":
                recommendations.append("🌐 Check network connectivity and latency")
            elif cause == "memory_leak":
                recommendations.append("🧠 Monitor memory usage patterns and garbage collection")
            elif cause == "high_traffic":
                recommendations.append("📈 Consider scaling resources or implementing rate limiting")
            elif cause == "cache_miss":
                recommendations.append("⚡ Optimize cache configuration and hit rates")
            elif cause == "application_bug":
                recommendations.append("🐛 Review recent deployments and error logs")
            elif cause == "resource_exhaustion":
                recommendations.append("⚙️ Scale up system resources")
            elif cause == "disk_space":
                recommendations.append("💾 Clean up disk space and optimize storage")
    
    return recommendations[:3]  # Return top 3 recommendations
