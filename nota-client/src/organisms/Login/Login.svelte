<script lang="ts">
  import { writable } from 'svelte/store'
  import { toBase64 } from '../../utils/base64'
  import { hash } from '../../utils/encryption'
  import { authenticate } from '../../utils/stores'
  import { Login } from './Login.generated'

  const credentials = writable({
    username: '',
    password: '',
  })

  const handleSubmit = async (username: string, password: string) => {
    const result = await Login({
      variables: {
        input: {
          usernameHash: toBase64(await hash(username, username)),
          passwordHash: toBase64(await hash(password, username)),
        },
      },
    })

    if (result.data) {
      authenticate(result.data.login)
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
