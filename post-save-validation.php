function save_post( $post_id ) {

    // Checks save status
    $is_autosave = wp_is_post_autosave( $post_id );
    $is_revision = wp_is_post_revision( $post_id );
    $is_valid_nonce = ( isset( $_POST[ 'mp_nonce' ] ) && wp_verify_nonce( $_POST[ 'mp_nonce' ], basename( __FILE__ ) ) ) ? 'true' : 'false';

    // Exits script depending on save status
    if ( $is_autosave || $is_revision || !$is_valid_nonce ) {
        return;
    }

    // Checks for input and sanitizes/saves if needed
    if( isset( $_POST[ 'image' ] ) ) {
        $image = $_POST[ 'image' ];
        $attachment_id = isset( $_POST[ 'image-attachment-id' ] ) ? $_POST[ 'image-attachment-id' ] : 0;

        if( $attachment_id != 0 && !$this->check_for_sizes( $post_id, $attachment_id ) ) {
            $resized_images = $this->scale_down_image( $image, $attachment_id );
        }
        if( isset( $resized_images ) && is_array( $resized_images ) ) {
            update_post_meta( $attachment_id, 'resized_images', $resized_images );
        }

        update_post_meta( $post_id, 'image', sanitize_text_field( $image ) );

    }

    if( isset( $_POST[ 'image-attachment-id' ] ) ) {
        update_post_meta( $post_id, 'image-attachment-id', sanitize_text_field( $_POST[ 'image-attachment-id' ] ) );
    }

    if( isset( $_POST[ 'read-duration' ] ) ) {
        update_post_meta( $post_id, 'read-duration', sanitize_text_field( $_POST[ 'read-duration' ] ) );
    }

    if( isset( $_POST[ 'co-author' ] ) ) {
        update_post_meta( $post_id, 'co-author', sanitize_text_field( $_POST[ 'co-author' ] ) );
    }

}

function meta_boxes() {
    remove_meta_box( 'postimagediv','post','side' );

    if( $this->user_can_upload_images() ) {
        add_meta_box( 'image', __( 'Post Header Image', 'menapost-custom' ), array( &$this, 'image_meta_box' ), 'post', 'normal', 'high' );
    }

    add_meta_box( 'post_read_duration', __( 'Read Duration', 'menapost-custom' ), array( &$this, 'read_duration_metabox' ), 'post', 'normal', 'low' );
    add_meta_box( 'co_author', __( 'Co-Author', 'menapost-custom' ), array( &$this, 'co_author_metabox' ), 'post', 'normal', 'low' );

    if( user_is( array( 'editor', 'administrator' ) ) ) {
        add_meta_box( 'ghost_author', __( 'Ghost Author', 'menapost-custom' ), array( &$this, 'ghost_author_metabox' ), 'post', 'normal', 'low' );
    }
}