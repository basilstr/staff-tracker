<script setup>
    import PromtYesNo from "../components/PromtYesNo.vue";
    import GroupList from "../components/element/GroupList.vue";
    import NameSection from "../components/report/NameSection.vue";
    import ReportSection from "../components/report/ReportSection.vue";

    import {ref, watch, nextTick, computed, onMounted} from 'vue'
    import {useRouter} from 'vue-router'
    import {logout} from "../firebase";
    import {storeToRefs} from "pinia";

    const router = useRouter()

    import {useUnitsStore} from "../composables/store/unitsStore.js";

    const unitsStore = useUnitsStore();
    const {units} = storeToRefs(unitsStore);
    import {useCaseGetUnits} from "../composables/usecases/unit/useCaseGetUnits";

    const {loading: loadingUnits, error: errorUnits, authError: authUnitsError, fetchUnits: fetchUnits, cancelRequest: cancelUnitsRequest} = useCaseGetUnits(unitsStore);

    import {useEmployeesStore} from "../composables/store/employeesStore.js";

    const employeesStore = useEmployeesStore();
    const {employeesVisible: employees, employeeUser} = storeToRefs(employeesStore);
    import {useCaseGetEmployees} from "../composables/usecases/employees/useCaseGetEmployees";

    const {loading: loadingEmployees, error: errorEmployees, authError: authEmployeesError, fetchEmployees: fetchEmployees, cancelRequest: cancelEmployeesRequest} = useCaseGetEmployees(employeesStore);

    import {useStatusesStore} from "../composables/store/statusesStore";

    const statusesStore = useStatusesStore();
    const {statuses} = storeToRefs(statusesStore);

    import {useCaseGetStatuses} from "../composables/usecases/status/useCaseGetStatuses";
    import {onUnmounted} from "@vue/runtime-core";

    const {loading: loadingStatuses, error: errorStatuses, authError: authStatusesError, fetchStatuses: fetchStatuses, cancelRequest: cancelStatusesRequest} = useCaseGetStatuses(statusesStore);

    const viewportHeight = ref(window.innerHeight)
    const scrollTop = ref(0);

    const currentUnit = ref(unitsStore.getCurrentUnitId())
    const timeoutId = ref(null);
    const workDays = ref(true);
    const saturdayDays = ref(true);
    const sundayDays = ref(true);
    const filterText = ref('Показувати всі дні тижня');
    const reportContainer = ref(null);

    const selectedDateFrom = ref('');
    const selectedDateTo = ref('');
    let dateFrom = new Date()
    let dateTo = new Date()
    dateFrom.setDate(1)
    dateTo.setDate(1)
    dateTo.setMonth(dateTo.getMonth() + 1)
    dateTo.setDate(dateTo.getDate() - 1)
    selectedDateFrom.value = dateFrom.toISOString().split('T')[0]; // Встановлюємо поточну дату в selectedDate
    selectedDateTo.value = dateTo.toISOString().split('T')[0]; // Встановлюємо поточну дату в selectedDate


    const back = () => {
        router.push('/employees')
    }

    const isLoading = computed(() => loadingUnits.value || loadingEmployees.value || loadingStatuses.value)
    const authError = computed(() => authEmployeesError.value || authUnitsError.value || authStatusesError.value);
    const error = computed(() => errorUnits.value || errorEmployees.value || errorStatuses.value);

    const errorAction = () => {
        errorUnits.value = ''
        errorEmployees.value = ''
        errorStatuses.value = ''
    }

    onMounted(async () => {
        if (unitsStore.getCurrentUnitId()) {
            await loadEmployeeAndStatus()
        } else {
            await fetchUnits()
        }
        if (reportContainer.value) {
            reportContainer.value.addEventListener("scroll", handleScroll);
        }
        window.addEventListener('resize', updateHeight);
    })

    onUnmounted(() => {
        if (reportContainer.value) {
            reportContainer.value.removeEventListener("scroll", handleScroll);
        }
        window.removeEventListener("resize", updateHeight);
    });

    const handleScroll = () => {
        if (reportContainer.value) {
            scrollTop.value = reportContainer.value.scrollTop
        }
    }

    watch(units, async () => {
        await loadEmployeeAndStatus()
    });

    watch(currentUnit, async () => {
        unitsStore.setCurrentUnitId(currentUnit.value)
        employeesStore.clearEmployees()
        await loadEmployeeAndStatus()
    })

    const loadEmployeeAndStatus = async () => {
        currentUnit.value = unitsStore.getCurrentUnitId()
        await fetchEmployees(unitsStore.getCurrentUnitId())
        await fetchStatuses(unitsStore.getCurrentUnitId())
        await updateHeight()
    }

    const logoutAction = async () => {
        cancelUnitsRequest()
        cancelEmployeesRequest()
        cancelStatusesRequest()

        await logout();
        await router.push('/login');
    };

    // Функція для обчислення та оновлення висоти загального контейнера з іменами та розкладом
    const updateHeight = async () => {
        await nextTick()
        viewportHeight.value = window.innerHeight

        clearTimeout(timeoutId.value);
        timeoutId.value = setTimeout(() => {
            const reportContainerRect = reportContainer.value?.getBoundingClientRect();

            if (reportContainerRect) {
                reportContainer.value.style.height = (viewportHeight.value - reportContainerRect.top) + 'px';
            }
        }, 500); // Затримка в 500 мс
    };

    watch([workDays, saturdayDays, sundayDays], () => {
        if (workDays.value && saturdayDays.value && sundayDays.value) {
            filterText.value = 'Показувати всі дні тижня'
        } else if (workDays.value && !saturdayDays.value && !sundayDays.value) {
            filterText.value = 'Показувати тільки робочі дні'
        } else if (!workDays.value && saturdayDays.value && sundayDays.value) {
            filterText.value = 'Показувати тільки вихідні дні'
        } else if (!workDays.value && saturdayDays.value && !sundayDays.value) {
            filterText.value = 'Показувати тільки суботи'
        } else if (!workDays.value && !saturdayDays.value && sundayDays.value) {
            filterText.value = 'Показувати тільки неділі'
        } else if (workDays.value && saturdayDays.value && !sundayDays.value) {
            filterText.value = 'Показувати тільки робочі дні та суботи'
        } else if (workDays.value && !saturdayDays.value && sundayDays.value) {
            filterText.value = 'Показувати тільки робочі дні та неділі'
        } else {
            filterText.value = 'Увімкніть хоча б один фільтр'
        }
    })
</script>

<template>
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <button @click="back()" class="block text-sm/6 font-medium text-gray-900 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                 class="lucide lucide-circle-arrow-left">
                <circle cx="12" cy="12" r="10"/>
                <path d="M16 12H8"/>
                <path d="m12 8-4 4 4 4"/>
            </svg>
        </button>

        <GroupList v-model:currentUnit="currentUnit" v-model:units="units"/>

        <div v-if="isLoading">
            <div class="mt-6 text-center">
                <div role="status">
                    <svg aria-hidden="true" class="inline w-8 h-8 text-gray-300 animate-spin fill-blue-600"
                         viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"/>
                        <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"/>
                    </svg>
                    <span class="sr-only">Loading...</span>
                </div>
            </div>
        </div>

        <div v-if="!isLoading">
            <div class="flex gap-2 mt-2">
                <div class="w-1/2 sm:w-full">
                    <label for="dateFrom" class="block text-sm font-medium text-gray-900">Дата з:</label>
                    <input type="date" id="dateFrom" v-model="selectedDateFrom"
                           class="w-32 p-1 m-1 rounded-lg border-1 border-gray-300"/>
                </div>
                <div class="w-32 w-1/2 sm:w-full">
                    <label for="dateTo" class="block text-sm font-medium text-gray-900">Дата по:</label>
                    <input type="date" id="dateTo" v-model="selectedDateTo"
                           class="p-1 m-1 rounded-lg border-1 border-gray-300"/>
                </div>
            </div>

            <div class="flex justify-between mt-4">
                <label class="inline-flex items-center cursor-pointer">
                    <input v-model="workDays" type="checkbox" value="" class="sr-only peer" checked>
                    <div class="relative w-9 h-5 bg-gray-300 peer-focus:outline-none
                rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white
                after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300
                after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-stone-600"></div>
                    <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-800">Робочі</span>
                </label>
                <label class="inline-flex items-center cursor-pointer">
                    <input v-model="saturdayDays" type="checkbox" value="" class="sr-only peer" checked>
                    <div class="relative w-9 h-5 bg-gray-300 peer-focus:outline-none
                rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white
                after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300
                after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                    <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-800">Суботи</span>
                </label>
                <label class="inline-flex items-center cursor-pointer">
                    <input v-model="sundayDays" type="checkbox" value="" class="sr-only peer" checked>
                    <div class="relative w-9 h-5 bg-gray-300 peer-focus:outline-none
                rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white
                after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300
                after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-600"></div>
                    <span class="ms-3 text-sm font-medium text-gray-900">Неділі</span>
                </label>
            </div>

            <div class="text-sm font-medium text-gray-500 mt-2 text-center">{{filterText}}</div>

            <div class="flex overflow-y-auto relative mt-4" ref="reportContainer">
                <NameSection/>
                <ReportSection v-model:selectedDateFrom="selectedDateFrom" v-model:selectedDateTo="selectedDateTo"
                               v-model:currentUnit="currentUnit" v-model:scrollTop="scrollTop"
                               v-model:workDays="workDays" v-model:saturdayDays="saturdayDays"
                               v-model:sundayDays="sundayDays"
                />
            </div>
        </div>

        <div v-if="authError">
            <PromtYesNo
                title="Помилка"
                message="Облікові дані невірні"
                yesText="OK"
                @click-yes="logoutAction"
                @click-cancel="logoutAction"
            />
        </div>

        <div v-if="errorStatuses">
            <PromtYesNo
                title="Помилка"
                message="Помилка отримання даних"
                yesText="OK"
                @click-yes="errorAction"
                @click-cancel="errorAction"
            />
        </div>
    </div>
</template>

<style scoped>

</style>
