const apiKey = '8ae5581c367f4d0abf4572b4c39fafac';
const main = document.querySelector('main');
const sourceSelector = document.querySelector('#sourceSelector');
const defaultSource = 'the-washington-post';


var deferredPrompt;

window.addEventListener('beforeinstallprompt', function (e) {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;

  showAddToHomeScreen();

});


var deferredPrompt;

window.addEventListener('beforeinstallprompt', function (e) {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;

  showAddToHomeScreen();

});


function addToHomeScreen() {  var a2hsBtn = document.querySelector(".ad2hs-prompt");  // hide our user interface that shows our A2HS button
  a2hsBtn.style.display = 'none';  // Show the prompt
  deferredPrompt.prompt();  // Wait for the user to respond to the prompt
  deferredPrompt.userChoice
    .then(function(choiceResult){

  if (choiceResult.outcome === 'accepted') {
    console.log('User accepted the A2HS prompt');
  } else {
    console.log('User dismissed the A2HS prompt');
  }

  deferredPrompt = null;

});}

window.addEventListener('load', async e =>  {
  updateApi();
  await updateSources();
  sourceSelector.value = defaultSource;

  sourceSelector.addEventListener('change', e => {
      updateApi(e.target.value);
  });

  if('serviceWorker' in navigator){
      try {
          navigator.serviceWorker.register('/sw.js');
          console.log('SW registered');
      } catch (error) {
          console.log('SW Failed');
      }
  }

});

 async function updateSources()
 {
     const res = await fetch("https://newsapi.org/v1/sources?");
     const json = await res.json();
    
     sourceSelector.innerHTML = json.sources.map(src => `<option value="${src.id}">${src.name}</option>`).join('\n');

 }

 async function updateApi(source = defaultSource) {
 // console.log('test1');
  console.log(source);
    
    const res = await fetch("https://newsapi.org/v1/articles?source="+source+"&apiKey="+apiKey+"");
    const json = await res.json();
    let json1 = json;
   // console.log(json1.articles[0]);
    // main.textContent=json.title;
    //main.innerHTML = '<h2>' + json.title + '</h2>'
    //main.innerHTML = '<h2>' + json.completed + '</h2>'
    //main.innerHTML = json.title + json.completed +json.userId+json.id;
   // main.innerHTML = map.createPCR(json);
  // main.innerHTML = json.articles.map(createPCR).join('\n');

 // main.innerHTML = json.articles[1].author;
 // main.innerHTML = json.articles[1].title;
    main.innerHTML = json.articles.map(createPCR).join('\n');

}

function createPCR(article)
{
    return `
    <h1>
    ${article.title}
    </h1>
    <div>
    <img src='${article.urlToImage}'/>
    </div>
    
    `
}


