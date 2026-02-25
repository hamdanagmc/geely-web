import { definePlugin } from 'sanity';
import LeadsTool from './components/LeadsTool';

const leadsTool = () => {
  return {
    title: 'Promo Leads',
    name: 'promoLeads',
    component: () => (
      LeadsTool()
    ),
  }
}

export const promoLeadPlugin = definePlugin({
  name: 'promoLeadPlugin',
  
  tools: [ 
    leadsTool() 
  ],
});
