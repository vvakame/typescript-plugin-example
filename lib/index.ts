import * as ts from "typescript/lib/tsserverlibrary";

const factory: ts.server.PluginModuleFactory = mod => {
    const ts = mod.typescript;

    return {
        create: create,
        getExternalFiles: void 0,
    };

    function create(info: ts.server.PluginCreateInfo) {
        const log = (text: string) => {
            if (info.config.verbose) {
                info.project.projectService.logger.info(text);
            }
        };
        log("typescript-plugin-example loaded.");

        const ls = info.languageService;

        const proxy: ts.LanguageService = Object.create(null);
        Object.keys(ls).forEach((key: keyof ts.LanguageService) => {
            proxy[key] = (...args: any[]) => {
                log(`typescript-plugin-example called ${key}. ${JSON.stringify(args, null, 2)}`);
                return ls[key].apply(ls, args);
            };
        });

        // overwrite functions
        proxy.getQuickInfoAtPosition = (fileName: string, position: number) => {
            log(`typescript-plugin-example getQuickInfoAtPosition. ${fileName}, ${position}`);

            const result = ls.getQuickInfoAtPosition(fileName, position);
            if ((result.displayParts || []).length === 0) {
                return result;
            }
            result.displayParts = [
                ...result.displayParts,
                { kind: "", text: "😺" },
            ];
            return result;
        };

        proxy.getCompletionEntryDetails = (fileName: string, position: number, entryName: string) => {
            log(`typescript-plugin-example getCompletionEntryDetails. ${fileName}, ${position}, ${entryName}`);

            const result = ls.getCompletionEntryDetails(fileName, position, entryName);
            if ((result.displayParts || []).length === 0) {
                return result;
            }
            result.displayParts = [
                ...result.displayParts,
                { kind: "", text: "😺" },
            ];
            return result;
        };

        return proxy;
    }
};
export = factory;
