//
// Roundel animation
//
/*
  anime({
    targets: '.roundel .circle-dark-dashed',
    rotateZ: 360,
    duration: 10000,
    easing: 'linear',
    loop: true
  });
*/
anime.timeline({
    loop: false
  })
  .add({
    targets: '.roundel .circle-white',
    scale: [0, 3],
    opacity: [1, 0],
    easing: 'easeOutCubic',
    rotateZ: 360,
    duration: 1200
  }, '+=2000')
  .add({
    targets: '.roundel .circle-container',
    scale: [0, 1],
    duration: 900,
    easing: 'easeOutCubic'
  }, '-=1000')
  .add({
    targets: '.roundel .circle-dark',
    scale: [0, 1],
    duration: 900,
    easing: 'easeOutCubic'
  }, '-=600')
  .add({
    targets: '.roundel .line-1',
    scale: [0, 1],
    duration: 1200,
    translateY: ['50%', '0%'],
    easing: 'easeOutCubic'
  }, '-=550')
  .add({
    targets: '.roundel .line-2',
    scale: [0, 1],
    rotateZ: 0,
    translateY: ['50%', '0%'],
    duration: 1200,
    easing: 'easeOutCubic'
  }, '-=1000');

//
// Forecast animation
//
anime.timeline({
    loop: false
  })
  .add({
    targets: '.video-container',
    opacity: [0, 1],
    duration: 1200,
    easing: 'easeInOutCubic'
  }, '+=500')
  .add({
    targets: '#weather',
    opacity: [0, 1],
    duration: 1200,
    easing: 'easeInOutCubic'
  }, '+=500')
  .add({
    targets: '.weather-img',
    opacity: [0, 1],
    scale: [1.1, 1],
    duration: 2000,
  }, '-=1500')
  .add({
    targets: '.day',
    opacity: [0, 1],
    scale: [.5, 1],
    translateY: ['50%', '0%'],
    delay: anime.stagger(100),
    duration: 1200,
    easing: 'spring(1, 80, 10, 0)'
  }, '-=1000');

//
// Footer animation
//
anime.timeline({
    loop: false
  })
  .add({
    targets: '.footer-container',
    opacity: [0, 1],
    translateY: ['25%', '0%'],
    duration: 600,
    easing: 'spring(1, 80, 20, 0)'
  }, '+=1000')
  .add({
    targets: '.brand-logo',
    opacity: [0, 1],
    translateX: ['-100%', '0%'],
    duration: 1200,
    easing: 'spring(1, 80, 15, 0)'
  }, '-=1000')
  .add({
    targets: '.location',
    opacity: [0, 1],
    translateX: ['100%', '0%'],
    duration: 1200,
    easing: 'spring(1, 80, 15, 0)'
  }, '-=1200')
  .add({
    targets: '.category',
    opacity: [0, 1],
    translateX: ['100%', '0%'],
    duration: 1200,
    easing: 'spring(1, 80, 15, 0)'
  }, '-=1000');