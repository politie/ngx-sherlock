import { ReactorOptions } from '@politie/sherlock';

export interface DerivableProxy<T> {
    $react(reaction: (value: T) => void, options?: Partial<ReactorOptions<T>>): () => void;
}

export function isDerivableProxy(obj: any): obj is DerivableProxy<any> {
    return obj.$react && typeof obj.$react === 'function';
}
