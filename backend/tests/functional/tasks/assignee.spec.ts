import User from '#models/user'
import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

/**
 * Lo que cada tarea muestra de su responsable. Cubre los tres scenarios del
 * requisito «Lo que cada tarea muestra de su responsable» de
 * `openspec/specs/tasks/spec.md`: el responsable identificable, que la tarea no
 * filtre datos de la cuenta y el responsable sin nombre.
 *
 * El scenario dice «suelta o dentro de la lista», así que cada comprobación se
 * hace por las dos lecturas: `GET /api/v1/tasks` y `GET /api/v1/tasks/:id`.
 */
test.group('Tasks | responsable', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  /**
   * Crea la cuenta, inicia sesión y apunta una tarea con ese token: la tarea
   * nace a nombre de quien la crea, así que esa cuenta es su responsable.
   */
  async function tareaDe(client: any, fullName: string | null, email = 'ada@example.com') {
    await User.create({ fullName, email, password: 'secreto123' })

    const login = await client.post('/api/v1/auth/login').json({ email, password: 'secreto123' })
    const token = login.body().data.token as string

    const creada = await client
      .post('/api/v1/tasks')
      .header('Authorization', `Bearer ${token}`)
      .json({ title: 'Revisar el informe' })

    return { token, id: creada.body().data.id as number }
  }

  /**
   * El `assignee` de la tarea `id` según cada una de las dos lecturas.
   */
  const lecturas: Array<[string, (client: any, token: string, id: number) => Promise<any>]> = [
    [
      'en la lista',
      async (client, token, id) => {
        const response = await client
          .get('/api/v1/tasks')
          .header('Authorization', `Bearer ${token}`)
        response.assertStatus(200)
        return response.body().data.find((tarea: any) => tarea.id === id).assignee
      },
    ],
    [
      'en la tarea suelta',
      async (client, token, id) => {
        const response = await client
          .get(`/api/v1/tasks/${id}`)
          .qs({ today: '2026-10-07' })
          .header('Authorization', `Bearer ${token}`)
        response.assertStatus(200)
        return response.body().data.assignee
      },
    ],
  ]

  for (const [donde, leer] of lecturas) {
    test(`${donde}, el responsable llega con su nombre y sus iniciales`, async ({
      client,
      assert,
    }) => {
      const { token, id } = await tareaDe(client, 'Ada Lovelace')

      const assignee = await leer(client, token, id)

      assert.equal(assignee.fullName, 'Ada Lovelace')
      assert.equal(assignee.initials, 'AL')
    })

    test(`${donde}, el responsable no trae el email ni datos de acceso`, async ({
      client,
      assert,
    }) => {
      const { token, id } = await tareaDe(client, 'Ada Lovelace')

      const assignee = await leer(client, token, id)

      assert.notProperty(assignee, 'email')
      assert.notProperty(assignee, 'password')
      // Ni bajo otra clave: el email no aparece en ningún sitio del objeto, y
      // tampoco la contraseña ni el token con el que se ha pedido.
      const serialized = JSON.stringify(assignee)
      assert.notInclude(serialized, 'ada@example.com')
      assert.notInclude(serialized, 'secreto123')
      assert.notInclude(serialized, token)
    })

    test(`${donde}, un responsable sin nombre llega con nombre nulo y sus iniciales`, async ({
      client,
      assert,
    }) => {
      const { token, id } = await tareaDe(client, null)

      const assignee = await leer(client, token, id)

      assert.property(assignee, 'fullName')
      assert.isNull(assignee.fullName)
      assert.equal(assignee.initials, 'AE')
    })
  }
})
