<script lang="ts">
  import { setupDevTools } from './others/devtools'
  setupDevTools()

  import { Router, Route } from 'svelte-navigator'

  import { pendingAuth } from './others/auth'

  import AppHeader from './organisms/AppHeader/AppHeader.svelte'
  import AuthGateway from './components/AuthGateway.svelte'

  import Login from './organisms/Login/Login.svelte'
  import Register from './organisms/Register/Register.svelte'

  import Home from './organisms/Home/Home.svelte'
  import Message from './organisms/Message/Message.svelte'
</script>

<Router>
  <AppHeader />

  {#if $pendingAuth}
    <h1>Authenticating...</h1>
  {:else}
    <!-- Routes to everyone -->
    <Route path="/login">
      <Login />
    </Route>

    <Route path="/register">
      <Register />
    </Route>

    <!-- Authentication-based routes -->
    <Route path="/">
      <AuthGateway>
        <Home />
      </AuthGateway>
    </Route>

    <Route path="/messages/:id" let:params>
      <AuthGateway>
        <Message id={params['id']} />
      </AuthGateway>
    </Route>
  {/if}
</Router>
