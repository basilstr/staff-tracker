# Використовуємо PHP 8.2 з Apache
FROM php:8.2-apache

# Копіюємо Composer
COPY --from=composer:2.8.4 /usr/bin/composer /usr/bin/

# Увімкнути mod_rewrite
RUN a2enmod rewrite env alias headers

# Оновлення системних пакетів
RUN apt-get update && apt-get install -y \
    nodejs \
    npm \
    git \
    zip \
    unzip \
    p7zip-full \
    libzip-dev \
    libxml2-dev \
    libsqlite3-dev \
    && rm -rf /var/lib/apt/lists/*

# Встановити розширення pdo_mysql для підтримки MySQL
RUN docker-php-ext-install pdo_mysql gettext

# Встановити та увімкнути ZIP
RUN docker-php-ext-configure zip \
    && docker-php-ext-install zip \
    && docker-php-ext-enable zip

# Встановити redis
RUN pecl install redis \
    && docker-php-ext-enable redis


# Встановлення php-dom (як частина стандартної інсталяції PHP)
RUN docker-php-ext-install dom # Встановлюємо розширення dom

# Встановити yarn
RUN npm install yarn -g

# Встановлення Xdebug для покриття коду
RUN pecl install xdebug \
    && docker-php-ext-enable xdebug

RUN echo "xdebug.mode=coverage" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini \
    && echo "xdebug.start_with_request=yes" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini

ARG UID
ARG GID
RUN usermod -u $UID www-data && groupmod -g $GID www-data
