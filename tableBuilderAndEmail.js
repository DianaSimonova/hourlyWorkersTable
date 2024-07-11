function fetchDataAndPopulateSheet() {
    // Set the URL of the server endpoint
    var url = 'https://poor-worms-stay.loca.lt';
  
    // Set options for the HTTP request
    var options = {
      method: 'get',
      contentType: 'application/json',
    };
  
    // Make the HTTP request
    var response = UrlFetchApp.fetch(url, options);
  
    // Parse the JSON response
    var responseData = JSON.parse(response.getContentText());
  
    // Get active spreadsheet
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  
    // Assuming data is in the first sheet (you may need to adjust this based on your spreadsheet structure)
    var sheet = spreadsheet.getSheets()[0];
  
    // Assuming responseData is an array of objects with keys matching the column headers
    var columnNames = ['Full name', 'Employee ID', 'City', 'Travel Fee', 'Days worked', 'Monthly Cost', 'Cost per Day'];
  
    // Append column names as the first row in the spreadsheet
    sheet.getRange(1, 1, 1, columnNames.length).setValues([columnNames]);
  
    var data = responseData.map(function (item) {
      // Log the contents of the 'item' object
      // Logger.log(item);
  
      return [item.fullName, item.employeeId, item.city, item.travelFee, item.daysWorked, item.monthlyCost, item.costPerDay];
    });
  
    // Write data to the sheet, starting from the second row
    sheet.getRange(2, 1, data.length, data[0].length).setValues(data);
  
    console.log('Data fetched and written to the sheet successfully.');
  
    // Send an email with the table as an attachment
    sendEmailWithAttachment(data, columnNames);
  }
  
  function sendEmailWithAttachment(data, columnNames) {
    // Define the recipient email address
    var recipientEmail = 'advab@sqreamtech.com';
  
    // Define the email subject
    var subject = 'Monthly Hourly Workers Report';
  
    // Define the email body
    var body = 'Please find the attached table.';
  
    // Convert data to CSV format
    var csvData = [columnNames].concat(data).map(row => row.join(',')).join('\n');
  
    // Send the email with the table as an attachment
    MailApp.sendEmail({
      to: recipientEmail,
      subject: subject,
      body: body,
      attachments: [{
        fileName: 'table.csv',
        content: csvData,
        mimeType: 'application/octet-stream'
      }]
    });
  
    console.log('Email sent with the table as an attachment.');
  }