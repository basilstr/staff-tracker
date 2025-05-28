<script setup>
    import ReportCol from "./ReportCol.vue";
    import PromtYesNo from "../../components/PromtYesNo.vue";
    import {ref, watch} from 'vue';
    import {computed} from "@vue/reactivity";

    const currentUnit = defineModel('currentUnit')
    const selectedDateFrom = defineModel('selectedDateFrom')
    const selectedDateTo = defineModel('selectedDateTo')
    const scrollTop = defineModel('scrollTop')
    const workDays = defineModel('workDays')
    const saturdayDays = defineModel('saturdayDays')
    const sundayDays = defineModel('sundayDays')

    import {useRouter} from 'vue-router'
    import {logout} from "../../firebase";

    const router = useRouter()

    import {storeToRefs} from "pinia";
    import {useUnitsStore} from "../../composables/store/unitsStore.js";

    const unitsStore = useUnitsStore();

    import {useEmployeesStore} from "../../composables/store/employeesStore.js";

    const employeesStore = useEmployeesStore();
    const {employeesVisible: employees} = storeToRefs(employeesStore);

    import {useStatusesStore} from "../../composables/store/statusesStore.js";

    const statusesStore = useStatusesStore();
    const {statuses} = storeToRefs(statusesStore);


    import {useReportStore} from "../../composables/store/reportStore.js";

    const reportStore = useReportStore();
    const {reportData, statusesList} = storeToRefs(reportStore);
    import {useCaseGetReport} from "../../composables/usecases/report/useCaseGetReport";
    import {onMounted} from "@vue/runtime-core";

    const {loading: loadingReport, error: errorReport, authError: authReportError, fetchReport: fetchReport, cancelRequest: cancelReportRequest} = useCaseGetReport(reportStore);

    const scrollContainer = ref(null);
    const isDragging = ref(false);
    const startX = ref(0);
    const scrollLeft = ref(0);
    const isClick = ref(false);
    const leftDate = ref(null);
    const rightDate = ref(null);
    const isFetchLeft = ref(true);
    const pausedDrag = ref(false);

    onMounted(() => {
        if (currentUnit.value) {
            getReport()
        }
        scrollContainer.value.style.height = (employees.value.length * 30 + 40) + 'px'
    })

    watch(currentUnit, () => {
        if (currentUnit.value) {
            cancelReportRequest()
            getReport()
        }
    });

    watch([selectedDateFrom, selectedDateTo], () => {
        if (!currentUnit.value || !selectedDateFrom.value && !selectedDateTo.value) return

        cancelReportRequest()
        reportStore.clearReport()

        isDragging.value = false
        startX.value = 0
        scrollLeft.value = 0
        isClick.value = false
        leftDate.value = null
        rightDate.value = null
        isFetchLeft.value = true

        getReport()
    });

    watch(employees, () => {
        scrollContainer.value.style.height = (employees.value.length * 30 + 40) + 'px'
    })

    const cancel = () => {
        errorReport.value = ''
    }
    const logoutAction = async () => {
        cancelReportRequest()
        await logout();
        await router.push('/login');
    };

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

    const getReport = () => {
        if (reportStore.isEmptyReport(unitsStore.getCurrentUnitId(), selectedDateFrom.value, selectedDateTo.value)) {
            fetchReport(unitsStore.getCurrentUnitId(), selectedDateFrom.value, selectedDateTo.value)
        }
    }

    const statusesTopShow = computed(() => statuses.value.filter(item => statusesList?.value.indexOf(item.id) >= 0));
    const statusesByKey = computed(() => {
        if (!statuses.value.length) return null
        return statuses.value.reduce((acc, item) => {
            acc[item.id] = item;
            return acc;
        }, {})
    })

</script>

<template>
    <div v-if="loadingReport" class="w-full bg-gray-200 rounded-full h-4 overflow-hidden relative mt-50 mx-10">
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
        <div v-if="employees && statuses && reportData" class="scroll-content">
            <div class="item" v-for="status in statusesTopShow" :key="status.id">
                <ReportCol :statusesTopShow="statusesTopShow"
                           :statusesByKey="statusesByKey"
                           :statusId="status.id"
                           :employees="employees"
                           :reportData="reportData"
                           :workDays="workDays"
                           :saturdayDays="saturdayDays"
                           :sundayDays="sundayDays"
                           :scrollTop="scrollTop"
                />
            </div>
        </div>
    </div>

    <div v-if="errorReport">
        <PromtYesNo
            title="Помилка"
            :message="errorReport"
            yesText="Повторити"
            noText="Відмінити"
            @click-yes="getReport()"
            @click-no="cancel"
            @click-cancel="cancel"
        />
    </div>
    <div v-if="authReportError">
        <PromtYesNo
            title="Помилка"
            message="Облікові дані невірні"
            yesText="OK"
            @click-yes="logoutAction"
            @click-cancel="logoutAction"
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
