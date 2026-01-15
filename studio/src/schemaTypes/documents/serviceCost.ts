import { DocumentIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import { i18n } from "../../../language";

export const serviceCost = defineType({
  name: 'serviceCost',
  type: 'document',
  title: 'Service Cost',
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
      name: 'serviceCostTable',
      type: 'table',
      title: 'Service Cost Table'
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
      modelTitle: 'modelName.modelName',
      hasTrim: 'hasTrim',
      trimName: 'trimName',
    },
    prepare({ modelTitle, hasTrim, trimName }) {
      const displayTitle =
        hasTrim && trimName
          ? `${modelTitle || 'Unknown'} — ${trimName}`
          : modelTitle || 'No Model Selected';

      return {
        title: displayTitle,
        subtitle: 'Service Cost'
      };
    }
  }


})