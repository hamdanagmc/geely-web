import { defineField, defineType } from 'sanity';

export const fleetVehicleList = defineType({
    name: 'fleetVehicleList',
    title: 'Fleet Vehicle List section',
    type: 'object',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            description: 'The title of the vehicle list section',
        }),
        defineField({
            name: 'vehicles',
            title: 'Vehicles',
            type: 'array',
            of: [
                defineField({
                    name : 'vehicle',
                    type: 'object',
                    fields: [
                        defineField({
                            name: 'name',
                            title: 'Vehicle Name',
                            type: 'string',
                            description: 'The name of the vehicle',
                        }),
                        defineField({
                            name: 'image',
                            title: 'Image',
                            description:'image size should be 489x290 pixels',
                            type: 'customImage',
                        }),
                        defineField({
                            name: 'description',
                            title: 'Description',
                            type: 'text',
                            description: 'A brief description of the vehicle',
                        }),
                        defineField({
                            name: 'features',
                            title: 'Features',
                            type: 'array',
                            of: [
                                defineField({
                                    name : 'feature',
                                    type: 'object',
                                    fields: [
                                        defineField({
                                            name: 'icon',
                                            title: 'Feature Icon',
                                            type: 'customImage',
                                            description: 'Icon representing the feature and size shoube be 40x40 pixels',
                                        }),
                                        defineField({
                                            name: 'label',
                                            title: 'Feature Label',
                                            type: 'string',
                                            description: 'Label for the feature',
                                        }),
                                    ],
                                }),
                            ],
                        }),
                    ],
                }),
            ],
        }),
    ],
    preview: {
        select: {
            title: 'title',
            vehicleCount: 'vehicles.length',
        },
        prepare(selection) {
            const { title, vehicleCount } = selection;
            return {
                title: title,
                subtitle: `${vehicleCount || 0} vehicle(s)`,
            };
        },
    },
});