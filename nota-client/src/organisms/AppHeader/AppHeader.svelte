<script type="ts">
  import { Link } from 'svelte-navigator'
  import { authData, isAuth, logout, profiles, switchToProfile } from '../../others/auth'

  let selectedProfile = $authData?.viewer.uuid

  authData.subscribe((data) => {
    selectedProfile = data?.viewer.uuid
  })
</script>

<div id="profiles">
  {#if $profiles.length > 0}
    <span>Switch to profile:</span>
    <select bind:value={selectedProfile} on:change={() => selectedProfile && switchToProfile(selectedProfile)}>
      {#each $profiles as profile}
        <option value={profile.uuid}>{profile.lastDecryptedName}</option>
        {#if !selectedProfile}
          <option value={undefined} disabled>&lt;Logged out&gt;</option>
        {/if}
      {/each}
    </select>

    {#if $isAuth}
      <button on:click={() => logout()}>Logout</button>
    {/if}
  {:else}
    <p>No available profile, please <Link to="/login">login</Link>.</p>
  {/if}
</div>
<hr />
