function getTimeParts(end_date) {
  // https://stackoverflow.com/a/13904120/743443

  // get total seconds between the times
  let delta = (end_date - new Date()) / 1000;

  if (delta > 0) {
    const days = Math.floor(delta / 86400);
    delta -= days * 86400;

    const hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;

    const minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;

    const seconds = Math.floor(delta);

    return {d: days, h: hours, m: minutes, s: seconds};
  } else {
    return false;
  }
}

const endDate = new Date(new Date().getFullYear() + 1, 0, 1)
  daysCont = document.querySelector('.days .val'),
  hoursCont = document.querySelector('.hours .val'),
  minutesCont = document.querySelector('.minutes .val'),
  secondsCont = document.querySelector('.seconds .val');

document.querySelector('.end_date').innerText = endDate.toLocaleDateString(undefined, {dateStyle: 'full'});

const intervalId = setInterval(() => {
  let timeParts = getTimeParts(endDate);
  
  if(timeParts) {
    daysCont.innerText = timeParts.d;
    hoursCont.innerText = timeParts.h;
    minutesCont.innerText = timeParts.m;
    secondsCont.innerText = timeParts.s;
  } else {
    clearInterval(intervalId);
  }
}, 1000);
