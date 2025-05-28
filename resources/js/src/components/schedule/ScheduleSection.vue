<script setup>
    import PromtYesNo from "../../components/PromtYesNo.vue";
    import ScheduleCol from "./ScheduleCol.vue";
    import {ref, watch} from 'vue';
    import {nextTick, onUnmounted} from "@vue/runtime-core";

    const currentUnit = defineModel('currentUnit')
    const selectedDate = defineModel('selectedDate')
    const employeeRank = defineModel('employeeRank')
    const scrollTop = defineModel('scrollTop')

    import {storeToRefs} from "pinia";
    import {useUnitsStore} from "../../composables/store/unitsStore.js";

    const unitsStore = useUnitsStore();

    import {useEmployeesStore} from "../../composables/store/employeesStore.js";

    const employeesStore = useEmployeesStore();
    const {employeesVisible: employees} = storeToRefs(employeesStore);

    import {useStatusesStore} from "../../composables/store/statusesStore.js";

    const statusesStore = useStatusesStore();
    const {statuses} = storeToRefs(statusesStore);

    import {useSchedulesStore} from "../../composables/store/schedulesStore.js";

    const schedulesStore = useSchedulesStore();
    const {indexes, statusesList} = storeToRefs(schedulesStore);

    const scrollContainer = ref(null);
    const isDragging = ref(false);
    const startX = ref(0);
    const scrollLeft = ref(0);
    const isClick = ref(false);
    const leftDate = ref(null);
    const rightDate = ref(null);
    const isFetchLeft = ref(true);
    const pausedDrag = ref(false);

    import {useCaseGetSchedules} from "../../composables/usecases/schedule/useCaseGetSchedules";
    import {computed} from "@vue/reactivity";
    import {APP_CONSTANTS} from "../../constants";

    const {loading: loadingSchedules, error: errorSchedules, authError: authSchedulesError, fetchSchedules: fetchSchedules, cancelRequest: cancelSchedulesRequest} = useCaseGetSchedules(schedulesStore);

    // Видаляємо слухача при знищенні компонента
    onUnmounted(() => {
        scrollContainer.value?.removeEventListener('scroll', checkScroll);
    });

    watch(loadingSchedules, async () => {
        scrollContainer.value?.removeEventListener('scroll', checkScroll);
        if (!loadingSchedules.value) {
            isDragging.value = false;
            await nextTick();
            if (!leftDate.value) {
                leftDate.value = selectedDate.value
            }
            if (isFetchLeft.value) scrollContainer.value.scrollLeft = scrollContainer.value.scrollLeft + (APP_CONSTANTS.FETCH_PERIOD_DAY - 1) * 40 // Прокрутка до дати яка знаходиться біля лівого краю і показана повністю (10 днів загрузка по 40 рх мінус один елемент 40рх = 360) (ширина 40px)
            await nextTick();
            scrollContainer.value.addEventListener('scroll', checkScroll); // Стежимо за скролом
        }
    });

    watch(currentUnit, () => {
        if (currentUnit.value) {
            cancelSchedulesRequest()
            getSchedules(selectedDate.value)
        }
    });

    watch(selectedDate, () => {
        if (!currentUnit.value) return

        cancelSchedulesRequest()
        schedulesStore.checkAndClearUnit(null)

        isDragging.value = false
        startX.value = 0
        scrollLeft.value = 0
        isClick.value = false
        leftDate.value = null
        rightDate.value = null
        isFetchLeft.value = true

        getSchedules(selectedDate.value)
    });

    const cancel = () => {
        errorSchedules.value = ''
    }

    const startDrag = (event) => {
        if (event.type === "touchstart") {
            startX.value = event.touches[0].pageX - scrollContainer.value.offsetLeft;
        } else {
            startX.value = event.pageX - scrollContainer.value.offsetLeft;
        }
        isDragging.value = true;
        isClick.value = true; // Вважаємо, що це клік, доки не буде значного руху
        scrollLeft.value = scrollContainer.value.scrollLeft;
    };

    const onDrag = (event) => {
        if (pausedDrag.value) return;
        if (!isDragging.value) return;
        let x;
        if (event.type === "touchmove") {
            x = event.touches[0].pageX - scrollContainer.value.offsetLeft;
        } else {
            x = event.pageX - scrollContainer.value.offsetLeft;
        }
        const walk = (x - startX.value) * -1;
        scrollContainer.value.scrollLeft = scrollLeft.value + walk;

        if (Math.abs(walk) > 5) {
            isClick.value = false; // Якщо було перетягування, не вважаємо це кліком
        }
    };

    const stopDrag = () => {
        isDragging.value = false;
    };

    const getSchedules = (date) => {
        if (schedulesStore.isEmptyByDate(unitsStore.getCurrentUnitId(), date)) {
            const {unit, dateFrom, dateTo} = schedulesStore.getRangeDates(unitsStore.getCurrentUnitId(), date)
            fetchSchedules(unit, dateFrom, dateTo)
        }
    }

    // Автопідвантаження при прокручуванні
    const checkScroll = () => {
        if (!scrollContainer.value) return;

        const {scrollLeft, offsetWidth} = scrollContainer.value;

        leftDate.value = schedulesStore.getDateByIndex(Math.floor(scrollLeft / 40))
        rightDate.value = schedulesStore.getDateByIndex(Math.floor((scrollLeft + offsetWidth) / 40))
    };

    const statusesBottomShow = computed(() => statuses.value.filter(item => statusesList?.value.indexOf(item.id) >= 0));

    const statusesGroupShow = computed(() => statuses.value.filter(item => item.group && !item.deletedAt));

    watch([employees, statusesBottomShow, statusesGroupShow], () => {
        let groupHeight = employeeRank.value >= APP_CONSTANTS.RANK_SET_GROUP_STATUS ? statusesGroupShow.value.length * 40 : 0
        // додаємо ще 21, бо 20 висота поля з датою, а 1 це нижній border
        scrollContainer.value.style.height = (employees.value.length * 40 + groupHeight + (statusesBottomShow.value.length + 1) * 20 + 42) + 'px'
    })

    watch(leftDate, (date) => {
        if (!leftDate.value) return

        if (schedulesStore.isEmptyByDate(unitsStore.getCurrentUnitId(), date)) {
            const {unit, dateFrom, dateTo} = schedulesStore.getRangeDates(unitsStore.getCurrentUnitId(), date)
            isFetchLeft.value = true
            fetchSchedules(unit, dateFrom, dateTo)
        }
    })

    watch(rightDate, (date) => {
        if (!rightDate.value) return

        if (schedulesStore.isEmptyByDate(unitsStore.getCurrentUnitId(), date)) {
            const {unit, dateFrom, dateTo} = schedulesStore.getRangeDates(unitsStore.getCurrentUnitId(), date)
            isFetchLeft.value = false
            fetchSchedules(unit, dateFrom, dateTo)
        }
    })

</script>

<template>
    <div v-if="loadingSchedules" class="w-full bg-gray-200 rounded-full h-4 overflow-hidden relative mt-50 mx-10">
        <div class="absolute h-4 w-1/3 bg-cyan-900 animate-loader"></div>
    </div>

    <div class="scroll-container"
         ref="scrollContainer"
         @mousedown="startDrag"
         @mousemove="onDrag"
         @mouseup="stopDrag"
         @mouseleave="stopDrag"
         @touchstart="startDrag"
         @touchmove="onDrag"
         @touchend="stopDrag">
        <div class="scroll-content">
            <div class="item" v-for="day in indexes" :key="day">
                <ScheduleCol :day="day" :isClick="isClick" :employeeRank="employeeRank" :currentUnit="currentUnit"
                             :scrollTop="scrollTop" v-model="pausedDrag"/>
            </div>
        </div>
    </div>

    <div v-if="errorSchedules">
        <PromtYesNo
            title="Помилка"
            :message="errorSchedules"
            yesText="OK"
            @click-yes="cancel"
            @click-cancel="cancel"
        />
    </div>

</template>


<style scoped>
    .scroll-container {
        overflow: hidden;
        white-space: nowrap;
        display: flex;
        cursor: grab;
        user-select: none;
    }

    .scroll-content {
        display: flex;
    }

    .item {
        width: 40px;
        height: 0;
    }

    @keyframes loader {
        0% {
            left: -33%;
        }
        100% {
            left: 100%;
        }
    }

    .animate-loader {
        animation: loader 1.5s linear infinite;
    }
</style>
