import { Injectable } from '@nestjs/common';
import fetch, { Response } from 'node-fetch';
import * as fs from 'fs';

type ReportEmployee = {
  fullName: string,
    employeeId: number,
    city: string,
    travelFee: number,
    daysWorked: number,
    monthlyCost: number,
    costPerDay: number
}

@Injectable()
export class AppService {
  async getWorkersInfo(): Promise<Array<ReportEmployee>> {
    const hibobApiKey: string = 'bsM21nVSTixLJuldkdlRdqEPEPjGoiulUi6D9dKJ';
    const hibobBaseUrl: string = 'https://api.hibob.com/v1';
    const apiUrl: string = `${hibobBaseUrl}/people?showInactive=true`;


    const options: RequestInit = {
      method: 'GET',
      headers: {
        'Authorization': hibobApiKey,
      },
    };
    
    try {
      const response: Response = await fetch(apiUrl, options);
      console.log(response)
      
      const citiesFilePath = './cities.json';
      const citiesData = await fs.promises.readFile(citiesFilePath, 'utf8');
      const cityMap = JSON.parse(citiesData);

      const reportFilePath = './report.json';
      const reportData = await fs.promises.readFile(reportFilePath, 'utf8');
      const reportObj = JSON.parse(reportData);
      const filteredReportObj = {};

      for (const [key, value] of Object.entries(reportObj)) {
        if (value['fte'] !== 100) {
          filteredReportObj[key] = value;
        }
      }

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const body = await response.json();
      const employees = body['employees'];

      const activeEmployees = employees.filter((e: any) => e['internal']['terminationDate'] === null);
      const hourlyEmployees = activeEmployees.filter((e: any) => e['payroll']['employment']['fte'] < 100);
      console.log(hourlyEmployees)

      const hourlyEmployeesMapped = hourlyEmployees.map((employee) => {
        const fullName = employee.fullName;
        const employeeId = employee.work.employeeIdInCompany;
        const city = employee.address.city;
        const travelFee = cityMap[city];
        const daysWorked = filteredReportObj[fullName] ? filteredReportObj[fullName].daysWorked : null;
        
        return { fullName, employeeId, city, travelFee, daysWorked };
      })

      const employeesPaymentData = hourlyEmployeesMapped.map((worker) => {
        const travelCoefficient = 22.6;
        const calculatedCost = worker.daysWorked * travelCoefficient;
        const monthlyCost = Math.min(calculatedCost, worker.travelFee);
        const costPerDay = monthlyCost / worker.daysWorked || 0;

        return {...worker, monthlyCost, costPerDay}
      })

      console.log(employeesPaymentData)
      return employeesPaymentData;

    } catch (error) {
      console.error(error);
    }
  }
}
