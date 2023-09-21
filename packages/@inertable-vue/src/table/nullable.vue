<script>
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  name: "Nullable",
  props: {
    value: [String, Number, null],
  },
});
</script>
<template>
  <span
    :class="{
      'text-gray-400 dark:text-gray-500':
        value === 'N/A' || value === null || value === '',
    }"
  >
    {{ value === null || value === "" ? "N/A" : value }}
  </span>
</template>
