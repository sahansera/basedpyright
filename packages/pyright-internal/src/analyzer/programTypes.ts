/*
 * programTypes.ts
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT license.
 *
 * Various interfaces/types used in
 */
import { BaselineHandler } from '../baseline';
import { ConsoleInterface } from '../common/console';
import { LogTracker } from '../common/logTracker';
import { ServiceProvider } from '../common/serviceProvider';
import { Uri } from '../common/uri/uri';
import { IPythonMode, SourceFile, SourceFileEditMode } from './sourceFile';

export interface ISourceFileFactory {
    createSourceFile(
        serviceProvider: ServiceProvider,
        fileUri: Uri,
        moduleName: string,
        isThirdPartyImport: boolean,
        isThirdPartyPyTypedPresent: boolean,
        isModulePrivate: boolean,
        editMode: SourceFileEditMode,
        baselineHandler: BaselineHandler,
        getCellIndex: () => number | undefined,
        console?: ConsoleInterface,
        logTracker?: LogTracker,
        ipythonMode?: IPythonMode
    ): SourceFile;
}

export namespace ISourceFileFactory {
    export function is(obj: any): obj is ISourceFileFactory {
        return obj.createSourceFile !== undefined;
    }
}
