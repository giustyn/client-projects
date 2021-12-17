(function () {
    let team = [{
        "id": 1,
        "name": "Zaphod Beeblebrox",
        "title": "President of the Galaxy",
        "line-of-business": {
            "heading": "Let's Talk",
            "message": "Let's talk about how my team can help you with your estate guidance and financial planning needs.",
            "legal": "<p>©2021 The PNC Financial Services Group, Inc. All rights reserved.</p><p>PNC Bank, National Association. Member FDIC</p>"
        },
        "photo": "https://source.unsplash.com/random/?manager",
        "username": "zbeeblebrox",
        "email": "zbeeblebrox@universe.beyondl",
        "address": {
            "street": "Kulas Light",
            "suite": "Apt. 556",
            "city": "Gwenborough",
            "zipcode": "92998-3874",
            "geo": {
                "lat": "-37.3159",
                "lng": "81.1496"
            }
        },
        "phone": "1-770-736-8031 x56442",
        "website": "hildegard.org",
        "company": {
            "name": "Romaguera-Crona",
            "catchPhrase": "Multi-layered client-server neural-net",
            "bs": "harness real-time e-markets"
        }
    }];

    function animate() {
        let speed = 750,
            delay = 50,
            pause = 5000,
            animation = anime.timeline({
                loop: true,
                autoplay: false,
                duration: speed,
                easing: 'easeInOutExpo',
            })
            .add({
                targets: '.container',
                duration: (speed * 2),
                easing: 'easeInOutSine',
                opacity: [0, 1],
            })
            .add({
                targets: '.heading',
                translateY: '100%',
                translateX: ['100%', '0%'],
                opacity: [0, 1],
            }, '-=' + (speed) + '')
            .add({
                targets: '.heading',
                delay: speed,
                translateY: ['100%', '0%'],
            })
            .add({
                targets: '.photo',
                translateX: ['50%', '0%'],
                opacity: [0, 1],
                scale: [0, 1],
                duration: (speed * 2),
            }, '-=' + (speed * 3.5) + '')
            /** animate card #1 */
            .add({
                targets: '.card-1, .card-1 *',
                translateX: ['50%', '0%'],
                opacity: [0, 1],
                delay: anime.stagger(delay / 2),
                endDelay: pause,
            }, '-=' + (speed) + '')
            .add({
                targets: '.card-1, .card-1 *',
                translateX: ['0%', '50%'],
                opacity: [1, 0],
                delay: anime.stagger(delay, {
                    direction: 'reverse'
                }),
                changeComplete: function () {
                    $('.card-1').addClass('hide');
                    $('.card-2').removeClass('hide');
                }
            }, '-=' + (speed) + '')
            /** animate card #2 */
            .add({
                targets: '.card-2, .card-2 *',
                translateX: ['50%', '0%'],
                opacity: [0, 1],
                delay: anime.stagger(delay),
                endDelay: pause,
            }, '-=' + (speed / 2) + '')
            .add({
                targets: '.card-2, .card-2 *',
                translateX: ['0%', '50%'],
                delay: anime.stagger(delay, {
                    direction: 'reverse'
                }),
                opacity: [1, 0],
                changeComplete: function () {
                    $('.card-1').removeClass('hide');
                    $('.card-2').addClass('hide');
                }
            }, '-=' + (speed) + '')
            /** fade-out */
            .add({
                targets: '.heading, .photo',
                translateX: ['0%', '100%'],
                opacity: [1, 0],
                delay: anime.stagger(delay, {
                    direction: 'normal'
                }),
            }, '-=' + (speed / 2) + '')
            .add({
                targets: '.container',
                easing: 'easeInOutSine',
                opacity: [1, 0],
            }, '-=' + (speed + delay) + '')

        animation.play();
    }

    function assembleTeam() {
        // var url = "https://jsonplaceholder.typicode.com/users";
        // $.get(url, {}, function (response) {
        //     response.forEach((data, i) => {
        //         i += 1;
        //         team.push(data);
        //         // console.log(team[i]);
        //     });
        // });

        // let id = 0;
        $(team).each((i => {
            console.log(team[i]);
            $('.name').html(team[i].name);
            $('.title').html(team[i].title);
            $('.heading').html(team[i]["line-of-business"].heading);
            $('.message').html(team[i]["line-of-business"].message);
            $('.legal').html(team[i]["line-of-business"].legal);
            $('.photo').css('background-image', 'url(' + team[i].photo + ')');
            animate();
        }));
    }

    assembleTeam();

})();