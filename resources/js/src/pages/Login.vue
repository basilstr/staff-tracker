<script setup>
    import PromtYesNo from "../components/PromtYesNo.vue";

    import {useRouter} from 'vue-router'
    import {loginWithGoogle} from '../firebase.js';
    import {computed, onMounted, ref, watch} from "vue";

    import {useCaseLogin} from "../composables/usecases/user/useCaseLogin";
    import {logout} from "../firebase";

    const {success, loading, error, authError, login} = useCaseLogin();

    const isShowForm = ref(false)
    const isShowForgotPassword = ref(false)
    const isEmailEnter = ref(false)
    const email = ref('')
    const password = ref('')
    const googleToken = ref('')

    const router = useRouter()

    const invite = router.currentRoute.value.params.invite || ''

    const loginGoogleAction = () => {
        loginWithGoogle(googleToken)
    }

    const loginWithEmail = () => {
        if (email.value && password.value) {
            login(email.value, password.value, googleToken.value, invite)
        }
    }

    onMounted(() => {
        if (localStorage.getItem("token")) {
            router.push('/employees')
        } else {
            isShowForm.value = true
        }
    })

    watch(success, () => {
            if (success.value) {
                router.push('/employees')
            }
        }
    );

    watch(googleToken, () => {
            login(email.value, password.value, googleToken.value, invite)
        }
    );

    const loginEnable = computed(() => {
        return email.value.length && password.value.length
    })

    const logoutAction = async () => {
        await logout();
        authError.value = false
        email.value = ''
        password.value = ''
        googleToken.value = ''
    };

    const forgotPasswordAction = () => {
        isShowForgotPassword.value = true
    }
    const clearForgot = () => {
        isShowForgotPassword.value = false
    }
    const clearError = () => {
        error.value = false
    }
    const actionEmailEnter = () => {
        isEmailEnter.value = true
    }
</script>

<template>
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <div v-if="isShowForm && !loading">
            <div class="mt-2 sm:mx-auto sm:w-full sm:max-w-sm">
                <div v-if="isEmailEnter">
                    <h2 class="mt-2 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Введіть облікові
                        дані</h2>
                    <div>
                        <label for="email" class="block text-sm/6 font-medium text-gray-900">Email</label>
                        <div class="mt-2">
                            <input v-model="email"
                                   type="email"
                                   id="email"
                                   autocomplete="email"
                                   @keyup.enter="loginWithEmail"
                                   class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"/>
                        </div>
                    </div>

                    <div class="mt-6">
                        <div class="flex items-center justify-between">
                            <label for="password" class="block text-sm/6 font-medium text-gray-900">Пароль</label>
                            <div class="text-sm">
                                <a @click="forgotPasswordAction" href="#"
                                   class="font-semibold text-indigo-600 hover:text-indigo-500">Забули пароль?</a>
                            </div>
                        </div>
                        <div class="mt-2">
                            <input type="password"
                                   id="password"
                                   v-model="password"
                                   @keyup.enter="loginWithEmail"
                                   class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"/>
                        </div>
                    </div>

                    <div class="mt-6">
                        <button @click="loginWithEmail"
                                class="w-full rounded-full p-2 text-white text-center text-lg font-bold my-6"
                                :class="{ 'bg-blue-700 hover:bg-blue-900': loginEnable, 'bg-gray-400': !loginEnable }">
                            Вхід
                        </button>
                    </div>
                    <div class=" mt-4 flex justify-center">АБО</div>
                </div>
                <h2 v-if="!isEmailEnter" class="mt-2 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Вхід
                    через Google</h2>
                <div class="mt-6 flex justify-center">
                    <button @click="loginGoogleAction" class="gsi-material-button">
                        <div class="gsi-material-button-state"></div>
                        <div class="gsi-material-button-content-wrapper">
                            <div class="gsi-material-button-icon">
                                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"
                                     xmlns:xlink="http://www.w3.org/1999/xlink" style="display: block;">
                                    <path fill="#EA4335"
                                          d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                                    <path fill="#4285F4"
                                          d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                                    <path fill="#FBBC05"
                                          d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                                    <path fill="#34A853"
                                          d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                                    <path fill="none" d="M0 0h48v48H0z"></path>
                                </svg>
                            </div>
                            <span class="gsi-material-button-contents">Sign in with Google</span>
                            <span style="display: none;">Sign in with Google</span>
                        </div>
                    </button>
                </div>
            </div>

            <div v-if="isEmailEnter" class=" mt-6 flex text-center text-sm/6 font-medium text-gray-900">
                Якщо у Вас немає облікових даних, то реєстрація можлива тільки через автентифікацію Google<br/>(натисніть
                кнопку "Sign in with Google")
            </div>

            <div v-if="!isEmailEnter" class="text-sm mt-6 w-full text-center">
                <div class="mt-4">
                    АБО
                </div>
                <div class="mt-4">
                    <a @click="actionEmailEnter" href="#"
                       class="font-semibold text-indigo-600 hover:text-indigo-500">Вхід через Email</a>
                </div>
                <div class="mt-8">
                    Реєстрація нових користувачів в системі можлива тільки за запрошенням. Зіскануйте QR-код "Запрошення в
                    систему" в пункті меню "Кабінет" Вашого колеги який вже зареєстрований в системі та отримайте доступ.
                </div>
            </div>

        </div>
    </div>
    <div v-if="loading">
        <div class="text-center">
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
    <div v-if="authError">
        <PromtYesNo
            title="Помилка"
            message="Такий користувач не знайдений. Зареєструватись можна тільки за запрошенням."
            yesText="OK"
            @click-yes="logoutAction"
            @click-cancel="logoutAction"
        />
    </div>
    <div v-if="isShowForgotPassword">
        <PromtYesNo
            title="Повідомлення"
            message="Увійдіть через обліковий запис Google та змініть пароль"
            yesText="OK"
            @click-yes="clearForgot"
            @click-cancel="clearForgot"
        />
    </div>
    <div v-if="error">
        <PromtYesNo
            title="Помилка"
            :message="error"
            yesText="OK"
            @click-yes="clearError"
            @click-cancel="clearError"
        />
    </div>
</template>

<style scoped>
    .gsi-material-button {
        -moz-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        -webkit-appearance: none;
        background-color: WHITE;
        background-image: none;
        border: 1px solid #747775;
        -webkit-border-radius: 20px;
        border-radius: 20px;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        color: #1f1f1f;
        cursor: pointer;
        font-family: 'Roboto', arial, sans-serif;
        font-size: 14px;
        height: 40px;
        letter-spacing: 0.25px;
        outline: none;
        overflow: hidden;
        padding: 0 12px;
        position: relative;
        text-align: center;
        -webkit-transition: background-color .218s, border-color .218s, box-shadow .218s;
        transition: background-color .218s, border-color .218s, box-shadow .218s;
        vertical-align: middle;
        white-space: nowrap;
        width: auto;
        max-width: 400px;
        min-width: min-content;
    }

    .gsi-material-button .gsi-material-button-icon {
        height: 20px;
        margin-right: 12px;
        min-width: 20px;
        width: 20px;
    }

    .gsi-material-button .gsi-material-button-content-wrapper {
        -webkit-align-items: center;
        align-items: center;
        display: flex;
        -webkit-flex-direction: row;
        flex-direction: row;
        -webkit-flex-wrap: nowrap;
        flex-wrap: nowrap;
        height: 100%;
        justify-content: space-between;
        position: relative;
        width: 100%;
    }

    .gsi-material-button .gsi-material-button-contents {
        -webkit-flex-grow: 1;
        flex-grow: 1;
        font-family: 'Roboto', arial, sans-serif;
        font-weight: 500;
        overflow: hidden;
        text-overflow: ellipsis;
        vertical-align: top;
    }

    .gsi-material-button .gsi-material-button-state {
        -webkit-transition: opacity .218s;
        transition: opacity .218s;
        bottom: 0;
        left: 0;
        opacity: 0;
        position: absolute;
        right: 0;
        top: 0;
    }

    .gsi-material-button:disabled {
        cursor: default;
        background-color: #ffffff61;
        border-color: #1f1f1f1f;
    }

    .gsi-material-button:disabled .gsi-material-button-contents {
        opacity: 38%;
    }

    .gsi-material-button:disabled .gsi-material-button-icon {
        opacity: 38%;
    }

    .gsi-material-button:not(:disabled):active .gsi-material-button-state,
    .gsi-material-button:not(:disabled):focus .gsi-material-button-state {
        background-color: #303030;
        opacity: 12%;
    }

    .gsi-material-button:not(:disabled):hover {
        -webkit-box-shadow: 0 1px 2px 0 rgba(60, 64, 67, .30), 0 1px 3px 1px rgba(60, 64, 67, .15);
        box-shadow: 0 1px 2px 0 rgba(60, 64, 67, .30), 0 1px 3px 1px rgba(60, 64, 67, .15);
    }

    .gsi-material-button:not(:disabled):hover .gsi-material-button-state {
        background-color: #303030;
        opacity: 8%;
    }
</style>
