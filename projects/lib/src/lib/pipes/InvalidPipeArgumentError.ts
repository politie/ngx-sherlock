import { Type } from '@angular/core';

/**
 * Error thrown when an invalid argument has been provided to a pipe.
 */
export class InvalidPipeArgumentError extends Error {
    /**
     * @param type Pipe that was provided with an invalid argument
     * @param value Invalid argument provided
     */
    constructor(readonly type: Type<any>, readonly value: object) {
        super(`Invalid PipeArgument for pipe ${type.name}`);
    }
}
