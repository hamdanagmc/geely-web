import { Heading, Stack } from "@sanity/ui";
import styles from "../styles/leads-list.module.css";
import { Lead } from "./LeadsTool";


interface LeadsListProps {
  leads: Lead[];
}


export default function LeadsList({ leads }: LeadsListProps) {
  return (
    

      <LeadsTable leads={leads} />

  );
}

// Define the LeadsTable component
function LeadsTable({ leads }: LeadsListProps) {
  return (
    <Stack >
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
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Do you wish to stop receiving marketing communications from Geely?</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {leads?.map((lead, index) => {
                const {
                  name,
                  email,
                  phone,
                  stopMarketing,
                  _createdAt,
                } = lead;

               
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{name || "N/A"}</td>
                    <td>{email || "N/A"}</td>
                    <td>{phone || "N/A"}</td>
                    <td>{stopMarketing || "N/A"}</td>
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
