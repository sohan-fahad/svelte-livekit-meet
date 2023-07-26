import { Room } from "livekit-client";
import { BaseStore } from "./base.store";


export type ConnectionStatusType = "AUTHORIZING_ROOM" | "AUTHORIZED_ROOM" | "AUTHORIZING_ROOM_FAILED" | "AUTHORIZING" | "AUTHORIZED" | "AUTHORIZED_FAILED" | "CONNECTING" | "CONNECTED" | "CONNECTION_FAILED" | "DISCONNECTED" | "RECONNECTING" | "RECONNECTED" | "RECONNECTION_FAILED" | "";

export type DeviceStatus = "DEVICE_LOADING" | "DEVICE_LOADED" | "DEVICE_LOADING_FAILED" | ""

interface IMessages {
    message: string; type: string; name: string; time: string
}

interface IStore {
    currentRoom: Room | undefined;
    isLoading: boolean;
    isRemoteParticipant: boolean;
    isScreenShare: boolean;
    connectionStatus: ConnectionStatusType;
    deviceStatus: DeviceStatus;
    toastMessage: string;
    messagesArray: IMessages[]
}


class _RoomStore {
    store: BaseStore<IStore> = new BaseStore<IStore>({
        currentRoom: undefined,
        isLoading: true,
        isRemoteParticipant: false,
        isScreenShare: false,
        connectionStatus: "",
        deviceStatus: "",
        toastMessage: "",
        messagesArray: []
    })

    select() {
        return this.store.get();
    }

    public updateStore(payload: Partial<IStore>) {
        this.store.update((pv) => ({ ...pv, ...payload }));
    }

    public updateConnectionStatus(status: ConnectionStatusType) {
        this.store.update((pv) => ({ ...pv, connectionStatus: status }))
    }

    public updateDeviceStatus(status: DeviceStatus) {
        this.store.update((pv) => ({ ...pv, deviceStatus: status }))
    }

    public toast(message: string) {
        this.store.update(pv => ({ ...pv, toastMessage: message }))
        setTimeout(() => {
            this.store.update(pv => ({ ...pv, toastMessage: "" }))
        }, 3000)
    }

    public updateMessageArr(payload: IMessages) {
        const prevMsg = this.store.getValue().messagesArray;
        this.store.update(pv => ({ ...pv, messagesArray: [...prevMsg, payload] }))
    }

    public reset() {
        this.store.set({
            currentRoom: undefined,
            isLoading: false,
            isRemoteParticipant: false,
            isScreenShare: false,
            connectionStatus: "",
            deviceStatus: "",
            toastMessage: "",
            messagesArray: []
        });
    }
}

export const RoomStore = new _RoomStore();