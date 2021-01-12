// Sliders

var slider = document.getElementById('song-progress');
var music = document.getElementById('music'); // id for audio element
var duration; // Duration of audio clip
var pButton = document.querySelector("body > section.current-track > div.current-track__actions > a.ion-ios-play.play") // play button
var playhead = document.getElementById('playhead'); // playhead
var timeline = document.getElementById('timeline'); // timeline
var time = document.getElementById('tempo');
var finaltime = document.getElementById('tempofinal');
var volumeicon = document.getElementById('volume');
var linkmusica = document.getElementById('linkmusica');
var velocity = document.getElementById('velocity');

music.addEventListener(
		'canplaythrough',
		function() {
			duration = music.duration;
      finaltime.innerText = fancyTimeFormat(music.duration)
      music.volume = slidervolume.noUiSlider.get() / 100
		},
		false
	);

music.addEventListener('timeupdate', timeUpdate, true);




function fancyTimeFormat(duration) {   
    // Hours, minutes and seconds
    var hrs = ~~(duration / 3600);
    var mins = ~~((duration % 3600) / 60);
    var secs = ~~duration % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    var ret = "";

    if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }

    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
};

function timeUpdate() {
		var playPercent = 100 * (music.currentTime / duration);
    time.innerText = fancyTimeFormat(music.currentTime)
		slider.noUiSlider.set(playPercent);

		if (music.currentTime == duration) {
			pButton.className = '';
			pButton.className = 'ion-ios-play play';
		}
	}

function play() {
		// start music
		if (music.paused) {
			music.play();
			// remove play, add pause
			pButton.className = '';
			pButton.className = 'ion-ios-pause pause';
		} else {
			// pause music
			music.pause();
			// remove pause, add play
			pButton.className = '';
			pButton.className = 'ion-ios-play play';
		}
	}

pButton.addEventListener('click', play);


noUiSlider.create(slider, {
	start: [ 0 ],
	range: {
		'min': [   0 ],
		'max': [ 100 ]
	}
});

slider.noUiSlider.on('slide.one', function () {
  music.currentTime = (slider.noUiSlider.get() / 100) * duration

	if (music.currentTime == duration) {
	  pButton.className = '';
	  pButton.className = 'ion-ios-play play';
	}
});

var slidervolume = document.getElementById('song-volume');

noUiSlider.create(slidervolume, {
	start: [ 90 ],
	range: {
		'min': [   0 ],
		'max': [ 100 ]
	}
});

slidervolume.noUiSlider.on('slide.one', function () {
  music.volume = slidervolume.noUiSlider.get() / 100
  if (music.volume > 0.6) {
    volumeicon.className = ''
    volumeicon.className = 'ion-volume-high'
    return
  }
  if (music.volume <= 0.6 && music.volume > 0.3) {
    volumeicon.className = ''
    volumeicon.className = 'ion-volume-medium'
    return
  }
  if (music.volume <= 0.3 && music.volume > 0) {
    volumeicon.className = ''
    volumeicon.className = 'ion-volume-low'
    return
  }
  if (music.volume == 0) {
    volumeicon.className = ''
    volumeicon.className = 'ion-volume-mute'
    return
  }
});

volumeicon.addEventListener('click', function() {
  if (volumeicon.className != 'ion-volume-mute') {
    music.volume = 0
    slidervolume.noUiSlider.set(0)

    volumeicon.className = ''
    volumeicon.className = 'ion-volume-mute'
  } else {
    music.volume = 0.5
    slidervolume.noUiSlider.set(50)

    volumeicon.className = ''
    volumeicon.className = 'ion-volume-medium'
  }
});

velocity.addEventListener('click', function() {
  if (velocity.innerText == '100%') {
    velocity.innerText = '150%'
    music.playbackRate = 1.5
  } else if (velocity.innerText == '150%') {
    velocity.innerText = '200%'
    music.playbackRate = 2
  } else if (velocity.innerText == '200%') {
    velocity.innerText = '300%'
    music.playbackRate = 3
  } else if (velocity.innerText == '300%') {
    velocity.innerText = '50%'
    music.playbackRate = 0.5
  } else if (velocity.innerText == '50%') {
    velocity.innerText = '100%'
    music.playbackRate = 1
  }
})

// Tooltips

$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})

// Viewport Heights

$(window).on("resize load", function(){
  
  var totalHeight = $(window).height();

  var headerHeight = $('.header').outerHeight();
  var footerHeight = $('.current-track').outerHeight();
  var playlistHeight = $('.playlist').outerHeight();
  var nowPlaying = $('.playing').outerHeight();

  var navHeight = totalHeight - (headerHeight + footerHeight + playlistHeight + nowPlaying);
  var artistHeight = totalHeight - (headerHeight + footerHeight);

  console.log(totalHeight);
  
  $(".navigation").css("height" , navHeight);
  $(".artist").css("height" , artistHeight);
  $(".social").css("height" , artistHeight);
  
});
    


  

// Collapse Toggles

$(".navigation__list__header").on( "click" , function() {
  
  $(this).toggleClass( "active" );
  
});


// Media Queries

$(window).on("resize load", function(){
	if ($(window).width() <= 768){	
		
    $(".collapse").removeClass("in");
    
    $(".navigation").css("height" , "auto");
    
    $(".artist").css("height" , "auto");
    
	}	
});

$(window).on("resize load", function(){
	if ($(window).width() > 768){	
		
    $(".collapse").addClass("in");
    
	}	
});