export class GetStockNasdaqAPIResponseDTO {
  data: {
    symbol: string;
    companyName: string;
    stockType: string;
    exchange: string;
    isNasdaqListed: boolean;
    isNasdaq100: boolean;
    isHeld: boolean;
    primaryData: {
      lastSalePrice: string;
      netChange: string;
      percentageChange: string;
      deltaIndicator: string;
      lastTradeTimestamp: string;
      isRealTime: boolean;
      bidPrice: string;
      askPrice: string;
      bidSize: string;
      askSize: string;
      volume: string;
    };
    secondaryData: any;
    marketStatus: string;
    assetClass: string;
    keyStats: {
      fiftyTwoWeekHighLow: {
        label: string;
        value: string;
      };
      dayrange: {
        label: string;
        value: string;
      };
    };
    notifications: Array<{
      headline: string;
      eventTypes: Array<{
        message: string;
        eventName: string;
        url: {
          label: string;
          value: string;
        };
        id: string;
      }>;
    }>;
  };
  message: any;
  status: {
    rCode: number;
    bCodeMessage: any;
    developerMessage: any;
  };
}
