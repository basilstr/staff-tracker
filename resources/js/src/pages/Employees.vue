<script setup>
    import PromtYesNo from "../components/PromtYesNo.vue";
    import NameSection from "../components/schedule/NameSection.vue";
    import ScheduleSection from "../components/schedule/ScheduleSection.vue";
    import GroupList from "../components/element/GroupList.vue";
    import PromtAddEmployee from "../components/schedule/PromtAddEmployee.vue";

    import {computed, onMounted, ref, watch} from "vue";
    import {storeToRefs} from "pinia";
    import {logout} from '../firebase.js';
    import {useRouter} from 'vue-router'
    import {nextTick, onUnmounted} from "@vue/runtime-core";

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

    import {useStatusesStore} from "../composables/store/statusesStore.js";

    const statusesStore = useStatusesStore();
    const {statuses} = storeToRefs(statusesStore);

    import {useCaseGetStatuses} from "../composables/usecases/status/useCaseGetStatuses";

    const {loading: loadingStatuses, error: errorStatuses, authError: authStatusesError, fetchStatuses: fetchStatuses, cancelRequest: cancelStatusesRequest} = useCaseGetStatuses(statusesStore);

    const currentUnit = ref(unitsStore.getCurrentUnitId())
    const selectedDate = ref('');
    const scrollTop = ref(0);
    const hideButton = ref(false);

    const setEmployeeRank = () => {
        // визначення rank користувача системи в даній групі
        employeeRank.value = employeeUser.value ? employeeUser.value.rank : 0
    }

    onMounted(async () => {
        hideButton.value = JSON.parse(localStorage.getItem("paramHideButton"))

        selectedDate.value = (new Date()).toISOString().split('T')[0]; // Встановлюємо поточну дату в selectedDate
        if (unitsStore.getCurrentUnitId()) {
            await fetchEmployees(unitsStore.getCurrentUnitId())
            await fetchStatuses(unitsStore.getCurrentUnitId())
            currentUnit.value = unitsStore.getCurrentUnitId()
        } else {
            await fetchUnits()
        }
        setEmployeeRank()
        await updateHeight();

        if (scheduleContainer.value) {
            scheduleContainer.value.addEventListener("scroll", handleScroll);
        }
        // Додаємо слухача на подію resize
        window.addEventListener('resize', updateHeight);
    })

    onUnmounted(() => {
        if (scheduleContainer.value) {
            scheduleContainer.value.removeEventListener("scroll", handleScroll);
        }
        window.removeEventListener("resize", updateHeight);
    });

    const employeeRank = ref(0);
    watch(employees, async () => {
        setEmployeeRank()
        await updateHeight();
    })

    watch(units, async () => {
        await fetchEmployees(unitsStore.getCurrentUnitId())
        fetchStatuses(unitsStore.getCurrentUnitId())
        currentUnit.value = unitsStore.getCurrentUnitId() ?? 0
        await updateHeight();
    });

    watch(selectedDate, async () => {
        await updateHeight();
    });

    // menu
    const clickUnits = () => {
        router.push('/units')
    }
    const clickCabinet = () => {
        router.push('/cabinet')
    }
    const clickReport = () => {
        router.push('/report')
    }
    const logoutAction = async () => {
        cancelUnitsRequest()
        cancelEmployeesRequest()
        cancelStatusesRequest()
        await logout();
        await router.push('/login');
    };

    const clickStatuses = () => {
        router.push('/statuses')
    }
    const clickQr = () => {
        router.push('/qr')
    }

    const cancelErrorGroups = () => {
        errorUnits.value = null
    }

    const cancelErrorEmployees = () => {
        errorEmployees.value = null
    }

    const cancelErrorStatuses = () => {
        errorStatuses.value = null
    }

    const authError = computed(() => {
        return authUnitsError.value || authEmployeesError.value || authStatusesError.value
    })

    const isLoading = computed(() => {
        return loadingUnits.value || loadingEmployees.value || loadingStatuses.value
    })

    watch(currentUnit, async () => {
        unitsStore.setCurrentUnitId(currentUnit.value)
        employeesStore.clearEmployees()
        await fetchEmployees(unitsStore.getCurrentUnitId())
        await fetchStatuses(unitsStore.getCurrentUnitId())
        await updateHeight();
    })

    const scheduleContainer = ref(null);
    const bottomMenu = ref(null);
    const timeoutId = ref(null);

    // Функція для обчислення та оновлення висоти загального контейнера з іменами та розкладом
    const updateHeight = async () => {
        await nextTick()

        clearTimeout(timeoutId.value);
        timeoutId.value = setTimeout(() => {
            const scheduleContainerRect = scheduleContainer.value?.getBoundingClientRect();
            const bottomMenuRect = bottomMenu.value?.getBoundingClientRect();

            if (scheduleContainerRect && bottomMenuRect) {
                scheduleContainer.value.style.height = (bottomMenuRect.top - scheduleContainerRect.top) + 'px';
            }
        }, 500); // Затримка в 500 мс
    };

    const isShowedAddEmployee = ref(false)
    const addEmployee = () => {
        isShowedAddEmployee.value = true
    }

    const handleScroll = () => {
        if (scheduleContainer.value) {
            scrollTop.value = scheduleContainer.value.scrollTop
        }
    }

    const toggleTop = () => {
        hideButton.value = !hideButton.value
        localStorage.setItem("paramHideButton",  JSON.stringify(hideButton.value))
        updateHeight()
    }
</script>

<template>
    <button @click="toggleTop" class="absolute top-2 left-2 w-9 h-9 bg-stone-600 text-center text-white rounded-full flex items-center justify-center cursor-pointer z-10">
        <svg class="cursor-pointer" v-if="!hideButton" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"
             stroke="currentColor"><path d="M4,12H20V14H4V12M4,9H20V11H4V9M16,4L12,8L8,4H11V1H13V4H16M8,19L12,15L16,19H13V22H11V19H8Z" /></svg>
        <svg class="cursor-pointer" v-if="hideButton" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"
             stroke="currentColor"><path d="M13,9V15H16L12,19L8,15H11V9H8L12,5L16,9H13M4,2H20V4H4V2M4,20H20V22H4V20Z" /></svg>
    </button>

    <button @click="logoutAction" class="absolute top-2 right-2 w-9 h-9 bg-stone-600 text-center text-white rounded-full flex items-center justify-center cursor-pointer z-10">
        <svg class="w-6 h-6 text-gray-100 group-hover:text-gray-900"
             aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path
                d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
        </svg>
    </button>

    <div class="fixed bottom-0 left-0 z-50 w-full h-16 bg-gray-100 border-t border-gray-200"
         ref="bottomMenu">
        <div class="grid h-full max-w-lg grid-cols-5 mx-auto font-medium">
            <button @click="clickUnits()" type="button"
                    class="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-300 group">
                <svg class="w-5 h-5 mb-2 text-gray-500 group-hover:text-gray-900"
                     aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path
                        d="M0 20V17.225C0 16.6583 0.141667 16.1333 0.425 15.65C0.708333 15.1667 1.1 14.8 1.6 14.55C1.83333 14.4333 2.05833 14.325 2.275 14.225C2.50833 14.125 2.75 14.0333 3 13.95V20H0ZM4 13C3.16667 13 2.45833 12.7083 1.875 12.125C1.29167 11.5417 1 10.8333 1 10C1 9.16667 1.29167 8.45833 1.875 7.875C2.45833 7.29167 3.16667 7 4 7C4.83333 7 5.54167 7.29167 6.125 7.875C6.70833 8.45833 7 9.16667 7 10C7 10.8333 6.70833 11.5417 6.125 12.125C5.54167 12.7083 4.83333 13 4 13ZM4 11C4.28333 11 4.51667 10.9083 4.7 10.725C4.9 10.525 5 10.2833 5 10C5 9.71667 4.9 9.48333 4.7 9.3C4.51667 9.1 4.28333 9 4 9C3.71667 9 3.475 9.1 3.275 9.3C3.09167 9.48333 3 9.71667 3 10C3 10.2833 3.09167 10.525 3.275 10.725C3.475 10.9083 3.71667 11 4 11ZM4 20V17.2C4 16.6333 4.14167 16.1167 4.425 15.65C4.725 15.1667 5.11667 14.8 5.6 14.55C6.63333 14.0333 7.68333 13.65 8.75 13.4C9.81667 13.1333 10.9 13 12 13C13.1 13 14.1833 13.1333 15.25 13.4C16.3167 13.65 17.3667 14.0333 18.4 14.55C18.8833 14.8 19.2667 15.1667 19.55 15.65C19.85 16.1167 20 16.6333 20 17.2V20H4ZM6 18H18V17.2C18 17.0167 17.95 16.85 17.85 16.7C17.7667 16.55 17.65 16.4333 17.5 16.35C16.6 15.9 15.6917 15.5667 14.775 15.35C13.8583 15.1167 12.9333 15 12 15C11.0667 15 10.1417 15.1167 9.225 15.35C8.30833 15.5667 7.4 15.9 6.5 16.35C6.35 16.4333 6.225 16.55 6.125 16.7C6.04167 16.85 6 17.0167 6 17.2V18ZM12 12C10.9 12 9.95833 11.6083 9.175 10.825C8.39167 10.0417 8 9.1 8 8C8 6.9 8.39167 5.95833 9.175 5.175C9.95833 4.39167 10.9 4 12 4C13.1 4 14.0417 4.39167 14.825 5.175C15.6083 5.95833 16 6.9 16 8C16 9.1 15.6083 10.0417 14.825 10.825C14.0417 11.6083 13.1 12 12 12ZM12 10C12.55 10 13.0167 9.80833 13.4 9.425C13.8 9.025 14 8.55 14 8C14 7.45 13.8 6.98333 13.4 6.6C13.0167 6.2 12.55 6 12 6C11.45 6 10.975 6.2 10.575 6.6C10.1917 6.98333 10 7.45 10 8C10 8.55 10.1917 9.025 10.575 9.425C10.975 9.80833 11.45 10 12 10ZM20 13C19.1667 13 18.4583 12.7083 17.875 12.125C17.2917 11.5417 17 10.8333 17 10C17 9.16667 17.2917 8.45833 17.875 7.875C18.4583 7.29167 19.1667 7 20 7C20.8333 7 21.5417 7.29167 22.125 7.875C22.7083 8.45833 23 9.16667 23 10C23 10.8333 22.7083 11.5417 22.125 12.125C21.5417 12.7083 20.8333 13 20 13ZM20 11C20.2833 11 20.5167 10.9083 20.7 10.725C20.9 10.525 21 10.2833 21 10C21 9.71667 20.9 9.48333 20.7 9.3C20.5167 9.1 20.2833 9 20 9C19.7167 9 19.475 9.1 19.275 9.3C19.0917 9.48333 19 9.71667 19 10C19 10.2833 19.0917 10.525 19.275 10.725C19.475 10.9083 19.7167 11 20 11ZM21 20V13.95C21.25 14.0333 21.4833 14.125 21.7 14.225C21.9333 14.325 22.1667 14.4333 22.4 14.55C22.9 14.8 23.2917 15.1667 23.575 15.65C23.8583 16.1333 24 16.6583 24 17.225V20H21Z"/>
                </svg>
                <span class="text-sm text-gray-500 group-hover:text-gray-900">Групи</span>
            </button>
            <button @click="clickCabinet()" type="button"
                    class="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-300 group">
                <svg class="w-5 h-5 mb-2 text-gray-500 group-hover:text-gray-900"
                     aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <svg class="w-5 h-5 mb-2 text-gray-500 group-hover:text-gray-900"
                         aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                         viewBox="0 0 20 20">
                        <path
                            d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
                    </svg>
                </svg>
                <span class="text-sm text-gray-500 group-hover:text-gray-900">Кабінет</span>
            </button>
            <button @click="clickStatuses()" type="button"
                    class="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-300 group">
                <svg class="w-5 h-5 mb-2 text-gray-500 group-hover:text-gray-900"
                     aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M4 12.25V1m0 11.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M4 19v-2.25m6-13.5V1m0 2.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M10 19V7.75m6 4.5V1m0 11.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM16 19v-2"/>
                </svg>
                <span class="text-sm text-gray-500 group-hover:text-gray-900">Статуси</span>
            </button>
            <button @click="clickQr()" type="button"
                    class="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-300 group">
                <svg class="w-5 h-5 mb-2 text-gray-500 group-hover:text-gray-900" fill="currentColor"
                     aria-hidden="true" xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960"
                     width="20">
                    <path
                        d="M80-680v-200h200v80H160v120H80Zm0 600v-200h80v120h120v80H80Zm600 0v-80h120v-120h80v200H680Zm120-600v-120H680v-80h200v200h-80ZM700-260h60v60h-60v-60Zm0-120h60v60h-60v-60Zm-60 60h60v60h-60v-60Zm-60 60h60v60h-60v-60Zm-60-60h60v60h-60v-60Zm120-120h60v60h-60v-60Zm-60 60h60v60h-60v-60Zm-60-60h60v60h-60v-60Zm240-320v240H520v-240h240ZM440-440v240H200v-240h240Zm0-320v240H200v-240h240Zm-60 500v-120H260v120h120Zm0-320v-120H260v120h120Zm320 0v-120H580v120h120Z"/>
                </svg>
                <span class="text-sm text-gray-500 group-hover:text-gray-900">QR</span>
            </button>
            <button @click="clickReport()" type="button"
                    class="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-300 group">
                <svg class="w-5 h-5 mb-2 text-gray-500 group-hover:text-gray-900"
                     aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2M18 20H6V4H13V9H18V20M9 13V19H7V13H9M15 15V19H17V15H15M11 11V19H13V11H11Z" />
                </svg>
                <span class="text-sm text-gray-500 group-hover:text-gray-900">Звіт</span>
            </button>
        </div>
    </div>

    <div :class="{'hidden': hideButton}">
        <GroupList v-model:currentUnit="currentUnit" v-model:units="units"/>

        <div v-if="currentUnit" class="w-full border-b border-gray-300 my-4 py-1 grid grid-cols-2">
            <button @click="addEmployee"
                    class="inline-flex items-center gap-2 px-2 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 w-fit cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                     stroke="currentColor" class="w-6 h-6">
                    <path
                        d="M13,8c0-2.21-1.79-4-4-4S5,5.79,5,8s1.79,4,4,4S13,10.21,13,8z M15,10v2h3v3h2v-3h3v-2h-3V7h-2v3H15z M1,18v2h16v-2 c0-2.66-5.33-4-8-4S1,15.34,1,18z"/>
                </svg>
                <span>Додати</span>
            </button>
            <div class="text-right">
                <input type="date" id="date" v-model="selectedDate"/>
            </div>
        </div>
    </div>

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

    <div class="flex overflow-y-auto relative"
         ref="scheduleContainer">
        <NameSection v-model="employeeRank"/>
        <ScheduleSection v-model:selectedDate="selectedDate" v-model:currentUnit="currentUnit"
                         v-model:employeeRank="employeeRank" v-model:scrollTop="scrollTop"/>
    </div>
    <div v-if="errorUnits">
        <PromtYesNo
            title="Помилка"
            :message="errorUnits"
            yesText="Повторити"
            noText="Відмінити"
            @click-yes="fetchUnits"
            @click-no="cancelErrorGroups"
            @click-cancel="cancelErrorGroups"
        />
    </div>
    <div v-if="errorEmployees">
        <PromtYesNo
            title="Помилка"
            :message="errorEmployees"
            yesText="Повторити"
            noText="Відмінити"
            @click-yes="fetchEmployees(unitsStore.getCurrentUnit())"
            @click-no="cancelErrorEmployees"
            @click-cancel="cancelErrorEmployees"
        />
    </div>
    <div v-if="errorStatuses">
        <PromtYesNo
            title="Помилка"
            :message="errorStatuses"
            yesText="Повторити"
            noText="Відмінити"
            @click-yes="fetchStatuses"
            @click-no="cancelErrorStatuses"
            @click-cancel="cancelErrorStatuses"
        />
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

    <PromtAddEmployee v-model="isShowedAddEmployee"/>
</template>

<style scoped>
</style>
