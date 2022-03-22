<script type="ts">
  import Decrypt from '../../atoms/Decrypt.svelte'
  import { AsyncMessage } from './Message.generated'

  export let id: string

  const message = AsyncMessage({
    variables: {
      id,
    },
  }).then((message) => message.data.getMessage)
</script>

{#await message}
  <h1>Loading the message data...</h1>
{:then message}
  <h1><Decrypt key={message.key} content={message.encryptedData.encSubject} /></h1>
{:catch e}
  <h1>Failed to load the message: {e.message}</h1>
{/await}
