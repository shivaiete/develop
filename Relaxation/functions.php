<?php

function extend_theme_options( $settings ) {

    $settings[ 'sections' ][] = array(
        'id'    => 'custom_text',
        'title' => 'Custom Text'
    );

    $settings[ 'settings' ][] = array(
        'id'           => 'registration_text',
        'label'        => 'Registration Page Text',
        'std'          => '',
        'type'         => 'textarea',
        'section'      => 'custom_text',
        'rows'         => '',
        'post_type'    => '',
        'taxonomy'     => '',
        'min_max_step' => '',
        'class'        => '',
        'condition'    => '',
        'operator'     => 'and'
    );
    $settings[ 'settings' ][] = array(
        'id'           => 'recappage_text',
        'label'        => 'Recap Page Text',
        'std'          => '',
        'type'         => 'textarea',
        'section'      => 'custom_text',
        'rows'         => '',
        'post_type'    => '',
        'taxonomy'     => '',
        'min_max_step' => '',
        'class'        => '',
        'condition'    => '',
        'operator'     => 'and'
    );

    return $settings;
}
add_filter( 'ot_macro_settings', 'extend_theme_options' );
