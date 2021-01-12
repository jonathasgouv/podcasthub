page = 1;
end = false;
loadinghtml = '<div class="loader" id="loadingdiv"></div><hr>';
title_element = document.getElementById('podcasttitle');
author_element = document.getElementById('podcastauthor');
description_element = document.getElementById('podcastdescription');
image_element = document.getElementById('podcastimage');
originalcross = image_element.crossOrigin
categories_element = document.getElementById('btncategories')
title = '';
author = '';
description = '';
image = '';
imagetitle = ''
let genres;
let episodesdata;
let uid;
let tags;

apiurl = 'https://PodcasterBackEnd.podcaster.repl.co'

//const colorThief = new ColorThief();

function truncate(str, n) {
	return str.length > n ? str.substr(0, n - 1) + '&hellip;' : str;
}

var shuffle = function (array) {

	var currentIndex = array.length;
	var temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;

};

function generateColor() {

	// The available hex options
	var hex = ['a', 'b', 'c', 'd', 'e', 'f', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
	var color = '#';

	// Create a six-digit hex color
	for (var i = 0; i < 6; i++) {

		// Shuffle the hex values
		shuffle(hex);

		// Append first hex value to the string
		color += hex[0];

	}

	// Return the color string
	return color;

};

async function generateCategories(data) {
  let html;

  if (data.isFollowed == true) {
    html = '<button type="button" id="followbtn" class="btn btn-primary" onclick="followPodcast(this)">Seguindo</button>'
  } else {
    html = '<button type="button" id="followbtn" class="btn btn-primary" onclick="followPodcast(this)">Seguir</button>'
  }
  
  for (genre of genres) {
    name = genre.key
    id = genre.id
    console.log(name)

    if (name != "undefined") {
      html += '<button data-id="' + id + '" data-name="' + name + '" type="button"  class="btn btn-primary" onclick="categoriesPage(this)">' + name + '</button>'
    }
  }

  tagsdata = await getTags()

  if (!tagsdata.notag) {
    for (tag in tagsdata) {
      html += '<button data-id="' + tagsdata[tag] + '" type="button"  class="btn btn-primary" onclick="goToTagPage(this)">' + atob(tagsdata[tag]) + '</button>'
    }
  }

  html += '<button data-id="' + window.location.href.split('#id=')[1] + '" type="button"  class="btn btn-primary" id="plusbtn" onclick="tagPage(this)">+</button>'

  return html
}

function tagPage(elm) {
  categories_element.innerHTML += `
  <div id="addtag">
  <input class="form-control" type="text" id="taginput" placeholder="Digite sua tag personalizada :3">
  <button type="button"  class="btn btn-primary" id="cancelbtn" onclick="tagSave('Cancel')">Cancelar</button>
  <button type="button"  class="btn btn-primary" id="savebtn" onclick="tagSave('Save')">Salvar</button>
  </div>
  `
  document.getElementById("content").style.marginTop = document.getElementById("nav").offsetHeight + 'px';
}

async function getTags() {
  tagslist = fetch(`${apiurl}/getTags?podcastid=${window.location.href.split('#id=')[1]}&uid=${uid}`).then(function (result) {
    return result.json()
  })

  console.log(tagslist)
  return tagslist
}

function tagSave(choice) {
  if (choice == "Save") {
    tagname = document.getElementById('taginput').value
    userid = window.location.href.split('#id=')[1]
    document.getElementById('addtag').remove()
    document.getElementById("content").style.marginTop = document.getElementById("nav").offsetHeight + 'px'; 
    document.getElementById('plusbtn').remove()
    categories_element.innerHTML += '<button data-id="' + tagname + '"  type="button"  class="btn btn-primary" onclick="goToTagPage(this)">' + tagname + '</button>' + '<button data-id="' + window.location.href.split('#id=')[1] + '" type="button"  class="btn btn-primary" id="plusbtn" onclick="tagPage(this)">+</button>'

    id = window.location.href.split('#id=')[1];
    data = fetch(`${apiurl}/tag?podcastid=${id}&uid=${uid}&tagname=${tagname}&title=${title}&author=${author}&picture=${imagetitle}&url=${url}`);
  } else {
    document.getElementById('addtag').remove()
    document.getElementById("content").style.marginTop = document.getElementById("nav").offsetHeight + 'px'; 
  }
}

function goToTagPage(elm) {
  tagname = elm.getAttribute('data-id')
  url = '/views/mytag/podcast.html#tagname=' + tagname
  iframe.src = url;
  const stateObj = { view: "tag" };
  history.replaceState(stateObj, "tag", `../tag/${tagname}`);
  addToHistory(url)
}


function categoriesPage(category) {
	categoryid = category.getAttribute('data-id');
  name = category.getAttribute('data-name');
	url = '/views/searchgenre/podcast.html#id=' + categoryid + '&title=' + name
  urlencoded = `id=${categoryid}&name=${name}`
  urlencoded = btoa(urlencoded).split('/').join('-')
  const stateObj = { view: `${categoryid}` };
  window.parent.history.replaceState(stateObj, `${categoryid}`, `../categorie/${urlencoded}`);
  window.parent.addToHistory(url)
  location.replace(url)
}

async function generateTitle(data, gdata) {
	title = data.title[0];
	title_element.innerText = title;
	author = data['itunes:author'][0];
	author_element.innerText = author;
	description = data.description[0];
	description_element.innerHTML = description;
  categories_element.innerHTML = await generateCategories(gdata);
   
	try {
		imagetitle = data.image[0].url[0];
	} catch (e) {
		imagetitle = data['itunes:image'][0].$.href;
	}
	if (title == 'NerdCast') {
		imagetitle = 'https://i.scdn.co/image/c50cb0ac116073317588f20727af9abfce03af60';
	}

	image_element.src = imagetitle;
}

function generateHTML(data) {
	console.log(data);
	data = data.slice(page * 20 - 20, page * 20);

  if (data.length == 0) {
    document.getElementById('endofpage').style.visibility = 'visible'
  }
	content = document.getElementById('content');
	html = '';

	for (let [
		index,
		podcast
	] of data.reverse().entries()) {
		image = 'https://www.tibs.org.tw/images/default.jpg';
		summary = 'Não há descrição para este podcast.';
		try {
			image = podcast['itunes:image'][0].$.href;
		} catch (e) {
      try {
        image = podcast['itunes:image'][0];
      } catch {}
    }
		try {
			summary = truncate(podcast['itunes:summary'][0], 174);
		} catch (e) {}
		html =
			'<div class="card" data-src="' +
			podcast.enclosure[0].$.url +
			'" data-titleep="' +
			podcast.title +
			'" data-image="' +
			image +
			'" onclick="openEpisode(this)" onmouseover="showPlaybutton(this)" onmouseout="hidePlaybutton(this)" style="width: 16rem;">' +
			'    <img src="' +
			image +
			'" class="card-img-top" alt="' +
			podcast.title +
			'">' +
			'    <div class="card-body">' +
			'      <h5 class="card-title">' +
			podcast.title +
			'</h5>' +
			'      <p class="card-text">' +
			summary.trim() +
			'</p>' +
			'</div>' +
			'  <div class="gg-play-button-o" id="hoverpbutton" onclick="listenPodcast(this.parentElement, event)"></div></div>' +
			html;

		if (index - 1 % 4 == 0) {
			html += '<hr>';
		}
	}

	if (document.getElementById('loadingdiv')) {
		content.innerHTML = content.innerHTML.replace(loadinghtml, '');
	}

	content.innerHTML += html;
  document.getElementById("content").style.marginTop = document.getElementById("nav").offsetHeight + 'px';
	page += 1;
}

document.addEventListener('DOMContentLoaded', async function() {
	if (window == window.top) {
		// if not in an iframe goes back to home
		//location.replace(base_url)
	}
	id = window.location.href.split('#id=')[1];
  uid = window.parent.userdata.id
	url = `${apiurl}/podcasts?byid=true&id=${id}&uid=${uid}`
  console.log(url)
	data = await fetch(url);
	data = await data.json();
  response = data.results
	genres = data.genreslist;
  url = data.url
	generateTitle(response.rss.channel[0], data);

  /* image_element2 = image_element.cloneNode(true);
  try {
    if (image_element2.complete) {
      image_element2.crossOrigin = "Anonymous";
      color = colorThief.getColor(image_element2);
      document.getElementById('nav').style.background = `linear-gradient( 180deg, rgb(${color[0]} ${color[1]} ${color[2]}) 1%, rgb(35 35 35) 50%, rgb(24 24 24 / 28%) 73%, rgb(74 74 74 / 0%) 100% )`
      console.log(`linear-gradient( 180deg, rgb(${color[0]} ${color[1]} ${color[2]}) 1%, rgb(35 35 35) 50%, rgb(24 24 24 / 28%) 73%, rgb(74 74 74 / 0%) 100% )`)
    } else {
      image_element2.addEventListener('load', function() {
        image_element2.crossOrigin = "Anonymous";
        color = colorThief.getColor(image_element2);
        document.getElementById('nav').style.background = `linear-gradient( 180deg, rgb(${color[0]} ${color[1]} ${color[2]}) 1%, rgb(35 35 35) 50%, rgb(24 24 24 / 28%) 73%, rgb(74 74 74 / 0%) 100% )`
        console.log(`linear-gradient( 180deg, rgb(${color[0]} ${color[1]} ${color[2]}) 1%, rgb(35 35 35) 50%, rgb(24 24 24 / 28%) 73%, rgb(74 74 74 / 0%) 100% )`)
      });
    }
  } catch {
  } */

	episodesdata = response.rss.channel[0].item;
  content.innerHTML = '';
	generateHTML(episodesdata);
});

window.onscroll = async function(ev) {
	if (window.innerHeight + window.scrollY >= document.body.scrollHeight) {
		// you're at the bottom of the page
		if (document.getElementById('loadingdiv')) {
			return;
		}
		content = document.getElementById('content');
		content.innerHTML += loadinghtml;
		generateHTML(episodesdata);
	}

	var header = document.getElementById('nav');
  var btncategories = document.getElementById('btncategories')
	header.classList.toggle('sticky', window.scrollY > 0);
  btncategories.classList.toggle('sticky', window.scrollY > 0);
};

function showPlaybutton(element) {
  element.querySelector("#hoverpbutton").style.visibility = 'visible';
  element.querySelector("#hoverpbutton").style.opacity = 1;
}

function hidePlaybutton(element) {
  element.querySelector("#hoverpbutton").style.visibility = 'hidden';
  element.querySelector("#hoverpbutton").style.opacity = 0;
}

function listenPodcast(podcast, e) {
  e = e || window.event;
  e.stopPropagation();
	music = window.parent.music;
	linkmusica = window.parent.linkmusica;
	podcastname = window.parent.podcastname;
	podcastep = window.parent.podcastep;
	if (linkmusica.src == podcast.getAttribute('data-src')) {
		return;
	}
	linkmusica.src = podcast.getAttribute('data-src');
	podcastep.innerText = podcast.getAttribute('data-titleep');
	podcastname.innerText = title;
	pButton = window.parent.pButton;
	music.load();
	music.play();
	pButton.className = '';
	pButton.className = 'ion-ios-pause pause';
}

function openEpisode(episode) {
  podcastid = window.location.href.split('#id=')[1];
  ep = episode.getAttribute('data-src');
	url = '/views/episodespage/podcast.html#id=' + podcastid + '&ep=' + ep
  const stateObj = { view: "episode" };
  urlepisode = `podcastid=${podcastid}&epid=${ep}`
  urlepisode = btoa(urlepisode).split('/').join('-')
  window.parent.history.replaceState(stateObj, "episode", `../episode/${urlepisode}`);
  window.parent.addToHistory(url)
  location.replace(url)
}

function followPodcast(elm) {
  if (elm.innerText === 'Seguir') {
    elm.innerText = 'Seguindo';
    id = window.location.href.split('#id=')[1];
    data = fetch(`${apiurl}/follow?podcastid=${id}&uid=${uid}&title=${title}&author=${author}&picture=${imagetitle}&url=${url}`);
  } else if (elm.innerText === 'Seguindo') {
    elm.innerText = 'Seguir'
  }
}