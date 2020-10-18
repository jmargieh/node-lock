import { EventEmitter } from 'events';

export class Lock {
  private readonly indexesLocks: Map<string | number, boolean>;
  private readonly indexesLocksTimers: Map<string | number, NodeJS.Timeout>;
  private readonly eventEmitter: EventEmitter;

  constructor() {
    this.indexesLocks = new Map<string, boolean>();
    this.eventEmitter = new EventEmitter();
    this.indexesLocksTimers = new Map<string, NodeJS.Timeout>();
  }

  acquireLock(key: string | number, timeout?: number): void {
    if (this.indexesLocks.has(key)) {
      // already locked.
    } else {
      if (timeout) {
        this.indexesLocksTimers.set(
          key,
          setTimeout(() => {
            this.releaseLock(key);
          }, timeout),
        );
      }
      this.indexesLocks.set(key, true);
    }
  }

  releaseLock(key: string | number): void {
    this.indexesLocks.delete(key);
    const timeout: NodeJS.Timeout | undefined = this.indexesLocksTimers.get(key);
    if (timeout !== undefined) {
      clearTimeout(timeout);
    }
    this.indexesLocksTimers.delete(key);
    this.eventEmitter.emit(key.toString()); // emit releasing lock
  }

  async waitForLockRelease(key: string | number): Promise<void> {
    if (this.indexesLocks.has(key)) {
      return new Promise<void>((resolve) => {
        this.eventEmitter.on(key.toString(), () => {
          resolve();
        });
      });
    }
  }
}
