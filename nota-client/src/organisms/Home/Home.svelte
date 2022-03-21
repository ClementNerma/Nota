<script lang="ts">
  import { authData } from '../../others/auth'
</script>

<h1>Hello {$authData?.decrypted.publicName}</h1>
