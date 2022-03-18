<script lang="ts">
  import { writable } from 'svelte/store'
  import { toBase64 } from '../../utils/base64'
  import {
    deriveKeyFromPassword,
    encryptSym,
    exportKey,
    generateIV,
    generateKeyPair,
    hash,
  } from '../../utils/encryption'
  import { Register } from './Register.generated'

  const credentials = writable({
    username: '',
    password: '',
    publicName: '',
  })

  const handleSubmit = async (username: string, password: string, publicName: string) => {
    const secretKey = await deriveKeyFromPassword(username, password)

    const { privateKey, publicKey } = await generateKeyPair()

    const ivForPublicName = generateIV()
    const ivForPrivateKey = generateIV()

    const result = await Register({
      variables: {
        input: {
          usernameHash: toBase64(await hash(username, username)),
          passwordHash: toBase64(await hash(password, username)),
          encPublicName: toBase64(await encryptSym(secretKey, publicName, ivForPublicName)),
          encPublicNameIV: toBase64(ivForPrivateKey),
          publicKeyJWK: await exportKey(publicKey),
          symKeyEncPrivateKeyJWK: toBase64(await encryptSym(secretKey, await exportKey(privateKey), ivForPrivateKey)),
          symKeyEncPrivateKeyIV: toBase64(ivForPrivateKey),
        },
      },
    })

    if (result.data?.register.uuid) {
      alert('Succesfully registered!')
    }
  }
</script>

<h1>Register</h1>

<form
  on:submit|preventDefault={() => handleSubmit($credentials.username, $credentials.password, $credentials.publicName)}
>
  <label for="username">Username</label>
  <input type="text" name="username" bind:value={$credentials.username} />

  <label for="password">Password</label>
  <input type="password" name="password" bind:value={$credentials.password} />

  <label for="text">Public name</label>
  <input type="text" name="publicName" bind:value={$credentials.publicName} />

  <input type="submit" value="Submit" />
</form>
