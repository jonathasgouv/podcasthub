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
let toppodcastsdata;

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
			image = podcast.artworkUrl100.replace('200x200', '600x600');
		} catch (e) {}
		try {
			summary = podcast.artistName;
		} catch (e) {}
		html =
			'<div class="card" data-src="' +
			podcast.id +
			'" data-titleep="' +
			podcast.name +
			'" data-image="' +
			image +
			'" onclick="listenPodcast(this)" style="width: 16rem;">' +
			'    <img src="' +
			image +
			'" class="card-img-top" alt="' +
			podcast.name +
			' onError="this.src =' +
			podcast.artworkUrl100.replace('600x600', '200x200') +
			'"/>">' +
			'    <div class="card-body">' +
			'      <h5 class="card-title">' +
			podcast.name +
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
	page += 1;
}

document.addEventListener('DOMContentLoaded', async function() {
	if (window == window.top) {
		// if not in an iframe goes back to home
		//location.replace(base_url)
	}
	data = await fetch('https://podcasterbackend.podcaster.repl.co/toppodcasts');
	response = await data.json();
	toppodcastsdata = response.feed.results;
	generateHTML(toppodcastsdata);
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
		generateHTML(toppodcastsdata);
	}
};

function listenPodcast(podcast) {
	podcastid = podcast.getAttribute('data-src');
  url = '/views/episodes/podcast.html#id=' + podcastid
  const stateObj = { view: "podcast" };
  window.parent.history.replaceState(stateObj, "podcast", `podcast/${podcastid}`);
  window.parent.addToHistory(url)
	location.replace(url);
}
