<script lang="ts">
  import Login from '../organisms/Login/Login.svelte'
  import { isAuth } from '../others/auth'
</script>

{#if $isAuth}
  <slot />
{:else}
  <Login />
{/if}
