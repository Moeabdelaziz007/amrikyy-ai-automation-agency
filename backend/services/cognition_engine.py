"""
Quantum Cognition Engine
Parallel analysis engine for definitive root cause investigation
"""

import asyncio
import logging
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime

from services.cognition_agents import get_check_function

logger = logging.getLogger(__name__)

class CognitionResult:
    """Result of a single cognition agent investigation"""
    def __init__(self, cause: str, confirmed: bool, details: str, severity: str, duration: float):
        self.cause = cause
        self.confirmed = confirmed
        self.details = details
        self.severity = severity
        self.duration = duration
        self.timestamp = datetime.now()

class CognitionAnalysis:
    """Complete analysis result from parallel cognition agents"""
    def __init__(self):
        self.results: List[CognitionResult] = []
        self.confirmed_causes: List[CognitionResult] = []
        self.primary_cause: Optional[CognitionResult] = None
        self.confidence: float = 0.0
        self.total_duration: float = 0.0
        self.timestamp = datetime.now()

    def add_result(self, result: CognitionResult):
        """Add a cognition result"""
        self.results.append(result)
        if result.confirmed:
            self.confirmed_causes.append(result)

    def finalize(self):
        """Finalize the analysis and determine primary cause"""
        if not self.results:
            return

        # Calculate total duration
        self.total_duration = max(result.duration for result in self.results)

        # Determine primary cause (highest severity among confirmed causes)
        if self.confirmed_causes:
            severity_order = {"critical": 4, "high": 3, "medium": 2, "low": 1}
            self.primary_cause = max(
                self.confirmed_causes,
                key=lambda r: severity_order.get(r.severity, 0)
            )

        # Calculate confidence based on number of confirmed causes
        total_causes = len(self.results)
        confirmed_count = len(self.confirmed_causes)
        
        if total_causes > 0:
            # Higher confidence when fewer causes are confirmed (more definitive)
            self.confidence = 1.0 - (confirmed_count / total_causes) * 0.5
            self.confidence = max(0.0, min(1.0, self.confidence))

async def run_parallel_analysis(probabilities: Dict[str, float]) -> CognitionAnalysis:
    """
    Run parallel analysis on all potential root causes
    
    Args:
        probabilities: Dictionary of cause names and their probabilities
        
    Returns:
        CognitionAnalysis object with investigation results
    """
    if not probabilities:
        logger.warning("No probabilities provided for cognition analysis")
        return CognitionAnalysis()

    logger.info(f"Starting parallel cognition analysis for {len(probabilities)} potential causes")
    
    analysis = CognitionAnalysis()
    
    # Create tasks for each potential cause
    tasks = []
    cause_names = []
    
    for cause_name, probability in probabilities.items():
        check_function = get_check_function(cause_name)
        if check_function:
            # Only investigate causes with probability > 0.1 (10%)
            if probability > 0.1:
                task = asyncio.create_task(
                    investigate_cause(cause_name, check_function)
                )
                tasks.append(task)
                cause_names.append(cause_name)
        else:
            logger.warning(f"No check function found for cause: {cause_name}")

    if not tasks:
        logger.warning("No valid tasks created for cognition analysis")
        return analysis

    # Run all investigations concurrently
    try:
        start_time = asyncio.get_event_loop().time()
        results = await asyncio.gather(*tasks, return_exceptions=True)
        end_time = asyncio.get_event_loop().time()
        
        # Process results
        for i, result in enumerate(results):
            if isinstance(result, Exception):
                logger.error(f"Error in cognition analysis for {cause_names[i]}: {result}")
                # Create a failed result
                failed_result = CognitionResult(
                    cause=cause_names[i],
                    confirmed=False,
                    details=f"Investigation failed: {str(result)}",
                    severity="low",
                    duration=end_time - start_time
                )
                analysis.add_result(failed_result)
            else:
                analysis.add_result(result)

        # Finalize analysis
        analysis.finalize()
        
        logger.info(f"Cognition analysis completed in {analysis.total_duration:.2f}s. "
                   f"Confirmed {len(analysis.confirmed_causes)} causes. "
                   f"Primary cause: {analysis.primary_cause.cause if analysis.primary_cause else 'None'}")
        
    except Exception as e:
        logger.error(f"Error in parallel cognition analysis: {e}")
        # Return empty analysis on error
        return CognitionAnalysis()

    return analysis

async def investigate_cause(cause_name: str, check_function) -> CognitionResult:
    """
    Investigate a single potential cause
    
    Args:
        cause_name: Name of the cause to investigate
        check_function: Async function to perform the investigation
        
    Returns:
        CognitionResult with investigation details
    """
    start_time = asyncio.get_event_loop().time()
    
    try:
        # Run the investigation
        result_data = await check_function()
        
        end_time = asyncio.get_event_loop().time()
        duration = end_time - start_time
        
        # Create cognition result
        result = CognitionResult(
            cause=cause_name,
            confirmed=result_data["confirmed"],
            details=result_data["details"],
            severity=result_data["severity"],
            duration=duration
        )
        
        logger.debug(f"Investigation of {cause_name}: {'CONFIRMED' if result.confirmed else 'CLEARED'} "
                    f"({result.severity} severity, {duration:.2f}s)")
        
        return result
        
    except Exception as e:
        end_time = asyncio.get_event_loop().time()
        duration = end_time - start_time
        
        logger.error(f"Error investigating {cause_name}: {e}")
        
        return CognitionResult(
            cause=cause_name,
            confirmed=False,
            details=f"Investigation error: {str(e)}",
            severity="low",
            duration=duration
        )

def get_cognition_summary(analysis: CognitionAnalysis) -> Dict[str, Any]:
    """
    Get a summary of the cognition analysis for WebSocket transmission
    
    Args:
        analysis: The completed cognition analysis
        
    Returns:
        Dictionary with summary information
    """
    return {
        "confirmed_root_cause": analysis.primary_cause.cause if analysis.primary_cause else None,
        "confirmed_details": analysis.primary_cause.details if analysis.primary_cause else None,
        "confirmed_severity": analysis.primary_cause.severity if analysis.primary_cause else None,
        "all_confirmed_causes": [
            {
                "cause": result.cause,
                "details": result.details,
                "severity": result.severity,
                "duration": result.duration
            }
            for result in analysis.confirmed_causes
        ],
        "investigation_confidence": analysis.confidence,
        "total_investigation_time": analysis.total_duration,
        "investigation_timestamp": analysis.timestamp.isoformat()
    }
