function areAnyTitlesEmpty() {
    var anyEmpty = false;
    $('#title-repository-table tr:not(.admin-only) input[type=text]').each(function() {
        if(!$(this).val()) {
            anyEmpty = true;
        }
    });

    return anyEmpty;
}


function validateBasics(full) {
    var title = $( 'input[name="post_title"]' ).val();
    var category = $('[name^="radio_tax_input[category][]"]:checked');

    var mood_tag = $('[name^="radio_tax_input[mood][]"]:checked');
    var mediaType = $('[name^="radio_tax_input[media-type-taxonomy][]"]:checked');
    var contentType = $('[name^="radio_tax_input[content-type-taxonomy][]"]:checked');
    var authorship = $('[name^="radio_tax_input[authorship-taxonomy][]"]:checked');
    var source = $('[name^="radio_tax_input[source-taxonomy][]"]:checked');
    var geography = $('[name^="tax_input[geography-taxonomy][]"]:checked');
    var focusKeyword= $('input#yoast_wpseo_focuskw').val();
    var errors = [];

    if( title == '' ) {
        errors.push( 'Title can\'t be left empty.' );
    }
    if( focusKeyword == '' ) {
        errors.push( 'Focus Keyword can\'t be left empty.' );
    }
    if( category.length == 0 ) {
        errors.push( 'Category is not selected.' );
    }

    if( mood_tag.length == 0 ) {
        errors.push( 'Mood tag is not selected.' );
    }
    if( mediaType.length == 0) {
        errors.push( 'Media Type is not added.' );
    }
    if( contentType.length == 0) {
        errors.push( 'Content Type is not added.' );
    }
    if( authorship.length == 0) {
        errors.push( 'Authorship is not added.' );
    }
    if( source.length == 0) {
        errors.push( 'Source is not added.' );
    }
    if( geography.length == 0) {
        errors.push( 'Geography is not selected.' );
    }

    if (full){return errors;}
    else{return errors.join( '\n' );}

}
function validateDraft(full) {
    errors = validateBasics(true);

    var body = tinyMCE.editors[0].getContent();
    var read_duration = $( 'input[name="read-duration"]' ).val();

    if( body == '' ) {
        errors.push( 'Article body can\'t be left empty.' );
    }
    if( read_duration == '' ) {
        errors.push( 'Read duration can\'t be left empty' );
    }
    if( areAnyTitlesEmpty() ) {
        errors.push( 'Please enter all alternative titles.' );
    }
    if (full){return errors;}
    else{return errors.join( '\n' );}
}

function validateFull(full) {
    errors = validateDraft(true);
    var image_attachment = $( 'input[name="image-attachment-id"]' ).val();
    if( image_attachment == '' ) {
        errors.push( 'Header image is not selected.' );
    }
    return errors.join( '\n' );
}



//BASIC
$('#save-post').on( 'click', function ( e, d ) {
    if ($('select#post_status').val() !=="in-progress" && $('select#post_status').val() !== "draft" && $('select#post_status').val() !== "publish" && $('select#post_status').val() !== "scheduled"){

        console.log(111,$('select#post_status').val());
        if( !d || ( d && d != 'fixed' ) ) {
        var errors = validateBasics();
        if( ( errors !== '' || validateYoutube() ) && ( backend_object.type_now == 'post' ) ) {
            if( errors != '' )
                alert(errors);
            return false;
            }
        }
    }
});

//DRAFT
$('#save-post').on( 'click', function ( e, d ) {
    if ($('select#post_status').val() == "draft"){

        if( !d || ( d && d != 'fixed' ) ) {
        var errors = validateDraft();
        if( ( errors !== '' || validateYoutube() ) && ( backend_object.type_now == 'post' ) ) {
            if( errors != '' )
                alert(errors);
            return false;
            }
        }
    }
});

//FULL
$('#save-post').on( 'click', function ( e, d ) {
    if ($('select#post_status').val() == "publish" || $('select#post_status').val() == "scheduled"){

        if( !d || ( d && d != 'fixed' ) ) {
            var errors = validateFull(true);
            if( ( errors !== '' || validateYoutube() ) && ( backend_object.type_now == 'post' ) ) {
                if( errors != '' )
                    alert(errors);
                return false;
            }
        }
    }
});
