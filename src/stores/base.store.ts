import { BehaviorSubject, Observable } from 'rxjs';
const SessionStorageService = {
    set: (key: string, value: any): void => {
        sessionStorage.setItem(key, value);
    },
    get: (key: string): string | null => {
        return sessionStorage.getItem(key);
    },
    delete: (key: string): void => {
        sessionStorage.removeItem(key);
    },
    clearAll: (): void => {
        sessionStorage.clear();
    }
};
const CacheStore = {
    get: (key: string) => {
        try {
            return JSON.parse(SessionStorageService.get(key) as any);
        } catch (error) {
            return {};
        }
    },
    set: (key: string, value: any) => {
        return SessionStorageService.set(key, JSON.stringify(value));
    },
    remove: (key: string) => {
        return SessionStorageService.delete(key);
    }
};
export class BaseStore<T> {
    private obs$!: BehaviorSubject<T>;
    private cacheKey: string | undefined;
    private initialValueSnapShot: T;
    constructor(initialValue: T, cacheKey: any = null) {
        this.cacheKey = cacheKey;
        if (initialValue === null) {
            this.obs$ = new BehaviorSubject<T>(CacheStore.get(cacheKey));
        } else {
            this.obs$ = new BehaviorSubject<T>(initialValue);
        }
        this.initialValueSnapShot = initialValue;
    }
    getValue = (): T => this.obs$.value;
    getCacheStore = (): T => CacheStore.get(this.cacheKey);
    get = (): Observable<T> => this.obs$.asObservable();
    set = (payload: T) => {
        this.cacheKey ? CacheStore.set(this.cacheKey, payload) : null;
        this.obs$.next(payload);
    };
    update = (callBack: (pv: T) => T) => {
        const updatedValues = callBack(this.getValue());
        this.cacheKey ? CacheStore.set(this.cacheKey, updatedValues) : null;
        this.obs$.next(updatedValues);
    };
    patch = (payload: Partial<T>) => {
        const margeValues = { ...this.obs$.value, ...payload };
        this.cacheKey ? CacheStore.set(this.cacheKey, margeValues) : null;
        this.obs$.next(margeValues);
    };
    reset = () => {
        this.cacheKey ? CacheStore.remove(this.cacheKey) : null;
        this.obs$.next(this.initialValueSnapShot);
    };
    clear = () => {
        this.obs$.next(null as any);
        this.cacheKey ? CacheStore.remove(this.cacheKey) : null;
    };
}

