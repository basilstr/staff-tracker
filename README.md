# Staff Tracker

Бекенд частина застосунку

## Вимоги

Для розгортання проєкту локально на вашому комп'ютері необхідно мати:
- PHP v8.2 або новішу версію
- Composer
- MySQL

## Установка

Виконайте наступні кроки, щоб налаштувати проєкт локально:

### 1. Клонування репозиторію

Склонуйте репозиторій проєкту:

```bash
git clone https://github.com/basilstr/staff-tracker.git
cd staff-tracker
```

### 2. Запуск контейнерів Docker

Виконайте команду:

```bash
docker compose build --no-cache
```

Виконайте команду:

```bash
docker compose up -d
```

### 4. Установка залежностей Laravel

Виконайте команду:

```bash
docker compose exec -it app composer install
```

### 5. Скопіюйте .env файл

Виконайте команду:

```bash
docker compose exec -it app cp .env.example .env
```

### 6. Згенеруйте ключ для Laravel

Виконайте команду:

```bash
docker compose exec app php artisan key:generate
```

### 7. Запустіть міграцію

Виконайте команду:

```bash
docker compose exec app php artisan migrate
```
Для очистки структури бази з повторним сідуванням виконайте команду:

```bash
docker compose exec app php artisan migrate:refresh --seed
```

## Тестування

Перед початком тестування виконайте наступні налаштування.

Скопіюйте `.env.example` в `.env.testing`.

Замніть в `.env.testing` блок з підключенням до БД:
```dotenv
DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=staff_tracker
DB_USERNAME=root
DB_PASSWORD=password
DB_ROOT_PASSWORD=password
```

### 1. Запуск тестів

Щоб запустити тестування, виконайте:

```bash
docker compose exec app php artisan test
```

### 2. Запуск аналізатора коду PHPStan

Щоб запустити аналізатор, виконайте:

```bash
docker compose exec app ./vendor/bin/phpstan analyse --memory-limit=2G
```

### 3. Запуск тестів з coverage

Щоб запустити тестування, виконайте:

```bash
docker compose exec app php artisan test --coverage
```

```bash
docker compose exec app php artisan test --coverage-html=coverage-report
```

### 4. Мутаційні тести

**Всі тести мають бути покриті мутаційними тестами.**

Щоб додати мутаційні тести обовʼязково додавайте метод `covers(...)` до ваших тестів.

Наприклад:
```php
covers(TodoController::class); // or mutates(TodoController::class);
 
it('list todos', function () {
    $this->getJson('/todos')->assertStatus(200);
});
```
Детальніше [тут](https://pestphp.com/docs/mutation-testing).

Щоб запустити тестування з мутаціями, виконайте:

```bash
docker compose exec app php artisan test --mutate --covered-only --min=100
```
Або в паралельному режимі:
```bash
docker compose exec app php artisan test --mutate --covered-only --min=100 --parallel
```

# встановлення залежностей для VUE
### Встановіть додаткові пакети за їх відсутності:
### інсталяцію потрібно робити у директорії /resources/js для того щоб можна було запускати додаток ізольовано від laravel
```
npm install
```

```
npm install vite
```
```
npm i @vitejs/plugin-vue
```

Генератор QR-кодів для Vue.js
```
npm install qrcode.vue
```

Парсер QR-кодів для Vue.js з камери
```
npm install jsqr
```

Іконки, роути, сховище та мережева бібліотека
```
npm install @headlessui/vue @heroicons/vue vue-router@v4 pinia axios pinia-plugin-persistedstate
```

Firebase бібліотека
```
npm install firebase
```

Бібліотека для тестування
```
npm install -D vitest
npm install dotenv-cli --save-dev
```
Бібліотека для взаємодії laravel та vite
```
npm install laravel-vite-plugin --save-dev
```

Додаткові залежності    
```
npm install --save-dev @commitlint/config-conventional @commitlint/cli
```
