import Route from '@ioc:Adonis/Core/Route'
import HealthCheck from '@ioc:Adonis/Core/HealthCheck'

import './document'

Route.get(`/`, async () => {
  return { hello: `world` }
})

Route.get(`health`, async ({ response }) => {
  const report = await HealthCheck.getReport()
  return report.healthy ? response.ok(report) : response.badRequest(report)
})
