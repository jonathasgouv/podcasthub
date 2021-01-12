fname = document.getElementById('fname');
sname = document.getElementById('sname');
img = document.getElementById('avatar');
loading = document.getElementById('loadingscr');
contentdiv = document.getElementById('content-middle');
iframe = document.getElementById('iframe');
podcastep = document.getElementById('podcastepisode');
podcastname = document.getElementById('podcastitle');
podcastitem = document.getElementById('podcastitem');
episodesitem = document.getElementById('myepisodesitem');
categoriesitem = document.getElementById('categoriesitem');
database = firebase.database();
userRef = database.ref('users/');

apiurl = 'https://PodcasterBackEnd.podcaster.repl.co'

historyarray = [{url: '/views/podcasts/podcast.html', view: 'home'}];
currentpageindex = 0;

function dealWithPagination(url) {
  console.log(url)
  try {
    view = url.split('#view=')[1].split('&')[0];
  } catch {
    url = '/views/podcasts/podcast.html'
    iframe.src = url;
    historyarray = [{url: url, view: 'home'}];
    const stateObj = { view: "home" };
    history.replaceState(stateObj, "home", "home");
    
    return;
  }

  if (view == 'mypodcasts') {
    url = '/views/mypodcasts/podcast.html#uid=' + userdata.id;
    iframe.src = url;
    historyarray = [{url: url, view: 'mypodcasts'}];
    const stateObj = { view: "mypodcasts" };
    history.replaceState(stateObj, "mypodcasts", "mypodcasts");
    
    return;
  };

  if (view == 'myepisodes') {
    url = '/views/myepisodes/podcast.html#uid=' + userdata.id
    iframe.src = url;
    historyarray = [{url: url, view: 'myepisodes'}];
    const stateObj = { view: "myepisodes" };
    history.replaceState(stateObj, "myepisodes", "myepisodes");
    
    return;
  }

  if (view == 'categories') {
    url = '/views/categories/podcast.html'
    iframe.src = url;
    historyarray = [{url: url, view: 'categories'}];
    const stateObj = { view: "categories" };
    history.replaceState(stateObj, "categories", "categories");
    
    return;
  }

  if (view == 'home') {
    url = '/views/podcasts/podcast.html'
    iframe.src = url;
    historyarray = [{url: url, view: 'home'}];;
    const stateObj = { view: "home" };
    history.replaceState(stateObj, "home", "home");
    
    return;
  }

  if (view == 'tag') {
    tagname = url.split('&param1=')[1].split('&')[0];
    url = '/views/mytag/podcast.html#tagname=' + tagname
    iframe.src = url;
    historyarray = [{url: url, view: `tag/${tagname}`}];
    const stateObj = { view: `tag/${tagname}` };
    history.replaceState(stateObj, "tag", `tag/${tagname}`);
    
    return;
  }

  if (view == 'podcast') {
    podcastid = url.split('&param1=')[1].split('&')[0];
    url = '/views/episodes/podcast.html#id=' + podcastid
    iframe.src = url;
    historyarray = [{url: url, view: `podcast/${podcastid}`}];
    const stateObj = { view: `podcast/${podcastid}` };
    history.replaceState(stateObj, "podcast", `podcast/${podcastid}`);
    
    return;
  }

  if (view == 'episode') {
    urlepisode = url.split('&param1=')[1].split('&')[0];
    urlepisodedecoded = atob(urlepisode.split('-').join('/'))
    podcastid = urlepisodedecoded.split('podcastid=')[1].split('&')[0]
    epid = urlepisodedecoded.split('epid=')[1]
    url = '/views/episodespage/podcast.html#id=' + podcastid + '&ep=' + epid
    iframe.src = url;
    historyarray = [{url: url, view: `episode/${urlepisode}`}];
    const stateObj = { view: `episode/${urlepisode}` };
    history.replaceState(stateObj, "episode", `episode/${urlepisode}`);
    
    return;
  }

  if (view == 'categorie') {
    urlcategory = url.split('&param1=')[1].split('&')[0];
    urldecoded = atob(urlcategory.split('-').join('/'))
    genreid = urldecoded.split('id=')[1].split('&')[0]
    name = urldecoded.split('name=')[1]
    url = '/views/searchgenre/podcast.html#id=' + genreid + '&title=' + name
    historyarray = [{url: url, view: `../categorie/${urlcategory}`}];
    const stateObj = { view: `../categorie/${urlcategory}` };
    iframe.src = url;
    history.replaceState(stateObj, `${genreid}`, `../categorie/${urlcategory}`)
  }
};

searchConfig = {
  searchpodcasts: true,
  searchauthor: false,
  searchinternationals: false
};

function addToHistory(view) {
  document.getElementById('goback').className = 'ion-chevron-left';
  document.getElementById('goback').style.cursor = 'pointer';

  if (historyarray.length-1 == currentpageindex) {
    console.log('push normal')
    historyarray.push({url: view, view: document.location.href.split('https://frontend.podcaster.repl.co/')[1]});
    currentpageindex += 1;
  } else {
    document.getElementById('go').className = 'ion-chevron-right disabled'
    document.getElementById('go').style.cursor = 'auto';
    historyarray = historyarray.slice(0,currentpageindex+1);
    currentpageindex = historyarray.lenght-1;
  }
  
};

document.getElementById('goback').addEventListener('click', () => {
  if (document.getElementById('goback').className == 'ion-chevron-left disabled') {
    return
  }
  document.getElementById('go').className = 'ion-chevron-right';
  document.getElementById('go').style.cursor = 'pointer';
  currentpageindex -= 1;
  console.log(currentpageindex)
  if (currentpageindex == 0) {
    document.getElementById('goback').className = 'ion-chevron-left disabled';
    document.getElementById('goback').style.cursor = 'auto';
    iframe.src = historyarray[0].url
    const stateObj = { view: historyarray[0].view };
    history.replaceState(stateObj, "view", historyarray[0].view);
  } else {
    console.log(historyarray[currentpageindex])
    iframe.src = historyarray[currentpageindex].url
    const stateObj = { view: historyarray[currentpageindex].view };
    history.replaceState(stateObj, "view", `../${historyarray[currentpageindex].view}`);
  }
})

document.getElementById('go').addEventListener('click', () => {
  if (document.getElementById('go').className == 'ion-chevron-right disabled') {
    return
  }

  document.getElementById('goback').className = 'ion-chevron-left';
  document.getElementById('goback').style.cursor = 'pointer';
  currentpageindex += 1;
  iframe.src = historyarray[currentpageindex].url
  const stateObj = { view: "view" };
  history.replaceState(stateObj, "view", historyarray[currentpageindex].view);

  if (historyarray.length-1 == currentpageindex) {
    document.getElementById('go').className = 'ion-chevron-right disabled'
    document.getElementById('go').style.cursor = 'auto';
  }
})


async function isUserSaved(id) {
  result = await userRef.child(id)
    .once('value')
    .then(function(snapshot) {
      var value = snapshot.val();
      if (value == null) {
        return false
      }
    })
  return result
}

function writeUserData(data) {
  userRef.child(data.id).set({
    username: data.name,
    email: data.email,
    profile_picture : data.picture.data.url
  });
}

userdata = undefined


  async function statusChangeCallback(response) {
  console.log('statusChangeCallback');
  console.log(response);
  // The response object is returned with a status field that lets the
  // app know the current login status of the person.
  // Full docs on the response object can be found in the documentation
  // for FB.getLoginStatus().
  if (response.status === 'connected') {
    // Logged into your app and Facebook.
    let id = response.authResponse.userID
    console.log('Welcome!  Fetching your information.... ');
    await FB.api('/me', {fields: 'name,picture,email'}, function (response) {
      console.log('Successful login for: ' + response.name);
      data = {name: response.name, picture: response.picture, email: response.email, id: id}
      userdata = data
      dealWithPagination(window.location.href)
      loadPage(data)
      isUserSaved(data.id).then(result => {
        if (result == false) {
          writeUserData(data)
        }
      });
    });
  } else {
    location.replace("/views/landingpage/index.html")
  }
};

async function getTags() {
  tagslist = fetch(`${apiurl}/getAllTags?uid=${data.id}`).then(function (result) {
    return result.json()
  })

  return tagslist
}

async function loadPage(data) {
  fname.innerText = data.name.split(' ')[0]
  sname.innerText = data.name.split(' ')[1]
  img.src = data.picture.data.url
  document.body.style.visibility = 'visible'

  tagsdata = await getTags(data)

  let tagshtml = '';

  for (tag in tagsdata) {
    console.log(tag)
    tagshtml += `<a href="#" class="navigation__list__item" data-id="${tag}" onclick="goToTagPage(this)">
              <ion-icon name="pricetag"></ion-icon>
              <span>${atob(tag)}</span>
            </a>`
  }

  document.getElementById('yourTags').innerHTML = tagshtml
}

function goToTagPage(elm) {
  tagname = elm.getAttribute('data-id')
  url = '/views/mytag/podcast.html#tagname=' + tagname
  iframe.src = url;
  const stateObj = { view: "tag" };
  history.replaceState(stateObj, "tag", `../tag/${tagname}`);
  addToHistory(url)
}

FB.getLoginStatus(async function(response) {
  statusChangeCallback(response);
  
});

function logout() {
  FB.logout(function(response) {
  location.replace("/views/landingpage/index.html")
});
}

podcastitem.addEventListener('click', function() {
  url = '/views/mypodcasts/podcast.html#uid=' + userdata.id;
  iframe.src = url;
  const stateObj = { view: "mypodcasts" };
  history.replaceState(stateObj, "mypodcasts", "../mypodcasts");
  addToHistory(url)
})

episodesitem.addEventListener('click', function() {
  url = '/views/myepisodes/podcast.html#uid=' + userdata.id;
  iframe.src = url;
  const stateObj = { view: "myepisodes" };
  history.replaceState(stateObj, "myepisodes", "../myepisodes");
  iframe.src = url
  addToHistory(url)
})

categoriesitem.addEventListener('click', function() {
  url = '/views/categories/podcast.html'
  iframe.src = url;
  const stateObj = { view: "categories" };
  history.replaceState(stateObj, "categories", "../categories");
  addToHistory(url)
})

document.getElementById('homebtn').addEventListener('click', function() {
  url = '/views/podcasts/podcast.html'
  iframe.src = url;
  const stateObj = { view: "home" };
  history.replaceState(stateObj, "home", "../home");
  addToHistory(url)
})

$('#searchinput').keypress(function(event){
	var keycode = (event.keyCode ? event.keyCode : event.which);
	if(keycode == '13'){
		query = $('#searchinput').val();
    if (searchConfig.searchpodcasts == true) {
      podcasts = "true"
    } else {
      podcasts = "false"
    }

    if (searchConfig.searchauthor == true) {
      author = "true"
    } else {
      author = "false"
    }

    if (searchConfig.searchinternationals == true) {
      internationals = "true"
    } else {
      internationals = "false"
    }

    url = "/views/search/podcast.html#query=" + query + "&title=" + podcasts + "&author=" + author + "&international=" + internationals
    iframe.src = ''
    iframe.src = url
    iframe.src = iframe.src
    const stateObj = { view: "podcast" };
    window.parent.history.replaceState(stateObj, "search", `../search`);
    addToHistory(url)
    document.getElementById('searchinput').value = ''
	}
});

document.getElementById("btnconfig").addEventListener('click', function() {
  if ($('#searchpodcasts').is(":checked")) {
    $("#searchpodcasts").prop("checked", true);
  }

  if ($('#searchepisodes').is(":checked")) {
    $("#searchauthor").prop("checked", true);
  }

  if ($('#searchinternationals').is(":checked")) {
    $("#searchinternationals").prop("checked", true);
  }
})

$('#exampleModal').on('shown.bs.modal', function () {
  if (searchConfig.searchpodcasts == true) {
    $("#searchpodcasts").prop("checked", true);
  }

  if (searchConfig.searchepisodes == true) {
    $("#searchauthor").prop("checked", true);
  }

  if (searchConfig.searchinternationals == true) {
    $("#searchinternationals").prop("checked", true);
  }
})