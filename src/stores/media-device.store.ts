import { BaseStore } from "./base.store";

interface ISelectedDevices {
    videoinput: {
        kind: string;
        deviceId: string;
    };
    audioinput: {
        kind: string;
        deviceId: string;
    };
    audiooutput: {
        kind: string;
        deviceId: string;
    };
}

interface IStore {
    isCameraEnable: boolean;
    isAudioEnable: boolean;
    selectedDevices: ISelectedDevices
}


class _MediaDeviceStore {
    store: BaseStore<IStore> = new BaseStore<IStore>({
        isCameraEnable: true,
        isAudioEnable: true,
        selectedDevices: {
            videoinput: {
                kind: "",
                deviceId: "",
            },
            audioinput: {
                kind: "",
                deviceId: "",
            },
            audiooutput: {
                kind: "",
                deviceId: "",
            },
        }
    }, "media-device-config")

    select() {
        return this.store.get();
    }

    public updateStore(payload: Partial<IStore>) {
        this.store.update((pv) => ({ ...pv, ...payload }));
    }

    public updateSelectedDevice(payload: Partial<ISelectedDevices>) {
        const prevSelectedDevice = this.store.getValue().selectedDevices
        this.store.update((pv) => ({ ...pv, selectedDevices: { ...prevSelectedDevice, ...payload } }));
    }

    public getValue() {
        return this.store.getCacheStore()
    }

    public reset() {
        this.store.set({
            isCameraEnable: true,
            isAudioEnable: true,
            selectedDevices: {
                videoinput: {
                    kind: "",
                    deviceId: "",
                },
                audioinput: {
                    kind: "",
                    deviceId: "",
                },
                audiooutput: {
                    kind: "",
                    deviceId: "",
                },
            }
        });
    }
}

export const MediaDeviceStore = new _MediaDeviceStore();