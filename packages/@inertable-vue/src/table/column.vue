<template>
  <tr>
    <template v-for="(column, index) in columns" :key="index">
      <th v-if="column.checkbox" scope="col" class="p-4 cursor-pointer">
        <div class="flex items-center">
          <input
            type="checkbox"
            v-model="selectedAll"
            :id="`checkbox-${id}`"
            @change="$emit('onSelectAll', !!selectedAll)"
            class="h-4 w-4 rounded bg-gray-50 border-gray-300 focus:ring-3 focus:ring-indigo-200"
          />
          <label :for="`checkbox-${id}`" class="sr-only">checkbox</label>
        </div>
      </th>
      <th
        v-else-if="!column.blank"
        scope="col"
        class="p-4 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
        @click="$emit('onSort', column.column)"
      >
        <div class="flex flex-row">
          <span>{{ column.text }}</span>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            v-if="column.sortable && params.direction == 'asc' && params.column == column.column"
            class="w-4 h-4 ml-2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12"
            />
          </svg>

          <svg
            v-if="column.sortable && params.direction == 'desc' && params.column == column.column"
            class="w-4 h-4 ml-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0l-3.75-3.75M17.25 21L21 17.25"
            />
          </svg>
        </div>
      </th>
    </template>
  </tr>
</template>
<script setup>
import { ref } from "vue";
import { v4 as uuid } from "uuid";

const id = ref(uuid());
const selectedAll = ref(false);

defineProps({
  columns: Object,
  params: Object,
  selectAll: Boolean,
});

defineEmits(["onSort", "onSelectAll"]);
</script>