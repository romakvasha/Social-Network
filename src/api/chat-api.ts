import { ChatMessageType } from "../types/types";

const CHAT_URL = "wss://social-network.samuraijs.com/handlers/ChatHandler.ashx";
const RECONNECT_DELAY_MS = 3000;

export type ChatStatusType = "pending" | "ready" | "error";

type MessagesReceivedSubscriberType = (messages: Array<ChatMessageType>) => void;
type StatusChangedSubscriberType = (status: ChatStatusType) => void;

const subscribers = {
  "messages-received": [] as Array<MessagesReceivedSubscriberType>,
  "status-changed": [] as Array<StatusChangedSubscriberType>,
};
type EventNamesType = keyof typeof subscribers;
type SubscriberOf<E extends EventNamesType> = (typeof subscribers)[E][number];

let ws: WebSocket | null = null;
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

const notifyStatus = (status: ChatStatusType) => {
  subscribers["status-changed"].forEach((s) => s(status));
};

const closeHandler = () => {
  notifyStatus("pending");
  reconnectTimer = setTimeout(createChannel, RECONNECT_DELAY_MS);
};

const messageHandler = (e: MessageEvent) => {
  const newMessages = JSON.parse(e.data) as Array<ChatMessageType>;
  subscribers["messages-received"].forEach((s) => s(newMessages));
};

const openHandler = () => notifyStatus("ready");
const errorHandler = () => notifyStatus("error");

const cleanUp = () => {
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
  if (ws) {
    ws.removeEventListener("close", closeHandler);
    ws.removeEventListener("message", messageHandler);
    ws.removeEventListener("open", openHandler);
    ws.removeEventListener("error", errorHandler);
    ws.close();
    ws = null;
  }
};

function createChannel() {
  cleanUp();
  ws = new WebSocket(CHAT_URL);
  notifyStatus("pending");
  ws.addEventListener("close", closeHandler);
  ws.addEventListener("message", messageHandler);
  ws.addEventListener("open", openHandler);
  ws.addEventListener("error", errorHandler);
}

export const chatAPI = {
  start() {
    createChannel();
  },
  stop() {
    subscribers["messages-received"] = [];
    subscribers["status-changed"] = [];
    cleanUp();
  },
  subscribe<E extends EventNamesType>(eventName: E, callback: SubscriberOf<E>) {
    (subscribers[eventName] as Array<SubscriberOf<E>>).push(callback);
    return () => {
      (subscribers[eventName] as Array<SubscriberOf<E>>) = (subscribers[eventName] as Array<SubscriberOf<E>>).filter(
        (s) => s !== callback
      );
    };
  },
  sendMessage(message: string) {
    ws?.send(message);
  },
};
