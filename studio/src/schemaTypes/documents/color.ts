// carColor.ts (Sanity Schema)
export default {
    name: 'color',
    type: 'document',
    title: 'Car Color',
    fields: [
      {
        name: 'name',
        type: 'string',
        title: 'Color Name',
        description: 'The common name of the color (e.g., "Midnight Blue", "Candy Apple Red")',
        validation: (Rule: { required: () => any; }) => Rule.required(), // Make the name required
      },
      {
        name: 'hexCode',
        type: 'string',
        title: 'Hex Code',
        description: 'The hexadecimal color code (e.g., "#000080" for navy blue)',
        validation: (Rule: { required: () => { (): any; new(): any; regex: { (arg0: RegExp, arg1: { name: string; invert: boolean; message: string; }): any; new(): any; }; }; }) =>
          Rule.required().regex(/^#([0-9A-Fa-f]{3}){1,2}$/, {
            name: 'hexCode',
            invert: false,
            message: 'Hex code must be a valid hexadecimal color code (e.g., "#000080")',
          }), // Validate hex code format
      },
      {
        name: 'swatch',
        type: 'image',
        title: 'Color Swatch',
        description: 'A visual representation of the color',
        options: {
          hotspot: true, // Allow for cropping/focal point
        },
      },
      {
        name: 'slug',
        type: 'slug',
        title: 'Slug',
        description: 'Used for URLs. Auto-generated from the color name.',
        options: {
          source: 'name',
          maxLength: 96,
        },
      },
    ],
    preview: {
      select: {
        title: 'name',
        subtitle: 'hexCode',
        media: 'swatch',
      },
    },
  };