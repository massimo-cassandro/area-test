(() => {
  'use strict';

  const download_img_btn = document.getElementById('download-img'),
    video = document.getElementById('video'),
    canvas = document.getElementById('canvas');


  // Get access to the camera!
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {

    navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        width: 480,
        height: 360,
        facingMode: 'user'
      }
    })
      .then(function (stream) {
        // video.src = window.URL.createObjectURL(stream);
        video.srcObject = stream;
        video.play();
      });

    // Elements for taking the snapshot
    var context = canvas.getContext('2d');

    // Trigger photo take
    document.getElementById('snap').addEventListener('click', function () {

      // not really necessary since we know video size
      let video_aspect_ratio = video.videoHeight / video.videoWidth,
        output_width = canvas.offsetWidth,
        output_heigth = Math.round(output_width * video_aspect_ratio);

      // prevent image distortion
      canvas.width = output_width;
      canvas.height = output_heigth;

      context.drawImage(video, 0, 0, output_width, output_heigth);

      //enable download link
      var image = new Image(480,400);
      image.src = canvas.toDataURL('image/jpeg');
      download_img_btn.href = image.src;
      download_img_btn.classList.remove('disabled');
      download_img_btn.removeAttribute('onclick');

    });

    // Filters

    document.getElementById('sepia').addEventListener('click', function () {
      video.classList.add('sepia');
      video.classList.remove('bw');
      canvas.classList.add('sepia');
      canvas.classList.remove('bw');
    });
    document.getElementById('bw').addEventListener('click', function () {
      video.classList.add('bw');
      video.classList.remove('sepia');
      canvas.classList.add('bw');
      canvas.classList.remove('sepia');
    });
    document.getElementById('reset').addEventListener('click', function () {
      video.classList.remove('sepia', 'bw');
      canvas.classList.remove('sepia', 'bw');
    });



    /*
    // Legacy code below!
    else if(navigator.getUserMedia) { // Standard
      navigator.getUserMedia(mediaConfig, function(stream) {
        video.src = stream;
        video.play();
      }, errBack);
    } else if(navigator.webkitGetUserMedia) { // WebKit-prefixed
      navigator.webkitGetUserMedia(mediaConfig, function(stream){
        video.src = window.webkitURL.createObjectURL(stream);
        video.play();
      }, errBack);
    } else if(navigator.mozGetUserMedia) { // Mozilla-prefixed
      navigator.mozGetUserMedia(mediaConfig, function(stream){
        video.src = window.URL.createObjectURL(stream);
        video.play();
      }, errBack);
    }
    */

  } else {

    alert('Your browser doen\'t support `getUserMedia`');

  }


})();
