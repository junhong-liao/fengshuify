let currentSection = 1;
let totalSections = 3;

function updateNavButtons() {
    // TODO fix forward/backward buttons
    if (currentSection > 1 || lesson_id > 1) {
        $('#prevBtn').removeClass("disabled");
    }
    else {
        $('#prevBtn').addClass("disabled");
    }
}

function showSection(sectionNum) {
    // loads data onto page from json
    let sectionData = learn_sections[sectionNum - 1];
    if (!sectionData) return;

    $(".section-header").html(`<h2>${sectionData.title}</h2>`);
    $(".learn-text").html(sectionData.summary);
    $(".learn-img").html(`<img src="${sectionData.image}" alt="${sectionData.alt}" 
        class="view-img img-fluid">`);
    $(".learn-text-sm").html(`<p>${sectionData.secondary}</p>`);

    updateNavButtons();
}

function showLesson(){
    let lessonData = lessons[lesson_id - 2];
    if (!lessonData) return;

    $(".lesson-header").html(`<h2>${lessonData.title}</h2>`);
    $(".learn-text").html(lessonData.summary);
    let attrList = "<ul>";
    lessonData.points.forEach(function(point) {
        attrList += `<li>${point}</li>`;
    });
    attrList += "</ul>";
    $(".attributes").append(attrList);
    $(".learn-img").html(`<img src="${lessonData.image}" alt="${lessonData.alt}" 
        class="view-img img-fluid">`);
    $(".learn-text-sm").html(`<p>${lessonData.secondary}</p>`);

    updateNavButtons();
}

$(document).ready(function() {
    updateNavButtons();
    if (lesson_id > 1) {
        totalSections = 1;
        showLesson();
    }
    else {
        showSection(currentSection);
    }

    $('#nextBtn').click(function() {
        if (currentSection < totalSections) {
            showSection(++currentSection);
        }
        else if (lesson_id === 1) {
            window.location.href = `/learn/2`;
        }
        else if (lesson_id <= 6) {
                window.location.href = `/orientation_game/${lesson_id - 1}`;
        } else {
            window.location.href = "/simulator";
        }
    });

    $('#prevBtn').click(function() {
        if (lesson_id === 1 && currentSection > 1) {
            showSection(--currentSection);
        }
        else if (lesson_id === 2) {
            window.location.href = `/learn/1`;
        }
        else if (lesson_id > 2) {
            window.location.href = `/orientation_game/${lesson_id - 2}`;
        }
    });
});