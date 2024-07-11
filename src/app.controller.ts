import {
  Body,
  Controller,
  Get,
  Post
} from '@nestjs/common';
import * as fs from 'fs';
import { AppService } from './app.service';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async fetchDataHandler() {
    
    try {
      return await this.appService.getWorkersInfo();
    } catch (error) {
      console.error(error);
      throw new Error('Internal Server Error');
    }
  }

  @Post('city')
  async receiveCityList(@Body() createCityBody: any) {
    console.log(createCityBody);

    fs.writeFile('./cities.json', JSON.stringify(createCityBody), function (err) {
      if (err) {
        return console.log(err);
      }
      console.log('The file was saved!');
    });
  }

  @Post('reports')
  async receiveReportList(@Body() createReportBody: any) {
    console.log(createReportBody);

    fs.writeFile('./report.json', JSON.stringify(createReportBody), function (err) {
      if (err) {
        return console.log(err);
      }
      console.log('The file was saved!');
    });
  }
  
}
