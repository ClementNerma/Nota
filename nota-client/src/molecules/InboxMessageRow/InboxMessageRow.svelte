<script type="ts">
  import { Link } from 'svelte-navigator'
  import { InboxQuery, MessageDirection } from '../../graphql/types'

  import Decrypt from '../../atoms/Decrypt.svelte'

  export let message: InboxQuery['myMessages']['items'][number]
</script>

{#if message.direction === MessageDirection.CorrespondentToUser && !message.encryptedData.encNotificationData}
  <tr>
    <td>
      <Decrypt key={message.key} content={message.correspondent.encDisplayName} />
    </td>
    <td>
      <Decrypt key={message.key} content={message.encryptedData.encSenderName} />
    </td>
    <td>
      <Decrypt key={message.key} content={message.encryptedData.encSubject} />
    </td>
    <td>
      <Link to="/messages/{message.uuid}">Open</Link>
    </td>
  </tr>
{/if}
