import { DocumentIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import { i18n } from "../../../language";

export const sparePart = defineType({
  name: 'sparePart',
  type: 'document',
  title: 'Spare Parts',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'modelName',
      type: 'reference',
      title: 'Model Name',
      to: [{ type: 'models' }],
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'hasTrim',
      type: 'boolean',
      title: 'Has Trim?',
      initialValue: false,
    }),

    defineField({
      name: 'trimName',
      type: 'string',
      title: 'Trim Name',
      hidden: ({ parent }) => !parent?.hasTrim,
      validation: (Rule) =>
        Rule.custom((value: any, context: any) => {
          if (context.parent?.hasTrim && !value) {
            return "Trim name is required if 'Include Trim' is checked";
          }
          return true;
        }),
    }),
    defineField({
      name: 'sparePartTable',
      type: 'table',
      title: 'Spare Parts Table'
    }),
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      options: {
        list: i18n.languages.map((l) => l.id),
        layout: 'dropdown',
      },
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      modelTitle: 'modelName.modelName', // Adjust based on your 'models' schema field name
      hasTrim: 'hasTrim',
      trimName: 'trimName',
    },
    prepare({ modelTitle, hasTrim, trimName }) {
      const displayTitle = hasTrim && trimName 
        ? `${modelTitle || 'Unknown'} — ${trimName}`
        : modelTitle || 'No Model Selected';

      return {
        title: displayTitle,
        subtitle: 'Spare Parts'
      };
    }
  },
});