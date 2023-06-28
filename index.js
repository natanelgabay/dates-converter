function generateHebrewMonthOptions() {
  const hebrewMonths = [
    { value: 'Nisan', label: 'ניסן' },
    { value: 'Iyyar', label: 'אייר' },
    { value: 'Sivan', label: 'סיון' },
    { value: 'Tamuz', label: 'תמוז' },
    { value: 'Av', label: 'אב' },
    { value: 'Elul', label: 'אלול' },
    { value: 'Tishrei', label: 'תשרי' },
    { value: 'Cheshvan', label: 'חשון' },
    { value: 'Kislev', label: 'כסלו' },
    { value: 'Tevet', label: 'טבת' },
    { value: 'Shvat', label: 'שבט' },
    { value: 'Adar', label: 'אדר' },
    { value: 'Adar1', label: 'אדר א' },
    { value: 'Adar2', label: 'אדר ב' }
  ];
  return hebrewMonths;
}

// put the options data for the form (Hebrew to Georgian)
function fillOptions(id, options) {
  const selectElement = document.getElementById(id);
  selectElement.innerHTML = '';

  for (const option of options) {
    const optionInForm = document.createElement('option');
    optionInForm.value = option.value;
    optionInForm.textContent = option.label;
    selectElement.appendChild(optionInForm);
  }
}

// Put custom input options in the index.html form
window.onload = function () {
  const hebrewYears = [];
  for (let i = 5700; i <= 5800; i++) {
    hebrewYears.push({ value: i, label: i });
  }
  const hebrewDays = [];
  for (let i = 1; i <= 30; i++) {
    hebrewDays.push({ value: i, label: i });
  }
  const rangeDays = [];
  for (let i = 1; i <= 180; i++) {
    rangeDays.push({ value: i, label: i });
  }
  const hebrewMonths = generateHebrewMonthOptions();

  fillOptions('hebrewYearInput', hebrewYears);
  fillOptions('hebrewMonthInput', hebrewMonths);
  fillOptions('hebrewDayInput', hebrewDays);
  fillOptions('rangeInput', rangeDays);
};

// <<<------<<<  Convert a Hebrew date to a Gregorian date  >>>------>>>
function convertHebrewDate() {
  const hebrewYear = document.getElementById('hebrewYearInput').value;
  const hebrewMonth = document.getElementById('hebrewMonthInput').value;
  const hebrewDay = document.getElementById('hebrewDayInput').value;
  const rangeDays = document.getElementById('rangeInput').value;

  const apiUrlHebrewToGregorian = `https://www.hebcal.com/converter?cfg=json&hy=${hebrewYear}&hm=${hebrewMonth}&hd=${hebrewDay}&h2g=1&ndays=${rangeDays}&strict=1`;

  fetch(apiUrlHebrewToGregorian)
    .then(response => response.json())
    .then(data => {
      const convertedDatesTable = document.getElementById('convertedHebrewDatesTable');

      while (convertedDatesTable.rows.length > 1) { // skipping header in table
        convertedDatesTable.deleteRow(1);
      }

      for (const date in data.hdates) { // creating new rows and adding data to the table
        const row = convertedDatesTable.insertRow();

        const convertedDateCell = row.insertCell();
        convertedDateCell.textContent = date;

        const hebrewDateCell = row.insertCell();
        hebrewDateCell.textContent = data.hdates[date].hebrew;

        const eventsCell = row.insertCell();
        eventsCell.textContent = data.hdates[date].events ? data.hdates[date].events.join(', ') : 'None';
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

// <<<------<<<  Convert a Gregorian date to a Hebrew date  >>>------>>>
function convertGregorianDate() {
	
	
  const gregorianYear = document.getElementById('gregorianYearInput').value;
  const gregorianMonth = document.getElementById('gregorianMonthInput').value;
  const gregorianDay = document.getElementById('gregorianDayInput').value;
  const gregorianRange = document.getElementById('gregorianRangeInput').value;

  let startDate = new Date(gregorianYear, gregorianMonth - 1, gregorianDay);
  let endDate = new Date(startDate);

  endDate.setDate(startDate.getDate() + Number(gregorianRange - 1));

  let startDateFormat = `${startDate.getFullYear()}-${("0" + (startDate.getMonth() + 1)).slice(-2)}-${("0" + startDate.getDate()).slice(-2)}`;
  let endDateFormat = `${endDate.getFullYear()}-${("0" + (endDate.getMonth() + 1)).slice(-2)}-${("0" + endDate.getDate()).slice(-2)}`;

  const apiUrlGregorianToHebrew = `https://www.hebcal.com/converter?cfg=json&start=${startDateFormat}&end=${endDateFormat}&g2h=1`;

  fetch(apiUrlGregorianToHebrew)
    .then(response => response.json())
    .then(data => {
      const convertedDatesTable = document.getElementById('convertedGregorianDatesTable');

      while (convertedDatesTable.rows.length > 1) { // skipping header in table
        convertedDatesTable.deleteRow(1);
      }

      if (data.hdates) {
        for (const date in data.hdates) { // creating new rows and adding data to the table
          const row = convertedDatesTable.insertRow();
          const convertedDateCell = row.insertCell();
          convertedDateCell.textContent = data.hdates[date].hebrew;
          const gregorianDateCell = row.insertCell();
          gregorianDateCell.textContent = date;
          const eventsCell = row.insertCell();
          eventsCell.textContent = data.hdates[date].events ? data.hdates[date].events.join(', ') : 'None';
        }
      } else {
        const row = convertedDatesTable.insertRow();
        const convertedDateCell = row.insertCell();
        convertedDateCell.textContent = data.hebrew;
        const gregorianDateCell = row.insertCell();
        gregorianDateCell.textContent = `${data.gy}-${data.gm}-${data.gd}`;
        const eventsCell = row.insertCell();
        eventsCell.textContent = data.events ? data.events.join(', ') : 'None';
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}




