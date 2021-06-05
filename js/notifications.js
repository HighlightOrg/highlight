const guestPostBanner = `
<div class="bottom-notification">
    <div class="bottom-notification-close"><i class="fas fa-times"></i></div>
    <div class="container-fluid">
        <div class="row justify-content-center align-items-center">
            <div class="col-auto p-20">
                <img src="/img/highlight_guest_post.svg" class="img-fluid" alt="Guest post image with feather and ink." style="max-height: 100px; vertical-align: middle;">
            </div>
            <div class="col">
                <h4 class="m-0 mb-10" style="line-height: 1;">We are accepting guest posts!</h4>
                <div class="text-muted">"Guest posting" means writing and publishing an article on someone else's website or blog. It's a great way to connect with new readers and get your name out there!</div>
                <br>
                <a href="/guest-posts" class="btn btn-primary" role="button">Tell me more</a>
            </div>
        </div>
    </div>
</div>`;

$(document).ready(function () {
    if (document.cookie.indexOf("seenGuestPostBanner=true") === -1) {
        $('.content-wrapper').append(guestPostBanner);
    }

    $(document).on('click', '.bottom-notification-close', function () {
        $(this).parent().remove();
        // Save preferences for two weeks
        document.cookie = "seenGuestPostBanner=true; path=/; max-age=" + 60 * 60 * 24 * 14;
    });
});