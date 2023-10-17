# Puppeteer Telegram Bot

Este es un bot de Telegram que utiliza Puppeteer para obtener información sobre las tasas de cambio de moneda en Venezuela y envía actualizaciones a los usuarios de Telegram. El bot está configurado para ejecutarse en un cronómetro y enviar actualizaciones cada cierto intervalo de tiempo.

## Instalación

Para instalar y ejecutar este bot, sigue estos pasos:

1. Clona el repositorio en tu máquina local.
2. Instala las dependencias con el siguiente comando:

npm install

3. Configura las variables de entorno en un archivo `.env` en la raíz del proyecto. Asegúrate de proporcionar valores válidos para las variables de entorno necesarias.

4. Ejecuta la aplicación con el siguiente comando:

node index.js

## Estructura del Proyecto

El proyecto está estructurado en módulos para mejorar su mantenibilidad y comprensión. Aquí está la descripción de cada módulo:

1. **dependencies.js:** Este módulo importa todas las dependencias necesarias para el proyecto.

2. **expressConfig.js:** Aquí se configura el servidor Express y se definen las rutas y el puerto.

3. **puppeteerConfig.js:** Este módulo se encarga de la configuración de Puppeteer.

4. **fileOperations.js:** Contiene funciones para leer y escribir en archivos.

5. **index.js:** Aquí se encuentra la función principal `main` y otras funciones relacionadas con el proceso principal.

6. **telegramConfig.js:** Contiene la configuración y la lógica para enviar mensajes de Telegram.

## Contribuir

Si deseas contribuir a este proyecto, siéntete libre de hacer un fork y enviar un pull request. Asegúrate de seguir las directrices de contribución.

## Licencia

Este proyecto está bajo la licencia [MIT](https://opensource.org/licenses/MIT).
