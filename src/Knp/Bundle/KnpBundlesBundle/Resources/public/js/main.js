(function($) {
    if (window.location.hash.length > 0) {
        $('ul.nav-tabs li > a[data-target="' + window.location.hash + '"]').tab('show');
    }

    $(document).bind('keydown.s keydown.f keydown./', function() {
        $('#search-query').focus();
        return false;
    });

    $('#search-query').bind('keydown.esc', function() {
        $('#search-query').blur();
        return false;
    });

    $('.sidebar-developers-list img,abbr').tooltip();
    $('.symfony-versions').popover({trigger: 'hover'});

    $('#add-bundle-btn').bind('click', function(event) {
        var ul = $(this).parent().parent().parent(),
            input = ul.find('#bundle');

        ul.find('.unknown').removeClass('hide');

        if (!ul.find('.alert-error').hasClass('hide') || ul.find('.alert-success').hasClass('hide')) {
            ul.find('.alert-error').addClass('hide');
            ul.find('.alert-success').addClass('hide');
        }

        if (input.attr('value') == 'http://github.com/' || input.attr('value') == 'https://github.com/') {
            ul.find('li.unknown').addClass('hide');
            ul.find('.alert-error').removeClass('hide').text('Please enter proper GitHub repository URL, and try again.');

            return event.preventDefault();
        }

        $.ajax({
                type: "POST",
                url: $(this).parent().attr('action'),
                dataType: 'json',
                data: {
                    bundle: input.attr('value')
                },
                success: function(data) {
                    ul.find('li.unknown').addClass('hide');
                    ul.find('.alert-success').html(data.message).removeClass('hide');
                }
            })
            .fail(function(xhr) {
                var data = jQuery.parseJSON(xhr.responseText);
                ul.find('li.unknown').addClass('hide');
                ul.find('.alert-error').html(data.message).removeClass('hide');
            })
            .always(function() {
                ul.attr('disabled', 'disabled');
            });

        return event.preventDefault();
    });

    $('.content-box article h3 a,.content-half article .bundle-info h2 a').each(function() {
        var code = $(this);
        var codeWidthReal = code.css('display', 'inline-block').width();
        var codeWidthStyle = code.css('display', 'block').parent().width();

        code.parent().after($("<div></div>").css('height', code.height()));
        code.parent().css({
            width: codeWidthStyle,
            position: 'absolute'
        });

        if (codeWidthReal > codeWidthStyle) {
            code.mouseenter(function() {
                $(this).parent().stop().animate({
                    width: codeWidthReal + 8,
                    borderRadius: '6px',
                    zIndex: 6666
                }, 'fast');
            });

            code.mouseleave(function() {
                $(this).parent().stop().animate({
                    width: codeWidthStyle,
                    borderRadius: '0'
                }, 'fast');
            });
        }
    });
})(jQuery);
