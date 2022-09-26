![Package Logo](https://banners.beyondco.de/INERTABLE-VUE.png?theme=light&packageManager=npm+install&packageName=%40rizkhal%2Finertable-vue&pattern=topography&style=style_1&description=An+Inertable+for+Vue3&md=1&showWatermark=1&fontSize=125px&images=table)

## INSTALATION

```bash
npm install @rizkhal/inertable-vue
```

## BASIC USAGE

```vue
<script setup>
defineProps({
    inertable: Object,
});
</script>
<template>
    <div>
        <Inertable :data="inertable" />
    </div>
</template>
```

or you can costum the column with `slot` name, the slot name is equals from your inertable column name

```vue
<script setup>
defineProps({
    inertable: Object,
});
</script>
<template>
    <div>
        <Inertable :data="inertable">
            <template #name="{ item: {name} }">
                <span>{{ name }}</span>
            </template>
        </Inertable>
    </div>
</template>
```

