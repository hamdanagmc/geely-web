import { defineType } from "sanity";

export const orderServiceSection = defineType({
    name: "orderServiceSection",
    title: "Order Service Section",
    type: "object",
    fields: [
      {
        name: "orderService",
        title: "Order Service Information",
        type: "object",
        fields: [
          {
            name: "qrImage",
            title: "QR Code Image",
            type: "image",
            options: { hotspot: true },
            description:
              "Image for the QR code that links to the service order page.",
          },
          {
            name: "link",
            title: "Service Link",
            type: "url",
            description: "URL where users can order the service.",
          },
          {
            name: "instructions",
            title: "Instructions",
            type: "blockContent",
            description:
              "Instructions for ordering the service. Use newlines to separate steps.",
          },
        ],
      },
      {
        name: "contactDetails",
        title: "Contact Details",
        type: "object",
        fields: [
          {
            name: "website",
            title: "Website",
            type: "object",
            fields: [
              {
                name: "icon",
                title: "Website Icon",
                type: "image",
                options: { hotspot: true },
                description: "Icon image for the website.",
              },
              {
                name: "url",
                title: "Website URL",
                type: "url",
                description: "URL for the website.",
              },
              {
                name: "text",
                title: "Display Text",
                type: "string",
                description: "Text to display (e.g., 'www.morniksa.com').",
              },
            ],
          },
          {
            name: "phone",
            title: "Phone",
            type: "object",
            fields: [
              {
                name: "icon",
                title: "Phone Icon",
                type: "image",
                options: { hotspot: true },
                description: "Icon image for the phone number.",
              },
              {
                name: "tel",
                title: "Phone Number",
                type: "string",
                description: "Phone number to dial (e.g., '920003922').",
              },
              {
                name: "text",
                title: "Display Text",
                type: "string",
                description: "Text to display for the phone link.",
              },
            ],
          },
        ],
      },
      {
        name: "appDownloads",
        title: "App Downloads",
        type: "object",
        fields: [
          {
            name: "appleApp",
            title: "Apple App Store",
            type: "object",
            fields: [
              {
                name: "link",
                title: "App Store Link",
                type: "url",
                description: "Link to the Apple App Store page.",
              },
              {
                name: "image",
                title: "App Store Image",
                type: "image",
                options: { hotspot: true },
                description:
                  "Image (or banner) representing the Apple App Store download.",
              },
            ],
          },
          {
            name: "googlePlay",
            title: "Google Play Store",
            type: "object",
            fields: [
              {
                name: "link",
                title: "Google Play Link",
                type: "url",
                description: "Link to the Google Play Store page.",
              },
              {
                name: "image",
                title: "Google Play Image",
                type: "image",
                options: { hotspot: true },
                description:
                  "Image (or banner) representing the Google Play download.",
              },
            ],
          },
        ],
      },
    ],
    preview: {
      select: {
        serviceLink: "orderService.link",
      },
      prepare(selection) {
        const {  serviceLink } = selection;
        return {
          title: "Order Service Section",
          subtitle: serviceLink || "No Service Link",
        };
      },
    },
  });
  