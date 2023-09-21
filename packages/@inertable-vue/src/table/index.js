import Nullable from "./nullable.vue";
import Datatable from "./datatable.vue";

export default {
 install(app) {
    app.component(Nullable.name, Nullable);
    app.component(Datatable.name, Datatable);
 },
};

export { Datatable, Nullable };
