import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Autosuggest from 'react-autosuggest';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/system';

const StyledPaper = styled('div')(({ theme }) => ({
  padding: theme.spacing(3),
  margin: 'auto',
  maxWidth: 80,
}));

const StyledForm = styled('form')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const Container = styled('div')({
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const AutosuggestContainer = styled('div')({
  position: 'relative',
  width: '100%',
});

const AutosuggestInput = styled(TextField)({
  fontSize: '1rem',
  outline: 'none',
  border: '1px solid gray',
  borderRadius: '5px',
  padding: '1rem 0.7rem',
  color: 'gray',
  transition: '0.1s ease-out',
  '&:focus': {
    borderColor: '#6200EE',
  },
});

const AutosuggestSuggestions = styled(Paper)({
  position: 'absolute',
  zIndex: 1,
  marginTop: 8,
  left: 0,
  right: 0,
  listStyleType: 'none',
  padding: 0,
});

const SuggestionItem = styled('div')({
  display: 'block',
  padding: '10px',
  borderBottom: '1px solid #e0e0e0',
  cursor: 'pointer',
});
const PatientReferralForm = () => {
  // const classes = useStyles();

  const [patient, setPatient] = useState({
    firstname: '',
    lastname: '',
    dateOfBirth: {
      year: 0,
      month: 0,
      day: 0,
    },
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    language: '',
    contacts: [{
      active: false,
      type: '',
      value: '',
    }],
  });

  const [referral, setReferral] = useState({
    patient: '',
    notes: '',
  });

  const [suggestions, setSuggestions] = useState([]);

  const handlePatientChange = (key, value) => {
    setPatient((prevPatient) => ({
      ...prevPatient,
      [key]: value,
    }));
  };

  const handleContactChange = (index, key, value) => {
    setPatient((prevPatient) => ({
      ...prevPatient,
      contacts: prevPatient.contacts.map((contact, i) =>
        i === index ? { ...contact, [key]: value } : contact
      ),
    }));
  };

  const handleDateOfBirthChange = (datePart, value) => {
    setPatient((prevPatient) => ({
      ...prevPatient,
      dateOfBirth: {
        ...prevPatient.dateOfBirth,
        [datePart]: value,
      },
    }));
  };

  const handleAddressChange = (event, { newValue }) => {
    handlePatientChange('address1', newValue);
  };

  const handleSuggestionsFetchRequested = async ({ value }) => {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${value}&format=json`);
    const data = await response.json();
    setSuggestions(data);
  };

  const handleSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const getSuggestionValue = (suggestion) => suggestion.display_name;

  const renderSuggestion = (suggestion) => (
    <div>
      {suggestion.display_name}
    </div>
  );

  return (
    <Paper className={StyledPaper}>
      <Typography variant="h5" align="center" gutterBottom>
        Patient Referral Form
      </Typography>

      <form className={StyledForm}>

        {/* Patient Information */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="First Name"
              fullWidth
              value={patient.firstname}
              onChange={(e) => handlePatientChange('firstname', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Last Name"
              fullWidth
              value={patient.lastname}
              onChange={(e) => handlePatientChange('lastname', e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1">Date of Birth</Typography>
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Year"
              fullWidth
              value={patient.dateOfBirth.year}
              onChange={(e) => handleDateOfBirthChange('year', e.target.value)}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Month"
              fullWidth
              value={patient.dateOfBirth.month}
              onChange={(e) => handleDateOfBirthChange('month', e.target.value)}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Day"
              fullWidth
              value={patient.dateOfBirth.day}
              onChange={(e) => handleDateOfBirthChange('day', e.target.value)}
            />
          </Grid>
          {/* ... Other patient fields */}

          {/* Address Lookup */}
          
          <Grid item xs={12}>
            <TextField
              label="Address Line 2"
              fullWidth
              value={patient.address2}
              onChange={(e) => handlePatientChange('address2', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="City"
              fullWidth
              value={patient.city}
              onChange={(e) => handlePatientChange('city', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="State"
              fullWidth
              value={patient.state}
              onChange={(e) => handlePatientChange('state', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Zip Code"
              fullWidth
              value={patient.zipcode}
              onChange={(e) => handlePatientChange('zipcode', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
          <Container>
      <AutosuggestContainer>
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={handleSuggestionsFetchRequested}
          onSuggestionsClearRequested={handleSuggestionsClearRequested}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          inputProps={{
            label: 'Country',
            value: patient.country,
            onChange: (e) => handlePatientChange('country', e.target.value),
          }}
          theme={{
            container: { position: 'relative' },
            suggestionsContainerOpen: {
              position: 'absolute',
              zIndex: 1,
              marginTop: 8,
              left: 0,
              right: 0,
            },
            suggestion: {
              display: 'block',
              padding: '10px',
              borderBottom: '1px solid #e0e0e0',
              cursor: 'pointer',
            },
            suggestionsList: {
              margin: 0,
              padding: 0,
              listStyleType: 'none',
            },
          }}
        />
        <AutosuggestSuggestions>
          {suggestions.map((suggestion, index) => (
            <div key={index}>
              {suggestion.display_name}
            </div>
          ))}
        </AutosuggestSuggestions>
      </AutosuggestContainer>
    </Container>
    </Grid>

          <Grid item xs={12}>
            <TextField
              label="Language"
              fullWidth
              value={patient.language}
              onChange={(e) => handlePatientChange('language', e.target.value)}
            />
          </Grid>
        </Grid>

        {/* Contact Information */}
        {patient.contacts.map((contact, index) => (
          <div key={index}>
            <TextField
              label="Contact Type"
              fullWidth
              value={contact.type}
              onChange={(e) => handleContactChange(index, 'type', e.target.value)}
            />
            <TextField
              label="Contact Value"
              fullWidth
              value={contact.value}
              onChange={(e) => handleContactChange(index, 'value', e.target.value)}
            />
          </div>
        ))}

        {/* Referral Information */}
        <TextField
          label="Referral Notes"
          multiline
          rows={4}
          fullWidth
          value={referral.notes}
          onChange={(e) => setReferral({ ...referral, notes: e.target.value })}
        />

        {/* Submit Button */}
        <Button
          variant="contained"
          color="primary"
          className={StyledButton}
        >
          Submit Referral
        </Button>
      </form>
    </Paper>
  );
};

export default PatientReferralForm;
