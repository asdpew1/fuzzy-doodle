FROM php:8.4-fpm-alpine

RUN apk add --no-cache \
        acl \
        icu-dev \
        libzip-dev \
        linux-headers \
    && docker-php-ext-install \
        intl \
        opcache \
        pdo_mysql \
        zip \
    && docker-php-ext-enable opcache

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

COPY composer.json composer.lock symfony.lock ./

RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist

COPY . .

RUN composer dump-autoload --optimize \
    && composer run-script post-install-cmd \
    && chown -R www-data:www-data var

EXPOSE 9000
