<script lang="ts">
  import { authData } from '../../others/auth'

  import Inbox from '../Inbox/Inbox.svelte'
</script>

<h1>Hello {$authData?.decrypted.publicName}</h1>

<Inbox />
