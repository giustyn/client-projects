$(function () {
    const userName = "FNBO",
        userIcon = "./img/fnbo-logo.svg",

        dataURI = [
            local = "c:\\data\\social\\social.json",
            server = "https://kitchen.screenfeed.com/social/data/3jzp1h5xsxw684a2r5sk94b7fk.json"
        ],

        revealerSpeed = parseInt($(':root').css('--revealer-speed')),
        timerDuration = 7000,
        animeDuration = 750;

    let feeds = [],
        current = 0;

    function fitText(el) {
        resizeText({
            elements: document.querySelectorAll(el),
            step: 0.1,
            minSize: 1,
            maxSize: 3,
            unit: 'em'
        })
    }

    function isolateHashtag(element) {
        var edt = $(element).text().replace(/(^|\s)(#[a-z\d-]+)/ig, "$1<span class='hashtag'>$2</span>");
        $(element).html(edt);
    }

    function revealer() {
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

    function animateFeed($template) {
        var item = $template[0];
        var animateIn = anime.timeline({
                easing: 'easeOutQuart',
                duration: animeDuration,
                autoplay: false,
                loop: false
            })
            .add({
                begin: function () {
                    revealer();
                    fitText('#message');
                    isolateHashtag('#message'); // partilaly working, change occurs AFTER slide is finished
                },
            })
            .add({
                targets: item,
                opacity: [0, 1],
                delay: anime.stagger(100),
                translateX: [100, 0],
            })

        animateIn.play();
    }

    function animateTemplate($container, $template, data, current) {
        const $clone = $template.clone();
        let ProfileImageUrl = data.User.ProfileImageUrl,
            ProfileUserName = data.User.Name;

        if (!data.User.ProfileImageUrl === true) {
            // use default instagram image & username
            ProfileImageUrl = userIcon;
            ProfileUserName = userName;
        }

        $clone.attr("id", current).css('z-index', 1).removeClass('hidden');
        $clone.find('#socialicon .icon').attr('src', data.ProviderIcon);
        $clone.find('#username').text(ProfileUserName);
        $clone.find('#useraccount').text(data.User.Username);
        $clone.find('#usericon .icon').attr('src', ProfileImageUrl);
        $clone.find('#message').text(data.Content);
        $clone.find('#posted').text(data.DisplayTime);
        $clone.find('#media .video').attr('src', data.Images[0].Url);
        $clone.find('#media .photo').css('background-image', 'url(' + (data.Images[0].Url) + ')');
        $container.append($clone);

        animateFeed($clone);

        setTimeout(function () {
            $clone.remove();
        }, timerDuration + (revealerSpeed * 2));
    }

    function iterateAnimations() {
        const $template = $("article");
        const $container = $("#main");

        console.log(current, feeds[current])
        animateTemplate($container, $template, feeds[current]);
        current++;

        setInterval(function () {
            console.log(current, feeds[current])
            animateTemplate($container, $template, feeds[current]);
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

    function init() {
        getData();
    }

    init();

});