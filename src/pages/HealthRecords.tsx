import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, Tabs, Tab, Divider, Chip, Button, CircularProgress, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';
import MedicationIcon from '@mui/icons-material/Medication';
import ScienceIcon from '@mui/icons-material/Science';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DownloadIcon from '@mui/icons-material/Download';
import { abdmApi, ekaCareApi } from '../lib/api';

// Styled components
const RecordPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[3],
  },
}));

const RecordTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 500,
  marginBottom: theme.spacing(1),
}));

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// Tab Panel component
const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`health-tabpanel-${index}`}
      aria-labelledby={`health-tab-${index}`}
      {...other}
      style={{ paddingTop: 20 }}
    >
      {value === index && children}
    </div>
  );
};

const a11yProps = (index: number) => {
  return {
    id: `health-tab-${index}`,
    'aria-controls': `health-tabpanel-${index}`,
  };
};

const HealthRecordsPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [healthRecords, setHealthRecords] = useState<any[]>([]);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [consultations, setConsultations] = useState<any[]>([]);

  useEffect(() => {
    loadHealthData();
  }, []);

  const loadHealthData = async () => {
    try {
      setLoading(true);
      // Get user ABHA ID
      const userId = localStorage.getItem('userId') || '1';
      const ekaCareId = `eka-${userId}`;
      
      // Get all health records from ekaCare API
      const records = await ekaCareApi.getHealthRecords(ekaCareId);
      
      // Get prescriptions
      const ekaPrescriptions = await ekaCareApi.getEkaPrescriptions(ekaCareId);
      
      // Get lab reports
      const labReports = await ekaCareApi.getLabReports(ekaCareId);
      
      // Get consultation history
      const consultationHistory = await ekaCareApi.getConsultationHistory(ekaCareId);
      
      setHealthRecords(Array.isArray(records) ? records : []);
      setPrescriptions(Array.isArray(ekaPrescriptions) ? ekaPrescriptions : []);
      
      // Set lab reports using the dedicated API
      setReports(Array.isArray(labReports) ? labReports.map(lab => ({
        id: lab.id,
        recordType: 'labReport' as const,
        facilityName: lab.labName,
        date: lab.date,
        description: lab.testName,
        attachmentUrl: lab.attachmentUrl,
        additionalData: {
          parameters: lab.parameters,
          doctorName: lab.doctorName,
          notes: lab.notes
        }
      })) : []);
      
      // Set consultations using dedicated API and add general health records
      const consultationRecords = Array.isArray(consultationHistory) ? consultationHistory.map(cons => ({
        id: cons.id,
        recordType: 'consultation' as const,
        doctorName: cons.doctorName,
        facilityName: cons.facilityName,
        date: cons.date,
        description: cons.diagnosis || 'Consultation',
        attachmentUrl: cons.attachmentUrl,
        additionalData: {
          recommendations: cons.recommendations,
          notes: cons.notes,
          followupDate: cons.followupDate,
          specialization: cons.specialization
        }
      })) : [];
      
      // Include wellness, diagnosis and treatment records
      const otherRecords = Array.isArray(records) ? records.filter(record => 
        ['wellness', 'diagnosis', 'treatment'].includes(record.recordType)
      ) : [];
      
      setConsultations([...consultationRecords, ...otherRecords]);
      
      setLoading(false);
    } catch (error) {
      console.error("Error loading health records:", error);
      setError('Failed to load health records. Please try again later.');
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getRecordIcon = (recordType: string) => {
    switch (recordType) {
      case 'prescription':
        return <MedicationIcon color="primary" />;
      case 'labReport':
        return <ScienceIcon color="secondary" />;
      case 'wellness':
        return <MedicalInformationIcon sx={{ color: 'success.main' }} />;
      default:
        return <MedicalInformationIcon color="action" />;
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <Box sx={{ py: 4, px: { xs: 2, sm: 4 } }}>
      <Typography variant="h4" gutterBottom>
        Health Records
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        View and manage your health records from ekaCare and ABDM integration.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          aria-label="health records tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab 
            label="All Records" 
            icon={<MedicalInformationIcon />} 
            iconPosition="start" 
            {...a11yProps(0)} 
          />
          <Tab 
            label="Prescriptions" 
            icon={<MedicationIcon />} 
            iconPosition="start" 
            {...a11yProps(1)} 
          />
          <Tab 
            label="Lab Reports" 
            icon={<ScienceIcon />} 
            iconPosition="start" 
            {...a11yProps(2)} 
          />
          <Tab 
            label="Consultations" 
            icon={<MedicalInformationIcon />} 
            iconPosition="start" 
            {...a11yProps(3)} 
          />
        </Tabs>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TabPanel value={tabValue} index={0}>
            {healthRecords.length > 0 ? (
              <Grid container spacing={3}>
                {healthRecords.map((record, index) => (
                  <Grid item xs={12} md={6} key={record.id || index}>
                    <RecordPaper elevation={1}>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                        <Box display="flex" alignItems="center" mb={1}>
                          {getRecordIcon(record.recordType)}
                          <RecordTitle variant="h6" sx={{ ml: 1 }}>
                            {record.recordType === 'prescription' ? 'Prescription' : 
                            record.recordType === 'labReport' ? 'Lab Report' : 
                            record.recordType === 'wellness' ? 'Wellness Record' :
                            record.recordType === 'diagnosis' ? 'Diagnosis' :
                            record.recordType === 'treatment' ? 'Treatment' : 'Health Record'}
                          </RecordTitle>
                        </Box>
                        <Chip 
                          label={formatDate(record.date)} 
                          size="small" 
                          color="primary" 
                          variant="outlined" 
                        />
                      </Box>
                      
                      <Typography variant="body1">
                        {record.description}
                      </Typography>
                      
                      <Box mt={2}>
                        {record.doctorName && (
                          <Typography variant="body2" color="text.secondary">
                            Doctor: {record.doctorName}
                          </Typography>
                        )}
                        {record.facilityName && (
                          <Typography variant="body2" color="text.secondary">
                            Facility: {record.facilityName}
                          </Typography>
                        )}
                      </Box>
                      
                      {record.attachmentUrl && (
                        <Box mt={2}>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<PictureAsPdfIcon />}
                            href={record.attachmentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View Document
                          </Button>
                        </Box>
                      )}
                    </RecordPaper>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box textAlign="center" p={4}>
                <Typography variant="body1" color="text.secondary">
                  No health records found. Records will appear here after your first consultation or when you link your ABHA ID.
                </Typography>
              </Box>
            )}
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            {prescriptions.length > 0 ? (
              <Grid container spacing={3}>
                {prescriptions.map((prescription, index) => (
                  <Grid item xs={12} md={6} key={prescription.id || index}>
                    <RecordPaper elevation={1}>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                        <RecordTitle variant="h6">
                          Prescription
                        </RecordTitle>
                        <Chip 
                          label={formatDate(prescription.date)} 
                          size="small" 
                          color="primary" 
                          variant="outlined" 
                        />
                      </Box>
                      
                      {prescription.isDigitallySigned && (
                        <Chip 
                          label="Digitally Signed" 
                          size="small" 
                          color="success" 
                          sx={{ mb: 2 }} 
                        />
                      )}
                      
                      <Divider sx={{ my: 2 }} />
                      
                      {prescription.medications && prescription.medications.length > 0 && (
                        <Box mb={2}>
                          <Typography variant="subtitle1" fontWeight="500">
                            Medications
                          </Typography>
                          {prescription.medications.map((med: any, i: number) => (
                            <Box key={i} mt={1}>
                              <Typography variant="body1">{med.name}</Typography>
                              <Typography variant="body2" color="text.secondary">
                                {med.dosage}, {med.frequency}, {med.duration} 
                                {med.notes && ` • ${med.notes}`}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      )}
                      
                      {prescription.therapy && prescription.therapy.length > 0 && (
                        <Box mb={2}>
                          <Typography variant="subtitle1" fontWeight="500">
                            Sound Therapy
                          </Typography>
                          {prescription.therapy.map((therapy: any, i: number) => (
                            <Box key={i} mt={1}>
                              <Typography variant="body1">{therapy.name}</Typography>
                              <Typography variant="body2" color="text.secondary">
                                {therapy.instructions}, {therapy.duration}, {therapy.frequency}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      )}
                      
                      {prescription.notes && (
                        <Box mb={2}>
                          <Typography variant="subtitle1" fontWeight="500">
                            Notes
                          </Typography>
                          <Typography variant="body2">{prescription.notes}</Typography>
                        </Box>
                      )}
                      
                      {prescription.followUpDate && (
                        <Typography variant="body2" color="text.secondary">
                          Follow-up Date: {formatDate(prescription.followUpDate)}
                        </Typography>
                      )}
                      
                      {prescription.qrCodeUrl && (
                        <Box mt={2} display="flex" justifyContent="flex-end">
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<DownloadIcon />}
                            href={prescription.qrCodeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Download QR
                          </Button>
                        </Box>
                      )}
                    </RecordPaper>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box textAlign="center" p={4}>
                <Typography variant="body1" color="text.secondary">
                  No prescriptions found. Your prescriptions will appear here after doctor consultations.
                </Typography>
              </Box>
            )}
          </TabPanel>
          
          <TabPanel value={tabValue} index={2}>
            {reports.length > 0 ? (
              <Grid container spacing={3}>
                {reports.map((report, index) => (
                  <Grid item xs={12} md={6} key={report.id || index}>
                    <RecordPaper elevation={1}>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                        <Box display="flex" alignItems="center">
                          <ScienceIcon color="secondary" />
                          <RecordTitle variant="h6" sx={{ ml: 1 }}>
                            Lab Report
                          </RecordTitle>
                        </Box>
                        <Chip 
                          label={formatDate(report.date)} 
                          size="small" 
                          color="secondary" 
                          variant="outlined" 
                        />
                      </Box>
                      
                      <Typography variant="body1">
                        {report.description}
                      </Typography>
                      
                      <Typography variant="body2" mt={1} color="text.secondary">
                        Facility: {report.facilityName}
                      </Typography>
                      
                      {report.attachmentUrl && (
                        <Box mt={2} display="flex" justifyContent="flex-end">
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<PictureAsPdfIcon />}
                            color="secondary"
                            href={report.attachmentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View Report
                          </Button>
                        </Box>
                      )}
                    </RecordPaper>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box textAlign="center" p={4}>
                <Typography variant="body1" color="text.secondary">
                  No lab reports found. Your lab reports will appear here when they are added to your health record.
                </Typography>
              </Box>
            )}
          </TabPanel>
          
          <TabPanel value={tabValue} index={3}>
            {consultations.length > 0 ? (
              <Grid container spacing={3}>
                {consultations.map((consultation, index) => (
                  <Grid item xs={12} md={6} key={consultation.id || index}>
                    <RecordPaper elevation={1}>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                        <Box display="flex" alignItems="center">
                          <MedicalInformationIcon sx={{ color: 'success.main' }} />
                          <RecordTitle variant="h6" sx={{ ml: 1 }}>
                            {consultation.recordType === 'wellness' ? 'Wellness Record' :
                             consultation.recordType === 'diagnosis' ? 'Diagnosis' :
                             consultation.recordType === 'treatment' ? 'Treatment' : 'Consultation'}
                          </RecordTitle>
                        </Box>
                        <Chip 
                          label={formatDate(consultation.date)} 
                          size="small" 
                          color="success" 
                          variant="outlined" 
                        />
                      </Box>
                      
                      <Typography variant="body1">
                        {consultation.description}
                      </Typography>
                      
                      {consultation.doctorName && (
                        <Typography variant="body2" mt={1} color="text.secondary">
                          Doctor: {consultation.doctorName}
                        </Typography>
                      )}
                      
                      {consultation.facilityName && (
                        <Typography variant="body2" color="text.secondary">
                          Facility: {consultation.facilityName}
                        </Typography>
                      )}
                      
                      {consultation.additionalData && consultation.additionalData.therapy && (
                        <Box mt={2} p={1.5} bgcolor="rgba(76, 175, 80, 0.1)" borderRadius={1}>
                          <Typography variant="subtitle2" color="success.main">
                            Sound Therapy Details
                          </Typography>
                          <Typography variant="body2">
                            {consultation.additionalData.therapy}, {consultation.additionalData.duration}
                          </Typography>
                          {consultation.additionalData.outcome && (
                            <Typography variant="body2" mt={0.5}>
                              Outcome: {consultation.additionalData.outcome}
                            </Typography>
                          )}
                        </Box>
                      )}
                    </RecordPaper>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box textAlign="center" p={4}>
                <Typography variant="body1" color="text.secondary">
                  No consultation records found. Your consultation history will appear here after your visits.
                </Typography>
              </Box>
            )}
          </TabPanel>
        </>
      )}
    </Box>
  );
};

export default HealthRecordsPage;
