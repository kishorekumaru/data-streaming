

//   document.addEventListener('DOMContentLoaded', () => {
//     const joke = 'tell me a joke';
//     const urlEncoded = encodeURIComponent(joke);
//     const audioPlayer = new Audio();
//     const audioUrl = `http://localhost:3000/say-prompt?prompt=${urlEncoded}`; // URL of your audio stream  

//     audioPlayer.src = audioUrl;
//     audioPlayer.autoplay = true;
//     audioPlayer.load();
  
//     // Try to play the audio immediately
//     const playAudio = () => {
//         audioPlayer.play().catch(error => {
//           console.error('Error playing audio:', error);
//         });
//       };
    
//       // Add a user interaction prompt
//       document.body.addEventListener('click', () => {
//         playAudio();
//         document.body.removeEventListener('click', playAudio);
//       }, { once: true }); // Ensure the event listener is removed after the first interaction

//       audioPlayer.addEventListener('ended', () => {
//         audioPlayer.src = audioUrl;
//         audioPlayer.autoplay = true;
//         audioPlayer.load();
//       });
// });


document.addEventListener('DOMContentLoaded', () => {
    const textContainer = document.getElementById('textContainer');
    const joke = 'write an essay about the importance of recycling';
    const urlEncoded = encodeURIComponent(joke);
    const textStreamUrl = `http://localhost:3000/stream-text?prompt=${urlEncoded}`; // URL of your text stream
  
    const fetchStream = async () => {
      try {
        const response = await fetch(textStreamUrl);
        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let result;
  
        while (!result?.done) {
          result = await reader.read();
          const chunk = decoder.decode(result.value || new Uint8Array, { stream: !result.done });
          textContainer.innerHTML += chunk;
        }
      } catch (error) {
        console.error('Error fetching text stream:', error);
      }
    };
  
    // Add a user interaction prompt
    document.body.addEventListener('click', () => {
      fetchStream();
      document.body.removeEventListener('click', fetchStream);
    }, { once: true }); // Ensure the event listener is removed after the first interaction
  });