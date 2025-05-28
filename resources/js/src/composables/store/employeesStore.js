import {defineStore} from "pinia";

const debugMode = JSON.parse(import.meta.env.VITE_DEBUG_STORE);

export const useEmployeesStore = defineStore('employees', {
    state: () => {
        return {
            employees: [],
            employeesVisible: [],
            employeesHidden: [],
            unit: null,
            employeeUser: null
        }
    },
    actions: {
        setEmployees(data, unit) {
            this.employees = data;
            this.unit = unit;
            let userId = Number(localStorage.getItem("userId"))
            this.employeeUser = this.employees.find(item => item.userId === userId) ?? null;

            this.updateHVemployees();

            if (debugMode) console.log('STORAGE setEmployees(unit: ' + this.unit + '): ', this.employees)
        },
        clearEmployees() {
            this.employees = [];
            this.unit = null;
            this.employeeUser = null;
            if (debugMode) console.log('STORAGE clearEmployees(): ')
        },
        isEmptyEmployees(unit) {
            if (debugMode) console.log('STORAGE isEmptyEmployees(unit: ' + unit + '): ', this.employees.length === 0 || this.unit !== unit)
            return this.employees.length === 0 || this.unit !== unit;
        },
        getEmployee(id) {
            if (debugMode) console.log('STORAGE getEmployee(id: ' + id + '): ', this.employees.find(item => item.id === id))
            return this.employees.find(item => item.id === id) ?? null;
        },
        deleteEmployee(id) {
            this.employees = this.employees.filter(item => item.id !== id);
            this.updateHVemployees();
            if (debugMode) console.log('STORAGE deleteEmployees(' + id + '): ')
        },
        saveEmployee(employee) {
            if(!employee) return
            let newItems = this.employees.map(item => item.id === employee.id ? employee : item);
            newItems.sort((a, b) => a.sort - b.sort)
            this.employees = newItems
            this.updateHVemployees();
            if (debugMode) console.log('STORAGE saveEmployee(' + employee.id + '): ', employee)
        },
        createEmployee(employee) {
            if(!employee) return
            if(this.employees.find(item => item.id === employee.id)) {
                this.saveEmployee(employee)
                this.updateHVemployees();
                return;
            }
            this.employees.push(employee)
            this.employees.sort((a, b) => a.sort - b.sort)
            this.updateHVemployees();
            if (debugMode) console.log('STORAGE createEmployee(' + employee.id + '): ', employee)
        },
        updateHVemployees() {
            this.employeesHidden = this.employees.filter(item => item.hidden);
            this.employeesVisible = this.employees.filter(item => !item.hidden);
        }
    }
})
