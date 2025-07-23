export interface PubSubProvider<T> {
    publish(topic: string, payload: T): Promise<void>;
    watch(topic: string): AsyncIterableIterator<T>;
}

export const PUB_SUB_PROVIDER = 'PUB_SUB_PROVIDER';
