import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { GetStockResponseDTO } from './dtos/get-stock-response.dto';
import { GetStockNasdaqAPIResponseDTO } from './dtos/get-stock-nasdaq-api-response.dto';

@Injectable()
export class NasdaqAPIService {
  private HOST = process.env.NASDAQ_API_HOST;

  constructor(private readonly httpService: HttpService) {}

  async getStock(stock: string): Promise<GetStockResponseDTO> {
    const response = await lastValueFrom(
      this.httpService.get<GetStockNasdaqAPIResponseDTO>(
        `${this.HOST}/api/quote/${stock}/info?assetclass=stocks`,
      ),
    );

    const { data } = response.data;

    const isStockFound = data !== null;
    if (!isStockFound) throw new Error('Stock not found!');

    const priceOnlyNumbers = data?.primaryData?.lastSalePrice?.replace(
      /[^0-9.,]+/g,
      '',
    );

    const [dayMin, dayMax] = data?.keyStats?.dayrange.value.split(' - ');

    const result: GetStockResponseDTO = {
      stock,
      price: +priceOnlyNumbers,
      dayMin: +dayMin || -1,
      dayMax: +dayMax || -1,
    };

    const isAllDataAvailable = Object.values(result).every((value) => !!value);
    if (!isAllDataAvailable) throw new Error('Failed to fetch data!');

    return result;
  }
}
