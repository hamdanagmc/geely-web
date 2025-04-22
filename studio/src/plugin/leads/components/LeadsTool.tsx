import { DownloadIcon, SearchIcon } from '@sanity/icons';
import { Button, Card, Container, Flex, Heading, Label, Select, Spinner, Stack, Text, ToastProvider } from '@sanity/ui';
import { useState } from 'react';
import { exportToExcel } from 'react-json-to-excel';
import { useListeningQuery } from 'sanity-plugin-utils';
import "../styles/lease.css";
import LeadsList from './leads-list';
import { FilterProps, getLeadFilters } from './util';
import 'bootstrap/dist/css/bootstrap.min.css';

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

  const [model, setModel] = useState('');
  const [location, setLocation] = useState('');
  const [landingPage, setLandingPage] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const q = `*[_type == 'lead'] | order(_createdAt desc)`;
  const [query, setQuery] = useState(q);
  const [fieldError, setFieldError] = useState('');

  const {
    data,
    loading,
    error
  } = useListeningQuery(query, {
    initialValue: [],
  });
  const leads = data as Lead[];

  if (loading) {
    return <LoadingView />;
  }

  if (error) {
    return <ErrorView />;
  }

  const handleClick = () => {
    let conditions = [];
    if (fromDate) {
      const fD = fromDate + "T00:00:00Z";
      conditions.push(`_createdAt >= "${fD}"`);
    }
    if (toDate) {
      const tD = toDate + "T23:59:59Z";
      conditions.push(`_createdAt <= "${tD}"`);
    }
    if (model) {
      conditions.push(`vehicleModel == "${model}"`);
    }
    if (location) {
      conditions.push(`location == "${location}"`);
    }
    if (landingPage) {
      conditions.push(`pageUrl match "${landingPage}*"`);
    }

    if (conditions.length > 0) {

      const whereClause = conditions.length > 0 ? ` && ${conditions.join(' && ')}` : '';
      const q = `*[_type == 'lead'${whereClause}] | order(_createdAt desc)`;

      setQuery(q);
      setFieldError('');
    } else {
      setFieldError('Please select at least one filter option.');
    }

  }


  const leadFilters = getLeadFilters(leads) as FilterProps;


  return (
    <ToastProvider>
      <Container className="mainContainer" style={{ marginTop: '60px', maxWidth: '100%', overflow: 'scroll' }}>
        <div className='headingContainer'>
          <Heading className='px-4 fs-3 text-center'>Geely Leads Dashboard</Heading>
          <Card className='exportCntr'>
            <Button
              fontSize={[1.5, 1.5, 2]}
              icon={DownloadIcon}
              padding={[4, 4, 4]}
              text="Export To Excel"
              tone="positive"
              className='btn btn-success exportToExcel'
              radius="full"
              onClick={() => exportToExcel(leads, 'GeelyLeads')}
            />
          </Card>
        </div>
        <Flex align="center" className='d-flex justify-content-center formFields gap-3'>

          <Card padding={2}>
            <Stack>
              <Select
                className={`form-control`}
                style={{maxWidth:'220px'}}
                value={model} onChange={e => setModel(e.currentTarget.value)}
              >
                <option value="" >Choose Model</option>
                {leadFilters.vehicleModels.map((model, index) => (
                  <option key={index} value={model}>{model}</option>
                ))}
              </Select>
            </Stack>
          </Card>
          <Card padding={2}>
            <Stack>
              <Select
                className={`form-control`}
                value={location} onChange={e => setLocation(e.currentTarget.value)}
              >
                <option value="" >Choose Location</option>
                {leadFilters.locations.map((location, index) => (
                  <option key={index} value={location}>{location}</option>
                ))}
              </Select>
            </Stack>
          </Card>
          <Card padding={2}>
            <Stack>
              <Select
                className={`form-control`}
                value={landingPage} onChange={e => setLandingPage(e.currentTarget.value)}
              >
                <option value="" >Choose Landing Page</option>
                {leadFilters.pageUrls.map((pageUrl, index) => (
                  <option key={index} value={pageUrl}>{pageUrl}</option>
                ))}
              </Select>
            </Stack>
          </Card>
          <Card>
            <Label size={4} >From Date : </Label>
          </Card>
          <Card>

            <input type='date'
              className={`form-control `}
              onChange={(event) =>
                setFromDate(event.currentTarget.value)
              }
              value={fromDate}
            />
          </Card>
          <Card>
            <Label size={4} >To Date : </Label>
          </Card>
          <Card>
            <input type='date'
              className={`form-control `}
              onChange={(event) =>
                setToDate(event.currentTarget.value)
              }
              value={toDate}
            />
          </Card>

          </Flex>

          <Flex align="center" className='d-flex submitBtn justify-content-center gap-3'>
          
          <Card>
            <Button
              fontSize={[1.5, 1.5, 2]}
              icon={SearchIcon}
              padding={[3, 3, 3]}
              text="Search"
              className='btn btn-primary'
              radius="full"
              onClick={handleClick}
            />
          </Card>
          <Card>
            <Button
              fontSize={[1.5, 1.5, 2]}
              text="Clear Filters"
              className='btn btn-secondary'
              radius="full"
              onClick={() => {
                setModel('');
                setLocation('');
                setLandingPage('');
                setFromDate('');
                setToDate('');
                setQuery(q);
                setFieldError('');
              }}
            />
          </Card>
        </Flex>
        {fieldError && <p className="text-center formError mt-4 mb-0 text-red">{fieldError}</p>}
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