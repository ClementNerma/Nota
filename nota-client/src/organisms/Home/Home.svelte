<script lang="ts">
  import { AsyncHome } from './Home.generated'

  const home = AsyncHome({
    variables: {
      paginate: {
        limit: 10,
      },
    },
  })
</script>

{#await home}
  <h1>Loading...</h1>
{:then home}
  {home.data}
{:catch error}
  <h1>Failed: {error.message}</h1>
{/await}
