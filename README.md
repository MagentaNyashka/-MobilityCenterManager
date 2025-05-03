# -MobilityCenterManager
Web interface for automatic tracing mobility center for subway

### Описание

Данный проект является реализацией задания для Учебной Практики. По заданию необходимо разработать систему автоматизации распределения запросов людей с ОВЗ между работниками Центра Мобилизации Метро.

### Setup

Система предназначена для установки на сервере с установленной операционной системой Linux, например: Ubuntu. Система делится на две составляющие: Web-сайт для мониторинга и скрипта для работы с базой данных MySQL.

Для начала необходимо настроить web-engine, пример конфигурации для Nginx(в случае если localhost уже занят другой конфигурацией, необходимо заменить адрес в `server.mjs`):
```
server {
        listen 80;
        server_name domain.com;

        root /var/www/ip_site;
        index index.html;

        location / {
                try_files $uri $uri/ = 404;
        }

        location ~ \.php$ {
                include snippets/fastcgi-php.conf;

                fastcgi_pass unix:/run/php/php8.0-fpm.sock;
        }
}

# REQUIRED FOR PROPPER WORK OF PHP SCRIPTS
server {
        listen 80;
        server_name localhost;

        root /var/www/ip_site;
        index index.html;

        location / {
                try_files $uri $uri/ = 404;
        }

        location ~ \.php$ {
                include snippets/fastcgi-php.conf;

                fastcgi_pass unix:/run/php/php8.0-fpm.sock;
        }
}
```

После настройки web-engine нужно настроить `congig.php`, для этого разименуйте `congig.php.tmpl` и заполните поля в соответствии с вашей конфигурацией БД. Пример:

```
<?php
// config.php

// Глобальные переменные
$DB_HOST = '127.0.0.1';       // IP-адрес сервера БД
$DB_USER = 'root';            // Имя пользователя
$DB_PASS = 'password';        // Пароль
$DB_NAME = 'my_database';     // Имя базы данных
?>
```

Теперь необходимо настроить сервис для автоматического запуска серверной части. Для этого разименуйте `mobile_center.service.tmpl`, переместите файл в необходимую директорию(Обычно: `/etc/systemd/system`), поменяйте поле `WorkingDirectory=####` на директорию вашего сайта и поле `User=####` на вашего пользователя.

Теперь включаем сервис и проект можно считать готовым
`sudo systemctl enable mobile_center.service`

### Принцип работы

Будет описан когда мне будет не впадлу, я сам этот алгоритм уже не понимаю, я запутался