import createAuth0Client, {
  Auth0Client,
  Auth0ClientOptions,
  GetIdTokenClaimsOptions,
  GetTokenSilentlyOptions,
  GetTokenWithPopupOptions,
  LogoutOptions,
  RedirectLoginOptions,
} from '@auth0/auth0-spa-js'
import { App, computed, reactive, watchEffect } from 'vue'
import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

let client: Auth0Client
const state = reactive({
  loading: true,
  isAuthenticated: false,
  user: {} || undefined,
  popupOpen: false,
  error: null,
})

async function loginWithPopup() {
  state.popupOpen = true

  try {
    await client.loginWithPopup({})
  } catch (e) {
    console.error(e)
  } finally {
    state.popupOpen = false
  }

  state.user = await client.getUser()
  state.isAuthenticated = true
}

async function handleRedirectCallback() {
  state.loading = true

  try {
    await client.handleRedirectCallback()
    state.user = await client.getUser()
    state.isAuthenticated = true
  } catch (e) {
    state.error = e
  } finally {
    state.loading = false
  }
}

function loginWithRedirect(options?: RedirectLoginOptions) {
  return client.loginWithRedirect(options)
}

function getIdTokenClaims(options?: GetIdTokenClaimsOptions) {
  return client.getIdTokenClaims(options)
}

function getTokenSilently(options?: GetTokenSilentlyOptions) {
  return client.getTokenSilently(options)
}

function getTokenWithPopup(options?: GetTokenWithPopupOptions) {
  return client.getTokenWithPopup(options)
}

function logout(options?: LogoutOptions) {
  return client.logout(options)
}

const authPlugin = {
  isAuthenticated: computed(() => state.isAuthenticated),
  loading: computed(() => state.loading),
  user: computed(() => state.user),
  getIdTokenClaims,
  getTokenSilently,
  getTokenWithPopup,
  handleRedirectCallback,
  loginWithRedirect,
  loginWithPopup,
  logout,
}

export const routeGuard = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const { isAuthenticated, loading, loginWithRedirect } = authPlugin

  const verify = () => {
    // If the user is authenticated, continue with the route
    if (isAuthenticated.value) {
      return next()
    }

    // Otherwise, log in
    loginWithRedirect({ appState: { targetUrl: to.fullPath } })
  }

  // If loading has already finished, check our auth state using `fn()`
  if (loading.value) {
    return verify()
  }

  // Watch for the loading property to change before we check isAuthenticated
  watchEffect(() => {
    if (loading.value === false) {
      return verify()
    }
  })
}

export const setupAuth = async (
  options: Auth0ClientOptions,
  callbackRedirect: (data?: any) => void
) => {
  client = await createAuth0Client({
    ...options,
  })

  try {
    // If the user is returning to the app after authentication

    if (
      window.location.search.includes('code=') &&
      window.location.search.includes('state=')
    ) {
      // handle the redirect and retrieve tokens
      const { appState } = await client.handleRedirectCallback()

      // Notify subscribers that the redirect callback has happened, passing the appState
      // (useful for retrieving any pre-authentication state)
      callbackRedirect(appState)
    }
  } catch (e) {
    state.error = e
  } finally {
    // Initialize our internal authentication state
    state.isAuthenticated = await client.isAuthenticated()
    state.user = await client.getUser()
    state.loading = false
  }

  return {
    install: (app: App<Element>) => {
      app.config.globalProperties.$auth = authPlugin
    },
  }
}
