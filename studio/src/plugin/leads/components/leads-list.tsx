import React from "react";
import { Stack, Flex, Heading, Container, Card, Button } from "@sanity/ui";
import styles from "../styles/leads-list.module.css";
import { Lead } from "./LeadsTool";
import { DownloadIcon } from "@sanity/icons";
import { exportToExcel } from 'react-json-to-excel';

interface LeadsListProps {
  leads: Lead[];
}

export default function LeadsList({ leads }: LeadsListProps) {
  return (
    <Container className={styles.mainContainer} style={{ marginTop: "60px" }}>
      <Flex align="center" justify="space-between">
        <Heading>Geely Leads Dashboard</Heading>
        <Card>
            <Button
              fontSize={[1.5, 1.5, 2]}
              icon={DownloadIcon}
              padding={[4, 4, 4]}
              text="Export To Excel"
              tone="positive"
              className='btn btn-success'
              radius="full"
              onClick={() => exportToExcel(leads, 'GeelyLeads')}
            />
          </Card>
      </Flex>
      <LeadsTable leads={leads} />
    </Container>
  );
}

// Define the LeadsTable component
function LeadsTable({ leads }: LeadsListProps) {
  console.log(leads);
  return (
    <Stack space={3} padding={[3]}>
      {leads?.length === 0 ? (
        <Heading style={{ padding: "20px", fontSize: "14px" }}>
          You have no leads
        </Heading>
      ) : (
        <div className="table-responsive">
          <table
            className={`${styles.mainTable} table table-bordered table-striped`}
          >
            <thead>
              <tr>
                <th>Sno</th>
                <th>Form Type</th>
                <th>Title</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Fleet Size</th>
                <th>Company Name</th>
                <th>Vehicle Make</th>
                <th>Vehicle Model</th>
                <th>Location</th>
                <th>Model Year</th>
                <th>Service Center</th>
                <th>Type</th>
                <th>Do You want us to contact you</th>
                <th>Page URL</th>
                <th>Comments</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {leads?.map((lead, index) => {
                const {
                  title,
                  firstName,
                  lastName,
                  email,
                  phone,
                  fleetSize,
                  companyName,
                  comments,
                  formType,
                  vehicleMake,
                  vehicleModel,
                  location,
                  modelYear,
                  serviceCenter,
                  type,
                  contactYou,
                  pageUrl,
                  _createdAt,
                } = lead;
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{formType || "N/A"}</td>
                    <td>{title || "N/A"}</td>
                    <td>{firstName || "N/A"}</td>
                    <td>{lastName || "N/A"}</td>
                    <td>{email || "N/A"}</td>
                    <td>{phone || "N/A"}</td>
                    <td>{fleetSize || "N/A"}</td>
                    <td>{companyName || "N/A"}</td>
                    <td>{vehicleMake || "N/A"}</td>
                    <td>{vehicleModel || "N/A"}</td>
                    <td>{location || "N/A"}</td>
                    <td>{modelYear || "N/A"}</td>
                    <td>{serviceCenter || "N/A"}</td>
                    <td>{type || "N/A"}</td>
                    <td>{contactYou || "N/A"}</td>
                    <td>{pageUrl || "N/A"}</td>
                    <td>{comments || "N/A"}</td>
                    <td>{new Date(_createdAt).toLocaleString() || "N/A"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Stack>
  );
}
