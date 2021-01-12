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
let searchdata;

function truncate(str, n) {
	return str.length > n ? str.substr(0, n - 1) + '&hellip;' : str;
}
function generateHTML(data) {
	console.log(data);
	data = data.slice(page * 20 - 20, page * 20);
	console.log(data);

	content = document.getElementById('content');
	html = '';

	for (let [
		index,
		podcast
	] of data.reverse().entries()) {
		image = 'https://www.tibs.org.tw/images/default.jpg';
		summary = 'Não há descrição para este podcast.';
		try {
			image = podcast.artworkUrl100.replace('100x100', '600x600');
		} catch (e) {}
		try {
			summary = podcast.artistName;
		} catch (e) {}
		html =
			'<div class="card" data-src="' +
			podcast.collectionId +
			'" data-titleep="' +
			podcast.collectionName +
			'" data-image="' +
			image +
			'" onclick="listenPodcast(this)" style="width: 16rem;">' +
			'    <img src="' +
			image +
			'" class="card-img-top" alt="' +
			podcast.collectionName +
			' onError="this.src =' +
			podcast.artworkUrl100.replace('600x600', '200x200') +
			'"/>">' +
			'    <div class="card-body">' +
			'      <h5 class="card-title">' +
			podcast.collectionName +
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

	if (document.getElementById('loadingdiv')) {
		content.innerHTML = content.innerHTML.replace(loadinghtml, '');
	}
	content.innerHTML += html;
  document.getElementById("content").style.marginTop = document.getElementById("nav").offsetHeight + 'px !important';
	page += 1;
}

document.addEventListener('DOMContentLoaded', async function() {
	if (window == window.top) {
		// if not in an iframe goes back to home
		//location.replace(base_url)
	}
	query = window.location.href.split('#query=')[1].split('&')[0];
	title = window.location.href.split('title=')[1].split('&')[0];
	author = window.location.href.split('author=')[1].split('&')[0];
	international = window.location.href.split('international=')[1];
	data = await fetch(
		'https://podcasterbackend.podcaster.repl.co/search?term=' +
			query +
			'&title=' +
			title +
			'&author=' +
			author +
			'&international=' +
			international
	);
	response = await data.json();
	searchdata = response.results;
	generateHTML(searchdata);
	author_element.innerText = decodeURI(query);
	document.body.style.visibility = 'visible';
});

window.onscroll = async function(ev) {
	if (window.innerHeight + window.scrollY >= document.body.scrollHeight) {
		// you're at the bottom of the page
		if (document.getElementById('loadingdiv')) {
			return;
		}
		content = document.getElementById('content');
		content.innerHTML += loadinghtml;
		generateHTML(searchdata);
	}
};

function listenPodcast(podcast) {
	podcastid = podcast.getAttribute('data-src');
  url = '/views/episodes/podcast.html#id=' + podcastid
  const stateObj = { view: "podcast" };
  window.parent.history.replaceState(stateObj, "podcast", `../podcast/${podcastid}`);
  window.parent.addToHistory(url)
	location.replace(url);
}
