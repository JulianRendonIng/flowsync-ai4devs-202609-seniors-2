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
