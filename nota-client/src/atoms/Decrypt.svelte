<script lang="ts">
  import { tplDecrypt } from '../others/tpl-crypto'

  export let key: string
  export let content: string
</script>

{#await tplDecrypt(key, content)}
  <em>Decrypting...</em>
{:then}
  {content}
{:catch e}
  <span class="failed">Failed to decrypt</span>
{/await}

<style>
  .failed {
    text-transform: uppercase;
    font-weight: bold;
    color: red;
  }
</style>
