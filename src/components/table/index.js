import Nullable from "./nullable.vue";
import Inertable from "./inertable.vue";

export default {
    install(app) {
        app.component(Nullable.name, Nullable);
        app.component(Inertable.name, Inertable);
    },
};

export { Inertable, Nullable };
