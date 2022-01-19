$(function () {
    const userName = "FNBO",
        userIcon = "./img/fnbo-logo.svg",

        dataURI = [
            local = "c:\\data\\social\\social.json",
            server = "https://kitchen.screenfeed.com/social/data/3jzp1h5xsxw684a2r5sk94b7fk.json"
        ],

        revealerSpeed = parseInt($(':root').css('--revealer-speed')),
        // revealerSpeed = 750,
        timerDuration = 7000,
        animeDuration = 750;

    let feeds = [],
        current = 0;

    function revealer() {
        // alert(revealerSpeed)
        const $transition = $('.revealer'),
            mode = [
                'revealer--left',
                'revealer--right',
                'revealer--top',
                'revealer--bottom'
            ],
            shuffle = mode[(Math.random() * mode.length) | 0];
        $transition.addClass('revealer--animate').addClass(mode[1]).delay(revealerSpeed * 1.5).queue(function () {
            $(this).removeClass('revealer--animate').removeClass(mode[1]).dequeue();
        });
    }

    function animateItem($template) {
        var item = $template[0];
        var animateIn = anime.timeline({
                easing: 'easeInOutQuad',
                // easing: 'easeInOutElastic(1.5, 1.2)',
                duration: animeDuration,
                autoplay: true,
                loop: false
            })
            .add({
                begin: function () {
                    revealer();

                    resizeText({
                        elements: document.querySelectorAll('.message'),
                        step: 0.1,
                        minSize: 1,
                        maxSize: 3,
                        unit: 'em'
                    })

                    isolateTag({
                        element: document.querySelectorAll('.message')
                    });
                },
            })
            .add({
                targets: item,
                opacity: [0, 1],
                translateX: [100, 0],
                endDelay: (timerDuration - (animeDuration * 2)),
            })
            .add({
                targets: item,
                opacity: [1, 0],
                translateX: [0. - 100],
            })
    }

    function animateTemplate($container, $template, data, current) {
        const $clone = $template.clone();

        let ProfileImageUrl = data.User.ProfileImageUrl,
            ProfileUserName = data.User.Name,
            MediaUrl = {
                "Url": "./img/default-icon.svg"
            };

        if (data.Images === undefined || data.Images.length == 0) {
            // image array empty or does not exist
            data.Images.push(MediaUrl);
            $clone.find('#media .video').attr('src', MediaUrl.Url);
            $clone.find('#media .photo').css('background-image', 'url(' + (MediaUrl.Url) + ')');
        } else {
            MediaUrl = data.Images[0].Url;
            $clone.find('#media .video').attr('src', MediaUrl);
            $clone.find('#media .photo').css('background-image', 'url(' + (MediaUrl) + ')');
        }

        if (data.User.ProfileImageUrl === undefined || !data.User.ProfileImageUrl === true) {
            // use default instagram image & username
            ProfileImageUrl = userIcon;
            ProfileUserName = userName;
        }

        $clone.attr("id", current).css('z-index', current).removeClass('hidden');
        $clone.find('.socialicon .icon').attr('src', data.ProviderIcon);
        $clone.find('#username').text(ProfileUserName);
        $clone.find('#useraccount').text(data.User.Username);
        $clone.find('#usericon .icon').attr('src', ProfileImageUrl);
        $clone.find('.message').text(data.Content);
        $clone.find('#posted').text(data.DisplayTime);
        $container.append($clone);

        animateItem($clone);


        setTimeout(function () {
            $clone.remove();
        }, timerDuration + (revealerSpeed * 2));
    }

    function iterateAnimations() {
        const $template = $("article");
        const $container = $("main");

        console.log(current, feeds[current])
        animateTemplate($container, $template, feeds[current], current);
        current++;

        setInterval(function () {
            console.log(current, feeds[current])
            animateTemplate($container, $template, feeds[current], current);
            current = (current + 1) % feeds.length;
        }, timerDuration);

        $template.remove();
    }

    function getData() {
        $.get(dataURI[1])
            .done(function (response) {
                $.each(response.Items, function (i) {
                    feeds.push(response.Items[i]);
                })
                iterateAnimations();
                // setData(response);
            })
            .always(function () {
                // $bumper[0].addEventListener("timeupdate", videoTimeUpdate);
            });
    }

    function preLoad() {
        // $(window).load(function() {
        //     $(".preload").delay(2000).fadeOut("slow");
        // })
    }

    function init() {
        getData();
    }

    preLoad();
    init();

});