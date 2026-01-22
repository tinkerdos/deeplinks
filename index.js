import { Discovery } from '@firebolt-js/sdk'; // Replace with actual path to Discovery library

function firebolt_discovery() {
  console.log("Firebolt Deeplink fired");
  Discovery.launch("xre:///guide/x2/settings/audio/bluetooth.xml",
    {
      action: 'deeplink',
      context: { source: 'device' }
    })
    .then(() => {
      console.log('Firebolt deeplink launched successfully');
    }).catch(e => {
      console.error('Error launching Firebolt deeplink:', e);}
    )
}

function badger_deeplink() {
  console.log("Badger Deeplink fired");
  alert("Hello from Badger Deeplink!");
}
export { firebolt_discovery, badger_deeplink };

// Expose functions globally for inline onclick handlers
if (typeof window !== 'undefined') {
  window.firebolt_discovery = firebolt_discovery;
  window.badger_deeplink = badger_deeplink;
}