<script setup>
    import {computed, onMounted, ref} from 'vue';
    import {useStatusesStore} from "../../composables/store/statusesStore";
    import {storeToRefs} from "pinia";

    const props = defineProps({
        day: String,
        employeeId: Number,
        employeeName: String,
        status: Number,
        logs: Array,
        note: String,
    });

    const emit = defineEmits(['clickYes', 'clickNo', 'clickCancel'])

    const statusesStore = useStatusesStore();
    const {statuses} = storeToRefs(statusesStore);

    const statusesShow = computed(() => statuses.value.filter(item => !item.deletedAt));
    const currentStatusId = ref(props.status)
    const dateFrom = ref(props.day)
    const dateTo = ref(props.day)
    const note = ref(props.note)

    const statusesByKey = ref(statuses.value.reduce((acc, item) => {
        acc[item.id] = item;
        return acc;
    }, {}));

    const setStatus = (status) => {
        currentStatusId.value = status
    }
</script>

<template>
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div class="p-4 bg-white rounded-lg shadow-lg w-80 relative">
            <div class="absolute top-2 right-2">
                <button @click="emit('clickCancel')" class="hover:bg-gray-200">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.4 19L5 17.6L10.6 12L5 6.4L6.4 5L12 10.6L17.6 5L19 6.4L13.4 12L19 17.6L17.6 19L12 13.4L6.4 19Z"
                              fill="#1D1B20"/>
                    </svg>
                </button>
            </div>
            <h2 class="font-semibold mt-2 whitespace-normal overflow-hidden">Cтатус для {{employeeName}}:
                "{{statusesByKey[currentStatusId] ? statusesByKey[currentStatusId].fullName : 'не встановлено'}}"</h2>
            <div class="flex flex-wrap gap-2 mt-2">
                <div class="w-1/2 sm:w-full">
                    <label for="dateFrom" class="block text-sm font-medium text-gray-900">Дата з:</label>
                    <input type="date" id="dateFrom" v-model="dateFrom"
                           class="w-32 p-1 m-1 rounded-lg border-1 border-gray-300"/>
                </div>
                <div class="w-32 w-1/2 sm:w-full">
                    <label for="dateTo" class="block text-sm font-medium text-gray-900">Дата по:</label>
                    <input type="date" id="dateTo" v-model="dateTo"
                           class="p-1 m-1 rounded-lg border-1 border-gray-300"/>
                </div>
            </div>
            <div>
                <label for="note" class="block mt-2 text-sm font-medium text-gray-900">Коментар:</label>
                <input id="note" v-model="note"
                       class="w-full border-1 border-gray-300 p-1 m-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                       type="text">
            </div>
            <div class="my-2 text-sm font-medium text-gray-900">Встановити статус:</div>
            <div class="flex flex-wrap gap-4 items-center justify-around">
                <div v-for="item in statusesShow" :key="item.id">
                    <button class="w-[40px] h-[40px] text-sm font-semibold rounded cursor-pointer"
                            :class="{'border-1 border-gray-600  rounded-lg': item.id === currentStatusId}"
                            @click="setStatus(item.id)"
                            :style="{ color: item.textColor, backgroundColor: item.bgColor }">{{item.shortName}}
                    </button>
                </div>
            </div>
                <div v-if="props.logs" class="pt-3 pb-1 text-xs font-medium text-gray-900">Хронологія статусів:</div>
                <div v-for="(item, index) in props.logs" :key="index"
                     class="text-xs text-gray-900 whitespace-normal overflow-hidden">
                    {{ item }}
                </div>

            <div class="flex justify-end mt-4">
                <button @click="emit('clickYes', props.employeeId, currentStatusId, dateFrom, dateTo, note)"
                        class="bg-green-700 transition delay-50 duration-300 ease-in-out hover:scale-110 hover:bg-green-900 text-white px-4 py-2 mr-6 rounded-lg">
                    Встановити
                </button>
                <button @click="emit('clickNo')"
                        class="bg-blue-700 transition delay-50 duration-300 ease-in-out hover:scale-110 hover:bg-blue-900 text-white px-4 py-2 rounded-lg">
                    Відмінити
                </button>
            </div>
        </div>
    </div>
</template>


<style scoped>

</style>
