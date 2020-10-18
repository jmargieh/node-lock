# node-lock

## Description
node-lock is a tool for controlling access to a shared resource. Commonly, a lock provides exclusive access to a shared resource: only one event loop at a time can acquire the lock and all access to the shared resource requires that the lock be acquired first.

## Usage Typescript
```typescript
import {Lock} from 'node-lock';

const lock: Lock = new Lock(); // Lock instance shuld be initialized once on application startup

async asyncFunction(key) {
    await lock.waitForLockRelease(key); // Promise resolved instantly if no lock was acquired for the resource
    lock.acquireLock(hashedIndexKeyDto, 5000); // optional - lock release timeout. 
    // do you async operations here..
    lock.releaseLock(hashedIndexKeyDto); // release resource lock.
}
```

## API
#### .waitForLockRelease(string | number: key): Promise<void>
Returns a Promise when the resource released. resolved instantly in case no lock acquired for the resource.

#### .acquireLock(string | number: key, number?: timeout): void
Acquires a lock for the provided resource.

```timeout``` optional lock timeout in milli seconds.  

#### .releaseLock(string | number: key): void
Releases the lock of the provided resource.
