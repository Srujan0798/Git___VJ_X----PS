import { NodeUpdatePayload, EdgeUpdatePayload } from '../types';

type EventCallback = (...args: any[]) => void;

/**
 * @summary Simulates a real-time WebSocket connection for collaboration.
 */
class SocketService {
    private client_id: string;
    private status: 'connected' | 'disconnected' = 'disconnected';
    private listeners: Map<string, EventCallback[]> = new Map();

    constructor() {
        this.client_id = `client_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * @summary Gets the unique ID for the current client session.
     * @returns {string} The client's unique identifier.
     */
    getClientId(): string {
        return this.client_id;
    }

    /**
     * @summary Simulates establishing a connection to the WebSocket server.
     */
    connect() {
        console.log('[Socket SIM] Connecting...');
        setTimeout(() => {
            this.status = 'connected';
            this.emitStatusChange();
            console.log('[Socket SIM] Connected. Client ID:', this.client_id);
        }, 500);
    }

    /**
     * @summary Simulates disconnecting from the WebSocket server.
     */
    disconnect() {
        this.status = 'disconnected';
        this.emitStatusChange();
        console.log('[Socket SIM] Disconnected.');
    }

    /**
     * @summary Registers an event listener for a given event.
     * @param {string} event - The name of the event to listen for (e.g., 'status', 'node-updated').
     * @param {EventCallback} callback - The function to call when the event is emitted.
     */
    on(event: string, callback: EventCallback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event)?.push(callback);
    }

    /**
     * @summary Unregisters an event listener for a given event.
     * @param {string} event - The name of the event.
     * @param {EventCallback} callback - The specific callback function to remove.
     */
    off(event: string, callback: EventCallback) {
        const eventListeners = this.listeners.get(event);
        if (eventListeners) {
            this.listeners.set(event, eventListeners.filter(cb => cb !== callback));
        }
    }

    private emitStatusChange() {
        const statusListeners = this.listeners.get('status');
        if (statusListeners) {
            statusListeners.forEach(cb => cb(this.status));
        }
    }

    /**
     * @summary Emits a node update event to the simulated server.
     * @param {NodeUpdatePayload} payload - The node changes to broadcast.
     */
    emitNodeUpdate(payload: NodeUpdatePayload) {
        console.log('[Socket SIM] Emitting node update:', payload);
        // To simulate broadcast, we could use a BroadcastChannel or just log it
    }

    /**
     * @summary Emits an edge update event to the simulated server.
     * @param {EdgeUpdatePayload} payload - The edge changes to broadcast.
     */
    emitEdgeUpdate(payload: EdgeUpdatePayload) {
        console.log('[Socket SIM] Emitting edge update:', payload);
    }
}

export const socketService = new SocketService();