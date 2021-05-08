/**
 * Contract source: https://git.io/JTm6U
 *
 * Feel free to let us know via PR, if you find something broken in this contract
 * file.
 */

// eslint-disable-next-line quotes
declare module '@ioc:Adonis/Core/Env' {
  /*
  |--------------------------------------------------------------------------
  | Getting types for validated environment variables
  |--------------------------------------------------------------------------
  |
	| The `default` export from the "../env.ts" file exports types for the
	| validated environment variables. Here we merge them with the `EnvTypes`
	| interface so that you can enjoy intellisense when using the "Env"
	| module.
  |
  */

  // eslint-disable-next-line quotes
  type CustomTypes = typeof import('../env').default
  interface EnvTypes extends CustomTypes {}
}
