<template>
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
    <div v-if="!$auth.loading.value">
      <button v-if="!$auth.isAuthenticated.value" @click="login">Log in</button>
      <button v-if="$auth.isAuthenticated.value" @click="logout">
        Log out
      </button>
    </div>
  </div>
  <router-view />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'

@Options({})
export default class App extends Vue {
  $auth: any
  login() {
    this.$auth.loginWithRedirect()
  }

  // Log the user out
  logout() {
    this.$auth.logout({
      returnTo: window.location.origin,
    })
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: #2c3e50;
  text-align: center;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
