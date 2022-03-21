<script type="ts">
  import { MessageDirection } from '../../graphql/types'
  import { AsyncInbox } from './Inbox.generated'

  import InboxMessageRow from '../../molecules/InboxMessageRow/InboxMessageRow.svelte'

  const inbox = AsyncInbox({
    variables: {
      paginate: {
        limit: 10,
      },
    },
  })

  const messages = inbox.then((inbox) =>
    inbox.data.myMessages.items.filter(
      (item) => item.direction === MessageDirection.CorrespondentToUser && !item.encryptedData.encNotificationData,
    ),
  )
</script>

{#await messages}
  <h1>Loading...</h1>
{:then messages}
  <h1>Inbox ({messages.length} messages)</h1>

  <!-- TODO: show "sent" box -->
  <!-- TODO: use replyingtomessageid -->
  <!-- TODO: group by category -->
  <!-- TODO: handle notifications -->

  <table>
    <thead>
      <tr>
        <th>Sender</th>
        <th>Sender name</th>
        <th>Subject</th>
        <th>Link</th>
      </tr>
    </thead>
    <tbody>
      {#each messages as message}
        <InboxMessageRow {message} />
      {/each}
    </tbody>
  </table>
{:catch err}
  <h1>Failed: {err.message}</h1>
{/await}

<style>
  table {
    width: 100%;
  }

  table,
  th,
  table :global(td) {
    border: 1px solid black;
    border-collapse: collapse;
  }

  th,
  table :global(td) {
    padding: 5px;
    text-align: center;
  }
</style>
