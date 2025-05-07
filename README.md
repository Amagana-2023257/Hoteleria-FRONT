<h1>🔧 Estandarización de código para el proyecto</h1>
Con el objetivo de mantener un código limpio, organizado y fácil de mantener, todos los desarrolladores deberán seguir las siguientes convenciones durante el desarrollo del proyecto.

<h2>📌 Variables</h2>

Las variables deben estar nombradas en inglés.</br>
Se debe utilizar la notación camelCase.</br>
Ejemplos: userName, productId.</br>

<h2>📁 Módulos / Archivos</h2>

Los nombres de los archivos y módulos también deben estar en inglés.</br>
Usar camelCase, comenzando con minúscula.</br>
Ejemplos: productRegister, userRegister.</br>
Utilizar nombres en singular, no en plural.</br>
✅ productForm</br>
❌ productsForm</br>

<h2>❗Mensajes de error</h2>

Todos los mensajes de error deben estar escritos en inglés.</br>
Deben ser claros, precisos y orientados al usuario o al desarrollador, según corresponda.</br>
Ejemplos:</br>
"Invalid email address."</br>
"Product not found."</br>

<h2>💬 Commits</h2>

Todos los mensajes de commit deben iniciar con un prefijo que indique el tipo de cambio. A continuación, se listan:</br>
Prefijo | Descripción</br>
feat: | Agregar o eliminar una nueva característica</br>
add: | Añadir archivos nuevos al proyecto</br>
build: | Cambios relacionados con la estructura del proyecto</br>
docs: | Cambios en la documentación</br>
fix: | Corrección de errores o bugs</br>
refactor: | Cambios internos que no afectan la funcionalidad</br>
style: | Cambios en estilos (CSS, clases, etc.)</br>
chore: | Cambios en dependencias o tareas menores</br>

Ejemplos:</br>
add: Se creó el módulo register de productos</br>
fix: Se arregló el método register de productos</br>

<h2>🌿 Ramas</h2>

Las ramas se crearán por funcionalidad o ticket.</br>
Cada funcionalidad debe tener su propia rama, en la que se realizarán los commits correspondientes.</br>
Los nombres de la rama seran en base al número de ticket en este caso los que estan asignados en Jira.</br>
![image](https://github.com/user-attachments/assets/00047ea6-8613-426f-aed2-c3c814e5e383)</br>
El número del ticket en jira es el LGDA-8 este será el número de ticket que le deberan poner a la rama</br>
❗Ejemplo del nombre de rama por si no quedo claro:

Número de ticket LGDA-8 entonces el nombre quedaría así:</br>

LDGA-8 así quedaría el nombre de la rama.</br>
