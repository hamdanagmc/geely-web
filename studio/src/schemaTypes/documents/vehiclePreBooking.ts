import { defineField, defineType } from 'sanity';
import { ComposeIcon } from '@sanity/icons';

export const vehiclePreBooking = defineType({
  name: 'vehiclePreBooking',
  title: 'Vehicle Pre-Booking',
  type: 'document',
  icon: ComposeIcon,
  fields: [
    defineField({
      name: 'fullName',
      title: 'Full Name',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'email',
      title: 'Email Address',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'mobile',
      title: 'Mobile Number',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'orderReference',
      title: 'Order Reference',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'ngeniusOrderReference',
      title: 'nGenius Order Reference',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'paymentId',
      title: 'Payment ID',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'amount',
      title: 'Amount Paid',
      type: 'number',
      readOnly: true,
    }),
    defineField({
      name: 'currency',
      title: 'Currency',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'paymentStatus',
      title: 'Payment Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Successful', value: 'successful' },
          { title: 'Failed', value: 'failed' },
        ],
      },
      readOnly: true,
    }),
    defineField({
      name: 'transactionDate',
      title: 'Transaction Date',
      type: 'datetime',
      readOnly: true,
    }),
    defineField({
      name: 'pageUrl',
      title: 'Page URL',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'lastReconciledAt',
      title: 'Last Reconciled At',
      type: 'datetime',
      readOnly: true,
      description: 'Timestamp of the last reconciliation cron check for this booking.',
    }),
    defineField({
      name: 'reconciliationRunId',
      title: 'Reconciliation Run ID',
      type: 'string',
      readOnly: true,
      description: 'Workflow run id that processed this booking (for idempotency/audit).',
    }),
    defineField({
      name: 'reconciliationNote',
      title: 'Reconciliation Note',
      type: 'string',
      readOnly: true,
      description: 'Set by the reconciliation cron (e.g. "reconciliation_timeout") for audit purposes.',
    }),
  ],
  preview: {
    select: {
      title: 'fullName',
      subtitle: 'location',
    },
  },
});
