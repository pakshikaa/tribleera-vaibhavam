import { vendorRequests } from "@/lib/data/vendorRequests";

export interface EventRequestResponse {
  vendorSlug: string;
  status: "pending" | "accepted" | "rejected";
  rejectionReason?: string;
  respondedAt?: string;
  startingPrice?: number;
}

export interface EventRequest {
  id: string;
  customerId: string;
  eventDate: string;
  location: string;
  guestCount: number;
  budgetRange: string;
  selectedServices: string[];
  priorities: string[];
  specialRequirements?: string;
  status: "pending" | "responses_in" | "vendor_selected" | "completed";
  createdAt: string;
  responses: EventRequestResponse[];
}

export const eventRequests: EventRequest[] = [
  {
    id: "EVT-20260001",
    customerId: "customer-niranjala-kajan",
    eventDate: "2026-12-04",
    location: "Jaffna",
    guestCount: 450,
    budgetRange: "150k-350k",
    selectedServices: ["photography", "decoration", "bridal-makeup"],
    priorities: ["Quality", "Availability", "Reviews"],
    specialRequirements: "Need Tamil-speaking team and Colombo travel support.",
    status: "responses_in",
    createdAt: "2026-06-22T09:30:00+05:30",
    responses: [
      {
        vendorSlug: "jaffna-frames-studio",
        status: "accepted",
        respondedAt: "2026-06-22T12:00:00+05:30",
        startingPrice: 135000,
      },
      {
        vendorSlug: "pushpa-florals-and-decor",
        status: "pending",
      },
      {
        vendorSlug: "anjali-bridal-studio",
        status: "rejected",
        rejectionReason: "At full capacity",
        respondedAt: "2026-06-22T15:00:00+05:30",
      },
    ],
  },
  {
    id: "EVT-20260002",
    customerId: "customer-revathi",
    eventDate: "2026-10-02",
    location: "Colombo",
    guestCount: 280,
    budgetRange: "50k-150k",
    selectedServices: ["cakes", "invitation"],
    priorities: ["Budget", "Quality", "Reviews"],
    status: "pending",
    createdAt: "2026-06-20T18:00:00+05:30",
    responses: [],
  },
  {
    id: "EVT-20260003",
    customerId: "customer-subasha",
    eventDate: "2026-08-22",
    location: "Trincomalee",
    guestCount: 180,
    budgetRange: "under-50k",
    selectedServices: ["photography"],
    priorities: ["Availability", "Budget", "Quality"],
    status: "vendor_selected",
    createdAt: "2026-06-18T14:10:00+05:30",
    responses: vendorRequests.slice(0, 1).map((request) => ({
      vendorSlug: "lumiere-wedding-films",
      status: "accepted" as const,
      respondedAt: request.receivedAt,
      startingPrice: 89500,
    })),
  },
];

export function getEventRequestById(id: string) {
  return eventRequests.find((request) => request.id === id);
}

export function getResponsesForRequest(id: string) {
  return getEventRequestById(id)?.responses ?? [];
}
