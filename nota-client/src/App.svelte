<script lang="ts">
  import { Router, Route } from 'svelte-navigator'

  import AuthGateway from './components/AuthGateway.svelte'

  import Login from './organisms/Login/Login.svelte'
  import Register from './organisms/Register/Register.svelte'

  import Home from './organisms/Home/Home.svelte'
</script>

<Router>
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
</Router>
