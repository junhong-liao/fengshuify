// TODO
function updateNavButtons() {
    $('#nextBtn').text(part === 5 ? 'Finish' : 'Next');
}

$(document).ready(function() {
    $('#nextBtn').click(function() {
        if (part <= 4) {
            window.location.href = `/learn/${part + 2}`;
        } else {
            window.location.href = `/quiz`;
        }
    });

    $('#prevBtn').click(function() {
        // TODO
    });
    updateNavButtons();
});