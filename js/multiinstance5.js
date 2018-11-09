'use strict';

var draggableClasses = ['pin'];
var currentlyDragged = null;
function playerInstance(audioPlayerselector, playPauseSelector, playPauseBtnSelector, loadingSelector, progressSelector, sliderSelector, volumeBtnSelector, volumeControlsSelector, volumeProgressSelector, currentTimeSelector, totalTimeSelector, speakerSelector) {
  var audioPlayer = document.querySelector(audioPlayerselector);
  var playPause = audioPlayer.querySelector(playPauseSelector);
  var playpauseBtn = audioPlayer.querySelector(playPauseBtnSelector);
  var loading = audioPlayer.querySelector(loadingSelector);
  var progress = audioPlayer.querySelector(progressSelector);
  var sliders = audioPlayer.querySelectorAll(sliderSelector);
  var volumeBtn = audioPlayer.querySelector(volumeBtnSelector);
  var volumeControls = audioPlayer.querySelector(volumeControlsSelector);
  var volumeProgress = volumeControls.querySelector(volumeProgressSelector);
  var player = audioPlayer.querySelector('audio');
  var totalTime = audioPlayer.querySelector(totalTimeSelector);
  var currentTime = audioPlayer.querySelector(currentTimeSelector);
  var speaker = audioPlayer.querySelector(speakerSelector);
  player.addEventListener('loadedmetadata', function () {
    totalTime.innerText = formatTime(player.duration);
  });

  if(player.readyState >= 2) {
    totalTime.innerText = formatTime(player.duration); 
  }

  playpauseBtn.addEventListener('click', function() {
    if (player.paused) {
        playPause.attributes.d.value = "M0 0h6v24H0zM12 0h6v24h-6z";
        player.play();
    } else {
        playPause.attributes.d.value = "M18 12L0 24V0";
        player.pause();
    }
  });

  player.addEventListener('timeupdate', function() {
    var current = player.currentTime;
    var percent = current / player.duration * 100;
    progress.style.width = percent + '%';
    currentTime.innerText = formatTime(current);
  });

  player.onvolumechange =  function(event) {
    volumeProgress.style.height = player.volume * 100 + '%';
    if (player.volume >= 0.5) {
      speaker.attributes.d.value = 'M14.667 0v2.747c3.853 1.146 6.666 4.72 6.666 8.946 0 4.227-2.813 7.787-6.666 8.934v2.76C20 22.173 24 17.4 24 11.693 24 5.987 20 1.213 14.667 0zM18 11.693c0-2.36-1.333-4.386-3.333-5.373v10.707c2-.947 3.333-2.987 3.333-5.334zm-18-4v8h5.333L12 22.36V1.027L5.333 7.693H0z';
    } else if (player.volume < 0.5 && player.volume > 0.05) {
      speaker.attributes.d.value = 'M0 7.667v8h5.333L12 22.333V1L5.333 7.667M17.333 11.373C17.333 9.013 16 6.987 14 6v10.707c2-.947 3.333-2.987 3.333-5.334z';
    } else if (player.volume <= 0.05) {
      speaker.attributes.d.value = 'M0 7.667v8h5.333L12 22.333V1L5.333 7.667';
    }
  }
  if (player.readyState >= player.HAVE_FUTURE_DATA) {
    playpauseBtn.style.display = 'block';
    loading.style.display = 'none';
  }
  player.addEventListener('canplay', function () {
    playpauseBtn.style.display = 'block';
    loading.style.display = 'none';
  });

  player.addEventListener('ended', function () {
    playPause.attributes.d.value = "M18 12L0 24V0";
    player.currentTime = 0;
  });

  volumeBtn.addEventListener('click', function () {
    volumeBtn.classList.toggle('open');
    volumeControls.classList.toggle('hidden');
  });

  window.addEventListener('resize', function() {
    if (window.innerHeight < 250) {
        volumeControls.style.bottom = '-54px';
        volumeControls.style.left = '54px';
    } else if (audioPlayer.offsetTop < 154) {
        volumeControls.style.bottom = '-164px';
        volumeControls.style.left = '-3px';
    } else {
        volumeControls.style.bottom = '52px';
        volumeControls.style.left = '-3px';
    }
  });

  sliders.forEach(function(slider) {
    var pin = slider.querySelector('.pin');
    slider.addEventListener('click', window[pin.dataset.method]);
  });

  directionAware(audioPlayer, volumeControls);

  return {
    audioPlayer: audioPlayer,
    playPause: playPause,
    playpauseBtn: playpauseBtn,
    loading: loading,
    progress: progress,
    sliders: sliders,
    volumBtn: volumeBtn,
    volumeControls: volumeControls,
    volumeProgress: volumeProgress,
    player: player,
    totalTime: totalTime,
    currentTime: currentTime,
    speaker: speaker
  };
}

window.addEventListener('mousedown', function (event) {

  if (!isDraggable(event.target)) return false;

  currentlyDragged = event.target;
  var handleMethod = currentlyDragged.dataset.method;

  this.addEventListener('mousemove', window[handleMethod], false);

  window.addEventListener('mouseup', function () {
    currentlyDragged = false;
    window.removeEventListener('mousemove', window[handleMethod], false);
  }, false);
});

function togglePlay(player, playPause) {
  if (player.paused) {
    playPause.attributes.d.value = "M0 0h6v24H0zM12 0h6v24h-6z";
    player.play();
  } else {
    playPause.attributes.d.value = "M18 12L0 24V0";
    player.pause();
  }
}

function directionAware(audioPlayer, volumeControls) {
  if (window.innerHeight < 250) {
    volumeControls.style.bottom = '-54px';
    volumeControls.style.left = '54px';
  } else if (audioPlayer.offsetTop < 154) {
    volumeControls.style.bottom = '-164px';
    volumeControls.style.left = '-3px';
  } else {
    volumeControls.style.bottom = '52px';
    volumeControls.style.left = '-3px';
  }
}

function updateProgress(player, currentTime, progress) {
  var current = player.currentTime;
  var percent = current / player.duration * 100;
  progress.style.width = percent + '%';

  currentTime.textContent = formatTime(current);
}

function updateVolume(volumeProgress, player, speaker) {
  volumeProgress.style.height = player.volume * 100 + '%';
  if (player.volume >= 0.5) {
    speaker.attributes.d.value = 'M14.667 0v2.747c3.853 1.146 6.666 4.72 6.666 8.946 0 4.227-2.813 7.787-6.666 8.934v2.76C20 22.173 24 17.4 24 11.693 24 5.987 20 1.213 14.667 0zM18 11.693c0-2.36-1.333-4.386-3.333-5.373v10.707c2-.947 3.333-2.987 3.333-5.334zm-18-4v8h5.333L12 22.36V1.027L5.333 7.693H0z';
  } else if (player.volume < 0.5 && player.volume > 0.05) {
    speaker.attributes.d.value = 'M0 7.667v8h5.333L12 22.333V1L5.333 7.667M17.333 11.373C17.333 9.013 16 6.987 14 6v10.707c2-.947 3.333-2.987 3.333-5.334z';
  } else if (player.volume <= 0.05) {
    speaker.attributes.d.value = 'M0 7.667v8h5.333L12 22.333V1L5.333 7.667';
  }
}

function makePlay(playpauseBtn, loading) {
  playpauseBtn.style.display = 'block';
  loading.style.display = 'none';
}

function isDraggable(el) {
  var canDrag = false;
  var classes = Array.from(el.classList);
  draggableClasses.forEach(function (draggable) {
    if (classes.indexOf(draggable) !== -1) canDrag = true;
  });
  return canDrag;
}

function inRange(event) {
  var rangeBox = getRangeBox(event);
  var rect = rangeBox.getBoundingClientRect();
  var direction = rangeBox.dataset.direction;
  if (direction == 'horizontal') {
    var min = rangeBox.offsetLeft;
    var max = min + rangeBox.offsetWidth;
    if (event.clientX < min || event.clientX > max) return false;
  } else {
    var min = rect.top;
    var max = min + rangeBox.offsetHeight;
    if (event.clientY < min || event.clientY > max) return false;
  }
  return true;
}

function getRangeBox(event) {
  var rangeBox = event.target;
  var el = currentlyDragged;
  if (event.type == 'click' && isDraggable(event.target)) {
    rangeBox = event.target.parentElement.parentElement;
  }
  if (event.type == 'mousemove') {
    rangeBox = el.parentElement.parentElement;
  }
  return rangeBox;
}

function getCoefficient(event) {
  var slider = getRangeBox(event);
  var rect = slider.getBoundingClientRect();
  var K = 0;
  if (slider.dataset.direction == 'horizontal') {

    var offsetX = event.clientX - slider.offsetLeft;
    var width = slider.clientWidth;
    K = offsetX / width;
  } else if (slider.dataset.direction == 'vertical') {

    var height = slider.clientHeight;
    var offsetY = event.clientY - rect.top;
    K = 1 - offsetY / height;
  }
  return K;
}

function rewind(event) {
    var player = event.target.parentElement.parentElement.querySelector('audio');
    if (inRange(event)&&player) {
        player.currentTime = player.duration * getCoefficient(event);
    }
}

function changeVolume(event) {
    var player = event.target.parentElement.parentElement.parentElement.querySelector('audio');
    if (inRange(event)&&player) {
        player.volume = getCoefficient(event);
    }
}

function formatTime(time) {
  var min = Math.floor(time / 60);
  var sec = Math.floor(time % 60);
  return min + ':' + (sec < 10 ? '0' + sec : sec);
}