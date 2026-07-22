// Block Editor plugin registration
(function (wp) {
    console.log('Visual revisions loaded');
    if (!wp || !wp.plugins || !wp.editPost) {
        return;
    }

    const { registerPlugin } = wp.plugins;
    const { PluginPostStatusInfo } = wp.editPost;
    const { Button } = wp.components;
    const { createElement } = wp.element;

    const VisualRevisionButton = () => {

        return createElement(
            PluginPostStatusInfo,
            {},
            createElement(
                Button,
                {
                    variant: "secondary",
                    onClick: () => {

                        const id = wp.data
                            .select("core/editor")
                            .getCurrentPostId();

                        window.location.href =
                            "admin.php?page=madeit-visual-revisions&post=" + id;

                    }
                },
                "Bekijk visuele revisies"
            )
        );

    };

    registerPlugin(
        "madeit-visual-revisions",
        {
            render: VisualRevisionButton
        }
    );

})(window.wp);