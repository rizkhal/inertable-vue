import { defineComponent, h, ref } from "vue";

export default defineComponent({
  setup(props) {
    const model = ref(props.modelValue);

    const emit = defineEmits(["update:modelValue"]);

    const onInput = (event: InputEvent) => {
      emit("update:modelValue", (event.target as HTMLInputElement).value);
    };

    return () =>
      h("form", { class: "lg:pr-3" }, [
        h("label", { for: "search", class: "sr-only" }, "Search"),
        h("div", { class: "mt-1 relative lg:w-64 xl:w-96" }, [
          h("input", {
            type: "search",
            name: "email",
            id: "search",
            autocomplete: "off",
            placeholder: "Search",
            value: model.value,
            onInput,
            class:
              "bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5",
          }),
        ]),
      ]);
  },
  props: {
    modelValue: String,
  },
});
