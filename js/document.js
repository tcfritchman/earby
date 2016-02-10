function loadHelp() {
    $.get('templates/helpPage.stache', function(template) {
        var rendered = Mustache.render(template);
        $('#document-modal-body').html(rendered);
    });
    $('#document-title').html('Help');
}
