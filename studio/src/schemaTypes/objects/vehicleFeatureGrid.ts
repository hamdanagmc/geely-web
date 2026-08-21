import { defineField, defineType } from "sanity";

export const vehicleFeatureGrid = defineType({
  name: "vehicleFeatureGrid",
  type: "object",
  title: "Vehicle Feature Grid",
  fields: [
    defineField({
      name: "features",
      type: "array",
      title: "Features",
      of: [
        {
          type: "object",
          name: "feature",
          title: "Feature",
          fields: [
            defineField({
              name: "image",
              type: "customImage",
              title: "Image",
              description: "Recommended image size: 800x600 pixels",
              options: {
                hotspot: true,
              },
            }),

            defineField({
              name: "title",
              type: "string",
              title: "Title",
            }),

            defineField({
              name: "description",
              type: "text",
              title: "Description",
              rows: 3,
            }),
          ],

          preview: {
            select: {
              title: "title",
              media: "image.image",
            },
            prepare(selection) {
              const { title, media } = selection;

              return {
                title: title || "Vehicle Feature",
                media,
              };
            },
          },
        },
      ],
    }),
  ],

  preview: {
    select: {
      features: "features",
    },
    prepare({ features }) {
      return {
        title: "Vehicle Feature Grid",
        subtitle: `${features?.length || 0} features`,
      };
    },
  },
});