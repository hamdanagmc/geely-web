import { defineField, defineType } from "sanity";

export const vehiclePromoBanner = defineType({
    name: "vehiclePromoBanner",
    type: "object",
    title: "Vehicle Promo Banner",
    fields: [
        defineField({
            name: "backgroundImage",
            description: "Image size should be 1440x810 pixels",
            type: "customImage",
            title: "Background Image",
            options: { hotspot: true },
        }),
        defineField({
            name: "mobileImage",
            description: "Image size should be 480x720 pixels",
            type: "customImage",
            title: "Mobile Image",
            options: { hotspot: true },
        }),

        defineField({
            name: "vehicleName",
            type: "string",
            title: "Vehicle Name",
        }),

        defineField({
            name: "description",
            type: "string",
            title: "Description",
        }),

        defineField({
            name: "features",
            type: "array",
            title: "Vehicle Features",
            of: [
                {
                    type: "object",
                    fields: [
                        defineField({
                            name: "value",
                            type: "string",
                            title: "Value",
                        }),
                        defineField({
                            name: "label",
                            type: "string",
                            title: "Label",
                        }),
                    ],
                },
            ],
        }),

        defineField({
            name: "buttonText",
            type: "string",
            title: "Button Text",
        }),

        defineField({
            name: 'link',
            type: 'reference',
            title: 'Select Page',
            to: [{ type: 'page' }]
        }),
        defineField({
            name: 'buttonAlignment',
            type: 'string',
            title: 'Button Alignment',
            description: 'Choose where the button should be aligned.',
            options: {
                list: [
                    { title: 'Bottom (with Features)', value: 'bottom' },
                    { title: 'Center (below Description)', value: 'center' }
                ],
                layout: 'radio'
            },
            initialValue: 'bottom',
        }),
        defineField({
            name: 'showDarkOverlay',
            type: 'boolean',
            title: 'Show Dark Overlay',
            description: 'Enable this to add a dark transparent layer over the background image, making white text easier to read.',
            initialValue: false,
        }),
        defineField({
            name: 'paddingBottom',
            type: 'boolean',
            title: 'Add margin bottom outside the Banner',
            description: 'Enable this to add margin to the bottom of the banner.',
            initialValue: false,
        }),
        defineField({
            name: 'paddingTop',
            type: 'boolean',
            title: 'Add Top Padding inside the Banner',
            description: 'Enable this to add padding to the top of the banner.',
            initialValue: false,
        }),
    ],

    preview: {
        select: {
            title: "vehicleName",
            media: "backgroundImage.image",
        },
        prepare(selection) {
            const { title, media } = selection;

            return {
                title: title || "Vehicle Promo Banner",
                media,
            };
        },
    },
});