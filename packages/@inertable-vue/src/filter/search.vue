<template>
  <form class="lg:pr-3">
    <label for="users-search" class="sr-only">Search</label>
    <div class="mt-1 relative lg:w-64 xl:w-96">
      <input
        type="search"
        name="email"
        id="users-search"
        autocomplete="off"
        placeholder="Search"
        v-model="model"
        @input="onInput"
        class="
          bg-gray-50
          border border-gray-300
          text-gray-900
          sm:text-sm
          rounded-lg
          focus:ring-indigo-600 focus:border-indigo-600
          block
          w-full
          p-2.5
        "
      />
    </div>
  </form>
</template>
<script setup>
import { ref } from "vue";

const props = defineProps({
  modelValue: String,
});

const model = ref(props.modelValue);

const emit = defineEmits(["update:modelValue"]);

const onInput = (event) => {
  emit("update:modelValue", event.target.value);
};
</script>