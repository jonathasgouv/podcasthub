page = 1;
end = false;
loadinghtml = '<div class="loader" id="loadingdiv"></div><hr>';
title_element = document.getElementById('podcasttitle');
author_element = document.getElementById('podcastauthor');
description_element = document.getElementById('podcastdescription');
image_element = document.getElementById('podcastimage');
title = '';
author = '';
description = '';
image = '';
loaded = false;

let mypodcasts;
let mypodcastseps;

function truncate(str, n) {
	return str.length > n ? str.substr(0, n - 1) + '&hellip;' : str;
}

function flatten(arr) {
  return arr.reduce(function (flat, toFlatten) {
    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
  }, []);
}

function generateHTMLEps(data) {
	data = data.slice(page * 20 - 20, page * 20);
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
		} catch (e) {}
		try {
			summary = truncate(podcast['itunes:summary'][0], 174);
		} catch (e) {}

		html =
			'<div class="card ep" data-src="' +
			podcast.enclosure[0].$.url +
			'" data-titleep="' +
			podcast.title +
			'" data-title="' +
			podcast["itunes:author"] +
			'" data-image="' +
			image +
			'" data-id="' +
			podcast.id +
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
			'  <div class="gg-play-button-o" id="hoverpbutton" onclick="listenPodcastB(this.parentElement, event) style="visibility: hidden;"></div></div>' +
			html;

		if (index - 1 % 4 == 0) {
			html += '<hr>';
		}
	}

	if (document.getElementById('loadingdiv')) {
		content.innerHTML = content.innerHTML.replace(loadinghtml, '');
	}

	content.innerHTML += html;
	page += 1;
}

function generateHTML(data) {
	content.innerHTML.replace(loadinghtml, '');
	console.log(data);
	data = data.slice(page * 20 - 20, page * 20);
	if (data.length == 0) {
		end = true;
	}
	console.log(data);

	content = document.getElementById('content');
	html = '';

	for (let [
		index,
		podcastdata
	] of data.reverse().entries()) {
		podcast = podcastdata;
		console.log(podcast);
		image = 'https://www.tibs.org.tw/images/default.jpg';
		summary = 'Não há descrição para este podcast.';
		image = podcast.picture;
		try {
			summary = podcast.author;
		} catch (e) {}
		html =
			'<div class="card" data-src="' +
			podcast.podcastid +
			'" data-titleep="' +
			podcast.title +
			'" data-image="' +
			image +
			'" onclick="listenPodcast(this)" style="width: 16rem;">' +
			'    <img src="' +
			image +
			'" class="card-img-top" alt="' +
			podcast.title +
			'"/>' +
			'    <div class="card-body">' +
			'      <h5 class="card-title">' +
			podcast.title +
			'</h5>' +
			'      <p class="card-text">' +
			summary +
			'</p>' +
			'</div>' +
			'  </div>' +
			html;

		if (index - 1 % 4 == 0) {
			html += '<hr>';
		}
	}

	content.innerHTML += html;
	page += 1;
}



function showPlaybutton(element) {
  element.querySelector("#hoverpbutton").style.visibility = 'visible';
  element.querySelector("#hoverpbutton").style.opacity = 1;
}

function hidePlaybutton(element) {
  element.querySelector("#hoverpbutton").style.visibility = 'hidden';
  element.querySelector("#hoverpbutton").style.opacity = 0;
}

function noFollow() {
  document.getElementById('endofpage').innerText = 'Parece que você não segue ninguém :(\nSiga alguns podcasts para usar essa página'
  document.getElementById('endofpage').style.left = '50%'
  document.getElementById('endofpage').style.top = '50%'
  document.getElementById('nav').style.visibility = 'hidden'
  document.body.style.visibility = 'visible'
}

document.addEventListener('DOMContentLoaded', async function() {
	if (window == window.top) {
		// if not in an iframe goes back to home
		//location.replace(base_url)
	}
	uid = window.location.href.split('#uid=')[1];
	data = await fetch('https://podcasterbackend.podcaster.repl.co/getFollowEp?uid=' + uid);
	mypodcastseps = await data.json();

  if (mypodcastseps.nofollow) {
    noFollow();
    return;
  }

  mypodcastseps = flatten(mypodcastseps)
  mypodcastseps = mypodcastseps.sort((a, b) => {
    return Date.parse(b.pubDate[0]) - Date.parse(a.pubDate[0])
  })

  if (mypodcastseps.nofollow) {
    noFollow();
    return;
  }

  document.getElementById('endofpage').style.left = '50%'
  document.getElementById('endofpage').style.top = '50%'

  content = document.getElementById('content');
  content.innerHTML = ''
	generateHTMLEps(mypodcastseps)
  document.getElementById('loadingdiv').remove()
});

window.onscroll = async function(ev) {
	if (window.innerHeight + window.scrollY >= document.body.scrollHeight) {
		// you're at the bottom of the page
    generateHTMLEps(mypodcastseps)
	}
};

function listenPodcastB(podcast, e) {
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
	podcastname.innerText = podcast.getAttribute('data-title');;
	pButton = window.parent.pButton;
	music.load();
	music.play();
	pButton.className = '';
	pButton.className = 'ion-ios-pause pause';
}

function openEpisode(episode) {
  podcastid = episode.getAttribute('data-id');
  ep = episode.getAttribute('data-src');
	url = '/views/episodespage/podcast.html#id=' + podcastid + '&ep=' + ep
  const stateObj = { view: "episode" };
  urlepisode = `podcastid=${podcastid}&epid=${ep}`
  urlepisode = btoa(urlepisode).split('/').join('-')
  window.parent.history.replaceState(stateObj, "episode", `../episode/${urlepisode}`);
  window.parent.addToHistory(url)
  location.replace(url)
}
