// components
import * as components from "./src/components";

export default {
    install(app) {
        // import all components
        for (const componentKey in components) {
            app.use((components)[componentKey])
        }
    },
};
