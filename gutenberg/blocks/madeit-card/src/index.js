import { registerBlockType } from '@wordpress/blocks';

import './style.scss';
import './editor.scss';

import metadata from './../block.json';
import edit from './edit';
import save from './save';
import icon from './icon';

import classnames from 'classnames';
import { InnerBlocks, getColorClassName, RichText } from '@wordpress/block-editor';

registerBlockType(metadata.name, {
    ...metadata,
    icon,
    edit,
    save,

    // deprecated versie van de block die nog steeds de oude attributen en save functie bevat, zodat bestaande blocks niet breken bij het updaten van de code
    deprecated: [
        {
        attributes: {
            // oude attributen (misschien niets of alleen defaults)
            hasMediaBleed: { type: 'boolean', default: false },
            paddingTop: { type: 'string', default: '1.25rem' },
            paddingRight: { type: 'string', default: '1.25rem' },
            paddingBottom: { type: 'string', default: '1.25rem' },
            paddingLeft: { type: 'string', default: '1.25rem' },
        },
        save: ( { attributes } ) => {
            // oude save functie die alleen de basisstructuur van de card rendert zonder de nieuwe attributen
            const { 
                verticalAlignment,
                width,
                customBackgroundColor,
                backgroundColor,
                customTextColor,
                textColor,
                cardTitle,
                level,
                hasTitle
            } = props.attributes;
            
            const {
                className
            } = props
            
            const backgroundColorClass = backgroundColor ? getColorClassName( 'background-color', backgroundColor ) : undefined;
            const textColorClass = textColor ? getColorClassName( 'color', textColor ) : undefined;
            
            const TagName = 'h' + level;
            
            var wrapperClasses = classnames( className, {
                [ `card` ]: true,
            } );
            
            wrapperClasses = classnames(wrapperClasses, {
                'has-text-color': textColorClass,
                'has-background': backgroundColorClass,
                [ backgroundColorClass ]: backgroundColorClass,
                [ textColorClass ]: textColorClass,
            } );
            
            var style = {
                backgroundColor: backgroundColorClass ? undefined : customBackgroundColor,
                color: textColorClass ? undefined : customTextColor,
            };
        
            return (
                <div className={ wrapperClasses } style={ style }>
                    { hasTitle && (
                        <div class="card-header">
                            <TagName><RichText.Content value={ cardTitle } /></TagName>
                        </div>
                    ) }
                    <div class="card-body">
                        <InnerBlocks.Content />
                    </div>
                </div>
            );
        }
    }
    ],

    // migratie functie die wordt gebruikt om oude blocks bij te werken naar de nieuwe structuur en attributen, zodat ze blijven werken zonder dat gebruikers handmatig iets hoeven te doen
    migrations: [
        {
            migrate: (attributes) => {
                // migratie functie die de oude attributen omzet naar de nieuwe structuur en default waarden toevoegt als ze ontbreken
                return {
                    ...attributes,
                    hasMediaBleed: attributes.hasMediaBleed || false,
                    paddingTop: attributes.paddingTop || '1.25rem',
                    paddingRight: attributes.paddingRight || '1.25rem',
                    paddingBottom: attributes.paddingBottom || '1.25rem',
                    paddingLeft: attributes.paddingLeft || '1.25rem',
                };
            }
        }
    ]
});
