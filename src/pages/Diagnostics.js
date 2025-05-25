import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Clock, Activity, RefreshCw, Cpu, Wifi, Zap } from 'lucide-react';

/**
 * Diagnostics Component
 *
 * A low-priority diagnostic tool for system health monitoring with real-time browser diagnostics.
 * This component provides task-manager-like functionality for monitoring browser performance
 * and system health metrics.
 *
 * Features:
 * - Real-time browser performance metrics (memory, CPU, network, FPS)
 * - Device information (battery, connection type, connection speed)
 * - System component status monitoring
 * - Performance metrics visualization
 * - Manual and automatic refresh capabilities
 * - Recent issues tracking
 *
 * @component
 * @example
 * return (
 *   <Diagnostics />
 * )
 */
const Diagnostics = () => {
  /**
   * State Management
   *
   * The component uses several state variables to track different aspects of the diagnostics:
   * - UI state (active tab, refresh status)
   * - Browser performance metrics (real-time data)
   * - System status (mock data that could be replaced with real API calls)
   * - Performance metrics (combination of real and mock data)
   */

  // UI state variables
  const [activeTab, setActiveTab] = useState('system');  // Controls which tab is currently active
  const [isRefreshing, setIsRefreshing] = useState(false);  // Tracks if metrics are currently being refreshed
  const [lastRefreshed, setLastRefreshed] = useState(new Date());  // Timestamp of last refresh

  /**
   * Browser Performance Metrics
   *
   * Real-time metrics collected from the browser using various Web APIs:
   * - Memory: JavaScript heap usage (requires Chrome)
   * - CPU: Estimated usage based on benchmark
   * - Network: Latency measurements
   * - FPS: Frames per second rendering performance
   * - Battery: Level and charging status
   * - Connection: Network type and speed
   */
  const [browserMetrics, setBrowserMetrics] = useState({
    memory: {
      usedJSHeapSize: 0,      // Currently used JS heap size in MB
      totalJSHeapSize: 0,     // Total allocated JS heap size in MB
      jsHeapSizeLimit: 0      // Maximum JS heap size in MB
    },
    cpu: '0%',                // Estimated CPU usage percentage
    networkLatency: '0ms',    // Network response time in milliseconds
    fps: 0,                   // Frames per second (rendering performance)
    batteryLevel: null,       // Battery percentage (if available)
    batteryCharging: null,    // Whether device is charging (if available)
    connectionType: 'unknown', // Network connection type (4g, wifi, etc.)
    connectionSpeed: 'unknown' // Estimated connection speed
  });

  /**
   * System Status
   *
   * Mock data representing server-side component health.
   * In a production environment, this would be replaced with real API calls
   * to backend services that report actual system health metrics.
   */
  const [systemStatus, setSystemStatus] = useState({
    status: 'healthy',        // Overall system health status
    uptime: '99.98%',         // System uptime percentage
    lastChecked: 'Just now',  // Last status check timestamp
    components: [             // Individual system components
      { name: 'Frontend', status: 'operational', latency: '42ms' },
      { name: 'Backend API', status: 'operational', latency: '128ms' },
      { name: 'Database', status: 'operational', latency: '85ms' },
      { name: 'AI Services', status: 'operational', latency: '320ms' },
      { name: 'Media Storage', status: 'operational', latency: '156ms' }
    ]
  });

  /**
   * Performance Metrics
   *
   * Combined metrics that include both real browser data and mock server data.
   * These metrics provide a comprehensive view of system performance.
   */
  const [performanceMetrics, setPerformanceMetrics] = useState({
    cpu: '0%',                // CPU usage (from browser metrics)
    memory: '0%',             // Memory usage percentage
    requests: '0/min',        // Request rate (mock data)
    responseTime: '0ms',      // Average response time
    errorRate: '0.00%'        // Error rate percentage (mock data)
  });

  /**
   * collectBrowserMetrics
   *
   * Collects real-time performance metrics from the browser using various Web APIs.
   * This function gathers data about memory usage, CPU performance, network latency,
   * rendering performance (FPS), battery status, and network connection information.
   *
   * Some metrics may not be available in all browsers due to API limitations.
   * For example, memory metrics are only available in Chrome-based browsers.
   *
   * @async
   * @function
   * @returns {Promise<void>} Updates state with collected metrics
   */
  const collectBrowserMetrics = async () => {
    const metrics = { ...browserMetrics };

    /**
     * Memory Usage Collection
     *
     * Uses the non-standard Performance.memory API (Chrome only)
     * to gather JavaScript heap memory statistics.
     * Converts bytes to megabytes for better readability.
     */
    if (window.performance && window.performance.memory) {
      const memory = window.performance.memory;
      metrics.memory = {
        usedJSHeapSize: Math.round(memory.usedJSHeapSize / (1024 * 1024)),
        totalJSHeapSize: Math.round(memory.totalJSHeapSize / (1024 * 1024)),
        jsHeapSizeLimit: Math.round(memory.jsHeapSizeLimit / (1024 * 1024))
      };
    }

    /**
     * CPU Usage Estimation
     *
     * Since browsers don't provide direct CPU usage metrics,
     * we estimate it by running a CPU-intensive calculation
     * and measuring how long it takes to complete.
     *
     * This is a rough approximation and not an exact measurement.
     */
    const startTime = performance.now();

    // Perform a CPU-intensive calculation to measure performance
    let result = 0;
    for (let i = 0; i < 1000000; i++) {
      result += Math.sqrt(i);
    }
    const endTime = performance.now();
    const benchmarkTime = endTime - startTime;

    // Log the result to prevent unused variable warning
    if (process.env.NODE_ENV === 'development') {
      console.debug('CPU benchmark calculation result:', result);
    }

    // Convert benchmark time to a CPU usage percentage (rough approximation)
    // The divisor (50) is calibrated based on testing on an average system
    const estimatedCpuUsage = Math.min(100, Math.round((benchmarkTime / 50) * 100) / 100);
    metrics.cpu = `${estimatedCpuUsage}%`;

    /**
     * Network Latency Measurement
     *
     * Measures the round-trip time for a simple fetch request
     * to estimate network latency. Uses favicon.ico as a lightweight
     * resource that should be available on most sites.
     */
    try {
      const start = performance.now();
      await fetch('/favicon.ico', { cache: 'no-store' });
      const end = performance.now();
      metrics.networkLatency = `${Math.round(end - start)}ms`;
    } catch (e) {
      metrics.networkLatency = 'Error';
    }

    /**
     * FPS (Frames Per Second) Calculation
     *
     * Uses requestAnimationFrame to count how many frames
     * are rendered in a one-second period, providing a
     * measurement of rendering performance.
     */
    let frameCount = 0;
    let lastTimestamp = performance.now();
    const calculateFPS = () => {
      frameCount++;
      const now = performance.now();
      if (now - lastTimestamp >= 1000) {
        metrics.fps = frameCount;
        frameCount = 0;
        lastTimestamp = now;
      }
      if (frameCount < 60) { // Only request another frame if we're still counting
        requestAnimationFrame(calculateFPS);
      }
    };
    requestAnimationFrame(calculateFPS);

    /**
     * Battery Status Collection
     *
     * Uses the Battery API to gather information about
     * the device's battery level and charging status.
     * This API may not be available in all browsers.
     */
    if (navigator.getBattery) {
      try {
        const battery = await navigator.getBattery();
        metrics.batteryLevel = Math.round(battery.level * 100);
        metrics.batteryCharging = battery.charging;
      } catch (e) {
        console.error('Error getting battery info:', e);
      }
    }

    /**
     * Network Connection Information
     *
     * Uses the NetworkInformation API to gather data about
     * the type and speed of the network connection.
     * This API may not be available in all browsers.
     */
    if (navigator.connection) {
      metrics.connectionType = navigator.connection.effectiveType || 'unknown';
      metrics.connectionSpeed = navigator.connection.downlink
        ? `${navigator.connection.downlink} Mbps`
        : 'unknown';
    }

    // Update browser metrics state with collected data
    setBrowserMetrics(metrics);

    /**
     * Update Performance Metrics
     *
     * Combines real browser data with mock server data
     * to provide a comprehensive view of system performance.
     */
    setPerformanceMetrics({
      cpu: metrics.cpu,
      memory: metrics.memory.totalJSHeapSize ?
        `${Math.round((metrics.memory.usedJSHeapSize / metrics.memory.totalJSHeapSize) * 100)}%` :
        'Unknown',
      requests: '128/min', // Mock data
      responseTime: metrics.networkLatency,
      errorRate: '0.02%' // Mock data
    });
  };

  /**
   * refreshMetrics
   *
   * Refreshes all diagnostic metrics, including browser performance data
   * and system status information. This function is called both manually
   * when the user clicks the refresh button and automatically at regular
   * intervals.
   *
   * The function handles its own loading state and error handling to
   * provide a smooth user experience.
   *
   * @async
   * @function
   * @returns {Promise<void>} Updates all metrics state
   */
  const refreshMetrics = async () => {
    // Set refreshing state to show loading indicator
    setIsRefreshing(true);

    try {
      // Collect real browser metrics
      await collectBrowserMetrics();

      // Update system status last checked time
      setSystemStatus(prev => ({
        ...prev,
        lastChecked: 'Just now'
      }));

      // Update last refreshed timestamp
      setLastRefreshed(new Date());
    } catch (error) {
      console.error('Error refreshing metrics:', error);
      // In a production app, we might want to show an error message to the user
    } finally {
      // Always reset refreshing state, even if there was an error
      setIsRefreshing(false);
    }
  };

  /**
   * Auto-refresh Effect
   *
   * Sets up automatic refresh of metrics when the component mounts
   * and cleans up the interval when the component unmounts.
   *
   * The metrics are refreshed immediately on mount and then every 30 seconds.
   */
  useEffect(() => {
    // Initial metrics collection
    refreshMetrics();

    // Set up interval to refresh metrics every 30 seconds
    const intervalId = setInterval(() => {
      refreshMetrics();
    }, 30000);

    // Clean up interval on component unmount to prevent memory leaks
    return () => clearInterval(intervalId);

    // Disable exhaustive deps warning since refreshMetrics is defined in the same component
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * formatLastRefreshed
   *
   * Formats the last refreshed timestamp into a human-readable string.
   * The format changes based on how long ago the refresh occurred:
   * - Less than 5 seconds: "Just now"
   * - Less than 1 minute: "X seconds ago"
   * - Less than 1 hour: "X minutes ago"
   * - 1 hour or more: "X hours ago"
   *
   * @function
   * @returns {string} Human-readable time since last refresh
   */
  const formatLastRefreshed = () => {
    const now = new Date();
    const diff = Math.floor((now - lastRefreshed) / 1000); // difference in seconds

    if (diff < 5) return 'Just now';
    if (diff < 60) return `${diff} seconds ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    return `${Math.floor(diff / 3600)} hours ago`;
  };

  /**
   * Mock Recent Issues Data
   *
   * This array contains mock data for recent system issues.
   * In a production environment, this would be replaced with
   * real data from a backend API or monitoring service.
   *
   * Each issue includes:
   * - id: Unique identifier
   * - timestamp: When the issue occurred
   * - severity: How serious the issue was (low, medium, high)
   * - message: Description of the issue
   * - resolved: Whether the issue has been fixed
   */
  const recentIssues = [
    { id: 1, timestamp: '2025-04-10 14:32:18', severity: 'low', message: 'Temporary latency spike in AI services', resolved: true },
    { id: 2, timestamp: '2025-04-08 09:15:42', severity: 'medium', message: 'Database connection timeout', resolved: true },
    { id: 3, timestamp: '2025-04-05 22:03:56', severity: 'low', message: 'Media storage synchronization delay', resolved: true }
  ];

  /**
   * renderStatusIndicator
   *
   * Renders a visual indicator for a component's operational status.
   * Different statuses are represented with different colors and icons:
   * - operational: Green with checkmark
   * - degraded: Yellow with clock
   * - outage: Red with warning triangle
   *
   * @function
   * @param {string} status - The status to render ('operational', 'degraded', or 'outage')
   * @returns {JSX.Element|null} The status indicator component or null if status is unknown
   */
  const renderStatusIndicator = (status) => {
    switch (status) {
      case 'operational':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700">
          <CheckCircle className="w-3 h-3 mr-1" /> Operational
        </span>;
      case 'degraded':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-50 text-yellow-700">
          <Clock className="w-3 h-3 mr-1" /> Degraded
        </span>;
      case 'outage':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-50 text-red-700">
          <AlertTriangle className="w-3 h-3 mr-1" /> Outage
        </span>;
      default:
        return null;
    }
  };

  /**
   * renderSeverityIndicator
   *
   * Renders a visual indicator for an issue's severity level.
   * Different severity levels are represented with different colors:
   * - low: Blue
   * - medium: Yellow
   * - high: Red
   *
   * @function
   * @param {string} severity - The severity level to render ('low', 'medium', or 'high')
   * @returns {JSX.Element|null} The severity indicator component or null if severity is unknown
   */
  const renderSeverityIndicator = (severity) => {
    switch (severity) {
      case 'low':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
          Low
        </span>;
      case 'medium':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-50 text-yellow-700">
          Medium
        </span>;
      case 'high':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-50 text-red-700">
          High
        </span>;
      default:
        return null;
    }
  };

  /**
   * Component Render
   *
   * The component's UI is organized into several sections:
   * 1. Header with title and description
   * 2. Refresh button and last refreshed timestamp
   * 3. Browser diagnostics section with real-time metrics
   * 4. Tab navigation (System Status, Performance, Recent Issues)
   * 5. Content area that changes based on the active tab
   * 6. Footer with additional information
   *
   * The UI follows the application's minimalist design principles
   * with a clean white background and subtle visual elements.
   */
  return (
    <div className="flex flex-col items-center justify-center min-h-screen" style={{backgroundColor: '#ffffff', color: '#000000'}}>
      <div className="w-full px-4 md:px-8 lg:px-16 xl:px-24 py-16 relative">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <Activity className="h-12 w-12 text-gray-300" />
          </div>
          System Diagnostics
          <p className="text-sm text-gray-300">
            Low-priority system health monitoring
          </p>
        </div>

        {/* Refresh button and last refreshed time */}
        <div className="w-full max-w-4xl mx-auto mb-6 flex justify-between items-center">
          <div className="text-xs text-gray-400">
            Last refreshed: {formatLastRefreshed()}
          </div>
          <button
            onClick={refreshMetrics}
            disabled={isRefreshing}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 text-xs hover:bg-gray-50 transition-colors duration-200 ${
              isRefreshing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>

        {/* Browser Diagnostics */}
        <div className="w-full max-w-4xl mx-auto mb-8 p-4 bg-gray-50 rounded-lg">
          
            <Cpu className="w-4 h-4 text-gray-400" />
            <span>Browser Diagnostics</span>
          

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-white rounded border border-gray-100">
              <div className="text-xs text-gray-400 mb-1">Memory Usage</div>
              <div className="text-sm font-medium">
                {browserMetrics.memory.totalJSHeapSize ?
                  `${browserMetrics.memory.usedJSHeapSize}MB / ${browserMetrics.memory.totalJSHeapSize}MB` :
                  'Not available'}
              </div>
            </div>

            <div className="p-3 bg-white rounded border border-gray-100">
              <div className="text-xs text-gray-400 mb-1">CPU Load</div>
              <div className="text-sm font-medium">{browserMetrics.cpu}</div>
            </div>

            <div className="p-3 bg-white rounded border border-gray-100">
              <div className="text-xs text-gray-400 mb-1">Network Latency</div>
              <div className="text-sm font-medium">{browserMetrics.networkLatency}</div>
            </div>

            <div className="p-3 bg-white rounded border border-gray-100">
              <div className="text-xs text-gray-400 mb-1">FPS</div>
              <div className="text-sm font-medium">{browserMetrics.fps}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {browserMetrics.batteryLevel !== null && (
              <div className="p-3 bg-white rounded border border-gray-100">
                <div className="text-xs text-gray-400 mb-1">Battery</div>
                <div className="text-sm font-medium flex items-center">
                  {browserMetrics.batteryLevel}%
                  {browserMetrics.batteryCharging && (
                    <Zap className="w-3 h-3 ml-1 text-green-500" />
                  )}
                </div>
              </div>
            )}

            <div className="p-3 bg-white rounded border border-gray-100">
              <div className="text-xs text-gray-400 mb-1">Connection Type</div>
              <div className="text-sm font-medium flex items-center gap-1">
                <Wifi className="w-3 h-3 text-gray-400" />
                {browserMetrics.connectionType}
              </div>
            </div>

            <div className="p-3 bg-white rounded border border-gray-100">
              <div className="text-xs text-gray-400 mb-1">Connection Speed</div>
              <div className="text-sm font-medium">{browserMetrics.connectionSpeed}</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="w-full max-w-4xl mx-auto mb-8">
          <div className="border-b border-gray-100">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('system')}
                className={`py-2 px-1 text-sm font-normal border-b-2 ${
                  activeTab === 'system'
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-300 hover:text-gray-500'
                }`}
              >
                System Status
              </button>
              <button
                onClick={() => setActiveTab('performance')}
                className={`py-2 px-1 text-sm font-normal border-b-2 ${
                  activeTab === 'performance'
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-300 hover:text-gray-500'
                }`}
              >
                Performance
              </button>
              <button
                onClick={() => setActiveTab('issues')}
                className={`py-2 px-1 text-sm font-normal border-b-2 ${
                  activeTab === 'issues'
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-300 hover:text-gray-500'
                }`}
              >
                Recent Issues
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="w-full max-w-4xl mx-auto">
          {/* System Status Tab */}
          {activeTab === 'system' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  System Status
                  <p className="text-sm text-gray-500">Last checked: {systemStatus.lastChecked}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-green-700">
                    {systemStatus.status === 'healthy' ? 'All Systems Operational' : 'System Issues Detected'}
                  </div>
                  <div className="text-xs text-gray-500">Uptime: {systemStatus.uptime}</div>
                </div>
              </div>

              <div className="overflow-hidden border border-gray-100 rounded-lg">
                <table className="min-w-full divide-y divide-gray-100">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Component
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Latency
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {systemStatus.components.map((component, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {component.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {renderStatusIndicator(component.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {component.latency}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Performance Tab */}
          {activeTab === 'performance' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">CPU Usage</div>
                  <div className="text-2xl font-normal">{performanceMetrics.cpu}</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Memory Usage</div>
                  <div className="text-2xl font-normal">{performanceMetrics.memory}</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Requests</div>
                  <div className="text-2xl font-normal">{performanceMetrics.requests}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Average Response Time</div>
                  <div className="text-2xl font-normal">{performanceMetrics.responseTime}</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Error Rate</div>
                  <div className="text-2xl font-normal">{performanceMetrics.errorRate}</div>
                </div>
              </div>

              <div className="p-4 border border-gray-100 rounded-lg">
                Performance Insights
                <p className="text-xs text-gray-500">
                  System performance is within normal parameters. No action required at this time.
                </p>
              </div>
            </div>
          )}

          {/* Recent Issues Tab */}
          {activeTab === 'issues' && (
            <div className="space-y-6">
              {recentIssues.length > 0 ? (
                <div className="overflow-hidden border border-gray-100 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-100">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Timestamp
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Severity
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Message
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {recentIssues.map((issue) => (
                        <tr key={issue.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                            {issue.timestamp}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                            {renderSeverityIndicator(issue.severity)}
                          </td>
                          <td className="px-6 py-4 text-xs text-gray-500">
                            {issue.message}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                            {issue.resolved ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700">
                                Resolved
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-50 text-yellow-700">
                                In Progress
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center p-8 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">No issues reported in the last 30 days.</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="w-full max-w-4xl mx-auto mt-8 pt-8 border-t border-gray-100">
          <p className="text-xs text-gray-300 text-center">
            This is a low-priority diagnostic tool for system administrators.
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * Export the Diagnostics component as the default export.
 * This component can be imported and used in other parts of the application,
 * particularly in the main App component where it's rendered on the /diagnostics route.
 */
export default Diagnostics;
