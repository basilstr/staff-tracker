<script setup>

    import {ref, watch} from "vue";

    const props = defineProps({
        statusesTopShow: Object,
        statusesByKey: Object,
        statusId: Number,
        employees: Object,
        reportData: Object,
        workDays: Boolean,
        saturdayDays: Boolean,
        sundayDays: Boolean,
        scrollTop: Number,
    });

    const dateContainer = ref(null);
    watch(() => props.scrollTop, () => {
        if (dateContainer.value) {
            dateContainer.value.style.marginTop = (props.scrollTop - 1) + "px";
        }
    })
</script>

<template>
    <div class="w-[40px] relative">
        <div class="absolute text-xs font-bold h-[40px] w-[40px] border-r border-gray-400 text-center bg-gray-100 z-10"
             ref="dateContainer">
            <div class="w-[40px]">
                <button class="w-[30px] h-[30px] text-sm font-semibold rounded"
                        :style="{ color: statusesByKey[statusId].textColor, backgroundColor: statusesByKey[statusId].bgColor }">
                    {{statusesByKey[statusId].shortName}}
                </button>
            </div>
        </div>
        <div class="border-r border-gray-400" style="height: 40px"></div>
        <div v-for="(employee, index) in employees" :key="employee.id">
            <div class="flex items-center justify-center h-[30px] text-center border-b border-r border-gray-400"
                 :class="{ 'border-t border-gray-400': index === 0 }">
                {{ ((workDays ? reportData[employee.id]?.[statusId]?.[0] ?? 0 : 0) +
                (saturdayDays ? reportData[employee.id]?.[statusId]?.[1] ?? 0 : 0) +
                (sundayDays ? reportData[employee.id]?.[statusId]?.[2] ?? 0 : 0)) ?
                ((workDays ? reportData[employee.id]?.[statusId]?.[0] ?? 0 : 0) +
                (saturdayDays ? reportData[employee.id]?.[statusId]?.[1] ?? 0 : 0) +
                (sundayDays ? reportData[employee.id]?.[statusId]?.[2] ?? 0 : 0)) : ''}}
            </div>
        </div>
    </div>
</template>


<style scoped>
</style>
