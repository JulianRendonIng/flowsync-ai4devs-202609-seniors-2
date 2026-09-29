# Cuentas y acceso

## Purpose

Permite que una persona cree su cuenta en FlowSync, inicie y cierre sesión y consulte su perfil. Solo quien tiene una sesión válida puede acceder a las zonas privadas, tanto en la API como en la aplicación web.

## Requirements

### Requirement: Registro de cuenta

El sistema SHALL permitir crear una cuenta con `POST /api/v1/auth/signup`, enviando `email`, `password`, `passwordConfirmation` y `fullName`. La clave `fullName` SHALL enviarse siempre, pero puede valer `null` si la persona no quiere dar su nombre. Al registrarse, el usuario SHALL quedar autenticado sin tener que iniciar sesión aparte.

#### Scenario: Registro correcto

- **WHEN** alguien envía `fullName`, un `email` válido que no está registrado, una `password` de entre 8 y 32 caracteres y una `passwordConfirmation` idéntica
- **THEN** la API responde `200` con `{ "data": { "user": {...}, "token": "..." } }`, donde `user` contiene `id`, `fullName`, `email`, `initials`, `createdAt` y `updatedAt` pero no la contraseña, y `token` es un token de acceso ya utilizable

#### Scenario: Registro sin nombre

- **WHEN** alguien se registra con datos válidos y `fullName` a `null`
- **THEN** la cuenta se crea y el `user` devuelto tiene `fullName` a `null`

#### Scenario: Registro sin la clave del nombre

- **WHEN** alguien se registra con datos válidos pero sin incluir la clave `fullName` en el cuerpo
- **THEN** la API responde `422` con un error sobre el campo `fullName` y no crea ninguna cuenta

#### Scenario: Email ya registrado

- **WHEN** alguien intenta registrarse con un email que ya pertenece a otra cuenta
- **THEN** la API responde `422` con un error sobre el campo `email` y no crea ninguna cuenta

#### Scenario: Datos de registro inválidos

- **WHEN** alguien envía un email con formato no válido, una contraseña de menos de 8 o de más de 32 caracteres, o una confirmación que no coincide con la contraseña
- **THEN** la API responde `422` con un cuerpo `{ "errors": [...] }` en el que cada error indica el campo, la regla incumplida y un mensaje, y no crea ninguna cuenta

### Requirement: Inicio de sesión

El sistema SHALL permitir iniciar sesión con `POST /api/v1/auth/login` enviando `email` y `password`, y SHALL emitir un token de acceso nuevo cada vez que las credenciales sean correctas.

#### Scenario: Credenciales correctas

- **WHEN** alguien envía el email y la contraseña de una cuenta existente
- **THEN** la API responde `200` con `{ "data": { "user": {...}, "token": "..." } }`, con la misma forma de `user` que en el registro

#### Scenario: Credenciales incorrectas

- **WHEN** alguien envía un email que no está registrado, o uno registrado con una contraseña que no es la suya
- **THEN** la API responde `400` y no emite ningún token

#### Scenario: Email mal formado

- **WHEN** alguien intenta iniciar sesión con un email que no tiene formato de email
- **THEN** la API responde `422` con un error sobre el campo `email`

### Requirement: Acceso protegido por token

El sistema SHALL exigir un token de acceso válido en la cabecera `Authorization: Bearer <token>` en todas las rutas bajo `/api/v1/account`. Un token SHALL seguir siendo válido hasta que se cierre la sesión con él. Todas las respuestas de la API SHALL ser JSON.

#### Scenario: Petición sin token

- **WHEN** alguien llama a `GET /api/v1/account/profile` o a `POST /api/v1/account/logout` sin la cabecera `Authorization`
- **THEN** la API responde `401` con un cuerpo JSON de errores

#### Scenario: Token no válido o revocado

- **WHEN** alguien llama a una ruta bajo `/api/v1/account` con un token inventado o ya revocado por un cierre de sesión
- **THEN** la API responde `401`

### Requirement: Consulta del perfil

El sistema SHALL devolver los datos del usuario autenticado con `GET /api/v1/account/profile`.

#### Scenario: Perfil con token válido

- **WHEN** un usuario autenticado llama a `GET /api/v1/account/profile` con su token
- **THEN** la API responde `200` con `{ "data": { "id", "fullName", "email", "initials", "createdAt", "updatedAt" } }` de ese usuario

#### Scenario: Iniciales con nombre completo

- **WHEN** se consulta un usuario cuyo `fullName` tiene al menos dos palabras
- **THEN** `initials` son las iniciales, en mayúsculas, de sus dos primeras palabras

#### Scenario: Iniciales con nombre de una sola palabra

- **WHEN** se consulta un usuario cuyo `fullName` es una sola palabra, por ejemplo «Ada»
- **THEN** `initials` son las dos primeras letras de esa palabra en mayúsculas («AD»)

#### Scenario: Iniciales sin nombre

- **WHEN** se consulta un usuario sin `fullName`
- **THEN** `initials` son la primera letra de la parte del email anterior a la `@` y la primera de la parte posterior, en mayúsculas

### Requirement: Cierre de sesión en la API

El sistema SHALL revocar, con `POST /api/v1/account/logout`, el token con el que se hace la petición, sin afectar a otros tokens del mismo usuario.

#### Scenario: Logout correcto

- **WHEN** un usuario autenticado llama a `POST /api/v1/account/logout` con su token
- **THEN** la API responde `200` con `{ "message": "Logged out successfully" }`, sin envoltorio `data`, y a partir de ese momento ese token recibe `401` en las rutas protegidas

#### Scenario: Otras sesiones siguen activas

- **WHEN** un usuario tiene dos tokens y cierra sesión con uno de ellos
- **THEN** el otro token sigue dando acceso a las rutas protegidas

### Requirement: Pantalla de registro

La aplicación web SHALL ofrecer en `/register` un formulario de alta con los campos «Nombre completo (opcional)», «Email», «Contraseña» (con la pista «Entre 8 y 32 caracteres.») y «Repite la contraseña», y un enlace «Inicia sesión» que lleva a `/login`.

#### Scenario: Alta correcta

- **WHEN** una persona sin sesión rellena el formulario con datos válidos y pulsa «Crear cuenta»
- **THEN** mientras espera, el botón muestra «Creando cuenta…» y queda deshabilitado; al terminar, la persona entra con la sesión iniciada y ve su perfil en `/profile`

#### Scenario: Contraseñas distintas

- **WHEN** la persona escribe dos contraseñas distintas y pulsa «Crear cuenta»
- **THEN** ve «Las contraseñas no coinciden.» bajo el campo «Repite la contraseña» y el formulario no se envía

#### Scenario: Email ya registrado en pantalla

- **WHEN** la persona intenta darse de alta con un email que ya tiene cuenta
- **THEN** ve «Ese email ya está registrado. Inicia sesión en su lugar.» bajo el campo «Email»

#### Scenario: Errores de validación en pantalla

- **WHEN** el servidor rechaza el formulario por un email mal formado o una contraseña demasiado corta o demasiado larga
- **THEN** la persona ve, bajo el campo afectado, un mensaje en castellano que explica el problema, por ejemplo que la contraseña debe tener al menos 8 caracteres

### Requirement: Pantalla de inicio de sesión

La aplicación web SHALL ofrecer en `/login` un formulario con los campos «Email» y «Contraseña», un botón «Entrar» y un enlace «Crea una» que lleva a `/register`.

#### Scenario: Entrada correcta

- **WHEN** una persona sin sesión introduce credenciales correctas y pulsa «Entrar»
- **THEN** mientras espera, el botón muestra «Entrando…» y queda deshabilitado; al terminar, la persona ve su perfil en `/profile`

#### Scenario: Credenciales incorrectas en pantalla

- **WHEN** la persona introduce un email o una contraseña que no corresponden a ninguna cuenta
- **THEN** ve una alerta en la parte superior del formulario con el texto «El email o la contraseña no son correctos.»

#### Scenario: Campos del login inválidos

- **WHEN** la persona pulsa «Entrar» con un email mal formado o con la contraseña vacía
- **THEN** ve bajo el campo afectado «Introduce una dirección de email válida.» o «Falta rellenar la contraseña.»

#### Scenario: Servidor inaccesible

- **WHEN** la persona intenta entrar o darse de alta y el servidor no responde
- **THEN** ve una alerta con el texto «No se pudo conectar con el servidor. Comprueba que el backend está arrancado.»

### Requirement: Pantalla de perfil

La aplicación web SHALL mostrar en `/profile` los datos de la persona con sesión iniciada y un botón para cerrar sesión.

#### Scenario: Ver el perfil

- **WHEN** una persona con sesión iniciada abre `/profile`
- **THEN** ve un círculo con sus iniciales, su nombre completo (o «Sin nombre» si no lo dio), su email y «Miembro desde» seguido de la fecha de alta en formato largo en castellano

#### Scenario: Cerrar sesión

- **WHEN** la persona pulsa «Cerrar sesión»
- **THEN** la persona vuelve de inmediato a `/login` sin sesión y al recargar la página sigue sin sesión, aunque el servidor no haya podido confirmar el cierre

### Requirement: Persistencia de la sesión en el navegador

La aplicación web SHALL conservar la sesión entre recargas y SHALL comprobarla con el servidor al arrancar antes de dar acceso a las pantallas privadas.

#### Scenario: Recarga con sesión válida

- **WHEN** una persona con sesión iniciada recarga la página o vuelve a abrir la aplicación
- **THEN** ve un indicador de carga a pantalla completa mientras se comprueba la sesión y después sigue dentro, sin tener que volver a iniciar sesión

#### Scenario: Sesión rechazada por el servidor

- **WHEN** la aplicación arranca con una sesión guardada que el servidor ya no acepta
- **THEN** la persona acaba en `/login`, ve la alerta «Tu sesión ha caducado. Vuelve a iniciar sesión.» y la sesión guardada se descarta

#### Scenario: Servidor caído al arrancar

- **WHEN** la aplicación arranca con una sesión guardada y el servidor no responde
- **THEN** la persona acaba en `/login` con la alerta «No se pudo conectar con el servidor. Comprueba que el backend está arrancado.», y si recarga cuando el servidor vuelve a responder, entra de nuevo sin iniciar sesión

#### Scenario: Error del servidor al arrancar

- **WHEN** la aplicación arranca con una sesión guardada y el servidor responde con un error interno
- **THEN** la persona acaba en `/login` con la alerta «Algo ha ido mal en el servidor. Inténtalo de nuevo en un momento.», y la sesión guardada se conserva para la siguiente recarga

#### Scenario: El aviso de sesión perdida se mantiene

- **WHEN** la persona está en `/login` viendo el aviso de por qué perdió la sesión y todavía no ha intentado entrar
- **THEN** el aviso sigue visible hasta que envía el formulario, y a partir de ahí lo sustituye el resultado de ese intento

### Requirement: Protección de rutas en la aplicación web

La aplicación web SHALL impedir que alguien sin sesión acceda a las pantallas privadas y SHALL impedir que alguien con sesión vea las pantallas de acceso.

#### Scenario: Acceso a pantalla privada sin sesión

- **WHEN** una persona sin sesión abre `/profile`
- **THEN** la aplicación la lleva a `/login`

#### Scenario: Acceso a pantalla de acceso con sesión

- **WHEN** una persona con sesión iniciada abre `/login` o `/register`
- **THEN** la aplicación la lleva a `/profile`

#### Scenario: Ruta desconocida

- **WHEN** alguien abre una ruta que la aplicación no reconoce
- **THEN** la aplicación lo lleva a `/profile`, y de ahí a `/login` si no tiene sesión


---

## Parte B

### 1. Requisitos escritos y comprobados

- Requisitos escritos por el agente: 10
- Requisitos comprobados por mí abriendo el código: 0


### 2. Las incoherencias que aparecieron al escribirla

1. El email distingue mayúsculas y minúsculas: se pueden duplicar cuentas y fallar el login

- Ubicación: POST /api/v1/auth/signup y POST /api/v1/auth/login, validador de email en backend/app/validators/user.ts y la tabla users.
- Comportamiento observado:
  - La comprobación de email único se hace sin la opción de ignorar mayúsculas y compara el valor exacto. SQLite también compara así.
  - Por eso Ana@correo.com y ana@correo.com pueden registrarse como dos cuentas distintas.
  - Además, quien se registró como Ana@correo.com e intenta entrar con ana@correo.com recibe 400 («El email o la contraseña no son correctos.»).
  - El email no se normaliza en ningún momento.
- Por qué es anómalo: un email identifica a una persona sin importar las mayúsculas. Hoy una misma persona puede tener varias cuentas o quedarse fuera por escribir una mayúscula.

2. Los tokens de acceso no caducan nunca

- Ubicación: emisión de tokens en signup y login y guard api (backend/app/models/user.ts, config/auth.ts).
- Comportamiento observado: los tokens se crean sin fecha de caducidad (token solo deja de valer si se hace logout con él.
- Por qué es anómalo: un token filtrado o robado da acceso indefinido a la cuenta. El frontend incluso tiene preparado el mensaje «Tu sesión ha caducado», pero en el servidor
  la sesión no caduca nunca por tiempo.

3. Un logout que no llega al servidor deja el token vivo para siempre

- Ubicación: pantalla /profile, botón «Cerrar sesión» (frontend/src/authogout).
- Comportamiento observado: la sesión se borra en el navegador antes de llamar a POST /account/logout, y cualquier fallo de esa llamada se descarta en silencio.
- Por qué es anómalo: si la llamada falla (red caída, servidor caído), l sesión, pero el token sigue siendo válido en el servidor. Como lostokens no caducan (hallazgo 2), queda activo indefinidamente.

4. Con el servidor caído al arrancar, la sesión queda en un estado intermedio

- Ubicación: rehidratación de la sesión al cargar la app (auth-provider.tsx, el useEffect inicial).
- Comportamiento observado:
  - Ante cualquier error que no sea 401, la app se muestra como «sin sesión» y lleva a /login, pero conserva el token en el navegador.
  - La persona no puede cerrar esa sesión: la pantalla de perfil es inacbotón de salida.
  - Al recargar más tarde, vuelve a entrar sin haber iniciado sesión.
- Por qué es anómalo: la pantalla dice que no hay sesión, pero en el nav, por ejemplo, a un ordenador compartido: alguien que ve el login asumeque no hay nadie dentro.

5. El nombre «opcional» es obligatorio en la API

- Ubicación: POST /api/v1/auth/signup, campo fullName (validador signupValidator).
- Comportamiento observado: el campo acepta null pero no admite que faltclave fullName, la API responde 422 con la regla required. La web loesquiva enviando siempre la clave.
- Por qué es anómalo: la pantalla lo presenta como «(opcional)», pero lar cliente que no sea la web oficial falla al omitir un dato que seanuncia como opcional.

6. fullName no tiene límite de longitud

- Ubicación: POST /api/v1/auth/signup, campo fullName.
- Comportamiento observado:
  - El email tiene un máximo de 254 caracteres y la contraseña de 32, pero el nombre no tiene ningún límite.
  - La columna se declara como string (255 en la migración), pero SQLite
  - Resultado: se aceptan y guardan nombres de cualquier tamaño.
- Por qué es anómalo: permite almacenar cadenas enormes y es incoherentesí están acotados. Si la base de datos cambia a una que sí aplique ellímite, el mismo dato pasaría a dar un error de servidor.

7. Las iniciales se calculan mal con espacios repetidos

- Ubicación: campo initials en las respuestas de signup, login y perfil (getter initials del modelo de usuario).
- Comportamiento observado: el nombre se parte por un solo espacio (spli(dos espacios), la segunda parte es una cadena vacía y las inicialessalen «AD» en lugar de «AL». La API no recorta ni normaliza el nombre; solo la web recorta los extremos.
- Por qué es anómalo: el mismo nombre produce iniciales distintas según ios, y el avatar del perfil muestra letras que no corresponden al nombrey al apellido.

8. Sin nombre, la segunda inicial sale del dominio del email

- Ubicación: campo initials cuando fullName es null.
- Comportamiento observado: el email se parte por la @, así que ana@flow de la persona y la «F» del dominio. Todas las personas de la mismaempresa comparten esa segunda letra.
- Por qué es anómalo: la segunda letra identifica a la empresa, no a la ales de nadie.

9. Los mensajes de longitud empiezan en minúscula

- Ubicación: pantallas /register y /login, errores de longitud mínima y ts, función translate).
- Comportamiento observado: el mensaje se construye como ${label} debe tener al menos 8 caracteres., donde label vale «la contraseña», «el email», etc. La persona ve «la
  contraseña debe tener al menos 8 caracteres.», con la primera letra en
- Por qué es anómalo: es un defecto visible de redacción. El resto de mensajes de la app empiezan con mayúscula.

10. Una contraseña corta produce dos errores, uno de ellos engañoso

- Ubicación: POST /api/v1/auth/signup y la pantalla /register.
- Comportamiento observado:
  - La confirmación de la contraseña se valida también con las reglas de longitud de la contraseña.
  - Si alguien escribe dos veces una contraseña de 5 caracteres, la API tud.
  - La pantalla muestra dos mensajes: «la contraseña debe tener al menos 8 caracteres.» y «la confirmación de la contraseña debe tener al menos 8 caracteres.».
- Por qué es anómalo: la confirmación solo debe comprobar que coincide.  problema distinto al real y duplica el aviso.

11. Cualquier 400 se muestra como «credenciales incorrectas»

- Ubicación: frontend/src/lib/api.ts, función toApiError.
- Comportamiento observado: todo error 400, venga del endpoint que venga, se convierte en «El email o la contraseña no son correctos.». Del mismo modo, todo 401 se muestra
  como «Tu sesión ha caducado».
- Por qué es anómalo: el mensaje se decide solo por el código de estado, no por el error real. Hoy coincide por casualidad, porque solo el login devuelve 400. Cualquier otro
  400 enseñaría un mensaje falso.

12. El aviso de sesión perdida solo aparece en /login

- Ubicación: pantallas /login y /register.
- Comportamiento observado:
  - El motivo por el que se perdió la sesión («Tu sesión ha caducado…», se muestra en /login.
  - Si la persona pasa a /register desaparece, y al volver a /login reaparece.
  - Solo se borra al enviar el formulario de login, o al iniciar sesión
- Por qué es anómalo: un aviso que depende de en qué pantalla estés y que vuelve a salir tras navegar entre pantallas resulta confuso.

13. El logout no sigue el formato del resto de respuestas

- Ubicación: POST /api/v1/account/logout.
- Comportamiento observado: responde { "message": "Logged out successfulta": ... }. El resto de endpoints de la API sí lo usan. El mensaje además está en inglés, mientras que el producto está en castellano. Pasa lo mismo con GET /, que devuelve { "hello": "world" }.
- Por qué es anómalo: rompe el contrato de respuesta, y un cliente genéribe undefined. La web no lo nota porque ignora el cuerpo de la respuesta.

14. En producción, la web no puede llamar a la API

- Ubicación: configuración CORS del backend (backend/config/cors.ts).
- Comportamiento observado: en desarrollo se acepta cualquier origen. Fuera de desarrollo la lista de orígenes permitidos está vacía, así que el navegador bloquea todas las  peticiones de la web a la API.
- Por qué es anómalo: si se despliega tal cual, el registro, el login y el perfil dejan de funcionar desde el navegador, y ninguna variable de entorno permite configurar esa lista.

---