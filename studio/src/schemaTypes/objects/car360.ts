// schemas/pageBuilderComponents/car360Block.js
import { defineType, defineField, defineArrayMember } from 'sanity';

export default defineType({
  name: 'car360',
  type: 'object',
  title: 'Car 360 View Block',
  fields: [
    defineField({
      name: 'selectedCar', // Single reference to car document
      type: 'reference',
      title: 'Select Vehicle',
      to: [{ type: 'vehicle' }], // Reference to 'vehicle' document
      validation: (Rule) => Rule.required(), // Make sure a vehicle is selected
    }),
    defineField({
      name: 'heading',
      type: 'string',
      title: 'Heading',
    }),
    defineField({
      name: 'subHeading',
      type: 'string',
      title: 'Subheading',
    }),
    defineField({
      name: 'exteriorLabel',
      type: 'string',
      title: 'Exterior tab title',
    }),
    defineField({
      name: 'interiorLabel',
      type: 'string',
      title: 'Interior tab title',
    }),
    defineField({
      name: 'specificationTitle',
      type: 'string',
      title: 'Specification title',
    }),
    defineField({
      name: 'specificationSubTitle',
      type: 'string',
      title: 'Specification Sub title',
    }),
    defineField({
      name: 'specList',
      type: 'array',
      title: 'Specification List',
      of: [
        defineArrayMember(
          {
            name: 'spec',
            type: 'object',
            title: 'Specification Item',
            fields: [
              defineField({
                name: 'label',
                type: 'string',
                title: 'Label',
              }),
              defineField({
                name: 'unit',
                type: 'string',
                title: 'Unit',
              }),
              defineField({
                name: 'value',
                type: 'string',
                title: 'Value',
              }),
            ]
          }
        ),
      ]
    }),
    defineField({
      name: 'htmlId',
      type: 'string',
      title: 'ID Attribute',
      description: 'Unique identifier for the banner component',
    }),
  ],
  preview: {
    select: {
      title: 'selectedCar.name',
    },
    prepare(selection) {
      const { title } = selection;
      return {
        title: `Car 360 ${title}` || 'Car 360',

      };
    },
  }
});