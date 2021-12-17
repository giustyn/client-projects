(function () {

    // Default carousel settings
    $('#slides').slideshow({
        randomize: true, // Randomize the play order of the slides.
        slideDuration: 10000, // Duration of each induvidual slide.
        fadeDuration: 3000, // Duration of the fading transition. Should be shorter than slideDuration.
        animate: true, // Turn css animations on or off.
        pauseOnTabBlur: false, // Pause the slideshow when the tab is out of focus. This prevents glitches with setTimeout().
        enableLog: false // Enable log messages to the console. Useful for debugging.
    });

    // Custom preloader settings
    let buffer = 30000;
    let speed = parseInt($(':root').css('--transition-speed'));
    let preLoad = setTimeout(() => {
        $('.container').addClass('active');
        $('.slide').addClass('inactive').delay(speed).queue(function () {
            $('#slideshow, #slides').remove().dequeue();
        });
    }, buffer);
    $("#slideshow").delay(0).animate({
        "opacity": "1"
    }, speed);

    // Content streams
    let streamId = [{
            id: 0,
            name: "Tranquil Impressions",
            url: "https://www.loupeart.com/stream/channels/tranquil-impressions?present=true&showQrCode=false"
        },
        {
            id: 1,
            name: "Hypnotic Visuals",
            url: "https://www.loupeart.com/stream/channels/stream-motion-art?present=true&showQrCode=false"
        },
        {
            id: 2,
            name: "Urban Landscapes",
            url: "https://www.loupeart.com/stream/channels/modern/urban-landscapes?present=true&showQrCode=false"
        }
    ];
    $('#artwork').attr('src', streamId[0].url); // Assign content to iFrame

})();