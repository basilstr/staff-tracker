<script setup>
    import {storeToRefs} from "pinia";

    import {useEmployeesStore} from "../../composables/store/employeesStore.js";

    const employeesStore = useEmployeesStore();
    const {employeesVisible: employees} = storeToRefs(employeesStore);
</script>

<template>
    <div class="w-[30%]">
        <div class="border-r border-gray-400" style="height: 40px"></div>
        <div v-for="item in employees" :key="item.id"
             class="text-sm h-[30px] px-1 border-t border-r border-l border-gray-200 truncate flex items-center"
             :style="{ color: item.textColor, backgroundColor: item.bgColor }">
            <p class="truncate flex-1">{{item.name}}</p>
        </div>
    </div>
</template>

<style scoped>
</style>
