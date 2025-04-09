import { defineField, defineType } from "sanity";

export const geelyNetwork = defineType({
    name: 'geelyNetwork',
    type: 'document',
    title: 'Geely Network',
    fields: [
        defineField({
            name: "title",
            title: "Showroom Title",
            type: "string",
            readOnly: true,
            deprecated: { reason: 'Use the locale field instead. This field will be removed in future versions.' }
        }),
        defineField({
            name: "titleLocale",
            title: "Showroom Title (Localized)",
            type: "localeString",
        }),
        defineField({
            name: "mapImage",
            title: "Map Image",
            description:"image size should be 1200x800 pixels",
            type: "image",
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: "googleMapsLink",
            title: "Google Maps Link",
            type: "url",
        }),
        defineField({
            name: "addresslabel",
            title: "Address Label",
            type: "string",
            readOnly: true,
            deprecated: { reason: 'Use the locale field instead. This field will be removed in future versions.' }
        }),
        defineField({
            name: "addresslabelLocale",
            title: "Address Label (Localized)",
            type: "localeString",
        }),
        defineField({
            name: "addressicon",
            title: "Address Icon",
            type: "customImage",
        }),
        defineField({
            name: "addressField",
            title: "Address",
            type: "blockContent",
            readOnly: true,
            deprecated: { reason: 'Use the locale field instead. This field will be removed in future versions.' }
        }),
        defineField({
            name: "addressFieldLocale",
            title: "Address (Localized)",
            type: "localeBlockContent",
        }),
        defineField({
            name: "showroomTimingsLabel",
            title: "Showroom Timings Label",
            type: "string",
            readOnly: true,
            deprecated: { reason: 'Use the locale field instead. This field will be removed in future versions.' }
        }),
        defineField({
            name: "showroomTimingsLabelLocale",
            title: "Showroom Timings Label (Localized)",
            type: "localeString",
        }),
        defineField({
            name: "showroomTimingsIcon",
            title: "Showroom Timings Icon",
            type: "customImage",
        }),
        defineField({
            name: "showroomTimings",
            title: "Showroom Timings",
            type: "blockContent",
            readOnly: true,
            deprecated: { reason: 'Use the locale field instead. This field will be removed in future versions.' }
        }),
        defineField({
            name: "showroomTimingsLocale",
            title: "Showroom Timings (Localized)",
            type: "localeBlockContent",
        }),
    ],
    preview: {
        select: {
            title: "title",
            subtitle: "location",
            media: "mapImage",
        },
        prepare(selection) {
            const { title, subtitle, media } = selection;
            return {
                title: title,
                subtitle: subtitle ? `📍 ${subtitle}` : "No location provided",
                media: media || undefined,
            };
        },
    },
});