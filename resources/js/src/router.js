import {createRouter, createWebHistory} from "vue-router";
import DefaultLayout from "./components/DefaultLayout.vue";
import Home from "./pages/Home.vue";
import NotFound from "./pages/NotFound.vue";
import Detail from "./pages/Detail.vue";
import Statuses from "./pages/Statuses.vue";
import Units from "./pages/Units.vue";
import Employees from "./pages/Employees.vue";
import Cabinet from "./pages/Cabinet.vue";
import Login from "./pages/Login.vue";
import Qr from "./pages/Qr.vue";
import Invite from "./pages/Invite.vue";
import Report from "./pages/Report.vue";

const routes = [
    {
        path: "/",
        component: DefaultLayout,
        children: [
            {path: '/', name: 'Home', component: Home},
            {path: '/login/:invite?', name: 'Login', component: Login},
            {
                path: '/detail/:id', name: 'Detail', component: Detail,
                meta: {requiresAuth: true} // Доступ тільки для авторизованих
            },
            {
                path: '/statuses', name: 'Statuses', component: Statuses,
                meta: {requiresAuth: true} // Доступ тільки для авторизованих
            },
            {
                path: '/units', name: 'Units', component: Units,
                meta: {requiresAuth: true} // Доступ тільки для авторизованих
            },
            {
                path: '/employees', name: 'Employees', component: Employees,
                meta: {requiresAuth: true} // Доступ тільки для авторизованих
            },
            {
                path: '/cabinet', name: 'Cabinet', component: Cabinet,
                meta: {requiresAuth: true} // Доступ тільки для авторизованих
            },
            {
                path: '/qr', name: 'Qr', component: Qr,
                meta: {requiresAuth: true} // Доступ тільки для авторизованих
            },
            {
                path: '/invite/:invite?', name: 'Invite', component: Invite,
                meta: {requiresAuth: true} // Доступ тільки для авторизованих
            },
            {
                path: '/report', name: 'Report', component: Report,
                meta: {requiresAuth: true} // Доступ тільки для авторизованих
            },
        ]
    },
    {
        path: "/:pathMatch(.*)*",
        name: "NotFound",
        component: NotFound,
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// Функція для перевірки авторизації
const isAuthenticated = () => !!localStorage.getItem("token");

// Глобальний гвард перед переходом між сторінками
router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth && !isAuthenticated()) {
        next("/"); // Якщо не авторизований, перенаправляємо на вхід
    } else {
        next();
    }
});

export default router
