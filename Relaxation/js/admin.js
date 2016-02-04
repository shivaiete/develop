jQuery(document).ready(
    function($)
    {
        var $postTypeClientdata =   $('.post-type-clientdata');

        if(0 < $postTypeClientdata.length)
        {
            $('.add-new-h2, #edit-slug-box, #minor-publishing').remove();
            $('.deletion').remove();
            $('.page-title-action').remove();
            $('.row-actions').remove();
            $('.subsubsub').remove();
            $('#submitdiv .hndle span').text('Actions');
            $('#publish').val('Return');
            $('.wrap > h2').text('Client Data');
            $('.bulkactions').remove();

            $('#post').on(
                'submit',
                function(e)
                {
                    e.preventDefault();

                    window.location.href = 'edit.php?post_type=clientdata';
                }
            );

            $('#menu-posts-clientdata ul li').eq(2).remove();
        }

    }
);
