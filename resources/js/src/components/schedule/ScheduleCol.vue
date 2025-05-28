<script setup>
    import PromtGroupStatus from "./PromtGroupStatus.vue";
    import PromtSetStatus from "./PromtSetStatus.vue";
    import PromtYesNo from "../PromtYesNo.vue";
    import {APP_CONSTANTS} from '../../constants.js';

    import {computed, ref, onMounted, watch} from 'vue';
    import {storeToRefs} from "pinia";

    const pausedDrag = defineModel()

    import {useEmployeesStore} from "../../composables/store/employeesStore.js";

    const employeesStore = useEmployeesStore();
    const {employeesVisible: employees, employeeUser} = storeToRefs(employeesStore);

    import {useStatusesStore} from "../../composables/store/statusesStore.js";

    const statusesStore = useStatusesStore();
    const {statuses} = storeToRefs(statusesStore);

    const statusesShow = computed(() => statuses.value.filter(item => item.group && !item.deletedAt));

    import {useSchedulesStore} from "../../composables/store/schedulesStore.js";

    const schedulesStore = useSchedulesStore();
    const {schedules, logs, notes, statusesList} = storeToRefs(schedulesStore);


    import {useCaseSetSchedulesGroup} from "../../composables/usecases/schedule/useCaseSetSchedulesGroup";

    const {loading: loadingGroup, error: errorGroup, authError: authGroupError, setSchedulesGroup: setSchedulesGroup, cancelRequest: cancelGroupRequest} = useCaseSetSchedulesGroup(schedulesStore);

    import {useCaseSetSchedulesEmployee} from "../../composables/usecases/schedule/useCaseSetSchedulesEmployee";
    import {logout} from "../../firebase";

    const {loading: loadingEmployee, error: errorEmployee, authError: authEmployeeError, setSchedulesEmployee: setSchedulesEmployee, cancelRequest: cancelEmployeeRequest} = useCaseSetSchedulesEmployee(schedulesStore);


    const props = defineProps({
        day: String,
        isClick: Boolean,
        employeeRank: Number,
        currentUnit: Number,
        scrollTop: Number,
    });

    const canSetStatusGroup = computed(() => props.employeeRank >= APP_CONSTANTS.RANK_SET_GROUP_STATUS)
    const canSetStatusOwner = computed(() => props.employeeRank >= APP_CONSTANTS.RANK_SET_OWN_STATUS)
    const statusesByKey = computed(() => {
        if (!statuses.value.length) return null
        return statuses.value.reduce((acc, item) => {
            acc[item.id] = item;
            return acc;
        }, {})
    })

    const currentDate = ref('')
    const currentName = ref('')
    const isToday = ref(false)
    const isSaturday = ref(false) //Субота
    const isSunday = ref(false) //Неділя
    const schedule = ref({})

    const isGroupShow = ref(false)
    const currentGroupStatus = ref(0)
    const isEmployeeShow = ref(false)
    const currentSetStatus = ref(0)
    const currentEmployeeId = ref(0)
    const currentEmployeeName = ref(0)
    const currentLogs = ref({})
    const currentNote = ref('')

    const days = ['нед', 'пон', 'вів', 'сер', 'чет', 'пт', 'суб'];

    onMounted(() => {
        process(props.day)
    });

    watch([isGroupShow, isEmployeeShow], () => {
        pausedDrag.value = isGroupShow.value || isEmployeeShow.value
    })

    const process = () => {
        const date = new Date(props.day)
        currentDate.value = (date).toLocaleDateString('uk-UA', {
            day: '2-digit',
            month: '2-digit'
        });

        currentName.value = days[date.getDay()];

        const todayStr = new Date().toISOString().split('T')[0];
        isToday.value = props.day === todayStr

        const nDay = date.getDay(); // 0 = Неділя, 6 = Субота
        isSaturday.value = nDay === 6;
        isSunday.value = nDay === 0;


        schedule.value = schedules.value[props.day]
    }

    watch(schedules, () => {
        schedule.value = schedules.value[props.day]
    }, {deep: true})

    const actionGroup = (status) => {
        if (props.isClick) {
            isGroupShow.value = true
            currentGroupStatus.value = status
        }
    }
    const onClickGroup = () => {
        console.log(`date: ${props.day} actionGroup: ${currentGroupStatus.value}`)
        setSchedulesGroup(props.currentUnit, props.day, currentGroupStatus.value)
        isGroupShow.value = false
    }
    const onCancelGroup = () => {
        isGroupShow.value = false
    }

    const actionStatus = (employee, status) => {
        if (props.isClick) {
            if (canSetStatusGroup.value || (canSetStatusOwner.value && employee === employeeUser.value?.id)) {
                currentSetStatus.value = status
                currentEmployeeId.value = employee
                currentEmployeeName.value = employeesStore.getEmployee(currentEmployeeId.value).name
                currentLogs.value = logs.value[props.day][employee]
                currentNote.value = notes.value[props.day][employee]
                isEmployeeShow.value = true
            }
        }
    }
    const onClickSet = (employeeId, currentStatusId, dateFrom, dateTo, note) => {
        isEmployeeShow.value = false
        setSchedulesEmployee(employeeId, currentStatusId, dateFrom, dateTo, note)
    }
    const onCancelSet = () => {
        isEmployeeShow.value = false
    }

    const authError = computed(() => {
        return authGroupError.value || authEmployeeError.value
    })

    const logoutAction = async () => {
        cancelGroupRequest()
        cancelEmployeeRequest()
        await logout();
        await router.push('/login');
    };

    const cancelError = () => {
        errorGroup.value = false
        errorEmployee.value = false
    }

    const statusesBottomShow = computed(() => statuses.value.filter(item => statusesList?.value.indexOf(item.id) >= 0));
    const statusesBottomList = ref([])
    watch([statusesBottomShow, schedule], () => {
        statusesBottomList.value = []
        statusesBottomShow.value.forEach(status => {
            let count = 0;
            Object.values(schedule.value).forEach(value => {
                if (status.id === value) {
                    count++;
                }
            });
            statusesBottomList.value.push({id: status.id, count: count});
        })
    }, {deep: true})

    const dateContainer = ref(null);
    watch(() => props.scrollTop, () => {
        if (dateContainer.value) {
            dateContainer.value.style.marginTop = (props.scrollTop - 1) + "px";
        }
    })

    const ifFixDate = computed(() => {
        if (!canSetStatusGroup) {
            return props.scrollTop > 0
        }

        return props.scrollTop > statusesShow.value.length * 40
    })
</script>

<template>
    <div class="w-[40px] relative"
         :class="{
         'bg-cyan-900': isToday,
         'bg-indigo-100': isSaturday && !isToday,
         'bg-red-100': isSunday && !isToday,
         }">
        <div v-if="ifFixDate" class="absolute text-xs h-[40px] w-[40px] text-center z-10"
             ref="dateContainer">
            <div class="w-[40px]"
            :class="{'text-white': isToday, 'bg-cyan-900': isToday, 'bg-gray-100': !isToday}">
                <div>{{currentName}}</div>
                <div class="font-bold">{{currentDate}}</div>
            </div>
        </div>
        <div v-if="canSetStatusGroup" v-for="item in statusesShow" :key="item.id"
             class="text-sm h-[40px] w-[40px] p-[5px]">
            <button class="w-[30px] h-[30px] text-sm font-semibold rounded cursor-pointer"
                    @click="actionGroup(item.id)"
                    :style="{ color: item.textColor, backgroundColor: item.bgColor }">{{item.shortName}}
            </button>
        </div>
        <div class="text-xs h-[40px] text-center"
             :class="{'text-white': isToday}">
            <div>{{currentName}}</div>
            <div class="font-bold">{{currentDate}}</div>
        </div>
        <div v-if="statusesByKey && schedule">
            <div v-for="item in employees" :key="item.id"
                 class="relative text-sm h-[40px] w-[40px] p-[5px]">
                <div v-if="schedule[item.id]">
                    <button class="w-[30px] h-[30px] text-sm font-semibold rounded"
                            :class="{'cursor-pointer': (canSetStatusGroup || (canSetStatusOwner && item.id === employeeUser.value?.id))}"
                            @click="actionStatus(item.id, schedule[item.id])"
                            :style="{ color: statusesByKey[schedule[item.id]]?.textColor, backgroundColor: statusesByKey[schedule[item.id]]?.bgColor }">
                        {{statusesByKey[schedule[item.id]]?.shortName}}
                    </button>
                </div>
                <div v-else>
                    <button class="w-[30px] h-[30px] text-sm font-semibold rounded bg-gray-100 border border-gray-300"
                            :class="{'cursor-pointer': (canSetStatusGroup || (canSetStatusOwner && item.id === employeeUser.value?.id))}"
                            @click="actionStatus(item.id, 0)">&nbsp;
                    </button>
                </div>
                <svg v-if="notes[props.day][item.id]" class="absolute top-[1px] right-[2px] w-3 h-3 text-red-400"
                     fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
                </svg>
            </div>
        </div>
        <div class="text-sm text-center h-[20px] w-[40px] border-t border-gray-200 "
             :class="{'text-white': isToday, 'font-semibold': isToday}">
            {{employees.length}}
        </div>
        <div v-for="item in statusesBottomList" :key="item.id"
             class="text-sm text-center h-[20px] w-[40px] border-t border-gray-200"
             :class="{'text-white': isToday, 'font-semibold': isToday}">
            {{ item.count }}
        </div>
    </div>

    <div v-if="isGroupShow">
        <PromtGroupStatus
                :day="props.day"
                :statusText="statusesByKey[currentGroupStatus].fullName"
                @click-yes="onClickGroup"
                @click-no="onCancelGroup"
                @click-cancel="onCancelGroup"
        />
    </div>
    <div v-if="isEmployeeShow">
        <PromtSetStatus
                :day="props.day"
                :employeeId="currentEmployeeId"
                :employeeName="currentEmployeeName"
                :status="currentSetStatus"
                :logs="currentLogs"
                :note="currentNote"
                @click-yes="onClickSet"
                @click-no="onCancelSet"
                @click-cancel="onCancelSet"
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

    <div v-if="errorGroup">
        <PromtYesNo
                title="Помилка встановлення групового статусу"
                :message="errorGroup"
                noText="OK"
                @click-no="cancelError"
                @click-cancel="cancelError"
        />
    </div>

    <div v-if=" errorEmployee">
        <PromtYesNo
                title="Помилка встановлення персонального статусу"
                :message="errorEmployee"
                noText="OK"
                @click-no="cancelError"
                @click-cancel="cancelError"
        />
    </div>
</template>


<style scoped>
</style>
