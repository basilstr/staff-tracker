<script setup>
    import {ref} from "vue";
    import {storeToRefs} from "pinia";

    import { APP_CONSTANTS } from '../../constants.js';

    const isShowed = defineModel()
    const employeeName = ref(null)
    const employeeNote = ref(null)

    import {useEmployeesStore} from "../../composables/store/employeesStore.js";

    const employeesStore = useEmployeesStore();
    const {employeesVisible: employees, unit} = storeToRefs(employeesStore);

    import {useCaseCreateEmployee} from "../../composables/usecases/emploee/useCaseCreateEmployee";


    const {loading, error, authError, createEmployee, cancelRequest} = useCaseCreateEmployee(employeesStore);

    const clickCancel = () => {
        isShowed.value = false
        clearEmployeeData()
    }
    const clickAdd = () => {
        if(!employeeName.value) return

        let sort = 0
        employees.value.forEach(item => {
            if(item.sort > sort) sort = item.sort
        })

        createEmployee(unit.value, employeeName.value, employeeNote.value, sort, APP_CONSTANTS.RANK_FORBIDDEN)

        isShowed.value = false
        clearEmployeeData()
    }
    const clearEmployeeData = () => {
        employeeName.value = ''
        employeeNote.value = ''
    }

</script>

<template>
    <div v-if="isShowed" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div class="p-6 bg-white rounded-lg shadow-lg w-80 relative">
            <div class="absolute top-2 right-2">
                <button @click="clickCancel" class="hover:bg-gray-200">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.4 19L5 17.6L10.6 12L5 6.4L6.4 5L12 10.6L17.6 5L19 6.4L13.4 12L19 17.6L17.6 19L12 13.4L6.4 19Z"
                              fill="#1D1B20"/>
                    </svg>
                </button>
            </div>
            <h2 class="font-semibold mt-2">Додати учасника групи</h2>
            <div class="mt-2">
                <label for="name" class="block text-sm/6 font-medium text-gray-900">Ім'я</label>
                <div class="mt-1">
                    <input v-model="employeeName" type="text" id="name" maxlength="255" placeholder="Введіть ім'я учасника групи"
                           class="w-full border-1 border-gray-300 p-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div class="ml-2 text-xs"
                    :class="{'text-red-400/0': employeeName, 'text-red-400/100': !employeeName}">Ім'я учасника групи не може бути порожнім</div>
                </div>
            </div>
            <div class="mt-2">
                <label for="note" class="block text-sm/6 font-medium text-gray-900">Примітка</label>
                <div class="mt-1">
          <textarea v-model="employeeNote"
                    id="note"
                    name="note"
                    rows="2"
                    class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"></textarea>
                </div>
            </div>
            <div class="mt-3 flex justify-end">
                <button @click="clickAdd"
                        class="text-white px-4 py-2 mr-6 rounded-lg"
                    :class="{ 'bg-green-700 transition delay-50 duration-300 ease-in-out hover:scale-110 hover:bg-green-900': employeeName, 'bg-gray-400': !employeeName }">
                    Додати
                </button>
                <button @click="clickCancel" class="bg-blue-700 transition delay-50 duration-300 ease-in-out hover:scale-110 hover:bg-blue-900 text-white px-4 py-2 rounded-lg">
                    Відміна
                </button>
            </div>
        </div>
    </div>
</template>


<style scoped>

</style>
