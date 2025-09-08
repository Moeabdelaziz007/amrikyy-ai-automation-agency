// Real-time WebSocket connection for AG-UI protocol
export class AGUIConnection {
  private ws: WebSocket | null = null;
  private eventHandlers: Map<string, Function[]> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private isConnected = false;

  constructor(private url: string) {
    this.connect();
  }

  private connect() {
    try {
      this.ws = new WebSocket(this.url);
      
      this.ws.onopen = () => {
        console.log('AG-UI Connection established');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.startHeartbeat();
        this.emit('connected');
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          // Handle heartbeat responses
          if (data.type === 'pong') {
            return;
          }
          
          this.emit('message', data);
        } catch (error) {
          console.error('Failed to parse message:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('AG-UI Connection closed');
        this.isConnected = false;
        this.stopHeartbeat();
        this.emit('disconnected');
        this.reconnect();
      };

      this.ws.onerror = (error) => {
        console.error('AG-UI Connection error:', error);
        this.emit('error', error);
      };
    } catch (error) {
      console.error('Failed to create AG-UI connection:', error);
    }
  }

  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'ping', timestamp: Date.now() }));
      }
    }, 30000); // Send heartbeat every 30 seconds
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private reconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      setTimeout(() => this.connect(), 2000 * this.reconnectAttempts);
    }
  }

  public send(event: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        ...event,
        timestamp: new Date().toISOString(),
        id: event.id || `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      }));
    } else {
      console.warn('WebSocket not connected, message not sent:', event);
    }
  }

  public getConnectionStatus() {
    return {
      connected: this.isConnected,
      readyState: this.ws?.readyState,
      reconnectAttempts: this.reconnectAttempts
    };
  }

  public on(event: string, handler: Function) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event)!.push(handler);
  }

  public off(event: string, handler: Function) {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  private emit(event: string, data?: any) {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => handler(data));
    }
  }

  public disconnect() {
    this.stopHeartbeat();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
  }
}

// AG-UI Event Types
export interface AGUIEvent {
  id: string;
  type: 'agent_status' | 'tool_call' | 'user_input' | 'system_update';
  timestamp: string;
  agent_id: string;
  data: any;
}

// Real-time Agent Manager
export class RealTimeAgentManager {
  private connection: AGUIConnection;
  private agents: Map<string, any> = new Map();

  constructor(wsUrl: string) {
    this.connection = new AGUIConnection(wsUrl);
    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.connection.on('message', (event: AGUIEvent) => {
      this.handleAgentEvent(event);
    });

    this.connection.on('connected', () => {
      console.log('Real-time agent manager connected');
    });

    this.connection.on('disconnected', () => {
      console.log('Real-time agent manager disconnected');
    });
  }

  private handleAgentEvent(event: AGUIEvent) {
    switch (event.type) {
      case 'agent_status':
        this.updateAgentStatus(event.agent_id, event.data);
        break;
      case 'tool_call':
        this.handleToolCall(event.agent_id, event.data);
        break;
      case 'user_input':
        this.handleUserInput(event.agent_id, event.data);
        break;
      case 'system_update':
        this.handleSystemUpdate(event.data);
        break;
    }
  }

  private updateAgentStatus(agentId: string, status: any) {
    this.agents.set(agentId, { ...this.agents.get(agentId), ...status });
  }

  private handleToolCall(agentId: string, toolData: any) {
    console.log(`Agent ${agentId} called tool:`, toolData);
  }

  private handleUserInput(agentId: string, input: any) {
    console.log(`User input for agent ${agentId}:`, input);
  }

  private handleSystemUpdate(update: any) {
    console.log('System update:', update);
  }

  public sendAgentCommand(agentId: string, command: any) {
    this.connection.send({
      type: 'agent_command',
      agent_id: agentId,
      command,
      timestamp: new Date().toISOString()
    });
  }

  public getAgentStatus(agentId: string) {
    return this.agents.get(agentId);
  }

  public getAllAgents() {
    return Array.from(this.agents.entries()).map(([id, status]) => ({
      id,
      ...status
    }));
  }
}
