$ ( document ).on ( 'click', '.box-price', function () {

    var product = $ ( this ).attr ( 'data-item' );

    var price     = $ ( this ).find ( '.price' ).text ();
    var priceSPS  = $ ( this ).children ( 'li.price-sps' ).text ();
    var nameOffer = $ ( this ).find ( '.name_offer' ).text ();

    var dataset = {
        action   : 'register_price_session',
        priceSPS : priceSPS,
    };

    jQuery.ajax ( {
        data    : dataset,
        type    : 'POST',
        url     : ajax_url,
        success : function ( $result ) {
            sessionStorage.setItem ( 'price', price );
            sessionStorage.setItem ( 'nameOffer', nameOffer );
            sessionStorage.setItem ( 'item', product );

            if ( $result == "0" ) {
                window.location.href = register_page;
            }
        }
    } );
} );

// ==========================
// request registration form
// ==========================

$ ( document ).on ( 'submit', '#registrationForm', function ( event ) {

    event.preventDefault ();

    var pwd1 = $ ( '#registration_pwd' ).val ();
    var pwd2 = $ ( '#confirmation_pwd' ).val ();

    var dataset = {
        lastname  : $ ( '#registration_firstname' ).val (),
        firstname : $ ( '#registration_lastname' ).val (),
        email     : $ ( '#registration_email' ).val ()
    };

    if ( pwd1 === pwd2 ) {
        dataset.pwd          = pwd1;
        sessionStorage.setItem ( 'customer', JSON.stringify ( dataset ) );
        window.location.href = recap_page;
    } else {
        $ ( '.alert-danger' ).css ( 'display', 'block' );
    }
} );

// ===============================================
// Ajax request registration form after recap page
// ===============================================

$ ( document ).on ( 'submit', '#recapForm', function ( event ) {

    event.preventDefault ();

    var customer = JSON.parse ( sessionStorage.getItem ( 'customer' ) );

    var dataset = {
        action    : 'save_user_data',
        lastname  : customer[ 'lastname' ],
        firstname : customer[ 'firstname' ],
        email     : customer[ 'email' ],
        pwd       : customer[ 'pwd' ],
        item      : sessionStorage.getItem ( 'item' )
    };

    jQuery.ajax ( {
        data    : dataset,
        type    : 'POST',
        url     : ajax_url,
        success : function ( $result ) {
            sessionStorage.setItem ( 'customer', JSON.stringify ( dataset ) );

            if ( $result.hasOwnProperty ( 'success' ) && true === $result.success ) {
                window.location.href = payment_page;
            }

            if ( $result == "0" ) {
                window.location.href = payment_page;
            }
        }
    } );

} );

// ===============================
// Ajax request payment form
// ===============================

$ ( document ).on ( 'submit', '#paymentForm', function ( event ) {

    event.preventDefault ();

    var dataset = {
        action        : 'payment_user_data',
        name          : $ ( '#registration_name_card' ).val (),
        cardnumber1   : $ ( '#registration_cartnumber1' ).val (),
        cardnumber2   : $ ( '#registration_cartnumber2' ).val (),
        cardnumber3   : $ ( '#registration_cartnumber3' ).val (),
        cardnumber4   : $ ( '#registration_cartnumber4' ).val (),
        cardDateMonth : $ ( '#registration_card_date_month option:selected' ).val (),
        cardDateYonth : $ ( '#registration_card_date_year option:selected' ).val (),
        cvc           : $ ( '#registration_cvc' ).val ()
    };

    $ ( '.loader' ).css ( 'display', 'inline-block' );

    jQuery.ajax ( {
        data    : dataset,
        type    : 'POST',
        url     : ajax_url,
        success : function ( $result ) {
            if (
                $result.hasOwnProperty ( 'success' ) &&
                true === $result.success &&
                $result.hasOwnProperty ( 'data' ) &&
                'ok' === $result.data
            ) {
                console.log ( 'good' );
                $ ( '.loader' ).css ( 'display', 'none' );
            } else {
                $ ( '.alert-danger' ).css ( 'display', 'block' );
                $ ( '.loader' ).css ( 'display', 'none' );
            }
        }
    } );
} );

(function ( $, window, undefined ) {

    var $email = $ ( '#registration_email' );

    if ( 0 < $email.length ) {
        $email.on (
            'blur',
            function () {

                var $data = {
                    action : 'check_email_availability',
                    s      : z.nonce,
                    email  : $ ( this ).val ()
                };

                $.ajax (
                    {
                        data    : $data,
                        type    : 'POST',
                        url     : z.ajax_url,
                        success : function ( $response ) {

                            if ( $response.hasOwnProperty ( 'success' ) && false === $response.success ) {
                                $message = '';

                                if ( $response.hasOwnProperty ( 'data' ) ) {
                                    for ( var $i = 0, $j = $response.data.length; $i < $j; $i++ ) {
                                        if ( $i > 0 ) {
                                            $message += '<br />';
                                        }
                                        $message += $response.data[ $i ].message;
                                    }
                                }

                                $email.siblings ( '.alert.alert-danger' ).remove ();
                                $email.before ( '<div class="alert alert-danger" role="alert">' + $message + '</div>' );
                            } else {
                                $email.siblings ( '.alert.alert-danger' ).remove ();
                            }

                        }
                    }
                );

            }
        );

    }

}) ( jQuery, this );

/**
 * Responsible to return the user data, either the user is unknown or the user
 * is already registered in the system.
 *
 * @returns {Promise}
 */
function current_customer () {
    var promise = new Promise (
        function ( resolve, reject ) {
            var customer = JSON.parse ( sessionStorage.getItem ( 'customer' ) );

            if ( null === customer ) {
                var $data = {
                    action : 'logged_in_user_set_session_storage',
                    s      : z.nonce
                };

                jQuery.ajax (
                    {
                        data    : $data,
                        type    : 'POST',
                        url     : z.ajax_url,
                        success : function ( response ) {
                            if ( response.hasOwnProperty ( 'success' ) && true === response.success ) {

                                if ( response.hasOwnProperty ( 'data' ) ) {

                                    var $user = {
                                        first_name : response.data.first_name,
                                        last_name  : response.data.last_name,
                                        email      : response.data.email
                                    };

                                    var sessionCustomer = {
                                        firstname : response.data.first_name,
                                        lastname  : response.data.last_name,
                                        email     : response.data.email
                                    };

                                    window.sessionStorage.setItem ( 'customer', JSON.stringify ( sessionCustomer ) );

                                    resolve ( $user );

                                } else {
                                    reject ();
                                }

                            } else {
                                reject ();
                            }
                        }
                    }
                );

            } else {
                var $user = {
                    first_name : customer[ 'firstname' ],
                    last_name  : customer[ 'lastname' ],
                    email      : customer[ 'email' ]
                };

                resolve ( $user );
            }
        }
    );

    return promise;
}

function getElementCustomer () {
    current_customer ().then (
        function ( $user ) {
            var customer = JSON.parse ( sessionStorage.getItem ( 'customer' ) );
            // If we know who is the client then display the user information
            $ ( '.firstnameRecap' ).html ( $user.first_name );
            $ ( '.lastnameRecap' ).html ( $user.last_name );
            $ ( '.mailRecap' ).html ( $user.email );
        },
        function () {
            // If no user data is tracked, then redirect in home page.
            window.location.href = z.home;
        }
    )
}

function getElementPrice () {
    var nameOffer = sessionStorage.getItem ( 'nameOffer' );
    var price     = sessionStorage.getItem ( 'price' );
    $ ( '.price' ).html ( price );
    $ ( '.nameOffer' ).html ( nameOffer );
}

(function ( $, window, undefined ) {

    var $download_lesson = $ ( '.download_lesson' );
    var $alert_container = $( '.alert-container' );
    var $available_credits = $( '.available_credits' );
    var $consumed_credits = $( '.consumed_credits' );

    if ( 0 < $download_lesson.length ) {

        $download_lesson.on (
            'click',
            function () {
                var $link = $ ( this ).attr ( 'data-lesson' );

                var $data = {
                    action : 'download-book',
                    s      : z.nonce,
                    lesson : $link
                };

                $.ajax (
                    {
                        data    : $data,
                        type    : 'POST',
                        url     : z.ajax_url,
                        success : function ( $result ) {

                            $alert_container.empty();

                            if ( $result.hasOwnProperty( 'success' ) && true === $result.success ) {

                                if ( $result.hasOwnProperty ( 'data' ) && $result.data.hasOwnProperty ( 'balance' ) ) {
                                    $available_credits.text( parseInt( $result.data.balance, 10 ) );
                                }

                                if ( $result.hasOwnProperty ( 'data' ) && $result.data.hasOwnProperty ( 'consumed' ) ) {
                                    $consumed_credits.text( parseInt( $result.data.consumed, 10 ) );
                                }

                                if ( $result.hasOwnProperty ( 'data' ) && $result.data.hasOwnProperty ( 'lesson' ) ) {
                                    window.location = z.download_page + '/' + $result.data.lesson;
                                }

                            } else if ( $result.hasOwnProperty( 'success' ) && false === $result.success ) {
                                $alert_container.append( '<div class="alert alert-danger" role="alert">' + $result.data[0 ].message + '</div>' );
                            }
                        }
                    }
                );
            }
        );

    }

}) ( jQuery, this );
