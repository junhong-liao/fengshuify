$(document).ready(function() {
    const currentPath = window.location.pathname;
    
    $('.navbar-nav .nav-link').each(function() {
        const linkPath = $(this).attr('href');
        if (currentPath === linkPath) {
            $(this).addClass('active fw-bold');
        }
    });
    
    $('.btn').hover(
        function() {
            $(this).css('opacity', '0.9');
        },
        function() {
            $(this).css('opacity', '1');
        }
    );
    
    $('a[href^="#"]').on('click', function(event) {
        if (this.hash !== '') {
            event.preventDefault();
            const hash = this.hash;
            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, 800, function() {
                window.location.hash = hash;
            });
        }
    });
}); 