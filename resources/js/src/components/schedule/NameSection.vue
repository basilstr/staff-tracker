<script setup>
    import {useRouter} from 'vue-router'
    import {storeToRefs} from "pinia";
    import {computed} from "@vue/reactivity";

    import {useEmployeesStore} from "../../composables/store/employeesStore.js";

    const employeesStore = useEmployeesStore();
    const {employeesVisible: employees, employeesHidden, unit: employeeUnit} = storeToRefs(employeesStore);

    import {useSchedulesStore} from "../../composables/store/schedulesStore.js";

    const schedulesStore = useSchedulesStore();
    const {statusesList} = storeToRefs(schedulesStore);

    import {useStatusesStore} from "../../composables/store/statusesStore.js";

    const statusesStore = useStatusesStore();
    const {statuses, unit} = storeToRefs(statusesStore);

    const statusesBottomShow = computed(() => statuses.value.filter(item => statusesList?.value.indexOf(item.id) >= 0));
    const groupHeight = computed(() => `${statuses.value.filter(item => !item.deletedAt && item.group).length * 40}`);

    const router = useRouter()

    const employeeRank = defineModel()
    const canSetStatusGroup = computed(() => employeeRank.value >= 40)
    const canEditEmployee = computed(() => employeeRank.value >= 50)

    const detailEmployee = (id) => {
        if (canEditEmployee.value) router.push('/detail/' + id)
    }
</script>

<template>
    <div class="w-[30%]">
        <div v-if="canSetStatusGroup"
             class="pr-1 text-xs text-right border-r border-gray-200 flex items-center justify-end line-clamp-3"
             :style="{ height: groupHeight + 'px' }">групове встановлення статусів
        </div>
        <div style="height: 40px"></div>
        <div v-for="item in employees" :key="item.id"
             class="text-sm h-[40px] px-1 border-t border-r border-l border-gray-200 truncate flex items-center"
             :class="{'cursor-pointer': canEditEmployee}"
             :style="{ color: item.textColor, backgroundColor: item.bgColor }"
             @click="detailEmployee(item.id)">
            <p class="truncate flex-1">{{item.name}}</p>
        </div>
        <div v-if="employeeUnit"
             class="pr-1 text-sm h-[20px] text-right border-b border-r border-l border-gray-200 truncate">За списком:
        </div>
        <div v-for="item in statusesBottomShow" :key="item.id"
             class="pr-1 text-sm h-[20px] text-right border-b border-r border-l border-gray-200 truncate">
            {{item.fullName}}
        </div>
        <div v-if="employeesHidden.length">
            <div v-if="canSetStatusGroup">
                <div class="h-[40px] border-b border-gray-600"></div>
                <div class="pr-1 text-sm h-[20px] text-center font-medium">Не в списку:</div>
                <div v-for="item in employeesHidden" :key="item.id"
                     class="text-sm h-[40px] px-1 border-t border-r border-l border-gray-200 truncate flex items-center"
                     :class="{'cursor-pointer': canEditEmployee}"
                     :style="{ color: item.textColor, backgroundColor: item.bgColor }"
                     @click="detailEmployee(item.id)">
                    <p class="truncate flex-1">{{item.name}}</p>
                </div>
            </div>
        </div>
    </div>
</template>


<style scoped>
</style>
