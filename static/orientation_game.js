function updateNavButtons() {
    $('#nextBtn').text(part === 5 ? 'Finish' : 'Next');
}

$(document).ready(function() {
    $("#orientationGameForm").submit(function(event) {
        event.preventDefault();

        const selectedValue = $("input[name='orientation']:checked").val();
        const gameResult = $("#gameResult");

        $.ajax({
            url: "/check_orientation",
            method: "POST",
            data: {
                section: $("input[name='section']").val(),
                choice: selectedValue
            },
            success: function(response) {
                if (response.correct) {
                    gameResult.removeClass("alert-danger").addClass("alert-success");
                    gameResult.html(`
                        <h4>Correct!</h4>
                        <p>${response.explanation}</p>
                    `);
                    $('#nextBtn').removeClass("disabled");
                } else {
                    gameResult.removeClass("alert-success").addClass("alert-danger");
                    gameResult.html(`
                        <h4>Not quite right</h4>
                        <p>${response.explanation}</p>
                        <p>The correct orientation is: ${response.correct_label}</p>
                    `);
                }

                gameResult.removeClass("d-none");

                // Scroll to result
                $('html, body').animate({
                    scrollTop: gameResult.offset().top - 100
                }, 200);
            }
        });
    });

    $('#nextBtn').click(function() {
        if (part <= 4) {
            window.location.href = `/learn/${part + 2}`;
        } else {
            window.location.href = `/quiz`;
        }
    });

    $('#prevBtn').click(function() {
        window.location.href = `/learn/${part + 1}`;
    });
    updateNavButtons();
});