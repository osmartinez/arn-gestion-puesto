$(document).ready(function () {
    $('.stepper').mdbStepper();
    //$('.mdb-select').materialSelect();
    const $valueSpan = $('#label-ritmo-ideal');
    const $value = $('#input-ritmo-ideal');
    $valueSpan.html($value.val());
    $value.on('input change', () => {
        $valueSpan.html($value.val());
    });
})




