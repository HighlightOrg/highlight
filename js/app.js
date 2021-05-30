var provider = new firebase.auth.GoogleAuthProvider();

function signInWithGoogle() {
    firebase.auth()
        .signInWithPopup(provider)
        .then((result) => {
            /** @type {firebase.auth.OAuthCredential} */
            var credential = result.credential;

            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            console.log(credential);
            console.log(token);
            console.log(user);
            // ...
        }).catch((error) => {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            console.log(errorCode);
            console.log(errorMessage);
            console.log(email);
            // ...
        });
}

function signOut() {
    firebase.auth().signOut().then(() => {
        // Sign-out successful.
    }).catch((error) => {
        // An error happened.
        halfmoon.initStickyAlert({
            content: "We couldn't sign you out! Check the console for additional details.",
            title: "Uh, oh!",
            alertType: "alert-danger",
            hasDismissButton: true,
            timeShown: 5000
        });
        console.log(`We couldn't sign you out! ERROR: ${error}`);
    });
}

$(document).ready(function () {
    const navbarHTML = `
    <div class="navbar-content">
        <button id="toggle-sidebar-btn" class="btn btn-action" type="button" onclick="halfmoon.toggleSidebar()">
            <i class="fas fa-bars"></i>
        </button>
    </div>
    <a href="${$('.navbar').data('navbar-link') ? $('.navbar').data('navbar-link') : '/'}" class="navbar-brand ml-10 ml-sm-20">
        <img src="/img/highlight_light.svg" class="hidden-dm" alt="Highlight">
        <img src="/img/highlight_dark.svg" class="hidden-lm" alt="Highlight">
        <span class="d-none d-sm-flex">${$('.navbar').data('navbar-text') ? $('.navbar').data('navbar-text') : 'Highlight'}</span>
    </a>
    <div class="navbar-content ml-auto">
        <button class="btn btn-action mr-10" type="button" onclick="halfmoon.toggleDarkMode()">
            <i class="fas fa-moon"></i>
            <span class="sr-only">Toggle dark mode</span>
        </button>
        <div class="account-loader">
        </div>
    </div>
    `;
    $('.navbar').html(navbarHTML);


    $(document).on('click', '.sign-in-with-google-btn', signInWithGoogle);
    $(document).on('click', '.account-sign-out', signOut);
    $('.account-loader').html('<div class="d-flex flex-column justify-content-center"><div class="fake-content w-150 h-25"></div></div>');

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            console.log(user)

            const loggedInUserHTML = `
            <div class="d-flex align-items-center">
                <div class="dropdown">
                    <a href="#" data-toggle="dropdown" id="avatar-popover-toggle" aria-haspopup="true" aria-expanded="false">
                        <img src="${user.photoURL}" style="width: 3.5rem; height: 3.5rem;" class="img-fluid rounded-circle mr-5">
                    </a>
                    <div class="dropdown-menu dropdown-menu-right" aria-labelledby="avatar-popover-toggle">
                        <h6 class="dropdown-header">Welcome!</h6>
                        <div class="dropdown-divider"></div>
                        <a href="#" class="dropdown-item">Settings <span class="badge badge-primary ml-10">Coming soon</span></a>
                        <a href="#" class="account-sign-out dropdown-item">Sign out</a>
                    </div>
                </div>
                ${user.displayName}
            </div>
            `;

            $('.account-loader').html(loggedInUserHTML);
        } else {
            // No user is signed in.
            $('.account-loader').html('<button class="sign-in-with-google-btn btn btn-primary">Sign in</a>');
        }
    });

    const sidebarHTML = `
    <div class="sidebar-menu">
        <h5 class="sidebar-title">General</h5>
        <div class="sidebar-divider"></div>
        <a href="/" class="sidebar-link sidebar-link-with-icon">
            <span class="sidebar-icon bg-transparent justify-content-start mr-0">
                <i class="fas fa-home"></i>
            </span>
            Home
        </a>
        <a href="/about" class="sidebar-link sidebar-link-with-icon">
            <span class="sidebar-icon bg-transparent justify-content-start mr-0">
                <i class="fas fa-info-circle"></i>
            </span>
            About
        </a>
        <br>
        <h5 class="sidebar-title">Tools</h5>
        <div class="sidebar-divider"></div>
        <a href="/tools#media" class="sidebar-link sidebar-link-with-icon">
            <span class="sidebar-icon bg-primary text-white rounded-circle">
                <i class="far fa-images"></i>
            </span>
            Images & Media
        </a>
        <a href="/tools#docs" class="sidebar-link sidebar-link-with-icon">
            <span class="sidebar-icon bg-success text-dark rounded-circle">
                <i class="far fa-file-alt"></i>
            </span>
            Text & Documents
        </a>
        <a href="/tools#seo" class="sidebar-link sidebar-link-with-icon">
            <span class="sidebar-icon bg-secondary text-dark rounded-circle">
                <i class="fas fa-chart-line"></i>
            </span>
            SEO
        </a>
        <a href="/tools#miscellaneous" class="sidebar-link sidebar-link-with-icon">
            <span class="sidebar-icon bg-danger text-white rounded-circle">
                <i class="fas fa-ellipsis-h"></i>
            </span>
            Miscellaneous
            </a>
    </div>
    `;
    const footerHTML = `
    <div class="container-fluid d-none d-md-flex">
        <ul class="navbar-nav ml-auto">
            <li class="nav-item">
                <a href="/contact" class="nav-link">Contact</a>
            </li>
            <li class="nav-item">
                <a href="/about" class="nav-link">About</a>
            </li>
        </ul>

        <span class="navbar-text">
            <div style="white-space: nowrap;" class="d-flex">© Copyright 2021-<span class="copyright-year"><div class="d-flex flex-column justify-content-center h-full"><div style="width: 3rem;" class="fake-content"></div></div></span>, Highlight</div>
        </span>
    </div>

    <div class="container-fluid hidden-md-and-up d-flex justify-content-center">
        <div class="dropdown dropup with-arrow">
            <button class="btn" data-toggle="dropdown" type="button" id="navbar-dropdown-toggle-btn-1">
            More
                <i class="fa fa-angle-up" aria-hidden="true"></i>
            </button>

            <div class="dropdown-menu" aria-labelledby="navbar-dropdown-toggle-btn-1">

                <div class="d-md-none">
                    <a href="contact" class="dropdown-item">Contact</a>
                    <a href="https://trello.com/b/t3yX5EH4" target="_blank" class="dropdown-item" rel="noopener">Development roadmap</a>
                </div>
            </div>
        </div>
        <span class="navbar-text">
            <div style="white-space: nowrap;" class="d-flex">© Copyright 2021-<span class="copyright-year"><div class="d-flex flex-column justify-content-center h-full"><div style="width: 3rem;" class="fake-content"></div></div></span>, Highlight</div>
        </span>
    </div>
    `;

    const customFooterHTML = `
    <div class="container-fluid">
        <div class="row row-eq-spacing-lg">
            <div class="col-lg-3">
                <div class="content">
                    <div class="mb-10">
                        <img src="/img/highlight_light.svg" class="img-fluid hidden-dm halfmoon-logo-img" style="width: 50px; height: auto;" alt="Highlight Logo Light">
                        <img src="/img/highlight_dark.svg" class="img-fluid hidden-lm halfmoon-logo-img" style="width: 50px; height: auto;" alt="Highligh Logo Dark">
                    </div>
                    <div>
                        <a href="/" class="custom-footer-link">Home</a>
                    </div>
                    <div>
                        <a href="/about" class="custom-footer-link">About</a>
                    </div>
                    <div>
                        <a href="/tools" class="custom-footer-link">Tools</a>
                    </div>
                    <div>
                        <a href="/blog" class="custom-footer-link">Blog</a>
                    </div>
                </div>
            </div>
            <div class="col-lg-3">
                <div class="content">
                    <h4 class="content-title font-size-16 mb-10">Get in touch</h4>
                    <div>
                        <a href="https://forms.gle/K5josyRQ3mLQxuUs8" class="custom-footer-link" target="_blank">Contact form <i class="fas fa-external-link-alt"></i></a>
                    </div>
                    <div>
                        <a href="mailto:contact@highlight.eu.org" class="custom-footer-link">contact@highlight.eu.org</a>
                    </div>
                </div>
            </div>
            <div class="col-lg-3">
                <div class="content">
                    <h4 class="content-title font-size-16 mb-10">Legal</h4>
                    <div>
                        <a href="/legal/privacy" class="custom-footer-link">Privacy policy</a>
                    </div>
                    <div>
                        <a href="/legal/cookies" class="custom-footer-link">Cookies</a>
                    </div>
                </div>
            </div>
            <div class="col-lg-3">
                <div class="content">
                    <h4 class="content-title font-size-16 mb-10">Made with <i class="fa fa-heart text-danger ml-5 mr-5" aria-hidden="true"></i> in France</h4>
                    <div class="mb-10">
                        <button class="btn btn-primary scroll-to-top-btn" disabled="disabled">Scroll to top</a>
                    </div>
                    <div class="text-muted">
                        <div style="white-space: nowrap;" class="d-flex overflow-x-scroll">© Copyright 2021-<span class="copyright-year"><div class="d-flex flex-column justify-content-center h-full"><div style="width: 3rem;" class="fake-content"></div></div></span>, Highlight</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;

    $('.sidebar').html(sidebarHTML);
    $('.navbar-fixed-bottom').html(footerHTML);
    $('.custom-footer').html(customFooterHTML);

    $('.copyright-year').html(new Date().getFullYear());

    $('.scroll-to-top-btn').prop('disabled', false);
    $(document).on('click', '.scroll-to-top-btn', function () {
        $('.content-wrapper').animate({ scrollTop: '0px' }, 1000);
    });
});