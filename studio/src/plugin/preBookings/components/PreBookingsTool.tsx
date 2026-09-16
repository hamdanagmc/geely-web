import React, { useState, useEffect } from 'react';
import { useClient } from 'sanity';
import { 
  ThemeProvider, 
  studioTheme, 
  Box, 
  Card, 
  Container, 
  Heading, 
  Stack, 
  Text, 
  TextInput, 
  Select, 
  Button,
  Flex
} from '@sanity/ui';

interface PreBooking {
  _id: string;
  _createdAt: string;
  fullName: string;
  email: string;
  mobile: string;
  location: string;
  orderReference: string;
  paymentId: string;
  amount: number;
  currency: string;
  paymentStatus: string;
  transactionDate: string;
}

const formatTransactionDate = (dateString: string) => {
  if (!dateString || typeof dateString !== 'string') return '';
  
  // new Date() naturally parses ISO strings (e.g. "2026-08-19T10:30:29.123Z")
  const d = new Date(dateString);
  
  // Validate that it resulted in a valid date
  if (isNaN(d.getTime())) return '';
  
  const pad = (n: number) => n.toString().padStart(2, '0');
  
  const day = pad(d.getDate());
  const month = pad(d.getMonth() + 1);
  const year = d.getFullYear();
  
  let hours = d.getHours();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const hoursStr = pad(hours);
  const minutes = pad(d.getMinutes());
  const seconds = pad(d.getSeconds());
  
  return `${day}/${month}/${year} ${hoursStr}:${minutes}:${seconds} ${ampm}`;
};

const PreBookingsTool = () => {
  const client = useClient({ apiVersion: '2023-01-01' });
  
  const [data, setData] = useState<PreBooking[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filtering and Sorting state
  const [statusFilter, setStatusFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('');
  const [locationOptions, setLocationOptions] = useState<string[]>([]);
  const [sortField, setSortField] = useState<'_createdAt' | 'transactionDate' | 'fullName' | 'paymentStatus'>('_createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchData();
  }, [statusFilter, locationFilter, sortField, sortOrder]);

  // Fetch unique locations once on mount
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const locs: Array<string> = await client.fetch(`*[_type == "vehiclePreBooking" && defined(location)].location`);
        const unique = Array.from(new Set(locs.filter(Boolean)));
        setLocationOptions(unique);
      } catch (err) {
        console.error('Failed to fetch locations for filter:', err);
      }
    };
    fetchLocations();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      let query = `*[_type == "vehiclePreBooking"`;
      
      if (statusFilter !== 'all') {
        query += ` && paymentStatus == "${statusFilter}"`;
      }
      if (locationFilter) {
        query += ` && location == "${locationFilter}"`;
      }
      
      query += `] | order(${sortField} ${sortOrder})`;

      const result = await client.fetch(query);
      setData(result);
    } catch (error) {
      console.error('Error fetching pre-bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (data.length === 0) return;
    
    const headers = [
      'ID', 'Full Name', 'Email', 'Mobile', 'Location', 
      'Order Reference', 'Payment ID', 'Amount', 'Currency', 
      'Status', 'Date'
    ];
    
    const csvRows = [headers.join(',')];
    
    data.forEach(booking => {
      const row = [
        booking._id,
        `"${booking.fullName || ''}"`,
        `"${booking.email || ''}"`,
        `"${booking.mobile || ''}"`,
        `"${booking.location || ''}"`,
        `"${booking.orderReference || ''}"`,
        `"${booking.paymentId || ''}"`,
        booking.amount,
        booking.currency,
        booking.paymentStatus,
        formatTransactionDate(booking.transactionDate)
      ];
      csvRows.push(row.join(','));
    });
    
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `pre-bookings_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Pagination logic
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const paginatedData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <ThemeProvider theme={studioTheme}>
      <Container width={3} padding={4}>
        <Stack space={4}>
          <Flex align="center" justify="space-between">
            <Heading as="h1">Vehicle Pre-Bookings</Heading>
            <Button onClick={exportToCSV} text="Export to CSV" tone="primary" />
          </Flex>
          
          <Card padding={4} radius={2} shadow={1}>
            <Stack space={4}>
              {/* Filters & Sorting */}
              <Flex gap={3} align="flex-end">
                <Box flex={1}>
                  <Text size={1} weight="semibold" style={{marginBottom: '8px'}}>Filter by Status</Text>
                  <Select onChange={(e) => setStatusFilter(e.currentTarget.value)} value={statusFilter}>
                    <option value="all">All</option>
                    <option value="successful">Successful</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                  </Select>
                </Box>
                <Box flex={1}>
                  <Text size={1} weight="semibold" style={{marginBottom: '8px'}}>Filter by Location</Text>
                  <Select onChange={(e) => setLocationFilter(e.currentTarget.value)} value={locationFilter}>
                    <option value="">All Locations</option>
                    {locationOptions.map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </Select>
                </Box>
                <Box flex={1}>
                  <Text size={1} weight="semibold" style={{marginBottom: '8px'}}>Sort By</Text>
                  <Select onChange={(e) => setSortField(e.currentTarget.value as any)} value={sortField}>
                    <option value="_createdAt">Date</option>
                    <option value="fullName">Customer Name</option>
                    <option value="paymentStatus">Status</option>
                  </Select>
                </Box>
                <Box flex={1}>
                  <Text size={1} weight="semibold" style={{marginBottom: '8px'}}>Sort Order</Text>
                  <Select onChange={(e) => setSortOrder(e.currentTarget.value as any)} value={sortOrder}>
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                  </Select>
                </Box>
              </Flex>

              {/* Data Table */}
              <Box style={{overflowX: 'auto'}}>
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #eaeaea' }}>
                      <th style={{ padding: '12px 8px' }}><Text size={1} weight="semibold">Date</Text></th>
                      <th style={{ padding: '12px 8px' }}><Text size={1} weight="semibold">Customer</Text></th>
                      <th style={{ padding: '12px 8px' }}><Text size={1} weight="semibold">Mobile</Text></th>
                      <th style={{ padding: '12px 8px' }}><Text size={1} weight="semibold">Location</Text></th>
                      <th style={{ padding: '12px 8px' }}><Text size={1} weight="semibold">Order Ref</Text></th>
                      <th style={{ padding: '12px 8px' }}><Text size={1} weight="semibold">Amount</Text></th>
                      <th style={{ padding: '12px 8px' }}><Text size={1} weight="semibold">Status</Text></th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={7} style={{ padding: '20px', textAlign: 'center' }}><Text>Loading...</Text></td></tr>
                    ) : paginatedData.length === 0 ? (
                      <tr><td colSpan={7} style={{ padding: '20px', textAlign: 'center' }}><Text>No records found.</Text></td></tr>
                    ) : (
                      paginatedData.map((item) => (
                        <tr key={item._id} style={{ borderBottom: '1px solid #eaeaea' }}>
                          <td style={{ padding: '12px 8px' }}><Text size={1}>{formatTransactionDate(item._createdAt) || 'N/A'}</Text></td>
                          <td style={{ padding: '12px 8px' }}><Text size={1}>{item.fullName}<br/><span style={{fontSize: '0.85em', color: '#666'}}>{item.email}</span></Text></td>
                          <td style={{ padding: '12px 8px' }}><Text size={1}>{item.mobile}</Text></td>
                          <td style={{ padding: '12px 8px' }}><Text size={1}>{item.location}</Text></td>
                          <td style={{ padding: '12px 8px' }}><Text size={1}>{item.orderReference}</Text></td>
                          <td style={{ padding: '12px 8px' }}><Text size={1}>{item.amount} {item.currency}</Text></td>
                          <td style={{ padding: '12px 8px' }}>
                            <Box 
                              padding={2} 
                              style={{ 
                                backgroundColor: item.paymentStatus === 'successful' ? '#e6f4ea' : item.paymentStatus === 'failed' ? '#fce8e6' : '#fef7e0',
                                color: item.paymentStatus === 'successful' ? '#137333' : item.paymentStatus === 'failed' ? '#c5221f' : '#b08d00',
                                borderRadius: '4px',
                                display: 'inline-block'
                              }}
                            >
                              <Text size={1} weight="semibold" style={{textTransform: 'capitalize'}}>{item.paymentStatus}</Text>
                            </Box>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </Box>

              {/* Pagination Controls */}
              {!loading && data.length > 0 && (
                <Flex align="center" justify="space-between" paddingY={3}>
                  <Text size={1}>Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, data.length)} of {data.length}</Text>
                  <Flex gap={2}>
                    <Button 
                      mode="ghost" 
                      text="Previous" 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    />
                    <Button 
                      mode="ghost" 
                      text="Next" 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    />
                  </Flex>
                </Flex>
              )}
            </Stack>
          </Card>
        </Stack>
      </Container>
    </ThemeProvider>
  );
};

export default PreBookingsTool;
