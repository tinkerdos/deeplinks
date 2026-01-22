import { Discovery } from '@firebolt-js/sdk'; // Replace with actual path to Discovery library

function firebolt_discovery(url) {
  console.log("Firebolt Deeplink fired");
  Discovery.launch(url,
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

export { firebolt_discovery };

// Expose functions globally for inline onclick handlers
if (typeof window !== 'undefined') {
  window.firebolt_discovery = firebolt_discovery;
}