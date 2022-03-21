<script lang="ts">
  import { writable } from 'svelte/store'
  import { Login } from './Login.generated'
  import { hash } from '../../others/crypto'
  import { deriveKeyFromPassword } from '../../others/crypto'
  import { authenticate } from '../../others/auth'

  const credentials = writable({
    username: '',
    password: '',
  })

  const handleSubmit = async (username: string, password: string) => {
    const result = await Login({
      variables: {
        input: {
          usernameHash: await hash(username, username),
          passwordHash: await hash(password, username),
        },
      },
    })

    if (result.data) {
      authenticate(await deriveKeyFromPassword(username, password), result.data.login.accessToken, result.data.login.viewer)
    }
  }
</script>

<h1>Login</h1>

<form on:submit|preventDefault={() => handleSubmit($credentials.username, $credentials.password)}>
  <label for="username">Username</label>
  <input type="text" name="username" bind:value={$credentials.username} />

  <label for="password">Password</label>
  <input type="password" name="password" bind:value={$credentials.password} />

  <input type="submit" value="Submit" />
</form>
