<script type="ts">
  import { CorrespondentTokenLifespan } from '../../graphql/types'

  import { CreateCorrespondenceToken } from './CreateCorrespondenceToken.generated'

  export let onTokenCreation: (token: string, expiresAt: Date) => void

  const lifespans: { [key in CorrespondentTokenLifespan]: string } = {
    FiveMinutes: '5 minutes',
    TenMinutes: '10 minutes',
    ThirtyMinutes: '30 minutes',
    OneHour: '1 hour',
    TwoHours: '2 hours',
    TwelveHours: '12 hours',
    OneDay: '1 day',
    TwoDays: '2 days',
    OneWeek: '1 week',
    TwoWeeks: '2 weeks',
  }

  const lifespanArr = Object.entries(lifespans)

  let tokenLifespan: CorrespondentTokenLifespan

  const handleCreation = async (lifespan: CorrespondentTokenLifespan) => {
    const created = await CreateCorrespondenceToken({
      variables: {
        lifespan,
      },
    })

    if (created.data) {
      onTokenCreation(
        created.data.createCorrespondenceToken.correspondenceToken,
        new Date(created.data.createCorrespondenceToken.expiresAt),
      )
    }
  }
</script>

<div class="container">
  Correspondence token - valid for
  <select bind:value={tokenLifespan}>
    {#each lifespanArr as lifespan}
      <option value={lifespan[0]}>{lifespan[1]}</option>
    {/each}
  </select>
  <button on:click={() => handleCreation(tokenLifespan)}>Create</button>
</div>

<style>
  .container {
    display: inline-block;
    border: 1px solid black;
    padding: 5px;
  }
</style>
