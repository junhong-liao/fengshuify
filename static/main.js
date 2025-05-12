$(document).ready(function() {
    const currentPath = window.location.pathname;
    
    $('.navbar-nav .nav-item').each(function() {
        const $navLink = $(this).find('.nav-link');
        const linkPath = $navLink.attr('href');

        if (currentPath === linkPath) {
            $(this).addClass('active-nav-item');
        }
        else if ((linkPath.includes('/learn') || linkPath.includes('/orientation_game')) &&
            (currentPath.includes('/learn') || currentPath.includes('/orientation_game'))) {
            $(this).addClass('active-nav-item');
        }
        else {
            $(this).removeClass('active-nav-item');
        }
    });
    
    $('.btn').hover(
        function() {
            $(this).css('opacity', '0.8');
        },
        function() {
            $(this).css('opacity', '1');
        }
    );
}); 