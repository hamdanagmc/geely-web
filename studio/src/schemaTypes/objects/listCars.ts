import { defineType, defineField } from "sanity";

export default defineType({
  name: "listCars",
  type: "object",
  title: "List Cars",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
    }),
    defineField({
      name: "cars",
      type: "array",
      title: "Cars",
      of: [
        defineField({
          name: "carItem",
          type: "object",
          title: "Car Item",
          fields: [
            defineField({
              name: "carTitle",
              type: "string",
              title: "Car Title",
            }),
            defineField({
              name: "carImage",
              type: "customImage",
              description: "image size should be 278x138 pixels",
              title: "Car Image",
              validation: (rule) => rule.required().error("Please select Car Image"),
            }),
            defineField({
              name: "exploreLink",
              type: "object",
              title: "Explore Link",
              fields: [
                defineField({
                  name: "text",
                  type: "string",
                  title: "Link Text",
                }),
                defineField({
                  name: "link",
                  type: "reference",
                  title: "Select Car Detail Page",
                  to: [{ type: "car" }],
                  validation: (rule) => rule.required().error("Please select Car"),
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  ],
});
