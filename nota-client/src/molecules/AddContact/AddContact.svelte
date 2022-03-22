<script type="ts">
  import { API_SERVER_URL } from '../../apollo-client'

  import { assertAuthData, authData } from '../../others/auth'
  import { encryptAsym, exportKey, importAsymKey } from '../../others/crypto'
  import { Viewer } from '../../others/gql/Viewer.generated'

  import { AddContact } from './AddContact.generated'
  import { AsyncGetCorrespondenceToken } from './GetCorrespondenceToken.generated'

  let contactToken: string

  const addContact = async (correspondenceToken: string) => {
    // TODO: Query the client's server directly instead of our own
    const details = await AsyncGetCorrespondenceToken({
      variables: {
        correspondenceToken,
      },
    }).then((details) => details.data.getCorrespondenceToken)

    const expirationDate = new Date(details.expiresAt)

    if (Date.now() > expirationDate.getTime()) {
      alert('Token has already expired on:\n' + expirationDate.toLocaleString())
      return
    }

    const targetPublicKey = await importAsymKey(details.userPublicKeyJWK, 'publicKey')

    await AddContact({
      variables: {
        correspondenceToken,
        correspondentData: {
          encDisplayName: await encryptAsym(targetPublicKey, $assertAuthData.decrypted.publicName),
          correspondentPublicKeyJWK: $assertAuthData.viewer.publicKeyJWK,
          // TODO: Customizable
          selfPermissions: {
            canSendMessages: true,
          },
          // TODO: Customizable
          userPermissions: {
            canSendMessages: true,
          },
          serverUrl: API_SERVER_URL,
          userApiKey: {}, // TODO
        },
      },
    })
  }
</script>

<div class="container">
  Add a contact:
  <input type="text" bind:value={contactToken} />
  <button on:click={() => addContact(contactToken)}>Submit</button>
</div>

<style>
  .container {
    display: inline-block;
    border: 1px solid black;
    padding: 5px;
  }
</style>
