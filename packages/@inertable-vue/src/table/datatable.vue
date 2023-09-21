<template>
  <main>
    <div
      class="p-4 block sm:flex lg:mt-1.5 bg-white items-center justify-between border-b border-gray-200"
    >
      <div class="mb-1 w-full">
        <div class="sm:flex">
          <div class="flex items-center">
            <InputSelect v-model="params.perpage" class="w-[60px] mr-2 mt-1">
              <option
                v-for="(item, index) in perpages"
                :key="index"
                :value="item"
              >
                {{ item }}
              </option>
            </InputSelect>
            <Search v-model="params.search" />
          </div>
          <div class="flex items-center space-x-2 sm:space-x-3 ml-auto">
            <slot name="attributes" />

            <template v-for="(action, index) in actions" :key="index">
              <button
                type="button"
                @click="action.action"
                class="px-3 py-2 w-1/2 text-sm sm:w-auto rounded text-center font-medium inline-flex text-white items-center justify-center bg-gray-900 hover:bg-gray-800 focus:ring-4 focus:ring-gray-200"
              >
                <span class="mr-1.5">{{ action.text }}</span>
                <template v-if="typeof action.icon == 'string'">
                  <!-- <v-icon :name="action.icon" class="w-5 h-5" /> -->
                </template>
                <template v-if="typeof action.icon == 'object'">
                  <!-- <v-icon :name="action.icon.name" :type="action.icon.type" class="w-5 h-5" /> -->
                </template>
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col">
      <div class="overflow-x-auto">
        <div class="align-middle inline-block min-w-full">
          <div class="shadow overflow-hidden">
            <table class="table-fixed min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-100">
                <Column
                  :params="params"
                  :columns="data.columns"
                  :selectAll="selectAll"
                  @onSort="handleOnSort"
                  @onSelectAll="handleOnSelectAll"
                />
              </thead>
              <tbody
                class="bg-white divide-y divide-gray-200"
                v-if="data.data.data.length"
              >
                <tr
                  v-for="(item, index) in data.data.data"
                  :key="index"
                  class="hover:bg-gray-100"
                >
                  <template v-for="(column, i) in data.columns" :key="i">
                    <td v-if="column.blank && column.checkbox" class="p-4 w-4">
                      <div class="flex items-center">
                        <input
                          :id="`checkbox-${id}`"
                          type="checkbox"
                          @change="handleOnSelect"
                          v-model="selected"
                          :value="item[checkboxKey]"
                          class="h-4 w-4 rounded bg-gray-50 border-gray-300 focus:ring-3 focus:ring-gray-200"
                        />
                        <label :for="`checkbox-${id}`" class="sr-only"
                          >checkbox</label
                        >
                      </div>
                    </td>
                    <td
                      v-else-if="!column.blank"
                      class="p-4 whitespace-nowrap text-base font-medium text-gray-900"
                    >
                      <slot :name="column.column" :item="item" />
                      <div v-if="!$slots[column.column]">
                        <div v-if="!item[column.column] && column.na">
                          <nullable :value="null" />
                        </div>
                        <div v-else>
                          {{ item[column.column] }}
                        </div>
                      </div>
                    </td>
                  </template>
                </tr>
              </tbody>
              <tbody class="bg-white divide-y divide-gray-200" v-else>
                <tr>
                  <td
                    class="text-center p-4 text-gray-600"
                    :colspan="data.columns.length"
                  >
                    Kosong
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <Pagination
      :total="data.data.total"
      :last="data.data.last_page"
      :current="data.data.current_page"
      :from="data.data.from"
      :to="data.data.to"
      @loadPage="handleOnLoadPage"
    />
  </main>
</template>
<script setup>
import Pagination from "./pagination.vue";
import nullable from "./nullable.vue";
import InputSelect from "../filter/input-select.vue";
import Column from "./column.vue";
import { v4 as uuid } from "uuid";
import { Inertia } from "@inertiajs/inertia";
import { string } from "vue-types";
import { ref, watchEffect } from "vue";

const selected = ref([]);
const selectAll = ref(false);

const id = uuid();
const perpages = [15, 30, 50];

const props = defineProps({
  data: Object,
  actions: [Array, Object],
  checkboxKey: string().def("id"),
});

const params = ref({
  column: props.data.filters?.column,
  search: props.data.filters?.search,
  direction: props.data.filters?.direction,
  perpage: props.data.filters?.perpage ?? 15,
  page: props.data.current_page,
  filters: props.data.filters.filters
    ? Object.keys(props.data.filters.filters).reduce(
        (ac, a) => ({
          ...ac,
          [a]: props.data.filters.filters[a],
        }),
        {}
      )
    : null,
});

const filtersModels = props.data.fields
  ? Object.keys(props.data.fields).reduce(
      (ac, a) => ({
        ...ac,
        [a]: null,
      }),
      {}
    )
  : null;

const handleOnSort = (column) => {
  if (!props.data.filters) return;

  params.value.column = column;
  params.value.direction = params.value.direction === "asc" ? "desc" : "asc";
};

const handleOnLoadPage = (page) => {
  params.value.page = page;
};

const handleOnSelectFilter = (event, key, type) => {
  if (params.value.filters) {
    params.value.filters = {
      ...params.value.filters,
      [key]: event.target.value,
    };
  } else {
    params.value.filters = {
      [key]: event.target.value,
    };
  }
};

const handleOnClearFilter = () => {
  if (params.value.filters) {
    Object.keys(params.value.filters).forEach((value) => {
      filtersModels[value] = null;
    });

    params.value.filters = null;
  }
};

const handleOnSelect = () => {
  const selectedItems = props.data.data.data.filter((value) =>
    Object.values(selected).includes(value[props.checkboxKey])
  );

  emit("on-select", selectedItems);
};

const handleOnSelectAll = () => {
  let all = [];
  selected.value = [];

  if (!selectAll.value) {
    for (let item in props.data.data.data) {
      all.push(props.data.data.data[item]);
      selected.value.push(props.data.data.data[item][props.checkboxKey]);
    }
  }

  emit("on-select-all", all);
};

watchEffect(() => {
  const paramsCopy = { ...params.value };
  delete paramsCopy.filters;

  Inertia.get(window.location.pathname, paramsCopy, {
    replace: true,
    preserveState: true,
  });
});

watchEffect(() => {
  if (props.data.data.data.length !== selected.value.length) {
    selectAll.value = false;
  } else {
    selectAll.value = true;
  }
});
</script>
<script>
export default {
  name: "Inertable",
};
</script>
