import { Card, Container, Flex, Spinner, Stack, Text, ToastProvider } from '@sanity/ui';
import { useListeningQuery } from 'sanity-plugin-utils';
import "../styles/lease.css";
import LeadsList from './leads-list';

 export type Lead = {
  _id: string;
  _type: "lead";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  title?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  fleetSize?: string;
  companyName?: string;
  comments?: string;
  formType?: string;
  vehicleMake?: string;
  vehicleModel?: string;
  location?: string;
  modelYear?: number;
  serviceCenter?: string;
  type?: string;
  contactYou?: string;
  pageUrl?: string;
};

export default function LeadsTool() {

  const query = `*[_type == 'lead'] | order(_createdAt desc)`

  const {
    data,
    loading,
    error
  } = useListeningQuery(query, {
    initialValue: [],
  });
  console.log("data", data);
  const leads = data as Lead[];


  if (loading) return <LoadingView />
  if (error) return <ErrorView />


  return (
    <ToastProvider>
      <Container className="mainContainer" style={{ marginTop: '60px', maxWidth: '100%', overflow : 'scroll' }}>

        <LeadsList
          leads={leads}
        />
      </Container>
    </ToastProvider>
  )
}

function LoadingView() {
  return (
    <Container style={{ marginTop: '60px' }}>
      <Card
        padding={4}
        radius={2}
        shadow={1}
        tone="positive"
      >
        <Flex
          gap={4}
          align="center"
          justify="center"
        >
          <Text
            align="center"
            size={3}
          >
            Loading Leads
          </Text>
          <Spinner muted />
        </Flex>
      </Card>
    </Container>
  )
}

function ErrorView() {
  return (
    <Container style={{ marginTop: '60px' }}>
      <Card
        padding={4}
        radius={2}
        shadow={1}
        tone="critical"
      >
        <Stack space={2}>
          <Text
            align="center"
            size={3}
          >
            Error Loading Leads
          </Text>
          <Text
            align="center"
            size={2}
          >
            Please try again later
          </Text>
        </Stack>
      </Card>
    </Container>
  )
}