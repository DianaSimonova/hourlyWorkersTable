function postDataToServer() {
    // Get active spreadsheet
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    
    // Assuming data is in the first sheet (you may need to adjust this based on your spreadsheet structure)
    var sheet = spreadsheet.getSheets()[0];
  
    // Get data from columns A and B
    var dataRange = sheet.getRange("A:B");
    var data = dataRange.getValues();
    const postData = data.reduce((acc, row) => ({
      ...acc,
      [row[0]]: row[1]
    }), {});
  
    // Set the URL of your server endpoint
    var url = "https://tiny-feet-wash.loca.lt";
  
    // Set options for the HTTP request
    var options = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(postData)
    };
  
    // Make the HTTP request
    var response = UrlFetchApp.fetch(url, options);
  
    // Log the response
    Logger.log(response.getContentText());
  }
  