(function () {
    let team = [{
                "id": 1,
                "name": "Leanne Graham",
                "title": "Assistant Branch Manager",
                "username": "Bret",
                "email": "Sincere@april.biz",
                "legal": "<p>©2021 The PNC Financial Services Group, Inc. All rights reserved.</p><p>PNC Bank, National Association. Member FDIC</p>",
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
            },
            {
                "id": 2,
                "name": "Ervin Howell",
                "title": "Branch Manager",
                "lineofbsiness": 1,
                "username": "Antonette",
                "email": "Shanna@melissa.tv",
                "address": {
                    "street": "Victor Plains",
                    "suite": "Suite 879",
                    "city": "Wisokyburgh",
                    "zipcode": "90566-7771",
                    "geo": {
                        "lat": "-43.9509",
                        "lng": "-34.4618"
                    }
                },
                "phone": "010-692-6593 x09125",
                "website": "anastasia.net",
                "company": {
                    "name": "Deckow-Crist",
                    "catchPhrase": "Proactive didactic contingency",
                    "bs": "synergize scalable supply-chains"
                }
            },
            {
                "id": 3,
                "name": "Clementine Bauch",
                "title": "Financial Supervisor",
                "username": "Samantha",
                "email": "Nathan@yesenia.net",
                "address": {
                    "street": "Douglas Extension",
                    "suite": "Suite 847",
                    "city": "McKenziehaven",
                    "zipcode": "59590-4157",
                    "geo": {
                        "lat": "-68.6102",
                        "lng": "-47.0653"
                    }
                },
                "phone": "1-463-123-4447",
                "website": "ramiro.info",
                "company": {
                    "name": "Romaguera-Jacobson",
                    "catchPhrase": "Face to face bifurcated interface",
                    "bs": "e-enable strategic applications"
                }
            }
        ],
        lineOfBusiness = [{
                id: 1,
                title: "Branch Manager",
                heading: "Let's Talk",
                message: "Let's talk about how my team can help you with your estate guidance and financial planning needs."
            },
            {
                id: 2,
                title: "Business Banker",
                heading: "Let's Talk",
                message: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Autem debitis deserunt ut id."
            },
            {
                id: 3,
                title: "Mortgage Loan Officer",
                heading: "Let's Talk",
                message: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aut minus maxime?"
            },
            {
                id: 4,
                title: "Agricultural Banker",
                heading: "Let's Talk",
                message: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores, voluptatum?"
            },
            {
                id: 5,
                title: "Merchant Services",
                heading: "Let's Talk",
                message: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Beatae soluta voluptate nulla ullam."
            }
        ];

    function animate() {
        let speed = 750,
            delay = 100,
            int = 5000;

        anime.timeline({
                loop: true,
                duration: speed,
                // easing: 'easeInOutElastic(1, 1.8)',
                easing: 'easeInOutExpo',
                // easing: 'easeOutSi',
            })
            .add({
                targets: '.container',
                duration: (speed * 2),
                easing: 'easeInOutSine',
                // opacity: [0, 1],
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
                translateX: ['100%', '0%'],
                opacity: [0, 1],
                scale: [0, 1],
                duration: (speed * 2),
            }, '-=' + (speed * 2.5) + '')
            .add({
                targets: '.card-1, .card-1 *',
                translateX: ['50%', '0%'],
                opacity: [0, 1],
                delay: anime.stagger(delay),
                endDelay: int,
            }, '-=' + (speed * 1.5) + '')
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
            .add({
                targets: '.card-2, .card-2 *',
                translateX: ['50%', '0%'],
                opacity: [0, 1],
                delay: anime.stagger(delay),
                endDelay: int,
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
            /** Animation fade-out */
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
                
        let id = 0;
        $(team).each((id => {
            $('.heading').html(lineOfBusiness[id].heading);
            $('.message').html(lineOfBusiness[id].message);
            $('.name').html(team[id].name);
            $('.title').html(team[id].title);
            $('.legal').html(team[id].legal);
            console.log(team[id]);
        }))
    }
    
    assembleTeam();
    animate();

})();