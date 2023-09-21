import DropdownLink from "./dropdown-link.vue";

export default {
 install(app) {
  app.component(DropdownLink.name, DropdownLink);
 },
};

export { DropdownLink };
