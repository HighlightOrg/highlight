const cookieConstentHTML = `
<div class="cookie-wrapper">
    <img src="/img/cookie.png" alt="Cookie">
    <div class="content">
      <h3>Cookies Consent</h3>
      <p>This website use cookies to ensure you get the best experience on our website.</p>
      <div class="buttons">
        <button class="accept-cookies item">I understand</button>
        <a href="/legal/cookies" class="item">Cookie policy</a>
      </div>
    </div>
</div>
`

if (document.cookie.indexOf("acceptCookies=true") === -1) {
    $('body').append(cookieConstentHTML);
}

$(document).on('click', '.accept-cookies', function () {
    // Save preferences for one month
    document.cookie = "acceptCookies=true; path=/; max-age=" + 60 * 60 * 24 * 30;
    if (document.cookie) {
        $('.cookie-wrapper').addClass('hide');
    } else {
        alert("We couldn't save your preferences. Make sure to allow cookies on this website!");
    }
})
