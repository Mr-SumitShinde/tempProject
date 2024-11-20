import { useEffect, useState } from 'react';

const YourComponent = ({ caseDetailsData }) => {
  const [clientDetails, setClientDetails] = useState({});
  const [caseStatus, setCaseStatus] = useState('');
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    setLoading(true); // Start loading
    setError(null); // Reset error state

    try {
      const cdTempData = caseDetailsData?.data?.attributes?.caseDetails;

      if (cdTempData) {
        setCaseStatus(cdTempData['status']);

        const cdata = {
          'Client name': `${cdTempData['firstName']} ${cdTempData['lastName']}` || '',
          'Date of birth': cdTempData['dateOfBirth'] || '',
          'Country of residence': cdTempData['countryOfResidence'] || '',
          'Email address': cdTempData['mail'] || '',
          'Client reference No.': cdTempData['customerReferenceId'] || '',
          'Request No.': cdTempData['caseId'] || '',
          Status: cdTempData['status'] || '',
          'Internal notes': cdTempData['notes'] || '',
        };

        setClientDetails(cdata);
      } else {
        throw new Error('Case details data is missing or incomplete.');
      }
    } catch (err) {
      setError(err.message); // Set error message
    } finally {
      setLoading(false); // Stop loading
    }
  }, [caseDetailsData]);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>Error: {error}</p> // Display error message
      ) : (
        <div>
          <h1>Case Status: {caseStatus}</h1>
          {/* Render clientDetails */}
          <pre>{JSON.stringify(clientDetails, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default YourComponent;