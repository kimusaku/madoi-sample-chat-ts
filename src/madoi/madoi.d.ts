export declare function ShareClass(option?: any): (target: any) => void;
export interface ShareOption {
    type?: "beforeExec" | "afterExec";
    maxLog?: number;
}
export declare function Share(config?: ShareOption): (target: any, name: string, descriptor: PropertyDescriptor) => void;
interface PeerInfo {
    peerId: string;
    order: number;
}
interface EnterRoom {
    type: "EnterRoom";
    sender: "__SYSTEM__";
    peerId: string;
    peers: PeerInfo[];
    histories: StoredMessageType[];
}
interface LeaveRoom {
    type: "LeaveRoom";
    sender: "__SYSTEM__";
    peerId: string;
}
interface PeerJoin {
    type: "PeerJoin";
    sender: "__SYSTEM__";
    peerId: string;
}
interface PeerLeave {
    type: "PeerLeave";
    sender: "__SYSTEM__";
    peerId: string;
}
interface Invocation {
    type: "Invocation";
    sender: string;
    methodIndex: number;
    args: any[];
}
interface ObjectState {
    type: "ObjectState";
    sender: string;
    objectIndex: number;
    state: string;
}
declare type StoredMessageType = Invocation | ObjectState;
declare type DowanStreamMessageType = EnterRoom | LeaveRoom | PeerJoin | PeerLeave | Invocation | ObjectState;
export declare class Madoi {
    private connecting;
    private connectionConfig;
    private objectConfigs;
    private methodConfigs;
    private sharedFunctions;
    private sharedObjects;
    private promises;
    private changedObjects;
    private handlers;
    private ws;
    private selfPeerId;
    private currentSenderPeerId;
    constructor(servicePath: string, key?: string, options?: object);
    getCurrentSenderPeerId(): string | null;
    isSelfCall(): boolean;
    close(): void;
    sendConfigs(): void;
    handleOnOpen(e: Event): void;
    handleOnClose(e: CloseEvent): void;
    handleOnError(e: Event): void;
    handleOnMessage(e: MessageEvent): void;
    data(msg: DowanStreamMessageType): void;
    onOpen(_e: Event): void;
    onClose(_e: Event): void;
    onError(_e: Event): void;
    onElse(_msg: any): void;
    onEnterRoom(selfId: string, peerIds: PeerInfo[]): void;
    onLeaveRoom(): void;
    onPeerJoin(peerId: string): void;
    onPeerLeave(peerId: string): void;
    send(type: string, body: any, headers: any): void;
    share(f: Function, config: any, objectIndex: number): Function;
    shareObject(obj: any, methods?: Function[], config?: any): void;
    saveStates(): void;
    private applyInvocation;
}
export {};
