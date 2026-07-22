<?php

$revision_id = get_query_var('madeit_revision');

$revision = get_post($revision_id);


if(!$revision){
    exit;
}


?>

<!doctype html>

<html <?php language_attributes(); ?>>

<head>

<meta charset="<?php bloginfo('charset'); ?>">

<?php wp_head(); ?>

</head>


<body class="madeit-revision-frame">


<?php

echo do_blocks(
    $revision->post_content
);

?>


<?php wp_footer(); ?>


</body>

</html>