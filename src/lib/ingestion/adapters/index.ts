import { Source } from "@/types";
import { BaseRssAdapter, SourceAdapter } from "./base";

// 1. Economic Times Adapter
export class EconomicTimesAdapter extends BaseRssAdapter {
  slug = "economic-times";
  name = "Economic Times";
  protected getCategory(): string {
    return "Stock Markets & Economy";
  }
}

// 2. Moneycontrol Adapter
export class MoneycontrolAdapter extends BaseRssAdapter {
  slug = "moneycontrol";
  name = "Moneycontrol";
  protected getCategory(): string {
    return "Market Reports & Earnings";
  }
}

// 3. Business Standard Adapter
export class BusinessStandardAdapter extends BaseRssAdapter {
  slug = "business-standard";
  name = "Business Standard";
  protected getCategory(): string {
    return "Companies & Industry";
  }
}

// 4. Mint Adapter
export class MintAdapter extends BaseRssAdapter {
  slug = "mint";
  name = "Mint";
  protected getCategory(): string {
    return "Equities & Macro";
  }
}

// 5. Financial Express Adapter
export class FinancialExpressAdapter extends BaseRssAdapter {
  slug = "financial-express";
  name = "Financial Express";
  protected getCategory(): string {
    return "Economy & Banking";
  }
}

// 6. BusinessLine Adapter
export class BusinessLineAdapter extends BaseRssAdapter {
  slug = "businessline";
  name = "BusinessLine";
  protected getCategory(): string {
    return "Agri & Commodities";
  }
}

// 7. CNBC-TV18 Adapter
export class CnbcTv18Adapter extends BaseRssAdapter {
  slug = "cnbc-tv18";
  name = "CNBC-TV18";
  protected getCategory(): string {
    return "Broadcast Scoops & Markets";
  }
}

// 8. NDTV Profit Adapter
export class NdtvProfitAdapter extends BaseRssAdapter {
  slug = "ndtv-profit";
  name = "NDTV Profit";
  protected getCategory(): string {
    return "Corporate News & Policy";
  }
}

// 9. Zee Business Adapter
export class ZeeBusinessAdapter extends BaseRssAdapter {
  slug = "zee-business";
  name = "Zee Business";
  protected getCategory(): string {
    return "Retail Traders & Commodities";
  }
}

// 10. Fortune India Adapter
export class FortuneIndiaAdapter extends BaseRssAdapter {
  slug = "fortune-india";
  name = "Fortune India";
  protected getCategory(): string {
    return "Enterprise Strategy & Startups";
  }
}

// Adapter Registry Map
const ADAPTER_REGISTRY: Record<string, SourceAdapter> = {
  "economic-times": new EconomicTimesAdapter(),
  "moneycontrol": new MoneycontrolAdapter(),
  "business-standard": new BusinessStandardAdapter(),
  "mint": new MintAdapter(),
  "financial-express": new FinancialExpressAdapter(),
  "businessline": new BusinessLineAdapter(),
  "cnbc-tv18": new CnbcTv18Adapter(),
  "ndtv-profit": new NdtvProfitAdapter(),
  "zee-business": new ZeeBusinessAdapter(),
  "fortune-india": new FortuneIndiaAdapter(),
};

export function getAdapterForSource(source: Source): SourceAdapter {
  const adapter = ADAPTER_REGISTRY[source.slug];
  if (adapter) return adapter;

  // Fallback generic RSS adapter if new source slug is added dynamically
  return new (class extends BaseRssAdapter {
    slug = source.slug;
    name = source.name;
  })();
}

export { ADAPTER_REGISTRY };
