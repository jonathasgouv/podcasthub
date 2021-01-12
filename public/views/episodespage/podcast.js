page = 1;
end = false;
loadinghtml = '<div class="loader" id="loadingdiv"></div><hr>';
title_element = document.getElementById('podcasttitle');
author_element = document.getElementById('podcastauthor');
description_element = document.getElementById('dtext');
image_element = document.getElementById('podcastimage');
categories_element = document.getElementById('btncategories');
date_element = document.getElementById('dateep');
duration_element = document.getElementById('lenghtep')
title = '';
author = '';
description = '';
image = '';
let genres;
let episodesdata;

moment.locale('pt-br');

function openInNewTab() {
  var win = window.open(window.location.href.split('&ep=')[1], '_blank');
  win.focus();
}

function fallbackCopyTextToClipboard() {
  document.getElementById('ddmenu').style.display = 'none';
  text = window.location.href
  var textArea = document.createElement("textarea");
  textArea.value = window.parent.location.href;

  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('Fallback: Copying text command was ' + msg);
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
  }

  document.body.removeChild(textArea);
}

async function sendComment() {
  alert('Comentário enviado!')
  comment = document.getElementById('exampleFormControlTextarea1').value
  commentdata = window.parent.userdata
  commentdata.comment = comment
  commentdata.podcastid = id
  commentdata.epid = ep
  commentdata.timestamp = Date.now()
  url = "https://podcasterbackend.podcaster.repl.co/comments"

  options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json'},
    body: await JSON.stringify(commentdata)
  }

  fetch(url, options)

  document.getElementById('exampleFormControlTextarea1').value = ''
};

function truncate(str, n) {
	return str.length > n ? str.substr(0, n - 1) + '&hellip;' : str;
}

function truncate(str, n) {
	return str.length > n ? str.substr(0, n - 1) + '&hellip;' : str;
}

var shuffle = function(array) {
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

function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
  return time;
}

function generateColor() {
	// The available hex options
	var hex = [
		'a',
		'b',
		'c',
		'd',
		'e',
		'f',
		'0',
		'1',
		'2',
		'3',
		'4',
		'5',
		'6',
		'7',
		'8',
		'9'
	];
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
}

function generateCategories(genres) {
	html = '';

	for (genre of genres) {
		name = genre.key;
		id = genre.id;
		console.log(name);

		if (name != 'undefined') {
			html +=
				'<button data-id="' +
				id +
				'" type="button" style="background-color: ' +
				generateColor() +
				'; margin-left: 5px; border: 2px solid white;" class="btn btn-primary">' +
				name +
				'</button>';
		}
	}

	return html;
}

function generateTitle(data) {
	episodedata = data.episode;
	podcastdata = data.podcast;
  commentepdata = data.comments;
	title = episodedata.title[0];
	title_element.innerText = title;
	author = podcastdata.title[0];
	author_element.innerText = author;
	description = episodedata.description[0];
	description_element.innerHTML = description.replace(/(?:\r\n|\r|\n)/g, '<br>');
  date = moment(episodedata.pubDate[0]).format('ll') + '.'
  date_element.innerText = date
  duration = episodedata["itunes:duration"]
  duration_element.innerText = duration


  image = 'https://www.tibs.org.tw/images/default.jpg';
  
	try {
		image = episodedata.image[0].url[0];
	} catch (e) {
    try {
		  image = episodedata['itunes:image'][0].$.href;
    } catch(e) {}
	}
	if (title == 'NerdCast') {
		image = 'https://i.scdn.co/image/c50cb0ac116073317588f20727af9abfce03af60';
	}

	image_element.src = image;
	document.body.style.visibility = 'visible';

  html = ''

  for (comment in commentepdata) {
    console.log(comment)
    html += '<div class="row">'+
            '    <div class="col-8">'+
            '        <div class="card card-white post">'+
            '            <div class="post-heading">'+
            '                <div class="float-left image">'+
            '                    <img src="'+ commentepdata[comment].picture.data.url + '" class="img-circle avatar" alt="user profile image">'+
            '                </div>'+
            '                <div class="float-left meta">'+
            '                    <div class="title h5">'+
            '                        <a href="#"><b>' + commentepdata[comment].name + '</b></a>'+
            '                        comentou.'+
            '                    </div>'+
            '                    <h6 class="text-muted time">' + moment(moment.unix(commentepdata[comment].timestamp/1000)).fromNow() + '</h6>'+
            '                </div>'+
            '            </div> '+
            '            <div class="post-description"> '+
            '                <p>' + commentepdata[comment].comment + '</p>'+
            ''+
            '            </div>'+
            '        </div>'+
            '    </div>'+
            '  </div>';
  }

  document.getElementById('commnts').innerHTML += html
}

function generateHTML(data) {
	console.log(data);
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
			'<div class="card" data-src="' +
			podcast.enclosure[0].$.url +
			'" data-titleep="' +
			podcast.title +
			'" data-image="' +
			image +
			'" style="width: 16rem;">' +
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
			summary +
			'</p>' +
			'</div>' +
			'  <div class="gg-play-button-o" id="hoverpbutton" onclick="listenPodcast(this.parentElement)"></div></div>' +
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
	id = window.location.href.split('#id=')[1].split('&')[0];
	ep = window.location.href.split('&ep=')[1];
	console.log(id);
	data = await fetch('https://podcasterbackend.podcaster.repl.co/episode?id=' + id + '&ep=' + ep);
	episode = await data.json();
	generateTitle(episode);
});

window.onscroll = async function(ev) {
	return;
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
	var btncategories = document.getElementById('btncategories');
	header.classList.toggle('sticky', window.scrollY > 0);
	btncategories.classList.toggle('sticky', window.scrollY > 0);
};

function listenPodcast(podcast) {
	music = window.parent.music;
	linkmusica = window.parent.linkmusica;
	podcastname = window.parent.podcastname;
	podcastep = window.parent.podcastep;
	if (linkmusica.src == window.location.href.split('&ep=')[1]) {
		return;
	}
	linkmusica.src = window.location.href.split('&ep=')[1];
	podcastep.innerText = title;
	podcastname.innerText = author;
	pButton = window.parent.pButton;
	music.load();
	music.play();
	pButton.className = '';
	pButton.className = 'ion-ios-pause pause';
}
