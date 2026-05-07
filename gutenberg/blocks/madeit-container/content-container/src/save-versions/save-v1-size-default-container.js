import save from '../save';

/**
 * Deprecated (2026-04-17): `size` default changed from `container`
 * to `container-content-boxed`.
 *
 * This variant keeps old content without an explicit `size` attribute valid by
 * serializing with the legacy fallback (`container`).
 */
export default function saveV1SizeDefaultContainer( props ) {
    const currentSize =
        typeof props?.attributes?.size === 'string' ? props.attributes.size : '';

    const wrapperClassName =
        typeof props?.attributes?.wrapperClassName === 'string'
            ? props.attributes.wrapperClassName
            : '';
    const wrapperTokens = wrapperClassName.trim().length
        ? wrapperClassName.trim().split( /\s+/ )
        : [];

    const wrapperHasContainer = wrapperTokens.includes( 'container' );
    const wrapperHasContainerFluid = wrapperTokens.includes( 'container-fluid' );

    // Legacy compatibility: older content was saved with a `container` wrapper
    // when no explicit `size` attribute existed. After changing the default
    // to `container-content-boxed`, those blocks parse with the new default
    // but still carry legacy wrapper classes from markup.
    const shouldForceLegacyContainer =
        currentSize === 'container-content-boxed' &&
        wrapperHasContainer &&
        ! wrapperHasContainerFluid;

    const legacySize = shouldForceLegacyContainer
        ? 'container'
        : currentSize && currentSize.length > 0
            ? currentSize
            : 'container';

    return save( {
        ...props,
        attributes: {
            ...props.attributes,
            size: legacySize,
        },
    } );
}
