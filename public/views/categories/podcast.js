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
toggle = 'titles'

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
		cdata
	] of data.reverse().entries()) {
		category = cdata;
		console.log(category);
		image = category.picture;
		try {
			summary = category.author;
		} catch (e) {}
		html =
			'<div class="card" data-id="' +
			category.categoryid +
			'" data-titleep="' +
			category.title +
			'" data-image="' +
			image +
			'" data-name="' + category.name + '" onclick="goToCategoryPage(this)" style="width: 16rem;">' +
			'    <img src="' +
			image +
			'" class="card-img-top" alt="' +
			category.title +
			'"/>' +
			'    <div class="card-body">' +
			'      <h5 class="card-title">' +
			category.title +
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

	categoriesdata = [{
    author: "Gênero",
    picture: "https://www.ancient.eu/img/r/p/500x600/906.jpg?v=1599292802",
    categoryid: "1443",
    title: "Filosofia",
    name: "Philosophy"
  }, {
    author: "Gênero",
    picture: "https://mymodernmet.com/wp/wp-content/uploads/2018/09/encyclopedia-sci-fi.jpg",
    categoryid: "1485",
    title: "Ficção Científica",
    name: "Science Fiction"
  }, {
    author: "Gênero",
    picture: "https://pi.tedcdn.com/r/talkstar-assets.s3.amazonaws.com/production/playlists/playlist_269/true_crime.jpg",
    categoryid: "1488",
    title: "Crimes Verídicos",
    name: "True Crime"
  }, {
    author: "Gênero",
    picture: "https://store-images.s-microsoft.com/image/apps.33561.9007199266247846.b5c49955-e050-4553-b8e4-0e223ed6c5a1.a6d25753-d40a-4a54-ba54-cd26ed29e2b1",
    categoryid: "1489",
    title: "Notícias",
    name: "News"
  }, {
    author: "Gênero",
    picture: "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://coursera-course-photos.s3.amazonaws.com/65/78ce0081ad11e681d7bb31b0a632ef/starry-night.jpg?auto=format%2Ccompress&dpr=1",
    categoryid: "1301",
    title: "Arte",
    name: "Arts"
  }, {
    author: "Gênero",
    picture: "https://www.neh.gov/sites/default/files/styles/1000x1000_square/public/2018-06/openbooks.jpg?h=b69e0e0e&itok=jS0QouZt",
    categoryid: "1482",
    title: "Livros",
    name: "Books"
  }, {
    author: "Gênero",
    picture: "https://dailyillini.com/wp-content/uploads/2018/10/lang-01.png",
    categoryid: "1498",
    title: "Aprendizado de Línguas",
    name: "Language Learning"
  }];
	generateHTML(categoriesdata);
	document.body.style.visibility = 'visible';
});


window.onscroll = async function(ev) {
	if (window.innerHeight + window.scrollY >= document.body.scrollHeight) {
		// you're at the bottom of the page
		if (toggle == 'titles') {
      generateHTML(mypodcasts)
    } else {
      console.log('peguei ep')
      generateHTMLEps(mypodcastseps)
    }
	}
};

function goToCategoryPage(category) {
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
  window.parent.addToHistory(url)
  location.replace(url)
}
