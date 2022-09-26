<template>
  <main>
    <div
      class="
        p-4
        block
        sm:flex
        lg:mt-1.5
        bg-white
        items-center
        justify-between
        border-b border-gray-200
      "
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
            <template v-for="(action, index) in actions" :key="index">
              <button
                type="button"
                @click="$emit(action.emit)"
                class="
                  w-1/2
                  text-white
                  bg-cyan-600
                  hover:bg-cyan-700
                  focus:ring-4 focus:ring-cyan-200
                  font-medium
                  inline-flex
                  items-center
                  justify-center
                  rounded-lg
                  text-sm
                  px-3
                  py-2
                  text-center
                  sm:w-auto
                "
              >
                {{ action.text }}
              </button>
            </template>

            <div class="ml-3 relative" v-if="Object.keys(data.fields).length">
              <Dropdown
                align="right"
                width="max"
                content-classes="bg-white p-2"
              >
                <template #trigger>
                  <span class="inline-flex rounded-md">
                    <button
                      type="button"
                      class="
                        inline-flex
                        items-center
                        px-3
                        py-2
                        border border-transparent
                        text-sm
                        leading-4
                        font-medium
                        rounded-md
                        text-white
                        bg-cyan-600
                        hover:text-cyan-200
                        focus:outline-none
                        transition
                        ease-in-out
                        duration-150
                      "
                    >
                      Filter

                      <FunnelIcon class="ml-2 -mr-0.5 h-4 w-4" />
                    </button>
                  </span>
                </template>
              </Dropdown>
            </div>
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
                  :columns="data.columns"
                  :params="params"
                  @onSort="handleSort"
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
                          class="
                            bg-gray-50
                            border-gray-300
                            focus:ring-3 focus:ring-cyan-200
                            h-4
                            w-4
                            rounded
                          "
                        />
                        <label :for="`checkbox-${id}`" class="sr-only"
                          >checkbox</label
                        >
                      </div>
                    </td>
                    <td
                      v-else-if="!column.blank"
                      class="
                        p-4
                        whitespace-nowrap
                        text-base
                        font-medium
                        text-gray-900
                      "
                    >
                      <slot :name="column.column" :item="item" />
                      <div v-if="!$slots[column.column]">
                        {{ item[column.column] }}
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
<script>
import { v4 as uuid } from "uuid";
import { pickBy, throttle } from "lodash";
import { FunnelIcon } from "@heroicons/vue/24/outline";

// filter
import Dropdown from "../filter/dropdown.vue";
import DropdownLink from "../filter/dropdown-link.vue";
import Search from "../filter/search.vue";
import InputSelect from "../filter/input-select.vue";

// table
import Column from "./column.vue";
import Pagination from "./pagination.vue";

export default {
  name: "Inertable",
  components: {
    Column,
    Search,
    Pagination,
    FunnelIcon,
    InputSelect,
    Dropdown,
    DropdownLink,
  },
  props: {
    data: Object,
    actions: [Array, Object],
  },
  data() {
    return {
      id: uuid(),
      perpages: [15, 30, 50],
      params: {
        column: this.data.filters?.column,
        search: this.data.filters?.search,
        direction: this.data.filters?.direction,
        perpage: this.data.filters?.perpage ?? 15,
        page: this.data.current_page,
        filters: this.data.filters.filters
          ? Object.keys(this.data.filters.filters).reduce(
              (ac, a) => ({ ...ac, [a]: this.data.filters.filters[a] }),
              {}
            )
          : null,
      },
      filtersModels: this.data.fields
        ? Object.keys(this.data.fields).reduce(
            (ac, a) => ({ ...ac, [a]: null }),
            {}
          )
        : null,
    };
  },
  methods: {
    handleSort(column) {
      if (!this.data.filters) return;

      this.params.column = column;
      this.params.direction = this.params.direction === "asc" ? "desc" : "asc";
    },
    handleOnLoadPage(page) {
      this.params.page = page;
    },
  },
  watch: {
    params: {
      handler: throttle(function () {
        let params = pickBy(this.params);

        this.$inertia.get(`${window.location.pathname}`, params, {
          replace: true,
          preserveState: true,
        });
      }, 100),
      deep: true,
    },
  },
};
</script>