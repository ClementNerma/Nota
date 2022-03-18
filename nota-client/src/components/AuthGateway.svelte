<script lang="ts">
  import Login from '../organisms/Login/Login.svelte'
  import { isAuth } from '../utils/stores'
</script>

{#if $isAuth}
  <slot />
{:else}
  <Login />
{/if}
