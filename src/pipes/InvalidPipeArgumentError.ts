import { Type } from '@angular/core';
import { BaseError } from '@politie/informant';

/**
 * @internal
 * Error thrown when an invalid argument has been provided to a pipe.
 */
export class InvalidPipeArgumentError extends BaseError {
    /**
     * Calls the super class BaseError with a helpful error message.
     * @param type Pipe that was provided with an invalid argument
     * @param value Invalid argument provided
     */
    constructor(type: Type<any>, value: object) {
        super({ type, value }, `Invalid PipeArgument for pipe ${type.name}`);
    }
}
